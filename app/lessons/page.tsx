'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useAppStore } from '@/lib/appStore';
import { AlphabetPanel } from '@/components/lessons/AlphabetPanel';
import { LessonGrid } from '@/components/lessons/LessonGrid';
import { LessonsAlphabetProgressHeader } from '@/components/lessons/LessonsAlphabetProgressHeader';
import { SpecialLessonLinks } from '@/components/lessons/SpecialLessonLinks';
import { useAlphabetPanelState } from '@/components/lessons/useAlphabetPanelState';
import { useLetterAudio } from '@/components/lessons/useLetterAudio';
import { useLessonsData } from '@/components/lessons/useLessonsData';
import { useLockedLessonTooltip } from '@/components/lessons/useLockedLessonTooltip';
import { useViewportWidth } from '@/components/lessons/useViewportWidth';
import {
  writeAlphabetStatusCache,
} from '@/lib/alphabetProgressCache';
import { deriveLessonState } from '@/lib/lessonProgress';

export default function HomePage() {
  const hydrate = useAppStore(state => state.hydrate);
  const progress = useAppStore(state => state.progressMap);
  const lessonTargetScore = useAppStore(state => state.settings.lessonTargetScore);
  const transliterationMode = useAppStore(state => state.settings.transliterationMode);
  const alphabetToggleRequest = useAppStore(state => state.alphabetToggleRequest);
  const profileMenuOpen = useAppStore(state => state.profileMenuOpen);
  const setAlphabetOpen = useAppStore(state => state.setAlphabetOpen);
  const {
    eps,
    lettersByEp,
    cachedLetterStatusByChar,
    setCachedLetterStatusByChar,
  } = useLessonsData(hydrate);
  const viewportWidth = useViewportWidth();
  const { audioError, speakLetter } = useLetterAudio();
  const recommendedLessonRef = useRef<HTMLAnchorElement | null>(null);
  const mobileRecommendedScrolledRef = useRef(false);
  const lettersByEpCount = Object.keys(lettersByEp).length;
  const {
    alphabetRef,
    lessonsWrapRef,
    showAlphabet,
    alphabetOverlapsLessons,
    toggleAlphabet,
  } = useAlphabetPanelState({
    alphabetToggleRequest,
    profileMenuOpen,
    setAlphabetOpen,
    layoutDeps: [eps.length, lettersByEpCount],
  });
  const {
    lockedLessonTooltipEpId,
    hideLockedLessonTooltip,
    scheduleLockedLessonTooltip,
    showLockedLessonTooltipNow,
  } = useLockedLessonTooltip();

  const {
    normalEpisodes,
    allLessonsSpecial,
    favoritesSpecial,
    phrasesSpecial,
    allLessonsReady,
    recommendedEpId,
    statusById,
    letterStatusByChar,
  } = useMemo(
    () =>
      deriveLessonState({
        episodes: eps,
        progress,
        lessonTargetScore,
        lettersByEpisode: lettersByEp,
        cachedLetterStatusByChar,
      }),
    [cachedLetterStatusByChar, eps, lessonTargetScore, lettersByEp, progress],
  );

  const lessonLetterSizePx =
    viewportWidth === null
      ? 24
      : Math.round(Math.max(18, Math.min(30, viewportWidth * 0.028)));
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      writeAlphabetStatusCache(letterStatusByChar);
      setCachedLetterStatusByChar(letterStatusByChar);
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lettersByEp, lessonTargetScore, progress]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (mobileRecommendedScrolledRef.current) return;
    if (!recommendedEpId) return;
    if (window.innerWidth > 700) return;
    if (!recommendedLessonRef.current) return;

    mobileRecommendedScrolledRef.current = true;
    window.requestAnimationFrame(() => {
      recommendedLessonRef.current?.scrollIntoView({
        block: 'start',
        inline: 'nearest',
        behavior: 'auto',
      });
      window.scrollBy({ top: -84, left: 0, behavior: 'auto' });
    });
  }, [recommendedEpId, eps.length, progress]);

  return (
    <main
      className="min-h-screen min-h-[100dvh] [@media(max-width:700px)]:min-h-[auto] bg-[var(--app-bg)] px-[clamp(20px,4.8vw,36px)] [@media(max-width:900px)]:px-[clamp(28px,8vw,44px)] [@media(max-width:700px)]:px-[clamp(24px,9vw,40px)] pt-3 pb-1 [@media(max-width:700px)]:pb-0 min-[1920px]:pt-6 min-[1920px]:pb-2 [@media(max-height:980px)]:pt-2 [@media(max-height:980px)]:pb-1 relative overflow-x-hidden flex flex-col"
    >
      <div className="relative mx-auto w-full flex-1 [@media(max-width:700px)]:flex-none flex flex-col justify-start pb-[clamp(32px,4.5vh,40px)] [@media(max-width:700px)]:pb-3">
      {/* алфавит + сетка эпизодов */}
      <section className="mt-16 [@media(max-width:900px)]:mt-3 [@media(max-width:700px)]:mt-0 min-[1512px]:mt-16 min-[1700px]:mt-20 min-[1700px]:pl-10 min-[2200px]:pl-12 [@media(max-height:980px)]:mt-10">
        <div className="relative mx-auto w-full">
          <AlphabetPanel
            alphabetRef={alphabetRef}
            alphabetOverlapsLessons={alphabetOverlapsLessons}
            showAlphabet={showAlphabet}
            transliterationMode={transliterationMode}
            audioError={audioError}
            onToggleAlphabet={toggleAlphabet}
            onSpeakLetter={speakLetter}
          />
          <div ref={lessonsWrapRef} className="relative z-[150] mx-auto w-full max-w-[980px] [@media(max-height:980px)]:max-w-[900px]">
            <LessonsAlphabetProgressHeader letterStatusByChar={letterStatusByChar} />
            <LessonGrid
              normalEpisodes={normalEpisodes}
              progress={progress}
              lettersByEp={lettersByEp}
              lessonTargetScore={lessonTargetScore}
              lessonLetterSizePx={lessonLetterSizePx}
              statusById={statusById}
              recommendedEpId={recommendedEpId}
              recommendedLessonRef={recommendedLessonRef}
              lockedLessonTooltipEpId={lockedLessonTooltipEpId}
              onScheduleLockedLessonTooltip={scheduleLockedLessonTooltip}
              onHideLockedLessonTooltip={hideLockedLessonTooltip}
              onLockedLessonClick={(episodeId, event) => {
                event.preventDefault();
                showLockedLessonTooltipNow(episodeId);
              }}
              allLessonsSpecial={allLessonsSpecial}
              allLessonsReady={allLessonsReady}
            />
          </div>
        </div>
      </section>

      <SpecialLessonLinks
        allLessonsSpecial={allLessonsSpecial}
        favoritesSpecial={favoritesSpecial}
        phrasesSpecial={phrasesSpecial}
        allLessonsReady={allLessonsReady}
      />

      </div>
    </main>
  );
}
