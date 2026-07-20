'use client';

import {
  buildLettersByEpisode,
  getStaticLettersByEpisode,
  normalizeEpisode,
  STATIC_EPISODES_FALLBACK,
  type CardInfoNote,
  type Episode,
  type EpisodeCard,
  type EpisodesListItem,
} from './contentData.ts';
export type { CardInfoNote, EpisodeCard, EpisodesListItem } from './contentData.ts';

export type EpisodesData = {
  episodes: EpisodesListItem[];
  lettersByEpisode: Record<string, string[]>;
};

export type EpisodeData = Episode | null;

const EPISODES_DATA_CACHE_KEY = 'deda:episodes-data-cache:v3';
const RAW_CONTENT_KEY = 'deda_content_json';

let episodesDataCache: EpisodesData | null = null;
let episodesDataPromise: Promise<EpisodesData> | null = null;

const episodeCache = new Map<string, EpisodeData>();
const episodePromiseCache = new Map<string, Promise<EpisodeData>>();

const STATIC_LETTERS_BY_EPISODE = getStaticLettersByEpisode();

function hasNumberedLessons(episodes: EpisodesListItem[]): boolean {
  return episodes.some((episode) => /^ep\d+$/i.test(String(episode.id ?? '')));
}

function readEpisodesFromLocalStorageCache(): EpisodesData {
  if (typeof window === 'undefined') return { episodes: [], lettersByEpisode: {} };

  try {
    const raw = window.localStorage.getItem(EPISODES_DATA_CACHE_KEY);
    if (!raw) return { episodes: [], lettersByEpisode: {} };

    const parsed = JSON.parse(raw) as {
      episodes?: EpisodesListItem[];
      lettersByEpisode?: Record<string, string[]>;
    };

    const episodes = Array.isArray(parsed.episodes) ? parsed.episodes : [];
    const lettersByEpisode =
      parsed.lettersByEpisode && typeof parsed.lettersByEpisode === 'object'
        ? parsed.lettersByEpisode
        : {};

    if (!hasNumberedLessons(episodes)) {
      try {
        window.localStorage.removeItem(EPISODES_DATA_CACHE_KEY);
      } catch {}
      return { episodes: [], lettersByEpisode: {} };
    }

    return {
      episodes,
      lettersByEpisode,
    };
  } catch {
    return { episodes: [], lettersByEpisode: {} };
  }
}

function parseRawContentEpisodes(): Episode[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(RAW_CONTENT_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as { episodes?: Episode[] };
    return (parsed.episodes ?? []).map((episode) => normalizeEpisode(episode));
  } catch {
    return [];
  }
}

function readEpisodesFallbackFromRawContent(): EpisodesData {
  const normalizedEpisodes = parseRawContentEpisodes();
  if (normalizedEpisodes.length === 0) {
    return {
      episodes: STATIC_EPISODES_FALLBACK,
      lettersByEpisode: STATIC_LETTERS_BY_EPISODE,
    };
  }

  return {
    episodes: normalizedEpisodes.map((episode) => ({
      id: episode.id,
      title: episode.title ?? episode.id,
    })),
    lettersByEpisode: buildLettersByEpisode(normalizedEpisodes),
  };
}

export function getEpisodesDataSync(): EpisodesData {
  if (episodesDataCache) return episodesDataCache;

  const cached = readEpisodesFromLocalStorageCache();
  if (cached.episodes.length > 0) {
    episodesDataCache = cached;
    return cached;
  }

  const fallback = readEpisodesFallbackFromRawContent();
  episodesDataCache = fallback;
  return fallback;
}

export async function getEpisodesDataCached(forceRefresh = false): Promise<EpisodesData> {
  if (!forceRefresh && episodesDataCache) return episodesDataCache;
  if (!forceRefresh && episodesDataPromise) return episodesDataPromise;

  episodesDataPromise = (async () => {
    try {
      const res = await fetch('/api/content/episodes', { cache: 'force-cache' });
      if (!res.ok) throw new Error('Failed to load episodes');

      const json = (await res.json()) as {
        ok: boolean;
        episodes?: EpisodesListItem[];
        lettersByEpisode?: Record<string, string[]>;
      };

      const data: EpisodesData = {
        episodes: json.episodes ?? [],
        lettersByEpisode: json.lettersByEpisode ?? {},
      };

      episodesDataCache = data;
      try {
        window.localStorage.setItem(EPISODES_DATA_CACHE_KEY, JSON.stringify(data));
      } catch {}

      return data;
    } catch {
      const fallback = getEpisodesDataSync();
      episodesDataCache = fallback;
      return fallback;
    } finally {
      episodesDataPromise = null;
    }
  })();

  return episodesDataPromise;
}

function readEpisodeFromRawContent(episodeId: string): EpisodeData {
  const episodes = parseRawContentEpisodes();
  return episodes.find((episode) => episode.id === episodeId) ?? null;
}

export async function getEpisodeByIdCached(episodeId: string): Promise<EpisodeData> {
  if (episodeCache.has(episodeId)) return episodeCache.get(episodeId) ?? null;

  const pending = episodePromiseCache.get(episodeId);
  if (pending) return pending;

  const req = (async () => {
    try {
      const res = await fetch(`/api/content/episode?id=${encodeURIComponent(episodeId)}`, {
        cache: 'force-cache',
      });

      if (res.status === 404) {
        episodeCache.set(episodeId, null);
        return null;
      }

      if (!res.ok) throw new Error('Failed to load episode');

      const json = (await res.json()) as { ok: boolean; episode?: EpisodeData };
      const episode = json.episode ?? null;
      episodeCache.set(episodeId, episode);
      return episode;
    } catch {
      const fallback = readEpisodeFromRawContent(episodeId);
      episodeCache.set(episodeId, fallback);
      return fallback;
    } finally {
      episodePromiseCache.delete(episodeId);
    }
  })();

  episodePromiseCache.set(episodeId, req);
  return req;
}
