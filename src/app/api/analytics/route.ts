import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const range = searchParams.get('range') || '7d';

    // Calculate date range
    const now = new Date();
    const days = range === '30d' ? 30 : range === '90d' ? 90 : 7;
    const startDate = new Date(now.setDate(now.getDate() - days));

    // Get analytics data
    const [totalClicks] = await sql`
      SELECT COUNT(*) as count
      FROM analytics a
      JOIN links l ON a.link_id = l.id
      WHERE l.user_id = ${userId}
      AND a.timestamp >= ${startDate}
    `;

    const [uniqueVisitors] = await sql`
      SELECT COUNT(DISTINCT visitor_ip) as count
      FROM analytics a
      JOIN links l ON a.link_id = l.id
      WHERE l.user_id = ${userId}
      AND a.timestamp >= ${startDate}
    `;

    const topCountries = await sql`
      SELECT country, COUNT(*) as visits
      FROM analytics a
      JOIN links l ON a.link_id = l.id
      WHERE l.user_id = ${userId}
      AND a.timestamp >= ${startDate}
      GROUP BY country
      ORDER BY visits DESC
      LIMIT 5
    `;

    const topDevices = await sql`
      SELECT device_type as device, COUNT(*) as visits
      FROM analytics a
      JOIN links l ON a.link_id = l.id
      WHERE l.user_id = ${userId}
      AND a.timestamp >= ${startDate}
      GROUP BY device_type
      ORDER BY visits DESC
      LIMIT 5
    `;

    const clicksByDay = await sql`
      SELECT 
        DATE(timestamp) as date,
        COUNT(*) as clicks
      FROM analytics a
      JOIN links l ON a.link_id = l.id
      WHERE l.user_id = ${userId}
      AND a.timestamp >= ${startDate}
      GROUP BY DATE(timestamp)
      ORDER BY date ASC
    `;

    return NextResponse.json({
      totalClicks: totalClicks.count,
      uniqueVisitors: uniqueVisitors.count,
      topCountries,
      topDevices,
      clicksByDay
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
} 