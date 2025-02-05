import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user's UUID from our database
    const [user] = await sql`
      SELECT id FROM users WHERE clerk_id = ${userId}
    `;

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get all links with click counts
    const links = await sql`
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
    `;

    return NextResponse.json(links);
  } catch (error) {
    console.error('Error fetching links:', error);
    return NextResponse.json(
      { error: 'Failed to fetch links' },
      { status: 500 }
    );
  }
} 