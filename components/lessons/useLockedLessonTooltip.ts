'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const LOCKED_LESSON_TOOLTIP_DELAY_MS = 240;

export function useLockedLessonTooltip() {
  const [lockedLessonTooltipEpId, setLockedLessonTooltipEpId] = useState<string | null>(null);
  const lockedTooltipTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (lockedTooltipTimerRef.current !== null) {
        window.clearTimeout(lockedTooltipTimerRef.current);
        lockedTooltipTimerRef.current = null;
      }
    };
  }, []);

  const hideLockedLessonTooltip = useCallback(() => {
    if (lockedTooltipTimerRef.current !== null) {
      window.clearTimeout(lockedTooltipTimerRef.current);
      lockedTooltipTimerRef.current = null;
    }
    setLockedLessonTooltipEpId(null);
  }, []);

  const scheduleLockedLessonTooltip = useCallback((episodeId: string) => {
    if (lockedTooltipTimerRef.current !== null) {
      window.clearTimeout(lockedTooltipTimerRef.current);
      lockedTooltipTimerRef.current = null;
    }
    lockedTooltipTimerRef.current = window.setTimeout(() => {
      setLockedLessonTooltipEpId(episodeId);
      lockedTooltipTimerRef.current = null;
    }, LOCKED_LESSON_TOOLTIP_DELAY_MS);
  }, []);

  const showLockedLessonTooltipNow = useCallback((episodeId: string) => {
    if (lockedTooltipTimerRef.current !== null) {
      window.clearTimeout(lockedTooltipTimerRef.current);
      lockedTooltipTimerRef.current = null;
    }
    setLockedLessonTooltipEpId(episodeId);
  }, []);

  return {
    lockedLessonTooltipEpId,
    hideLockedLessonTooltip,
    scheduleLockedLessonTooltip,
    showLockedLessonTooltipNow,
  };
}
