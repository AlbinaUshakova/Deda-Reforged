import { NextResponse } from 'next/server';
import { listEpisodes, loadNewLettersPerEpisode } from '@/lib/content';
import { normalizeCourseId } from '@/lib/courses';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const courseId = normalizeCourseId(new URL(req.url).searchParams.get('course'));
    const [episodes, lettersByEpisode] = await Promise.all([
      listEpisodes(courseId),
      loadNewLettersPerEpisode(courseId),
    ]);

    return NextResponse.json({
      ok: true,
      courseId,
      episodes,
      lettersByEpisode,
    });
  } catch (error) {
    console.error('content episodes error', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to load episodes' },
      { status: 500 },
    );
  }
}
