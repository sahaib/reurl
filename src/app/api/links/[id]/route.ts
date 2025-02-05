import { NextRequest } from 'next/server';
import { sql } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Extract ID from pathname
    const id = request.nextUrl.pathname.split('/').pop();

    // Get user's UUID from our database
    const [user] = await sql`
      SELECT id FROM users WHERE clerk_id = ${userId}
    `;

    if (!user) {
      return Response.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Delete analytics first (due to foreign key constraint)
    await sql`
      DELETE FROM analytics
      WHERE link_id = ${id}
    `;

    // Delete the link
    const [deletedLink] = await sql`
      DELETE FROM links
      WHERE id = ${id}
      AND user_id = ${user.id}
      RETURNING id
    `;

    if (!deletedLink) {
      return Response.json(
        { error: 'Link not found or unauthorized' },
        { status: 404 }
      );
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error deleting link:', error);
    return Response.json(
      { error: 'Failed to delete link' },
      { status: 500 }
    );
  }
} 