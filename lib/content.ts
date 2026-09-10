// lib/content.ts
'use server';

import {
  buildLettersByEpisode,
  listStaticEpisodes,
  listStaticEpisodeIds,
  loadSingleStaticEpisode,
  type Episode,
  type EpisodesListItem,
} from './contentData.ts';
import { DEFAULT_COURSE_ID, normalizeCourseId, type CourseId } from './courses.ts';
import {
  getItalianIntentEpisode,
  ITALIAN_INTENT_SECTION_IDS,
  ITALIAN_NUMBERS_ID,
  listItalianIntentItems,
} from './italianPhraseSections.ts';
import { getTravelPracticeEpisodes } from './travelPhraseSections.ts';
export type { CardInfoNote, Episode } from './contentData.ts';

function mergeEpisodes(newId: string, title: string, episodes: Array<Episode | null>): Episode | null {
  const validEpisodes = episodes.filter((episode): episode is Episode => episode !== null);
  if (validEpisodes.length === 0) return null;

  return {
    id: newId,
    title,
    cards: validEpisodes.flatMap((episode) => episode.cards),
  };
}

function isReadingLesson(episode: Episode): boolean {
  return /^ep\d+[a-z]*$/i.test(episode.id) && /^Урок /.test(episode.title);
}

function getReadingLessonTargets(index: number): { total: number; phrases: number } {
  if (index < 2) return { total: 14, phrases: 4 };
  if (index < 5) return { total: 16, phrases: 5 };
  return { total: 18, phrases: 6 };
}

// Урок написан «воронкой», если фразы вплетены между словами (слово → слово →
// фраза → слово …) и слов больше, чем фраз (иначе это просто набор фраз, как
// местоименные комбинации в sr:ep1). Тогда сохраняем авторский порядок.
function isFunnelOrdered(cards: Episode['cards']): boolean {
  const phraseCount = cards.filter(isPhraseCard).length;
  const wordCount = cards.length - phraseCount;
  const interleaved = cards.some(
    (card, i) => isPhraseCard(card) && cards.slice(i + 1).some((next) => !isPhraseCard(next)),
  );
  return interleaved && wordCount > phraseCount;
}

function isPhraseCard(card: Episode['cards'][number]): boolean {
  return /\s/.test(card.ge_text.trim());
}

function compactReadingLesson(episode: Episode, index: number): Episode {
  const { total, phrases: phraseTarget } = getReadingLessonTargets(index);

  // Воронка: сохраняем авторский порядок (слово → фраза → слово …). Если карточек
  // больше лимита — обрезаем лишние СЛОВА с хвоста, сохраняя все фразы.
  if (isFunnelOrdered(episode.cards)) {
    const cards = episode.cards;
    if (cards.length <= total) {
      return { ...episode, cards };
    }
    let excess = cards.length - total;
    const trimmed: Episode['cards'] = [];
    for (let i = cards.length - 1; i >= 0; i -= 1) {
      if (excess > 0 && !isPhraseCard(cards[i])) {
        excess -= 1;
        continue;
      }
      trimmed.unshift(cards[i]);
    }
    return { ...episode, cards: trimmed };
  }

  // Старое поведение для не-воронки: слова, затем фразы (гарантируем несколько фраз).
  const phraseCards = episode.cards.filter(isPhraseCard);
  const wordCards = episode.cards.filter((card) => !isPhraseCard(card));
  const selectedPhrases = phraseCards.slice(0, phraseTarget);
  const selectedWords = wordCards.slice(0, Math.max(0, total - selectedPhrases.length));
  const selected = selectedWords.concat(selectedPhrases).slice(0, total);

  return {
    ...episode,
    cards: selected.length > 0 ? selected : episode.cards.slice(0, total),
  };
}

function loadCompactReadingLesson(episodeId: string, courseId: CourseId): Episode | null {
  const episodes = listStaticEpisodeIds(courseId)
    .map((id) => loadSingleStaticEpisode(id, courseId))
    .filter((episode): episode is Episode => episode !== null);
  const targetIndex = episodes.findIndex((episode) => episode.id === episodeId);
  const targetEpisode = targetIndex >= 0 ? episodes[targetIndex] : null;

  if (!targetEpisode || !isReadingLesson(targetEpisode)) {
    return targetEpisode;
  }

  return compactReadingLesson(targetEpisode, targetIndex);
}

function loadItalianNumbersEpisode(): Episode | null {
  const oldNumbers = loadSingleStaticEpisode('ep10b', 'it');
  if (!oldNumbers) return null;
  return { ...oldNumbers, id: ITALIAN_NUMBERS_ID, title: 'Числа' };
}

function getItalianAllEpisodeIds(): string[] {
  return [
    ...listStaticEpisodeIds('it').filter(id => /^ep[1-9]$/i.test(id)),
    ...ITALIAN_INTENT_SECTION_IDS,
    ...getTravelPracticeEpisodes('it').map(episode => episode.id),
    ITALIAN_NUMBERS_ID,
  ];
}

