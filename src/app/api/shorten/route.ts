import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { z } from 'zod';
import { sql, executeQuery } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

const shortenSchema = z.object({
  url: z.string()
    .min(1, 'URL is required')
    .url('Invalid URL format')
    .transform(url => {
      try {
        const urlObj = new URL(url);
        return urlObj.toString();
      } catch {
        throw new Error('Invalid URL format');
      }
    }),
  customSlug: z.string().optional(),
  expiresAt: z.string().datetime().optional(),
  password: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // First check if user exists
    let [user] = await executeQuery<Array<{ id: string }>>(sql`
      SELECT id FROM users WHERE clerk_id = ${userId}
    `);

    // If user doesn't exist, create them
    if (!user) {
      [user] = await executeQuery<Array<{ id: string }>>(sql`
        INSERT INTO users (id, clerk_id)
        VALUES (gen_random_uuid(), ${userId})
        RETURNING id
      `);
    }

    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const { url, customSlug, expiresAt, password } = shortenSchema.parse(body);
    const shortUrl = customSlug || nanoid(6);

    // Check if short URL already exists
    const existing = await executeQuery<Array<{ id: string }>>(sql`
      SELECT id FROM links WHERE short_url = ${shortUrl}
    `);

    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'Custom URL already exists' },
        { status: 400 }
      );
    }

    // Create new link with user's UUID
    const [link] = await executeQuery<Array<{ id: string; short_url: string; original_url: string; }>>(sql`
      INSERT INTO links (
        user_id,
        original_url,
        short_url,
        password,
        expires_at
      ) VALUES (
        ${user.id},
        ${url},
        ${shortUrl},
        ${password},
        ${expiresAt}
      )
      RETURNING id, short_url, original_url
    `);

    return NextResponse.json(link);
  } catch (error) {
    console.error('Error shortening URL:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    if (error instanceof Error && error.message.includes('Database connection timed out')) {
      return NextResponse.json(
        { error: 'Database connection failed. Please try again.' },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to shorten URL' },
      { status: 500 }
    );
  }
} 