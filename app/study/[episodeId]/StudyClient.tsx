'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Route } from 'next';
import FlashcardDeck from '@/components/FlashcardDeck';
import StudyPageActions from '@/components/study/StudyPageActions';
import type { Episode } from '@/lib/content';
import { getEpisodeByIdCached } from '@/lib/clientContentCache';
import { DEFAULT_COURSE_ID, scriptWatermarkStyle } from '@/lib/courses';
import { useAppStore } from '@/lib/appStore';
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
  const hydrate = useAppStore(state => state.hydrate);
  const [courseEpisode, setCourseEpisode] = useState<Episode | null>(bundled);
  const [isEpisodeLoading, setIsEpisodeLoading] = useState<boolean>(!bundled);
  const ep = useMemo(() => resolveStudyEpisode(courseEpisode, episodeId), [courseEpisode, episodeId]);
  const words = useMemo(() => getStudyDeckCards(ep), [ep]);

  const hasEpisode = Boolean(ep);
  const hasWords = words.length > 0;

  // выбранная тема для кнопки "Играть"
  const [topicForPlay, setTopicForPlay] = useState<string | null>(null);

  const playHref =
    topicForPlay && hasWords
      ? `/play/${episodeId}?topic=${encodeURIComponent(topicForPlay)}`
      : `/play/${episodeId}`;

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

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
          setCourseEpisode(episode);
          setIsEpisodeLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setCourseEpisode(null);
          setIsEpisodeLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [bundled, courseId, episodeId]);

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
        <StudyPageActions playHref={playHref as Route} />

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
            />
          </div>
        ) : (
          <div className="mx-auto mt-8 max-w-[980px] text-center text-[var(--text-secondary)]">
            {interfaceLanguage === 'en'
              ? 'There are no flashcard words in this episode yet.'
              : 'В этом эпизоде пока нет слов для карточек.'}
          </div>
        )}
      </div>
    </main>
  );
}
