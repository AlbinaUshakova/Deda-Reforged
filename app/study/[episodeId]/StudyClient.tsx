'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Route } from 'next';
import FlashcardDeck from '@/components/FlashcardDeck';
import { StudyAlphabetHint } from '@/components/study/StudyAlphabetHint';
import StudyPageActions from '@/components/study/StudyPageActions';
import type { Episode } from '@/lib/content';
import { getStudyDeckCards, resolveStudyEpisode } from './studyContent';

export default function StudyClient({
  episodeId,
  bundled,
}: {
  episodeId: string;
  bundled: Episode | null;
}) {
  const ep = useMemo(() => resolveStudyEpisode(bundled, episodeId), [bundled, episodeId]);
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
    document.documentElement.classList.add('app-no-page-scroll');
    document.body.classList.add('app-no-page-scroll');
    return () => {
      document.documentElement.classList.remove('app-no-page-scroll');
      document.body.classList.remove('app-no-page-scroll');
    };
  }, []);

  return (
    <main className="study-card-screen app-screen-fixed min-h-screen bg-transparent text-[var(--text-primary)]">
      <div className="study-screen-orb study-screen-orb--left" aria-hidden="true" />
      <div className="study-screen-orb study-screen-orb--right" aria-hidden="true" />
      <div className="mx-auto h-full w-full overflow-hidden px-[clamp(14px,3.6vw,48px)] py-[clamp(16px,2.6vh,32px)]">
        <StudyPageActions playHref={playHref as Route} />
        {hasEpisode && hasWords ? <StudyAlphabetHint /> : null}

        {!hasEpisode ? (
          <div className="p-6">Эпизод не найден</div>
        ) : hasWords ? (
          <div className="relative z-0 mt-[clamp(2px,0.8vh,10px)]">
            <FlashcardDeck
              cards={words}
              lessonTitle={ep?.title ?? episodeId}
              episodeId={episodeId}
              onTopicChange={setTopicForPlay}
            />
          </div>
        ) : (
          <div className="text-neutral-400 mt-8">
            В этом эпизоде пока нет слов для карточек.
          </div>
        )}
      </div>
    </main>
  );
}
