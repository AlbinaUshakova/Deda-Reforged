'use client';

import type { Route } from 'next';
import { useEffect, useState, useMemo } from 'react';
import { useAppStore } from '@/lib/appStore';
import { getEpisodesDataCached, getEpisodesDataSync } from '@/lib/clientContentCache';
import type { EpisodeCard } from '@/lib/clientContentCache';
import { progressKeyForEpisode } from '@/lib/courses';
import BlocksGame from '@/components/BlocksGame';
import StudyPageActions from '@/components/study/StudyPageActions';
import { translateRussianMeaningToEnglish } from '@/lib/englishMeanings';
import { getActiveTranslationLanguage } from '@/lib/settings';
import { LESSON_UNLOCK_SCORE, getLessonPosition, getNextLessonId, getNormalLessonEpisodes, isLessonEpisodeId } from '@/lib/lessonProgress';
import { getLessonProgressGuidance, getLessonProgressSummary } from '@/lib/progressFeedback';
import { getSpecialEpisodeKind, getSpecialEpisodeLabel, getSpecialPlayCopy, getSpecialPlayEmptyState } from '@/lib/specialEpisodeText';
import { orderReviewCards, readReviewMemory } from '@/lib/reviewMemory';
import { readFavoriteWords } from '@/lib/studyPreferences';
import { readCustomCards } from '@/lib/customCards';

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
  const lessonTargetScore = useAppStore(state => state.settings.lessonTargetScore);
  const translationLanguage = getActiveTranslationLanguage(interfaceLanguage);
  const progressEpisodeId = progressKeyForEpisode(courseId, episodeId);
  const specialEpisodeKind = getSpecialEpisodeKind(episodeId);
  const isMainLessonEpisode = isLessonEpisodeId(episodeId);

  const [title, setTitle] = useState<string>('');
  const [words, setWords] = useState<Word[]>([]);
  const [initialBest, setInitialBest] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [episodesData, setEpisodesData] = useState(() => getEpisodesDataSync(courseId));
  const learnedReviewEpisodeSignature = useMemo(
    () =>
      getNormalLessonEpisodes(episodesData.episodes, episodesData.lettersByEpisode)
        .filter(episode => (progressMap[progressKeyForEpisode(courseId, episode.id)] ?? 0) >= LESSON_UNLOCK_SCORE)
        .map(episode => episode.id)
        .join('|'),
    [courseId, episodesData.episodes, episodesData.lettersByEpisode, progressMap],
  );

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
        const ep = episodeId === 'custom'
          ? {
              id: 'custom',
              title: interfaceLanguage === 'en' ? 'My cards' : 'Мои карточки',
              cards: readCustomCards(courseId).map(card => ({
                type: 'word' as const,
                ge_text: card.front,
                ru_meaning: card.meaning,
                translit: card.transcription,
                transcription_ru: card.transcription,
                transcription_en: card.transcription,
                playable: true,
              })),
            }
          : await loadEpisodeById(episodeId, courseId);
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

        if (episodeId === 'favorites') {
          const favoriteWords = readFavoriteWords();
          cards = cards.filter(c => favoriteWords.has(c.ge_text));
        }

        if (episodeId === 'all') {
          const learnedIds = new Set(learnedReviewEpisodeSignature.split('|').filter(Boolean));
          cards = orderReviewCards(
            cards.filter(card => card.source_episode_id && learnedIds.has(card.source_episode_id)),
            readReviewMemory(courseId),
          );
        }

        if (topic) {
          const filtered = cards.filter(c => c.topic === topic);
          if (filtered.length > 0) {
            cards = filtered;
          }
        }

        const ws: Word[] = cards.map((c) => ({
          ge: c.ge_text,
          ru: translationLanguage === 'en' && episodeId !== 'custom'
            ? translateRussianMeaningToEnglish(c.ru_meaning)
            : c.ru_meaning,
          acceptedRu: translationLanguage === 'en' && episodeId !== 'custom'
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
  }, [courseId, episodeId, interfaceLanguage, learnedReviewEpisodeSignature, translationLanguage]);

  const hasWords = useMemo(() => words.length > 0, [words]);
  const studyHref = `/study/${episodeId}` as Route;
  const pageTitle = title || getEpisodeFallbackTitle(episodeId);
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
  const nextLessonHref = nextLessonId ? (`/study/${nextLessonId}` as Route) : undefined;
  const currentBest = progressMap[progressEpisodeId] ?? 0;
  const hasUnlockedNextLesson = currentBest >= LESSON_UNLOCK_SCORE;
  const progressSummary = isMainLessonEpisode
    ? getLessonProgressSummary({
        score: currentBest,
        targetScore: lessonTargetScore,
        hasNextLesson: Boolean(nextLessonId),
        interfaceLanguage,
      })
    : currentBest > 0
      ? interfaceLanguage === 'en'
        ? `Best score ${currentBest}`
        : `Лучший счет ${currentBest}`
      : undefined;
  const lessonLabel = lessonPosition
    ? interfaceLanguage === 'en'
      ? `Lesson ${lessonPosition}`
      : `Урок ${lessonPosition}`
    : getSpecialEpisodeLabel(specialEpisodeKind, interfaceLanguage) ?? pageTitle;
  const playProgressLabel = lessonPosition && normalEpisodes.length > 0
    ? getLessonProgressGuidance({
        score: currentBest,
        targetScore: lessonTargetScore,
        hasNextLesson: Boolean(nextLessonId),
        surface: 'play',
        interfaceLanguage,
      })
    : getSpecialPlayCopy(specialEpisodeKind, interfaceLanguage);

  useEffect(() => {
    document.documentElement.classList.add('app-no-page-scroll');
    document.body.classList.add('app-no-page-scroll');
    return () => {
      document.documentElement.classList.remove('app-no-page-scroll');
      document.body.classList.remove('app-no-page-scroll');
    };
  }, []);

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

  return (
    <main className="blocks-game-screen app-screen-fixed relative min-h-screen bg-transparent text-[var(--text-primary)]">
      <div className="study-screen-orb study-screen-orb--left" aria-hidden="true" />
      <div className="study-screen-orb study-screen-orb--right" aria-hidden="true" />
      <div className="study-screen-shell mx-auto h-full w-full overflow-hidden px-[clamp(14px,3.6vw,48px)] py-[clamp(16px,2.6vh,32px)]">
        <StudyPageActions
          playHref={studyHref}
          lessonLabel={lessonLabel}
          courseProgressLabel={playProgressLabel}
          progressSummary={progressSummary}
          nextLessonHref={hasUnlockedNextLesson ? nextLessonHref : undefined}
          surface="play"
        />

        <div className="relative z-50 mx-auto w-full max-w-[980px]">
          {isLoading ? null : hasWords ? (
            <>
              <BlocksGame
                words={words}
                episodeId={episodeId}
                progressEpisodeId={progressEpisodeId}
                initialBest={initialBest}
                nextLessonHref={nextLessonHref}
                studyHref={studyHref}
              />
            </>
          ) : (
            <div className="mt-8 text-center text-[var(--text-secondary)]">
              {getSpecialPlayEmptyState(specialEpisodeKind, interfaceLanguage) ??
                (interfaceLanguage === 'en'
                  ? 'There are no game words in this episode yet.'
                  : 'В этом эпизоде пока нет слов для игры.')}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
