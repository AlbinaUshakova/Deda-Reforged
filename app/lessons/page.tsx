'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useAppStore } from '@/lib/appStore';
import { AlphabetPanel } from '@/components/lessons/AlphabetPanel';
import { LessonGrid } from '@/components/lessons/LessonGrid';
import { LessonsStickerJournal } from '@/components/lessons/LessonsStickerJournal';
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
import { progressKeyForEpisode, scriptWatermarkStyle } from '@/lib/courses';
import { deriveLessonState, LESSON_UNLOCK_SCORE } from '@/lib/lessonProgress';
import { getActiveTransliterationMode } from '@/lib/settings';

export default function HomePage() {
  const hydrate = useAppStore(state => state.hydrate);
  const progress = useAppStore(state => state.progressMap);
  const courseId = useAppStore(state => state.settings.courseId);
  const lessonTargetScore = useAppStore(state => state.settings.lessonTargetScore);
  const interfaceLanguage = useAppStore(state => state.settings.interfaceLanguage);
  const storedTransliterationMode = useAppStore(state => state.settings.transliterationMode);
  const transliterationMode = getActiveTransliterationMode(interfaceLanguage, courseId, storedTransliterationMode);
  const alphabetToggleRequest = useAppStore(state => state.alphabetToggleRequest);
  const profileMenuOpen = useAppStore(state => state.profileMenuOpen);
  const setAlphabetOpen = useAppStore(state => state.setAlphabetOpen);
  const {
    eps,
    lettersByEp,
    cachedLetterStatusByChar,
    setCachedLetterStatusByChar,
  } = useLessonsData(hydrate, courseId);
  const viewportWidth = useViewportWidth();
  const { audioError, speakLetter } = useLetterAudio(courseId);
  const recommendedLessonRef = useRef<HTMLAnchorElement | null>(null);
  const lastCenteredLessonRef = useRef<string | null>(null);
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
  const courseProgress = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(progress).flatMap(([key, value]) => {
          if (courseId === 'ka') return [[key, value]];
          const prefix = `${courseId}:`;
          return key.startsWith(prefix) ? [[key.slice(prefix.length), value]] : [];
        }),
      ),
    [courseId, progress],
  );

  const {
    normalEpisodes,
    practicalSpecials,
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
        progress: courseProgress,
        lessonTargetScore,
        lettersByEpisode: lettersByEp,
        cachedLetterStatusByChar,
      }),
    [cachedLetterStatusByChar, courseProgress, eps, lessonTargetScore, lettersByEp],
  );

  const normalEpisodeIds = useMemo(
    () => normalEpisodes.map(episode => episode.id),
    [normalEpisodes],
  );
  const masteredEpisodeIds = useMemo(
    () =>
      normalEpisodes
        .filter(episode => (courseProgress[episode.id] ?? 0) >= lessonTargetScore)
        .map(episode => episode.id),
    [normalEpisodes, courseProgress, lessonTargetScore],
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
    ? progress[progressKeyForEpisode(courseId, recommendedLesson.id)] ?? 0
    : 0;
  const lessonsHeadingHint = recommendedLessonNumber
    ? recommendedScore > 0
      ? interfaceLanguage === 'en'
        ? `Continue lesson ${recommendedLessonNumber}.`
        : `Продолжи урок ${recommendedLessonNumber}.`
      : interfaceLanguage === 'en'
        ? `Start with lesson ${recommendedLessonNumber}.`
        : `Начни с урока ${recommendedLessonNumber}.`
    : undefined;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      writeAlphabetStatusCache(letterStatusByChar, courseId);
      setCachedLetterStatusByChar(letterStatusByChar);
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, lettersByEp, lessonTargetScore, progress]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!recommendedEpId || !recommendedLessonRef.current) return;
    if (lastCenteredLessonRef.current === `${courseId}:${recommendedEpId}`) return;

    const element = recommendedLessonRef.current;
    const viewportIsCompact = window.innerWidth < 900;
    lastCenteredLessonRef.current = `${courseId}:${recommendedEpId}`;

    const timer = window.setTimeout(() => {
      element.scrollIntoView({
        behavior: viewportIsCompact ? 'smooth' : 'auto',
        block: 'nearest',
        inline: 'center',
      });
    }, 120);

    return () => window.clearTimeout(timer);
  }, [courseId, recommendedEpId]);

  return (
    <main
      style={scriptWatermarkStyle(courseId)}
      className="lessons-screen min-h-screen min-h-[100dvh] [@media(max-width:700px)]:min-h-[auto] px-[clamp(18px,4.4vw,36px)] [@media(max-width:900px)]:px-[clamp(24px,7vw,42px)] [@media(max-width:700px)]:px-[clamp(18px,6vw,30px)] pt-5 [@media(max-width:700px)]:pt-3 pb-5 [@media(max-width:700px)]:pb-3 relative overflow-x-hidden flex flex-col"
    >
      <div className="lessons-screen-orb lessons-screen-orb--left" aria-hidden="true" />
      <div className="lessons-screen-orb lessons-screen-orb--right" aria-hidden="true" />
      <div className="relative mx-auto w-full flex-1 [@media(max-width:700px)]:flex-none flex flex-col justify-start pb-[clamp(32px,4.5vh,40px)] [@media(max-width:700px)]:pb-3">
        <LessonsHero
          recommendedLesson={recommendedLesson}
          recommendedLessonNumber={recommendedLessonNumber}
          recommendedLetters={recommendedLetters}
          recommendedScore={recommendedScore}
          transliterationMode={transliterationMode}
          courseId={courseId}
          totalLessons={normalEpisodeIds.length}
          masteredCount={masteredEpisodeIds.length}
          onSpeakLetter={speakLetter}
        />
        <LessonsStickerJournal
          courseId={courseId}
          episodeIds={normalEpisodeIds}
          masteredEpisodeIds={masteredEpisodeIds}
        />
        {/* алфавит + сетка эпизодов */}
        <section className="lessons-path-section mt-5 [@media(max-width:900px)]:mt-4 [@media(max-width:700px)]:mt-3 min-[1700px]:pl-10 min-[2200px]:pl-12">
          <div className="relative mx-auto w-full">
            <AlphabetPanel
              alphabetRef={alphabetRef}
              alphabetOverlapsLessons={alphabetOverlapsLessons}
              showAlphabet={showAlphabet}
              transliterationMode={transliterationMode}
              courseId={courseId}
              audioError={audioError}
              onToggleAlphabet={toggleAlphabet}
              onSpeakLetter={speakLetter}
            />
            <div ref={lessonsWrapRef} className="relative z-[150] mx-auto w-full max-w-[1160px]">
              <div className="lessons-grid-heading">
                <div className="lessons-grid-heading-copy">
                  <h2>{interfaceLanguage === 'en' ? 'Lessons' : 'Уроки'}</h2>
                  {lessonsHeadingHint && (
                    <p className="lessons-grid-heading-hint">{lessonsHeadingHint}</p>
                  )}
                </div>
              </div>
              <LessonGrid
                courseId={courseId}
                normalEpisodes={normalEpisodes}
                progress={courseProgress}
                lettersByEp={lettersByEp}
                lessonTargetScore={lessonTargetScore}
                lessonLetterSizePx={lessonLetterSizePx}
                transliterationMode={transliterationMode}
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
              />
            </div>
          </div>
        </section>

        <SpecialLessonLinks
          practicalSpecials={practicalSpecials}
          allLessonsSpecial={allLessonsSpecial}
          favoritesSpecial={favoritesSpecial}
          phrasesSpecial={phrasesSpecial}
          allLessonsReady={allLessonsReady}
          reviewDeckCardCount={normalEpisodes.reduce(
            (sum, episode) =>
              (courseProgress[episode.id] ?? 0) >= LESSON_UNLOCK_SCORE
                ? sum + (episode.cardCount ?? 0)
                : sum,
            0,
          )}
        />

      </div>
    </main>
  );
}