export async function loadNewLettersPerEpisode(
  courseId: CourseId = DEFAULT_COURSE_ID,
): Promise<Record<string, string[]>> {
  const normalizedCourseId = normalizeCourseId(courseId);
  const episodes = listStaticEpisodeIds(normalizedCourseId)
    .map((id) => loadSingleStaticEpisode(id, normalizedCourseId))
    .filter((episode): episode is Episode => episode !== null)
    .filter((episode) => normalizedCourseId !== 'it' || /^ep[1-9]$/i.test(episode.id));

  const letters = buildLettersByEpisode(episodes, normalizedCourseId);
  if (normalizedCourseId === 'it') {
    for (const id of [
      ...ITALIAN_INTENT_SECTION_IDS,
      ...getTravelPracticeEpisodes('it').map(episode => episode.id),
      ITALIAN_NUMBERS_ID,
    ]) {
      letters[id] = [];
    }
  }
  return letters;
}

export async function loadEpisode(
  id: string,
  courseId: CourseId = DEFAULT_COURSE_ID,
): Promise<Episode | null> {
  const normalizedCourseId = normalizeCourseId(courseId);

  if (normalizedCourseId === 'it') {
    const italianIntentEpisode = getItalianIntentEpisode(id);
    if (italianIntentEpisode) return italianIntentEpisode;
    const italianTravelEpisode = getTravelPracticeEpisodes('it').find(episode => episode.id === id);
    if (italianTravelEpisode) return italianTravelEpisode;
    if (id === ITALIAN_NUMBERS_ID) return loadItalianNumbersEpisode();
  }

  if (id === 'phrases') {
    return loadSingleStaticEpisode(id, normalizedCourseId);
  }

  if (id === 'all') {
    const episodeIds = normalizedCourseId === 'it'
      ? getItalianAllEpisodeIds()
      : listStaticEpisodeIds(normalizedCourseId);
    const allEpisodes = await Promise.all(
      episodeIds.map((episodeId) => loadEpisode(episodeId, normalizedCourseId)),
    );
    const validEpisodes = allEpisodes.filter((episode): episode is Episode => episode !== null);

    if (validEpisodes.length === 0) return null;

    return {
      id: 'all',
      title: 'Все уроки',
      cards: validEpisodes.flatMap((episode) =>
        episode.cards.map((card) => ({
          ...card,
          source_episode_id: episode.id,
        })),
      ),
    };
  }

  if (id === 'favorites') {
    const all = await loadEpisode('all', normalizedCourseId);
    if (!all) return null;
    return {
      id: 'favorites',
      title: 'Избранное',
      cards: all.cards,
    };
  }

  if (id === 'ep1_2') {
    return mergeEpisodes('ep1_2', 'Уроки 1–2', [
      loadSingleStaticEpisode('ep1', normalizedCourseId),
      loadSingleStaticEpisode('ep2', normalizedCourseId),
    ]);
  }

  if (id === 'ep3_4') {
    return mergeEpisodes('ep3_4', 'Уроки 3–4', [
      loadSingleStaticEpisode('ep3', normalizedCourseId),
      loadSingleStaticEpisode('ep4', normalizedCourseId),
    ]);
  }

  if (id === 'ep5_6') {
    return mergeEpisodes('ep5_6', 'Уроки 5–6', [
      loadSingleStaticEpisode('ep5', normalizedCourseId),
      loadSingleStaticEpisode('ep6', normalizedCourseId),
    ]);
  }

  if (/^ep\d+[a-z]*$/i.test(id)) {
    return loadCompactReadingLesson(id, normalizedCourseId);
  }

  return null;
}

export async function listEpisodes(
  courseId: CourseId = DEFAULT_COURSE_ID,
): Promise<EpisodesListItem[]> {
  const normalizedCourseId = normalizeCourseId(courseId);
  if (normalizedCourseId !== 'it') {
    return listStaticEpisodes(normalizedCourseId).map((episode) => {
      if (!/^ep\d+[a-z]*$/i.test(episode.id)) return episode;
      const compactEpisode = loadCompactReadingLesson(episode.id, normalizedCourseId);
      return {
        ...episode,
        cardCount: compactEpisode?.cards.length ?? episode.cardCount,
      };
    });
  }

  const base = listStaticEpisodes('it');
  const readingLessons = base
    .filter(episode => /^ep[1-9]$/i.test(episode.id))
    .map((episode) => ({
      ...episode,
      cardCount: loadCompactReadingLesson(episode.id, 'it')?.cards.length ?? episode.cardCount,
    }));
  const numbers = loadItalianNumbersEpisode();

  return [
    ...readingLessons,
    ...listItalianIntentItems(),
    ...getTravelPracticeEpisodes('it').map(episode => ({
      id: episode.id,
      title: episode.title,
      cardCount: episode.cards.length,
    })),
    ...(numbers ? [{ id: ITALIAN_NUMBERS_ID, title: 'Числа', cardCount: numbers.cards.length }] : []),
    ...base.filter(episode => episode.id === 'favorites' || episode.id === 'all'),
  ];
}
