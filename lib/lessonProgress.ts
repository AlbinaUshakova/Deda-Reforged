import type { ProgressMap } from './supabase';

export type LessonListItem = { id: string; title: string; best?: number; cardCount?: number };
export type LessonStatus = 'mastered' | 'almost' | 'current' | 'locked';
export type AlphabetLetterStatus = LessonStatus | 'unknown';

export type DerivedLessonState = {
  normalEpisodes: LessonListItem[];
  practicalSpecials: LessonListItem[];
  allLessonsSpecial?: LessonListItem;
  favoritesSpecial?: LessonListItem;
  phrasesSpecial?: LessonListItem;
  allLessonsReady: boolean;
  unlockedById: Record<string, boolean>;
  recommendedEpId?: string;
  statusById: Record<string, LessonStatus>;
  letterStatusByChar: Record<string, AlphabetLetterStatus>;
};

export const LESSON_UNLOCK_SCORE = 5;

export function isLessonEpisodeId(id: string): boolean {
  return /^ep\d+[a-z]*$/i.test(id);
}

export function getNormalLessonEpisodes(
  episodes: LessonListItem[],
  lettersByEpisode: Record<string, string[]>,
) {
  const numberedEpisodes = episodes.filter((episode) => isLessonEpisodeId(episode.id));
  return numberedEpisodes.filter(
    (episode) => (lettersByEpisode[episode.id] ?? []).length > 0,
  );
}

export function getLessonPosition(episodes: LessonListItem[], episodeId: string) {
  const index = episodes.findIndex((episode) => episode.id === episodeId);
  if (index < 0) return undefined;
  return index + 1;
}

export function getNextLessonId(episodes: LessonListItem[], episodeId: string) {
  const index = episodes.findIndex((episode) => episode.id === episodeId);
  if (index < 0 || index >= episodes.length - 1) return undefined;
  return episodes[index + 1]?.id;
}

export function isLessonUnlocked(
  episodes: LessonListItem[],
  episodeId: string,
  getScore: (episodeId: string) => number,
) {
  const index = episodes.findIndex((episode) => episode.id === episodeId);
  if (index <= 0) return index === 0;
  return getScore(episodes[index - 1].id) >= LESSON_UNLOCK_SCORE;
}

function getEpisodeOrderValue(id: string): number {
  const [, numberRaw = '0', suffix = ''] = id.match(/^ep(\d+)([a-z]*)$/i) ?? [];
  const base = Number(numberRaw);
  const suffixOffset = suffix
    ? suffix.toLocaleLowerCase('en-US').charCodeAt(0) - 96
    : 0;
  return base + suffixOffset / 100;
}

export function deriveLessonState({
  episodes,
  progress,
  lessonTargetScore,
  lettersByEpisode,
  cachedLetterStatusByChar,
}: {
  episodes: LessonListItem[];
  progress: ProgressMap;
  lessonTargetScore: number;
  lettersByEpisode: Record<string, string[]>;
  cachedLetterStatusByChar: Record<string, AlphabetLetterStatus>;
}): DerivedLessonState {
  const numberedEpisodes = episodes.filter((episode) => isLessonEpisodeId(episode.id));
  const normalEpisodes = getNormalLessonEpisodes(episodes, lettersByEpisode);
  const practicalSpecials = numberedEpisodes.filter(
    (episode) => (lettersByEpisode[episode.id] ?? []).length === 0,
  ).map(episode => ({
    ...episode,
    best: progress[episode.id] ?? 0,
  }));
  const specials = episodes.filter((episode) => !/^ep\d+$/.test(episode.id));
  const allLessonsSpecial = specials.find((episode) => episode.id === 'all');
  const favoritesSpecial = specials.find((episode) => episode.id === 'favorites');
  const phrasesSpecial =
    specials.find((episode) => episode.id === 'phrases') ??
    practicalSpecials.find((episode) => episode.title === 'Вежливые фразы');

  const allLessonsReady =
    normalEpisodes.some((episode) => (progress[episode.id] ?? 0) >= LESSON_UNLOCK_SCORE);

  const unlockedById: Record<string, boolean> = {};
  for (let index = 0; index < normalEpisodes.length; index += 1) {
    const episode = normalEpisodes[index];
    if (index === 0) {
      unlockedById[episode.id] = true;
      continue;
    }

    const prevId = normalEpisodes[index - 1].id;
    unlockedById[episode.id] = (progress[prevId] ?? 0) >= LESSON_UNLOCK_SCORE;
  }

  const recommendedEpId = normalEpisodes
    .filter(
      (episode) =>
        unlockedById[episode.id] &&
        (progress[episode.id] ?? 0) < lessonTargetScore,
    )
    .sort((a, b) => {
      const aBest = progress[a.id] ?? 0;
      const bBest = progress[b.id] ?? 0;
      if (aBest !== bBest) return aBest - bBest;
      return getEpisodeOrderValue(a.id) - getEpisodeOrderValue(b.id);
    })[0]?.id;

  const statusById: Record<string, LessonStatus> = {};
  for (const episode of normalEpisodes) {
    const best = progress[episode.id] ?? 0;
    const unlocked = unlockedById[episode.id];
    if (!unlocked) {
      statusById[episode.id] = 'locked';
      continue;
    }
    if (best >= lessonTargetScore) {
      statusById[episode.id] = 'mastered';
      continue;
    }
    statusById[episode.id] = episode.id === recommendedEpId ? 'current' : 'almost';
  }

  const letterStatusByChar: Record<string, AlphabetLetterStatus> = {
    ...cachedLetterStatusByChar,
  };
  for (const episode of normalEpisodes) {
    const episodeStatus = statusById[episode.id] ?? 'locked';
    const letters = lettersByEpisode[episode.id] ?? [];
    for (const character of letters) {
      if (!letterStatusByChar[character]) {
        letterStatusByChar[character] = episodeStatus;
      }
    }
  }

  return {
    normalEpisodes,
    practicalSpecials,
    allLessonsSpecial,
    favoritesSpecial,
    phrasesSpecial,
    allLessonsReady,
    unlockedById,
    recommendedEpId,
    statusById,
    letterStatusByChar,
  };
}
