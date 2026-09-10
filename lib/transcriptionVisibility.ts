import type { CourseId } from './courses.ts';

const AUTO_TRANSCRIPTION_LIMITS: Partial<Record<CourseId, number>> = {
  ka: 2.02,
};

const PRACTICE_EPISODE_PREFIX: Record<CourseId, string> = {
  ka: 'ep10',
  sr: 'ep9',
  tr: 'ep10',
  es: 'ep11',
  de: 'ep7',
  en: 'ep9',
  fr: 'ep8',
  it: 'ep10',
};

function isLessonEpisodeId(episodeId: string): boolean {
  return /^ep\d+[a-z]*$/i.test(episodeId);
}

export function isPracticalEpisodeId(
  episodeId: string | undefined,
  courseId: CourseId,
): boolean {
  if (!episodeId) return false;
  const prefix = PRACTICE_EPISODE_PREFIX[courseId];
  return episodeId.toLocaleLowerCase('en-US') === prefix ||
    new RegExp(`^${prefix}[a-z]+$`, 'i').test(episodeId);
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
  if (isPracticalEpisodeId(episodeId, courseId)) return true;
  if (shouldAutoShowTranscription(episodeId, courseId)) return true;
  return flipped || showTranslit;
}
