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

export async function loadNewLettersPerEpisode(
  courseId: CourseId = DEFAULT_COURSE_ID,
): Promise<Record<string, string[]>> {
  const normalizedCourseId = normalizeCourseId(courseId);
  const episodes = listStaticEpisodeIds(normalizedCourseId)
    .map((id) => loadSingleStaticEpisode(id, normalizedCourseId))
    .filter((episode): episode is Episode => episode !== null);

  return buildLettersByEpisode(episodes, normalizedCourseId);
}

export async function loadEpisode(
  id: string,
  courseId: CourseId = DEFAULT_COURSE_ID,
): Promise<Episode | null> {
  const normalizedCourseId = normalizeCourseId(courseId);

  if (id === 'phrases') {
    return loadSingleStaticEpisode(id, normalizedCourseId);
  }

  if (id === 'all') {
    const episodeIds = listStaticEpisodeIds(normalizedCourseId);
    const allEpisodes = episodeIds
      .map((episodeId) => loadSingleStaticEpisode(episodeId, normalizedCourseId))
      .filter((episode): episode is Episode => episode !== null)
      .map((episode, index) => ({ ...episode, id: episodeIds[index] }));

    if (allEpisodes.length === 0) return null;

    return {
      id: 'all',
      title: 'Все уроки',
      cards: allEpisodes.flatMap((episode) => episode.cards),
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
    return mergeEpisodes('ep1_2', 'Эпизод 1–2', [
      loadSingleStaticEpisode('ep1', normalizedCourseId),
      loadSingleStaticEpisode('ep2', normalizedCourseId),
    ]);
  }

  if (id === 'ep3_4') {
    return mergeEpisodes('ep3_4', 'Эпизод 3–4', [
      loadSingleStaticEpisode('ep3', normalizedCourseId),
      loadSingleStaticEpisode('ep4', normalizedCourseId),
    ]);
  }

  if (id === 'ep5_6') {
    return mergeEpisodes('ep5_6', 'Эпизод 5–6', [
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
  return listStaticEpisodes(normalizeCourseId(courseId));
}
