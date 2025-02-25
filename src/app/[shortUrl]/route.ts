import { NextRequest } from 'next/server';
import { sql } from '@/lib/db';
import { UAParser } from 'ua-parser-js';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Extract shortUrl from pathname
    const shortUrl = request.nextUrl.pathname.slice(1);

    // Get link details
    const [link] = await sql`
      SELECT * FROM links 
      WHERE short_url = ${shortUrl}
      AND (expires_at IS NULL OR expires_at > NOW())
    `;

    if (!link) {
      return new Response(null, {
        status: 302,
        headers: { Location: '/404' }
      });
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
        ${'unknown'},
        ${'unknown'}
      )
    `;

    return new Response(null, {
      status: 302,
      headers: { Location: link.original_url }
    });
  } catch (error) {
    console.error('Error redirecting:', error);
    return new Response(null, {
      status: 302,
      headers: { Location: '/404' }
    });
  }
}