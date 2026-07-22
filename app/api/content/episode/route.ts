import { NextRequest, NextResponse } from 'next/server';
import { loadEpisode } from '@/lib/content';
import { normalizeCourseId } from '@/lib/courses';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')?.trim() || '';
  if (!id) {
    return NextResponse.json(
      { ok: false, error: 'Missing id' },
      { status: 400 },
    );
  }

  try {
    const courseId = normalizeCourseId(req.nextUrl.searchParams.get('course'));
    const episode = await loadEpisode(id, courseId);
    if (!episode) {
      return NextResponse.json(
        { ok: false, error: 'Episode not found' },
        { status: 404 },
      );
    }

    return NextResponse.json({ ok: true, courseId, episode });
  } catch (error) {
    console.error('content episode error', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to load episode' },
      { status: 500 },
    );
  }
}
