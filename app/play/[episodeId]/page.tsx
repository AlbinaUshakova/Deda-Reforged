'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { useEffect, useState, useMemo } from 'react';
import { useAppStore } from '@/lib/appStore';
import type { EpisodeCard } from '@/lib/clientContentCache';
import BlocksGame from '@/components/BlocksGame';

type Word = { ge: string; ru: string; audio?: string };
type Card = EpisodeCard;
type Episode = { id: string; title: string; cards: Card[] };

function isPlayableCard(card: Card): card is Card & { type: 'word' | 'phrase' } {
  return card.type === 'word' || card.type === 'phrase';
}

function isEpisodeCard(value: unknown): value is Card {
  if (!value || typeof value !== 'object') return false;
  const card = value as Record<string, unknown>;
  return (
    (card.type === 'word' || card.type === 'phrase' || card.type === 'letter') &&
    typeof card.ge_text === 'string' &&
    typeof card.ru_meaning === 'string' &&
    (card.audio_url === undefined || typeof card.audio_url === 'string') &&
    (card.topic === undefined || typeof card.topic === 'string')
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
  if (match) return `Урок ${match[1]}`;
  return episodeId;
}

async function loadEpisodeById(episodeId: string): Promise<Episode | null> {
  const res = await fetch(`/api/content/episode?id=${encodeURIComponent(episodeId)}`, {
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

  const [title, setTitle] = useState<string>('');
  const [words, setWords] = useState<Word[]>([]);
  const [initialBest, setInitialBest] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  useEffect(() => {
    setInitialBest(progressMap[episodeId] ?? 0);
  }, [episodeId, progressMap]);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    (async () => {
      try {
        const ep = await loadEpisodeById(episodeId);
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
          ru: c.ru_meaning,
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
  }, [episodeId]);

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
      <div className="mx-auto h-full w-full overflow-hidden px-3 sm:px-4 md:px-6 py-8 lg:pl-[124px]">
        <div className="relative z-30 mb-2 mx-auto w-full max-w-[980px]">
          <div className="relative flex min-h-[52px] items-center justify-end">
            <div className="topButtons study-page-actions ml-auto flex flex-wrap justify-end gap-2 lg:pr-[112px]">
            <Link
              className="study-action-pill study-action-pill--secondary"
              href="/lessons"
              aria-label="Вернуться на главную страницу уроков"
            >
              <span aria-hidden="true">←</span>
              Главная
            </Link>
            <Link
              className="study-action-pill study-action-pill--primary"
              href={studyHref}
              aria-label="Вернуться к карточкам этого урока"
            >
              <span aria-hidden="true">▣</span>
              Карточки
            </Link>
            </div>
          </div>
        </div>

        <div className="relative z-50 w-full">
          {isLoading ? null : hasWords ? (
            <>
              <BlocksGame
                words={words}
                episodeId={episodeId}
                initialBest={initialBest}
              />
            </>
          ) : (
            <div className="text-neutral-400 mt-8">
              В этом эпизоде пока нет слов для игры.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
