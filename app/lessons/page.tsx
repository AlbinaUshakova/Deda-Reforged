'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useAppStore } from '@/lib/appStore';
import { AlphabetPanel } from '@/components/lessons/AlphabetPanel';
import { LessonGrid } from '@/components/lessons/LessonGrid';
import { LessonsHero } from '@/components/lessons/LessonsHero';
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
  const recommendedLessonIndex = recommendedEpId
    ? normalEpisodes.findIndex(episode => episode.id === recommendedEpId)
    : -1;
  const recommendedLesson = recommendedLessonIndex >= 0
    ? normalEpisodes[recommendedLessonIndex]
    : normalEpisodes[0];
  const recommendedLessonNumber = recommendedLessonIndex >= 0
    ? recommendedLessonIndex + 1
    : recommendedLesson
      ? 1
      : undefined;
  const recommendedLetters = recommendedLesson
    ? lettersByEp[recommendedLesson.id] ?? []
    : [];
  const recommendedScore = recommendedLesson
    ? progress[recommendedLesson.id] ?? 0
    : 0;

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
      className="lessons-screen min-h-screen min-h-[100dvh] [@media(max-width:700px)]:min-h-[auto] px-[clamp(18px,4.4vw,36px)] [@media(max-width:900px)]:px-[clamp(24px,7vw,42px)] [@media(max-width:700px)]:px-[clamp(18px,6vw,30px)] pt-5 pb-5 [@media(max-width:700px)]:pb-3 relative overflow-x-hidden flex flex-col"
    >
      <div className="lessons-screen-orb lessons-screen-orb--left" aria-hidden="true" />
      <div className="lessons-screen-orb lessons-screen-orb--right" aria-hidden="true" />
      <div className="relative mx-auto w-full flex-1 [@media(max-width:700px)]:flex-none flex flex-col justify-start pb-[clamp(32px,4.5vh,40px)] [@media(max-width:700px)]:pb-3">
        <LessonsHero
          recommendedLesson={recommendedLesson}
          recommendedLessonNumber={recommendedLessonNumber}
          recommendedLetters={recommendedLetters}
          recommendedScore={recommendedScore}
          lessonTargetScore={lessonTargetScore}
          phrasesLesson={phrasesSpecial}
        />
        {/* алфавит + сетка эпизодов */}
        <section className="lessons-path-section mt-5 [@media(max-width:900px)]:mt-4 [@media(max-width:700px)]:mt-4 min-[1700px]:pl-10 min-[2200px]:pl-12">
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
