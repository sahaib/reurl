import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { sql, executeQuery } from '@/lib/db';

export async function GET(request: NextRequest) {
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

    // Get date range from query params
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '7d';
    const days = range === '30d' ? 30 : range === '90d' ? 90 : 7;
    
    // Calculate date range
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get total clicks
    const [totalClicksResult] = await executeQuery<{ count: number }[]>(sql`
      SELECT COUNT(*) as count
      FROM analytics a
      JOIN links l ON l.id = a.link_id
      WHERE l.user_id = ${user.id}
      AND a.timestamp >= ${startDate}
    `);

    // Get unique visitors
    const [uniqueVisitorsResult] = await executeQuery<{ count: number }[]>(sql`
      SELECT COUNT(DISTINCT visitor_ip) as count
      FROM analytics a
      JOIN links l ON l.id = a.link_id
      WHERE l.user_id = ${user.id}
      AND a.timestamp >= ${startDate}
    `);

    // Get top countries
    const topCountries = await executeQuery<{ country: string; visits: number }[]>(sql`
      SELECT 
        COALESCE(a.country, 'Unknown') as country,
        COUNT(*) as visits
      FROM analytics a
      JOIN links l ON l.id = a.link_id
      WHERE l.user_id = ${user.id}
      AND a.timestamp >= ${startDate}
      GROUP BY country
      ORDER BY visits DESC
      LIMIT 5
    `);

    // Get top devices
    const topDevices = await executeQuery<{ device: string; visits: number }[]>(sql`
      SELECT 
        COALESCE(a.device_type, 'Unknown') as device,
        COUNT(*) as visits
      FROM analytics a
      JOIN links l ON l.id = a.link_id
      WHERE l.user_id = ${user.id}
      AND a.timestamp >= ${startDate}
      GROUP BY device
      ORDER BY visits DESC
      LIMIT 5
    `);

    // Get clicks by day
    const clicksByDay = await executeQuery<{ date: string; clicks: number }[]>(sql`
      SELECT 
        DATE(a.timestamp) as date,
        COUNT(*) as clicks
      FROM analytics a
      JOIN links l ON l.id = a.link_id
      WHERE l.user_id = ${user.id}
      AND a.timestamp >= ${startDate}
      GROUP BY DATE(a.timestamp)
      ORDER BY date ASC
    `);

    return NextResponse.json({
      totalClicks: totalClicksResult.count,
      uniqueVisitors: uniqueVisitorsResult.count,
      topCountries,
      topDevices,
      clicksByDay
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 