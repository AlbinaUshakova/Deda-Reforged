// lib/content.ts
'use server';

import {
  buildLettersByEpisode,
  listStaticEpisodeIds,
  loadSingleStaticEpisode,
  normalizeEpisode,
  PHRASES_EPISODE,
  STATIC_EPISODES_FALLBACK,
  type CardInfoNote,
  type Episode,
} from './contentData.ts';
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

export async function loadNewLettersPerEpisode(): Promise<Record<string, string[]>> {
  const episodes = listStaticEpisodeIds()
    .map((id) => loadSingleStaticEpisode(id))
    .filter((episode): episode is Episode => episode !== null);

  return buildLettersByEpisode(episodes);
}

export async function loadEpisode(id: string): Promise<Episode | null> {
  if (id === 'phrases') {
    return normalizeEpisode(PHRASES_EPISODE);
  }

  if (id === 'all') {
    const episodeIds = listStaticEpisodeIds();
    const allEpisodes = episodeIds
      .map((episodeId) => loadSingleStaticEpisode(episodeId))
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
    const all = await loadEpisode('all');
    if (!all) return null;
    return {
      id: 'favorites',
      title: 'Избранное',
      cards: all.cards,
    };
  }

  if (id === 'ep1_2') {
    return mergeEpisodes('ep1_2', 'Эпизод 1–2', [
      loadSingleStaticEpisode('ep1'),
      loadSingleStaticEpisode('ep2'),
    ]);
  }

  if (id === 'ep3_4') {
    return mergeEpisodes('ep3_4', 'Эпизод 3–4', [
      loadSingleStaticEpisode('ep3'),
      loadSingleStaticEpisode('ep4'),
    ]);
  }

  if (id === 'ep5_6') {
    return mergeEpisodes('ep5_6', 'Эпизод 5–6', [
      loadSingleStaticEpisode('ep5'),
      loadSingleStaticEpisode('ep6'),
    ]);
  }

  if (/^ep\d+$/.test(id)) {
    return loadSingleStaticEpisode(id);
  }

  return null;
}

export async function listEpisodes(): Promise<Array<{ id: string; title: string }>> {
  return STATIC_EPISODES_FALLBACK;
}
