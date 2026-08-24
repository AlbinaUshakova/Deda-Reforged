'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { useEffect, useState, useMemo } from 'react';
import { useAppStore } from '@/lib/appStore';
import type { EpisodeCard } from '@/lib/clientContentCache';
import { progressKeyForEpisode } from '@/lib/courses';
import BlocksGame from '@/components/BlocksGame';
import { translateRussianMeaningToEnglish } from '@/lib/englishMeanings';
import { getActiveTranslationLanguage } from '@/lib/settings';

type Word = { ge: string; ru: string; acceptedRu?: string[]; acceptedGe?: string[]; audio?: string };
type Card = EpisodeCard;
type Episode = { id: string; title: string; cards: Card[] };

function isPlayableCard(card: Card): card is Card & { type: 'word' | 'phrase' } {
  return (card.type === 'word' || card.type === 'phrase') && card.playable !== false;
}

function isEpisodeCard(value: unknown): value is Card {
  if (!value || typeof value !== 'object') return false;
  const card = value as Record<string, unknown>;
  return (
    (card.type === 'word' || card.type === 'phrase' || card.type === 'letter') &&
    typeof card.ge_text === 'string' &&
    typeof card.ru_meaning === 'string' &&
    (card.audio_url === undefined || typeof card.audio_url === 'string') &&
    (card.topic === undefined || typeof card.topic === 'string') &&
    (card.playable === undefined || typeof card.playable === 'boolean') &&
    (card.accepted_ru === undefined ||
      (Array.isArray(card.accepted_ru) && card.accepted_ru.every(value => typeof value === 'string'))) &&
    (card.accepted_ge === undefined ||
      (Array.isArray(card.accepted_ge) && card.accepted_ge.every(value => typeof value === 'string')))
  );
}

function parseEpisodeApiResponse(value: unknown): Episode | null {
  if (!value || typeof value !== 'object') return null;
  const response = value as Record<string, unknown>;
  if (!response.ok || !response.episode || typeof response.episode !== 'object') {
    return null;
  }

  const episode = response.episode as Record<string, unknown>;
  if (
    typeof episode.id !== 'string' ||
    typeof episode.title !== 'string' ||
    !Array.isArray(episode.cards) ||
    !episode.cards.every(isEpisodeCard)
  ) {
    return null;
  }

  return {
    id: episode.id,
    title: episode.title,
    cards: episode.cards,
  };
}

function getEpisodeFallbackTitle(episodeId: string): string {
  const match = episodeId.match(/^ep(\d+)$/i);
  if (match) return `Lesson ${match[1]}`;
  return episodeId;
}

