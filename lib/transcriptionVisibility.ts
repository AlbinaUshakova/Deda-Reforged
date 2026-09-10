import type { CourseId } from './courses.ts';

const AUTO_TRANSCRIPTION_LIMITS: Partial<Record<CourseId, number>> = {
  ka: 2.02,
};

function isLessonEpisodeId(episodeId: string): boolean {
  return /^ep\d+[a-z]*$/i.test(episodeId);
}

function isPracticalEpisodeId(episodeId: string | undefined): boolean {
  return !!episodeId && /^ep10[a-z]*$/i.test(episodeId);
}

export function getEpisodeOrderValue(id: string): number {
  const [, numberRaw = '0', suffix = ''] = id.match(/^ep(\d+)([a-z]*)$/i) ?? [];
  const base = Number(numberRaw);
  const suffixOffset = suffix
    ? suffix.toLocaleLowerCase('en-US').charCodeAt(0) - 96
    : 0;
  return base + suffixOffset / 100;
}

export function shouldAutoShowTranscription(
  episodeId?: string,
  courseId?: CourseId,
): boolean {
  if (!episodeId) return false;
  if (!isLessonEpisodeId(episodeId)) return false;
  const episodeOrder = getEpisodeOrderValue(episodeId);
  const courseLimit = courseId ? AUTO_TRANSCRIPTION_LIMITS[courseId] : undefined;
  const autoShowLimit = courseLimit ?? 2;
  return episodeOrder <= autoShowLimit;
}

export function shouldShowTranscriptionToggle(
  episodeId: string | undefined,
  courseId: CourseId,
  flipped: boolean,
  showTranslit: boolean,
): boolean {
  if (isPracticalEpisodeId(episodeId)) return true;
  if (shouldAutoShowTranscription(episodeId, courseId)) return true;
  return flipped || showTranslit;
}
