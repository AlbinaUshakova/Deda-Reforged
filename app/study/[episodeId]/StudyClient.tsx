'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Route } from 'next';
import FlashcardDeck from '@/components/FlashcardDeck';
import StudyPageActions from '@/components/study/StudyPageActions';
import type { Episode } from '@/lib/content';
import { getEpisodeByIdCached, getEpisodesDataCached, getEpisodesDataSync } from '@/lib/clientContentCache';
import { DEFAULT_COURSE_ID, progressKeyForEpisode, scriptWatermarkStyle } from '@/lib/courses';
import { useAppStore } from '@/lib/appStore';
import { LESSON_UNLOCK_SCORE, getLessonPosition, getNextLessonId, getNormalLessonEpisodes, isLessonEpisodeId } from '@/lib/lessonProgress';
import { getLessonProgressGuidance, getLessonProgressSummary } from '@/lib/progressFeedback';
import { getSpecialEmptyState, getSpecialEpisodeKind, getSpecialEpisodeLabel, getSpecialStudyCopy } from '@/lib/specialEpisodeText';
import { readFavoriteWordMap } from '@/lib/studyPreferences';
import { getStudyDeckCards, resolveStudyEpisode } from './studyContent';

export default function StudyClient({
  episodeId,
  bundled,
}: {
  episodeId: string;
  bundled: Episode | null;
}) {
  const courseId = useAppStore(state => state.settings.courseId);
  const interfaceLanguage = useAppStore(state => state.settings.interfaceLanguage);
  const lessonTargetScore = useAppStore(state => state.settings.lessonTargetScore);
  const progressMap = useAppStore(state => state.progressMap);
  const hydrate = useAppStore(state => state.hydrate);
  const [courseEpisode, setCourseEpisode] = useState<Episode | null>(bundled);
  const [isEpisodeLoading, setIsEpisodeLoading] = useState<boolean>(!bundled);
  const [episodesData, setEpisodesData] = useState(() => getEpisodesDataSync(courseId));
  const ep = useMemo(() => resolveStudyEpisode(courseEpisode, episodeId, courseId), [courseEpisode, courseId, episodeId]);
  const learnedReviewEpisodeIds = useMemo(
    () =>
      getNormalLessonEpisodes(episodesData.episodes, episodesData.lettersByEpisode)
        .filter(episode => (progressMap[progressKeyForEpisode(courseId, episode.id)] ?? 0) >= LESSON_UNLOCK_SCORE)
        .map(episode => episode.id),
    [courseId, episodesData.episodes, episodesData.lettersByEpisode, progressMap],
  );
  const learnedReviewEpisodeSignature = learnedReviewEpisodeIds.join('|');
  const words = useMemo(() => {
    const cards = getStudyDeckCards(ep);
    if (episodeId !== 'all') return cards;
    const learnedIds = new Set(learnedReviewEpisodeSignature.split('|').filter(Boolean));
    return cards.filter(card => card.source_episode_id && learnedIds.has(card.source_episode_id));
  }, [ep, episodeId, learnedReviewEpisodeSignature]);
  const specialEpisodeKind = getSpecialEpisodeKind(episodeId);
  const isMainLessonEpisode = isLessonEpisodeId(episodeId);
  const isFavoritesEpisode = specialEpisodeKind === 'favorites';
  const [visibleDeckCount, setVisibleDeckCount] = useState(() => (isFavoritesEpisode ? 0 : words.length));

  const hasEpisode = Boolean(ep);
  const displayedWordCount = isFavoritesEpisode ? visibleDeckCount : words.length;
  const hasWords = displayedWordCount > 0;

  // выбранная тема для кнопки "Играть"
  const [topicForPlay, setTopicForPlay] = useState<string | null>(null);

  const playHref =
    topicForPlay && hasWords
      ? `/play/${episodeId}?topic=${encodeURIComponent(topicForPlay)}`
      : `/play/${episodeId}`;
  const normalEpisodes = useMemo(
    () => getNormalLessonEpisodes(episodesData.episodes, episodesData.lettersByEpisode),
    [episodesData.episodes, episodesData.lettersByEpisode],
  );
  const lessonPosition = useMemo(
    () => getLessonPosition(normalEpisodes, episodeId),
    [episodeId, normalEpisodes],
  );
  const nextLessonId = useMemo(
    () => getNextLessonId(normalEpisodes, episodeId),
    [episodeId, normalEpisodes],
  );
  const currentBest = progressMap[progressKeyForEpisode(courseId, episodeId)] ?? 0;
  const hasUnlockedNextLesson = currentBest >= LESSON_UNLOCK_SCORE;
  const progressSummary = isMainLessonEpisode
    ? getLessonProgressSummary({
        score: currentBest,
        targetScore: lessonTargetScore,
        hasNextLesson: Boolean(nextLessonId),
        interfaceLanguage,
      })
    : hasWords
      ? interfaceLanguage === 'en'
        ? `${displayedWordCount} cards`
        : `${displayedWordCount} карточек`
      : undefined;
  const lessonLabel = lessonPosition
    ? interfaceLanguage === 'en'
      ? `Lesson ${lessonPosition}`
      : `Урок ${lessonPosition}`
    : getSpecialEpisodeLabel(specialEpisodeKind, interfaceLanguage);
  const courseProgressLabel = lessonPosition && normalEpisodes.length > 0
    ? getLessonProgressGuidance({
        score: currentBest,
        targetScore: lessonTargetScore,
        hasNextLesson: Boolean(nextLessonId),
        surface: 'study',
        interfaceLanguage,
      })
    : getSpecialStudyCopy(specialEpisodeKind, interfaceLanguage);
  const nextLessonHref =
    hasUnlockedNextLesson && nextLessonId
      ? (`/study/${nextLessonId}` as Route)
      : undefined;

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  useEffect(() => {
    let cancelled = false;
    setEpisodesData(getEpisodesDataSync(courseId));

    void getEpisodesDataCached(false, courseId).then((data) => {
      if (cancelled) return;
      setEpisodesData(data);
    }).catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [courseId]);

  useEffect(() => {
    let cancelled = false;
    setIsEpisodeLoading(true);

    if (courseId === DEFAULT_COURSE_ID) {
      setCourseEpisode(bundled);
      setIsEpisodeLoading(false);
      return;
    }

    getEpisodeByIdCached(episodeId, courseId, true)
      .then(episode => {
        if (!cancelled) {
          setCourseEpisode(episode ?? bundled);
          setIsEpisodeLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setCourseEpisode(bundled);
          setIsEpisodeLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [bundled, courseId, episodeId]);

  useEffect(() => {
    if (!isFavoritesEpisode) {
      setVisibleDeckCount(words.length);
      return;
    }

    try {
      const favorites = readFavoriteWordMap();
      setVisibleDeckCount(words.filter(word => favorites[word.ge_text]).length);
    } catch {
      setVisibleDeckCount(0);
    }
  }, [isFavoritesEpisode, words]);

  useEffect(() => {
    document.documentElement.classList.add('app-no-page-scroll');
    document.body.classList.add('app-no-page-scroll');
    return () => {
      document.documentElement.classList.remove('app-no-page-scroll');
      document.body.classList.remove('app-no-page-scroll');
    };
  }, []);

  return (
    <main style={scriptWatermarkStyle(courseId)} className="study-card-screen app-screen-fixed min-h-screen bg-transparent text-[var(--text-primary)]">
      <div className="study-screen-orb study-screen-orb--left" aria-hidden="true" />
      <div className="study-screen-orb study-screen-orb--right" aria-hidden="true" />
      <div className="study-screen-shell mx-auto h-full w-full overflow-hidden px-[clamp(14px,3.6vw,48px)] py-[clamp(16px,2.6vh,32px)]">
        <StudyPageActions
          playHref={playHref as Route}
          lessonLabel={lessonLabel}
          courseProgressLabel={courseProgressLabel}
          progressSummary={progressSummary}
          nextLessonHref={nextLessonHref}
        />

        {isEpisodeLoading ? (
          <div className="mx-auto max-w-[980px] p-6 text-center text-[var(--text-secondary)]">
            {interfaceLanguage === 'en' ? 'Loading lesson…' : 'Загружаю урок…'}
          </div>
        ) : !hasEpisode ? (
          <div className="mx-auto max-w-[980px] p-6 text-center">{interfaceLanguage === 'en' ? 'Episode not found' : 'Эпизод не найден'}</div>
        ) : hasWords ? (
          <div className="relative z-0 mx-auto mt-[clamp(2px,0.8vh,10px)] w-full max-w-[980px]">
            <FlashcardDeck
              cards={words}
              episodeId={episodeId}
              onTopicChange={setTopicForPlay}
              onVisibleCountChange={setVisibleDeckCount}
            />
          </div>
        ) : (
          <div className="mx-auto mt-8 max-w-[980px] text-center text-[var(--text-secondary)]">
            {getSpecialEmptyState(specialEpisodeKind, interfaceLanguage) ?? (
              interfaceLanguage === 'en'
                ? 'There are no flashcard words in this episode yet.'
                : 'В этом эпизоде пока нет слов для карточек.'
            )}
          </div>
        )}
      </div>
    </main>
  );
}
