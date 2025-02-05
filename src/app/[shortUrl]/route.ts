import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { UAParser } from 'ua-parser-js';

export async function GET(
  request: NextRequest,
  { params }: { params: { shortUrl: string } }
) {
  try {
    const shortUrl = params.shortUrl;

    // Get link details
    const [link] = await sql`
      SELECT * FROM links 
      WHERE short_url = ${shortUrl}
      AND (expires_at IS NULL OR expires_at > NOW())
    `;

    if (!link) {
      // Redirect to 404 page if link not found or expired
      return NextResponse.redirect(new URL('/404', request.url));
    }

    // Parse user agent
    const ua = new UAParser(request.headers.get('user-agent') || '');
    const browser = ua.getBrowser();
    const device = ua.getDevice();

    // Get visitor IP
    const forwardedFor = request.headers.get('x-forwarded-for');
    const visitorIp = forwardedFor ? forwardedFor.split(',')[0].trim() : 'unknown';

    // Record analytics
    await sql`
      INSERT INTO analytics (
        link_id,
        visitor_ip,
        user_agent,
        referer,
        device_type,
        browser,
        country,
        city
      ) VALUES (
        ${link.id},
        ${visitorIp},
        ${request.headers.get('user-agent') || ''},
        ${request.headers.get('referer') || ''},
        ${device.type || 'unknown'},
        ${browser.name || 'unknown'},
        ${'unknown'}, -- Would need a geo-ip service for these
        ${'unknown'}
      )
    `;

    // Redirect to original URL
    return NextResponse.redirect(link.original_url);
  } catch (error) {
    console.error('Error redirecting:', error);
    return NextResponse.redirect(new URL('/404', request.url));
  }
} 