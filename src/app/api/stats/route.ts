import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { sql, executeQuery } from '@/lib/db';

export async function GET() {
  try {
    const { userId } = await auth();

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

    // Get total links
    const [totalLinksResult] = await executeQuery<{ count: number }[]>(sql`
      SELECT COUNT(*) as count
      FROM links
      WHERE user_id = ${user.id}
    `);
    
    const totalLinks = totalLinksResult.count;

    // Get total clicks
    const [totalClicksResult] = await executeQuery<{ sum: number }[]>(sql`
      SELECT COUNT(*) as sum
      FROM analytics a
      JOIN links l ON l.id = a.link_id
      WHERE l.user_id = ${user.id}
    `);
    
    const totalClicks = totalClicksResult.sum || 0;

    // Get active links (links with clicks in the last 30 days)
    const [activeLinksResult] = await executeQuery<{ count: number }[]>(sql`
      SELECT COUNT(DISTINCT l.id) as count
      FROM links l
      JOIN analytics a ON l.id = a.link_id
      WHERE l.user_id = ${user.id}
      AND a.timestamp > NOW() - INTERVAL '30 days'
    `);
    
    const activeLinks = activeLinksResult.count;

    // Get top performing link
    const [topPerformingLink] = await executeQuery<{ shortUrl: string, clicks: number }[]>(sql`
      SELECT 
        l.short_url as "shortUrl",
        COUNT(a.id) as clicks
      FROM links l
      LEFT JOIN analytics a ON l.id = a.link_id
      WHERE l.user_id = ${user.id}
      GROUP BY l.id, l.short_url
      ORDER BY clicks DESC
      LIMIT 1
    `);

    return NextResponse.json({
      totalLinks,
      totalClicks,
      activeLinks,
      topPerformingLink: topPerformingLink || null,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 