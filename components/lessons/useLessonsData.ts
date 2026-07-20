'use client';

import { useEffect, useState } from 'react';
import {
  readAlphabetStatusCache,
} from '@/lib/alphabetProgressCache';
import { getEpisodesDataCached, getEpisodesDataSync } from '@/lib/clientContentCache';
import type { AlphabetLetterStatus, LessonListItem } from '@/lib/lessonProgress';

export function useLessonsData(hydrate: () => Promise<void> | void) {
  const initialEpisodesData = getEpisodesDataSync();
  const [eps, setEps] = useState<LessonListItem[]>(initialEpisodesData.episodes);
  const [lettersByEp, setLettersByEp] = useState<Record<string, string[]>>(
    initialEpisodesData.lettersByEpisode,
  );
  const [cachedLetterStatusByChar, setCachedLetterStatusByChar] = useState<Record<string, AlphabetLetterStatus>>({});

  useEffect(() => {
    const init = async () => {
      void hydrate();
      setCachedLetterStatusByChar(readAlphabetStatusCache());

      try {
        const { episodes, lettersByEpisode } = await getEpisodesDataCached(true);
        setEps(episodes);
        setLettersByEp(lettersByEpisode);
      } catch (e) {
        console.error('Failed to load episodes API, fallback to local storage', e);
      }
    };

    void init();
  }, [hydrate]);

  return {
    eps,
    lettersByEp,
    cachedLetterStatusByChar,
    setCachedLetterStatusByChar,
  };
}
