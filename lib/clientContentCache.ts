'use client';

import {
  buildLettersByEpisode,
  getStaticLettersByEpisode,
  listStaticEpisodes,
  normalizeEpisode,
  type CardInfoNote,
  type Episode,
  type EpisodeCard,
  type EpisodesListItem,
} from './contentData.ts';
import { DEFAULT_COURSE_ID, normalizeCourseId, type CourseId } from './courses.ts';
export type { CardInfoNote, EpisodeCard, EpisodesListItem } from './contentData.ts';

export type EpisodesData = {
  episodes: EpisodesListItem[];
  lettersByEpisode: Record<string, string[]>;
};

export type EpisodeData = Episode | null;

const EPISODES_DATA_CACHE_KEY_PREFIX = 'deda:episodes-data-cache:v15';
const RAW_CONTENT_KEY = 'deda_content_json';

const episodesDataCache = new Map<CourseId, EpisodesData>();
const episodesDataPromise = new Map<CourseId, Promise<EpisodesData>>();

const episodeCache = new Map<string, EpisodeData>();
const episodePromiseCache = new Map<string, Promise<EpisodeData>>();

function getEpisodesCacheKey(courseId: CourseId): string {
  return `${EPISODES_DATA_CACHE_KEY_PREFIX}:${courseId}`;
}

function getEpisodeCacheKey(courseId: CourseId, episodeId: string): string {
  return `${courseId}:${episodeId}`;
}

function hasNumberedLessons(episodes: EpisodesListItem[]): boolean {
  return episodes.some((episode) => /^ep\d+$/i.test(String(episode.id ?? '')));
}

function episodeListSignature(episodes: EpisodesListItem[]): string {
  return episodes.map(episode => `${episode.id}:${episode.title}`).join('|');
}

function isEpisodesDataCurrent(courseId: CourseId, data: EpisodesData): boolean {
  const expectedEpisodes = listStaticEpisodes(courseId);
  return episodeListSignature(data.episodes) === episodeListSignature(expectedEpisodes);
}

function readEpisodesFromLocalStorageCache(courseId: CourseId): EpisodesData {
  if (typeof window === 'undefined') return { episodes: [], lettersByEpisode: {} };

  try {
    const cacheKey = getEpisodesCacheKey(courseId);
    const raw = window.localStorage.getItem(cacheKey);
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
        window.localStorage.removeItem(cacheKey);
      } catch {}
      return { episodes: [], lettersByEpisode: {} };
    }

    const data = {
      episodes,
      lettersByEpisode,
    };

    if (!isEpisodesDataCurrent(courseId, data)) {
      try {
        window.localStorage.removeItem(cacheKey);
      } catch {}
      return { episodes: [], lettersByEpisode: {} };
    }

    return data;
  } catch {
    return { episodes: [], lettersByEpisode: {} };
  }
}