async function loadEpisodeById(episodeId: string, courseId: string): Promise<Episode | null> {
  const res = await fetch(`/api/content/episode?id=${encodeURIComponent(episodeId)}&course=${encodeURIComponent(courseId)}`, {
    cache: 'no-store',
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Failed to load episode');
  return parseEpisodeApiResponse(await res.json());
}

export default function PlayPage({ params }: { params: { episodeId: string } }) {
  const { episodeId } = params;
  const hydrate = useAppStore(state => state.hydrate);
  const progressMap = useAppStore(state => state.progressMap);
  const courseId = useAppStore(state => state.settings.courseId);
  const interfaceLanguage = useAppStore(state => state.settings.interfaceLanguage);
  const translationLanguage = getActiveTranslationLanguage(interfaceLanguage);
  const progressEpisodeId = progressKeyForEpisode(courseId, episodeId);

  const [title, setTitle] = useState<string>('');
  const [words, setWords] = useState<Word[]>([]);
  const [initialBest, setInitialBest] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  useEffect(() => {
    setInitialBest(progressMap[progressEpisodeId] ?? 0);
  }, [progressEpisodeId, progressMap]);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    (async () => {
      try {
        const ep = await loadEpisodeById(episodeId, courseId);
        if (cancelled) return;

        if (!ep) {
          setTitle(episodeId);
          setWords([]);
          setInitialBest(0);
          setIsLoading(false);
          return;
        }

        setTitle(ep.title || episodeId);

        // читаем topic из query
        let topic: string | null = null;
        if (typeof window !== 'undefined') {
          const sp = new URLSearchParams(window.location.search);
          topic = sp.get('topic');
        }

        // берём только нужные карточки
        let cards = ep.cards.filter(isPlayableCard);

        if (topic) {
          const filtered = cards.filter(c => c.topic === topic);
          if (filtered.length > 0) {
            cards = filtered;
          }
        }

        const ws: Word[] = cards.map((c) => ({
          ge: c.ge_text,
          ru: translationLanguage === 'en'
            ? translateRussianMeaningToEnglish(c.ru_meaning)
            : c.ru_meaning,
          acceptedRu: translationLanguage === 'en'
            ? (c.accepted_ru ?? []).map(translateRussianMeaningToEnglish)
            : c.accepted_ru,
          acceptedGe: c.accepted_ge,
          audio: c.audio_url,
        }));
        setWords(ws);
        setIsLoading(false);
      } catch (e) {
        console.error('load play episode error', e);
        if (!cancelled) {
          setTitle(episodeId);
          setWords([]);
          setInitialBest(0);
          setIsLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [courseId, episodeId, translationLanguage]);

  const hasWords = useMemo(() => words.length > 0, [words]);
  const studyHref = `/study/${episodeId}` as Route;
  const pageTitle = title || getEpisodeFallbackTitle(episodeId);

  useEffect(() => {
    document.documentElement.classList.add('app-no-page-scroll');
    document.body.classList.add('app-no-page-scroll');
    return () => {
      document.documentElement.classList.remove('app-no-page-scroll');
      document.body.classList.remove('app-no-page-scroll');
    };
  }, []);

  return (
    <main className="blocks-game-screen app-screen-fixed relative min-h-screen bg-transparent text-[var(--text-primary)]">
      <div className="study-screen-orb study-screen-orb--left" aria-hidden="true" />
      <div className="study-screen-orb study-screen-orb--right" aria-hidden="true" />
      <div className="blocks-screen-shell mx-auto h-full w-full overflow-hidden px-3 py-8 sm:px-4 md:px-6 lg:pl-[124px]">
        <div className="relative z-30 mb-2 mx-auto w-full max-w-[980px]">
          <div className="relative flex min-h-[52px] items-center justify-center lg:justify-end">
            <div className="topButtons study-page-actions flex flex-wrap justify-center gap-2 lg:ml-auto lg:justify-end lg:pr-[112px]">
            <Link
              className="study-action-pill study-action-pill--secondary"
              href="/lessons"
              aria-label={interfaceLanguage === 'en' ? 'Back to lessons' : 'Вернуться на главную страницу уроков'}
            >
              <span aria-hidden="true">←</span>
              {interfaceLanguage === 'en' ? 'Home' : 'Главная'}
            </Link>
            <Link
              className="study-action-pill study-action-pill--primary"
              href={studyHref}
              aria-label={interfaceLanguage === 'en' ? 'Back to flashcards for this lesson' : 'Вернуться к карточкам этого урока'}
            >
              <span aria-hidden="true">▣</span>
              {interfaceLanguage === 'en' ? 'Cards' : 'Карточки'}
            </Link>
            </div>
          </div>
        </div>

        <div className="relative z-50 mx-auto w-full max-w-[980px]">
          {isLoading ? null : hasWords ? (
            <>
              <BlocksGame
                words={words}
                episodeId={progressEpisodeId}
                initialBest={initialBest}
              />
            </>
          ) : (
            <div className="mt-8 text-center text-[var(--text-secondary)]">
              {interfaceLanguage === 'en'
                ? 'There are no game words in this episode yet.'
                : 'В этом эпизоде пока нет слов для игры.'}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
