import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { sql, executeQuery } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get user's UUID from our database
    const [user] = await executeQuery<{ id: string }[]>(sql`
      SELECT id FROM users WHERE clerk_id = ${userId}
    `);

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    const recentLinks = await executeQuery<{
      id: string;
      original_url: string;
      short_url: string;
      created_at: Date;
      clicks: number;
    }[]>(sql`
      SELECT 
        l.id,
        l.original_url,
        l.short_url,
        l.created_at,
        COUNT(a.id) as clicks
      FROM links l
      LEFT JOIN analytics a ON l.id = a.link_id
      WHERE l.user_id = ${user.id}
      GROUP BY l.id
      ORDER BY l.created_at DESC
      LIMIT ${limit}
    `);

    return NextResponse.json(recentLinks);
  } catch (error) {
    console.error('Error fetching links:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 