function parseRawContentEpisodes(courseId: CourseId): Episode[] {
  if (typeof window === 'undefined') return [];
  if (courseId !== DEFAULT_COURSE_ID) return [];

  try {
    const raw = window.localStorage.getItem(RAW_CONTENT_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as { episodes?: Episode[] };
    return (parsed.episodes ?? []).map((episode) => normalizeEpisode(episode, courseId));
  } catch {
    return [];
  }
}

function readEpisodesFallbackFromRawContent(courseId: CourseId): EpisodesData {
  const normalizedEpisodes = parseRawContentEpisodes(courseId);
  if (normalizedEpisodes.length === 0) {
    return {
      episodes: listStaticEpisodes(courseId),
      lettersByEpisode: getStaticLettersByEpisode(courseId),
    };
  }

  return {
    episodes: normalizedEpisodes.map((episode) => ({
      id: episode.id,
      title: episode.title ?? episode.id,
    })),
    lettersByEpisode: buildLettersByEpisode(normalizedEpisodes, courseId),
  };
}

export function getEpisodesDataSync(courseId: CourseId = DEFAULT_COURSE_ID): EpisodesData {
  const normalizedCourseId = normalizeCourseId(courseId);
  const cachedForCourse = episodesDataCache.get(normalizedCourseId);
  if (cachedForCourse) {
    if (isEpisodesDataCurrent(normalizedCourseId, cachedForCourse)) {
      return cachedForCourse;
    }
    episodesDataCache.delete(normalizedCourseId);
  }

  const cached = readEpisodesFromLocalStorageCache(normalizedCourseId);
  if (cached.episodes.length > 0) {
    episodesDataCache.set(normalizedCourseId, cached);
    return cached;
  }

  const fallback = readEpisodesFallbackFromRawContent(normalizedCourseId);
  episodesDataCache.set(normalizedCourseId, fallback);
  return fallback;
}

export async function getEpisodesDataCached(
  forceRefresh = false,
  courseId: CourseId = DEFAULT_COURSE_ID,
): Promise<EpisodesData> {
  const normalizedCourseId = normalizeCourseId(courseId);
  const cachedForCourse = episodesDataCache.get(normalizedCourseId);
  if (!forceRefresh && cachedForCourse) return cachedForCourse;
  const pendingForCourse = episodesDataPromise.get(normalizedCourseId);
  if (!forceRefresh && pendingForCourse) return pendingForCourse;

  const promise = (async () => {
    try {
      const res = await fetch(`/api/content/episodes?course=${encodeURIComponent(normalizedCourseId)}`, {
        cache: forceRefresh ? 'no-store' : 'force-cache',
      });
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

      episodesDataCache.set(normalizedCourseId, data);
      try {
        window.localStorage.setItem(getEpisodesCacheKey(normalizedCourseId), JSON.stringify(data));
      } catch {}

      return data;
    } catch {
      const fallback = getEpisodesDataSync(normalizedCourseId);
      episodesDataCache.set(normalizedCourseId, fallback);
      return fallback;
    } finally {
      episodesDataPromise.delete(normalizedCourseId);
    }
  })();

  episodesDataPromise.set(normalizedCourseId, promise);
  return promise;
}

function readEpisodeFromRawContent(episodeId: string, courseId: CourseId): EpisodeData {
  const episodes = parseRawContentEpisodes(courseId);
  return episodes.find((episode) => episode.id === episodeId) ?? null;
}

export async function getEpisodeByIdCached(
  episodeId: string,
  courseId: CourseId = DEFAULT_COURSE_ID,
  forceRefresh = false,
): Promise<EpisodeData> {
  const normalizedCourseId = normalizeCourseId(courseId);
  const cacheKey = getEpisodeCacheKey(normalizedCourseId, episodeId);
  if (!forceRefresh && episodeCache.has(cacheKey)) return episodeCache.get(cacheKey) ?? null;

  const pending = episodePromiseCache.get(cacheKey);
  if (!forceRefresh && pending) return pending;

  const req = (async () => {
    try {
      const res = await fetch(
        `/api/content/episode?id=${encodeURIComponent(episodeId)}&course=${encodeURIComponent(normalizedCourseId)}`,
        {
          cache: forceRefresh ? 'no-store' : 'force-cache',
        },
      );

      if (res.status === 404) {
        episodeCache.set(cacheKey, null);
        return null;
      }

      if (!res.ok) throw new Error('Failed to load episode');

      const json = (await res.json()) as { ok: boolean; episode?: EpisodeData };
      const episode = json.episode ?? null;
      episodeCache.set(cacheKey, episode);
      return episode;
    } catch {
      const fallback = readEpisodeFromRawContent(episodeId, normalizedCourseId);
      episodeCache.set(cacheKey, fallback);
      return fallback;
    } finally {
      episodePromiseCache.delete(cacheKey);
    }
  })();

  episodePromiseCache.set(cacheKey, req);
  return req;
}
