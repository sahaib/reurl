import { NextRequest } from 'next/server';
import { sql } from '@/lib/db';
import { UAParser } from 'ua-parser-js';

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: {
    shortUrl: string;
  };
}

export async function GET(
  req: NextRequest,
  { params }: RouteContext
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
      const url = new URL('/404', req.url);
      return Response.redirect(url);
    }

    // Parse user agent
    const ua = new UAParser(req.headers.get('user-agent') || '');
    const browser = ua.getBrowser();
    const device = ua.getDevice();

    // Get visitor IP
    const forwardedFor = req.headers.get('x-forwarded-for');
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
        ${req.headers.get('user-agent') || ''},
        ${req.headers.get('referer') || ''},
        ${device.type || 'unknown'},
        ${browser.name || 'unknown'},
        ${'unknown'}, -- Would need a geo-ip service for these
        ${'unknown'}
      )
    `;

    return Response.redirect(new URL(link.original_url));
  } catch (error) {
    console.error('Error redirecting:', error);
    return Response.redirect(new URL('/404', req.url));
  }
} 