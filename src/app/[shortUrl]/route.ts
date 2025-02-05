import { NextRequest } from 'next/server';
import { sql, executeQuery } from '@/lib/db';
import { UAParser } from 'ua-parser-js';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Extract shortUrl from pathname
    const shortUrl = request.nextUrl.pathname.slice(1);

    // Get link details
    const [link] = await executeQuery<{
      id: string;
      original_url: string;
      password: string | null;
      expires_at: Date | null;
    }[]>(sql`
      SELECT id, original_url, password, expires_at
      FROM links 
      WHERE short_url = ${shortUrl}
      AND (expires_at IS NULL OR expires_at > NOW())
    `);

    if (!link) {
      return new Response(null, {
        status: 302,
        headers: { Location: '/404' }
      });
    }

    // Check if URL is password protected
    if (link.password) {
      const providedPassword = request.nextUrl.searchParams.get('password');
      
      if (!providedPassword) {
        // Redirect to password entry page
        return new Response(null, {
          status: 302,
          headers: { Location: `/password/${shortUrl}` }
        });
      }

      if (providedPassword !== link.password) {
        // Redirect back to password page with error
        return new Response(null, {
          status: 302,
          headers: { Location: `/password/${shortUrl}?error=incorrect` }
        });
      }
    }

    // Parse user agent
    const ua = new UAParser(request.headers.get('user-agent') || '');
    const browser = ua.getBrowser();
    const device = ua.getDevice();

    // Get visitor IP
    const forwardedFor = request.headers.get('x-forwarded-for');
    const visitorIp = forwardedFor ? forwardedFor.split(',')[0].trim() : 'unknown';

    // Record analytics
    await executeQuery(sql`
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
    `);

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