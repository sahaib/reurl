import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    // Delete analytics first (due to foreign key constraint)
    await sql`
      DELETE FROM analytics
      WHERE link_id = ${params.id}
    `;

    // Delete the link
    const [deletedLink] = await sql`
      DELETE FROM links
      WHERE id = ${params.id}
      AND user_id = ${user.id}
      RETURNING id
    `;

    if (!deletedLink) {
      return NextResponse.json(
        { error: 'Link not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting link:', error);
    return NextResponse.json(
      { error: 'Failed to delete link' },
      { status: 500 }
    );
  }
} 