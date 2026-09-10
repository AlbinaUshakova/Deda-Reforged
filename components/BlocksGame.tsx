// src/components/BlocksGame.tsx
'use client';

import React, { useMemo, useState, useEffect, useRef } from 'react';
import { BlocksQuestionPanel } from '@/components/blocks/BlocksQuestionPanel';
import BlocksGrid from './BlocksGrid';
import type { Route } from 'next';
import { useAppStore } from '@/lib/appStore';
import {
  RECENT_WORD_GAP,
  buildCycle,
  isSameAnswer,
  normalizeRu,
  pickNextIndexFromQueue,
  wordKey,
} from '@/lib/blocksAnswer';
import { getDisplayText, type TransliterationMode } from '@/lib/transliteration';
import { readFavoriteWords, toggleFavoriteWord } from '@/lib/studyPreferences';
import { upsertProgress } from '@/lib/supabase';
import { getActiveTransliterationMode } from '@/lib/settings';
import { LESSON_UNLOCK_SCORE, isLessonEpisodeId } from '@/lib/lessonProgress';
import { recordReviewMistake, recordReviewSuccess } from '@/lib/reviewMemory';
import { crossedLessonUnlockScore } from '@/lib/gameMilestones';

type Word = { ge: string; ru: string; acceptedRu?: string[]; acceptedGe?: string[]; audio?: string };

type BlocksGameProps = {
  words: Word[];
  episodeId?: string;
  progressEpisodeId?: string;
  // рекорд уровня, который пришёл с карты
  initialBest?: number;
  topActions?: React.ReactNode;
  nextLessonHref?: string;
  studyHref?: string;
};

type Question = {
  ge: string;
  ru: string;
  acceptedRu?: string[];
  acceptedGe?: string[];
};

type Mode = 'question' | 'pieces' | 'gameOver';
type AnswerState = 'idle' | 'wrong' | 'correct';
type TranslationDirection = 'ge-ru' | 'ru-ge';
type QuestionPanelStyleVars = React.CSSProperties & {
  '--input-size': string;
  '--prompt-size': string;
};

function createQuestionFromWord(word: Word): Question {
  return {
    ge: word.ge,
    ru: word.ru,
    acceptedRu: word.acceptedRu,
    acceptedGe: word.acceptedGe,
  };
}

export default function BlocksGame({
  words,
  episodeId,
  progressEpisodeId,
  initialBest = 0,
  topActions,
  nextLessonHref,
  studyHref,
}: BlocksGameProps) {
  const questionPanelStyle: QuestionPanelStyleVars = {
    '--input-size': 'clamp(16px,1.8vw,22px)',
    '--prompt-size': 'clamp(22px,2.5vw,31px)',
  };
  const translationDirection = useAppStore(state => state.settings.translationDirection);
  const interfaceLanguage = useAppStore(state => state.settings.interfaceLanguage);
  const courseId = useAppStore(state => state.settings.courseId);
  const storedTransliterationMode = useAppStore(state => state.settings.transliterationMode);
  const transliterationMode = getActiveTransliterationMode(interfaceLanguage, courseId, storedTransliterationMode) as TransliterationMode;
  const isFavoritesEpisode = episodeId === 'favorites';
  const isMainLessonEpisode = episodeId ? isLessonEpisodeId(episodeId) : false;
  const [showUnlockToast, setShowUnlockToast] = useState(false);

  const hasWords = useMemo(() => words && words.length > 0, [words]);

  const [mode, setMode] = useState<Mode>('question');
  const [roundId, setRoundId] = useState(0);
  const [direction, setDirection] = useState<TranslationDirection>(translationDirection);

  const [question, setQuestion] = useState<Question | null>(null);
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(false);
  const [answerState, setAnswerState] = useState<AnswerState>('idle');

  const [attempts, setAttempts] = useState(0);
  const [showCorrect, setShowCorrect] = useState(false);
  const [isAnswerAccepted, setIsAnswerAccepted] = useState(false);

  const [showPalette, setShowPalette] = useState(false);
  const [hardGameOver, setHardGameOver] = useState(false);

  const [currentWordIndex, setCurrentWordIndex] = useState<number | null>(null);
  const [hardSet, setHardSet] = useState<Set<number>>(() => new Set());
  const [queue, setQueue] = useState<number[]>([]);

  // ожидание показа правильного ответа после 3-й ошибки
  const [isRevealing, setIsRevealing] = useState(false);
  const revealTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const correctTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const answerInputRef = useRef<HTMLInputElement | null>(null);
  const recentWordIndicesRef = useRef<number[]>([]);
  const recentWordKeysRef = useRef<string[]>([]);

  // ИЗБРАННЫЕ СЛОВА (по грузинскому слову)
  const [favoriteWords, setFavoriteWords] = useState<Set<string>>(
    () => new Set(),
  );
  const [isNarrowLayout, setIsNarrowLayout] = useState(false);


  // рекорд уровня (тот же, что на карте)
  const [bestScore, setBestScore] = useState(initialBest);
  useEffect(() => {
    setBestScore(initialBest);
  }, [initialBest]);

  useEffect(() => {
    if (!showUnlockToast) return;
    const timeout = setTimeout(() => setShowUnlockToast(false), 2400);
    return () => clearTimeout(timeout);
  }, [showUnlockToast]);

  // helper: очистить таймер показа правильного ответа
  const clearRevealTimer = () => {
    if (revealTimeoutRef.current) {
      clearTimeout(revealTimeoutRef.current);
      revealTimeoutRef.current = null;
    }
    setIsRevealing(false);
  };

  const clearCorrectTimer = () => {
    if (correctTimeoutRef.current) {
      clearTimeout(correctTimeoutRef.current);
      correctTimeoutRef.current = null;
    }
  };

  // очистка таймера при размонтировании
  useEffect(() => {
    return () => {
      clearRevealTimer();
      clearCorrectTimer();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // загрузка избранных слов из localStorage (мерджим старый и новый ключ)
  useEffect(() => {
    try {
      setFavoriteWords(readFavoriteWords());
    } catch (e) {
      console.error('Failed to load favorites', e);
    }
  }, []);

  useEffect(() => {
    setDirection(prev => (prev === translationDirection ? prev : translationDirection));
  }, [translationDirection]);

  useEffect(() => {
    const updateLayout = () => {
      setIsNarrowLayout(window.innerWidth < 900);
    };
    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, []);

  useEffect(() => {
    setAnswer('');
    setError(false);
    setAnswerState('idle');
    setIsAnswerAccepted(false);
    setAttempts(0);
    setShowCorrect(false);
    clearRevealTimer();
    if (mode === 'question' && hasWords) {
      gotoNextFromQueue(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [direction]);

  // переключение избранного для конкретного грузинского слова
  const toggleFavorite = (ge: string) => {
    setFavoriteWords(prev => {
      try {
        return toggleFavoriteWord(prev, ge);
      } catch (e) {
        console.error('Failed to save favorites', e);
        return prev;
      }
    });
  };

  const rememberRecentWord = (idx: number) => {
    const w = words[idx];
    if (!w) return;
    const key = wordKey(w);
    const maxRecent = Math.max(3, RECENT_WORD_GAP * 2);

    recentWordIndicesRef.current = [...recentWordIndicesRef.current, idx].slice(
      -maxRecent,
    );
    recentWordKeysRef.current = [...recentWordKeysRef.current, key].slice(
      -maxRecent,
    );
  };

  const gotoNextFromQueue = (markHard: boolean) => {
    if (!hasWords) {
      setQuestion(null);
      setCurrentWordIndex(null);
      setQueue([]);
      return;
    }

    setHardSet(prevHard => {
      const newHard = new Set(prevHard);

      if (markHard && currentWordIndex !== null) {
        newHard.add(currentWordIndex);
      }

      setQueue(prevQueue => {
        let q = prevQueue;

        if (!q.length) {
          q = buildCycle(words.length, newHard);
        }

        if (!q.length) {
          setQuestion(null);
          setCurrentWordIndex(null);
          return [];
        }

        const picked = pickNextIndexFromQueue(
          q,
          words,
          recentWordIndicesRef.current,
          recentWordKeysRef.current,
        );
        if (!picked) {
          setQuestion(null);
          setCurrentWordIndex(null);
          return [];
        }
        const { nextIdx, rest } = picked;
        const w = words[nextIdx];

        setCurrentWordIndex(nextIdx);
        rememberRecentWord(nextIdx);
        setQuestion(createQuestionFromWord(w));
        setAnswer('');
        setError(false);
        setAnswerState('idle');
        setIsAnswerAccepted(false);
        setAttempts(0);
        setShowCorrect(false);
        clearRevealTimer();

        return rest;
      });

      return newHard;
    });
  };

  useEffect(() => {
    if (hasWords) {
      recentWordIndicesRef.current = [];
      recentWordKeysRef.current = [];
      const newHard = new Set<number>();
      const cycle = buildCycle(words.length, newHard);

      if (!cycle.length) {
        setQuestion(null);
        setQueue([]);
        setCurrentWordIndex(null);
        setHardSet(newHard);
        return;
      }

      const picked = pickNextIndexFromQueue(
        cycle,
        words,
        recentWordIndicesRef.current,
        recentWordKeysRef.current,
      );
      if (!picked) {
        setQuestion(null);
        setQueue([]);
        setCurrentWordIndex(null);
        setHardSet(newHard);
        return;
      }

      const { nextIdx: firstIdx, rest } = picked;
      const w = words[firstIdx];

      setCurrentWordIndex(firstIdx);
      rememberRecentWord(firstIdx);
      setQuestion(createQuestionFromWord(w));
      setQueue(rest);
      setHardSet(newHard);

      setAnswer('');
      setError(false);
      setAnswerState('idle');
      setIsAnswerAccepted(false);
      setAttempts(0);
      setShowCorrect(false);
      clearRevealTimer();

      setHardGameOver(false);
      setMode('question');
      setRoundId(0);
    } else {
      setQuestion(null);
      setQueue([]);
      setCurrentWordIndex(null);
      setHardSet(new Set());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasWords, words]);

  useEffect(() => {
    if (mode === 'pieces') {
      const t = setTimeout(() => setShowPalette(true), 400);
      return () => clearTimeout(t);
    }
    setShowPalette(false);
  }, [mode]);

  const acceptCorrectAnswer = () => {
    if (question) recordReviewSuccess(courseId, question.ge);
    clearRevealTimer();
    clearCorrectTimer();
    setError(false);
    setAnswerState('correct');
    setIsAnswerAccepted(true);
    setAttempts(0);
    setShowCorrect(false);
    correctTimeoutRef.current = setTimeout(() => {
      setAnswer('');
      setAnswerState('idle');
      setIsAnswerAccepted(false);
      setMode('pieces');
      setRoundId(prev => (prev > 0 ? prev + 1 : 1));
      correctTimeoutRef.current = null;
    }, 140);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode !== 'question' || !question || hardGameOver) return;

    // если уже ждём автопоказ правильного ответа — игнорируем ввод
    if (isRevealing) return;

    if (showCorrect) {
      gotoNextFromQueue(true);
      return;
    }

    if (!normalizeRu(answer)) return;

    const correctAnswer = direction === 'ge-ru'
      ? [question.ru, ...(question.acceptedRu ?? [])]
      : [question.ge, ...(question.acceptedGe ?? [])];
    const isCorrect = isSameAnswer(answer, correctAnswer);

    if (isCorrect) {
      acceptCorrectAnswer();
    } else {
      recordReviewMistake(courseId, question.ge);
      setIsAnswerAccepted(false);
      if (currentWordIndex !== null) {
        setHardSet(prev => {
          const next = new Set(prev);
          next.add(currentWordIndex);
          return next;
        });
      }
      setAnswerState('wrong');
      setAttempts(prev => {
        const next = prev + 1;

        if (next >= 3) {
          // третья ошибка — поле остаётся красным 4 секунды,
          // затем автоматически показываем правильный ответ
          if (!isRevealing && !showCorrect) {
            setError(true);
            setIsRevealing(true);

            revealTimeoutRef.current = setTimeout(() => {
              revealCorrectAnswer();
            }, 2000);
          }
        } else {
          setError(true);
        }

        return next;
      });
    }
  };

  const handleAnswerChange = (nextValue: string) => {
    setAnswer(nextValue);
    if (error) setError(false);
    if (!question || showCorrect) {
      if (answerState !== 'idle') setAnswerState('idle');
      return;
    }
    if (!normalizeRu(nextValue)) {
      if (answerState !== 'idle') setAnswerState('idle');
      return;
    }
    const correctAnswer = direction === 'ge-ru'
      ? [question.ru, ...(question.acceptedRu ?? [])]
      : [question.ge, ...(question.acceptedGe ?? [])];
    const liveCorrect = isSameAnswer(nextValue, correctAnswer);
    if (liveCorrect) {
      if (!isAnswerAccepted) {
        acceptCorrectAnswer();
      }
      return;
    }
    if (isAnswerAccepted) {
      setIsAnswerAccepted(false);
    }
    setAnswerState('idle');
  };

  const revealCorrectAnswer = () => {
    if (!question) return;
    clearRevealTimer();
    clearCorrectTimer();
    if (currentWordIndex !== null) {
      setHardSet(prev => {
        const next = new Set(prev);
        next.add(currentWordIndex);
        return next;
      });
    }
    setAttempts(3);
    setError(false);
    setAnswerState('idle');
    setIsAnswerAccepted(false);
    setShowCorrect(true);
    setAnswer(direction === 'ge-ru' ? question.ru : getDisplayText(question.ge, transliterationMode, courseId));
  };

  const handleRevealTranslation = () => {
    if (!hasWords || hardGameOver || showCorrect || isRevealing) return;
    revealCorrectAnswer();
  };

  const handleRoundFinished = () => {
    if (!hasWords) return;
    if (hardGameOver) return;

    setMode('question');
    setAnswerState('idle');
    setIsAnswerAccepted(false);
    gotoNextFromQueue(false);
  };

  const handleGameOver = () => {
    setMode('gameOver');
    setHardGameOver(true);
    // прогресс уже сохранён при обновлении рекорда
  };

  const handleRestartRequested = () => {
    setHardGameOver(false);
    setMode('question');
    setAnswerState('idle');
    setIsAnswerAccepted(false);
    setRoundId(0);
    gotoNextFromQueue(false);
  };

  // когда из BlocksGrid приходит новый рекорд — обновляем прогресс и карту
  const handleBestScoreChange = (newBest: number) => {
    const justUnlockedNextLesson = crossedLessonUnlockScore({
      previousBest: bestScore,
      nextBest: newBest,
      unlockScore: LESSON_UNLOCK_SCORE,
      hasNextLesson: isMainLessonEpisode && Boolean(nextLessonHref),
    });
    setBestScore(newBest);
    if (justUnlockedNextLesson) {
      setShowUnlockToast(true);
    }
    const progressId = progressEpisodeId ?? episodeId;
    if (!progressId) return;
    upsertProgress(progressId, newBest).catch(console.error);
  };

  const isQuestionVisible = mode === 'question';
  const isGameOver = mode === 'gameOver';
  const shouldRenderQuestionPanel = !isGameOver && !hardGameOver;
  const showQuestionStage = !isNarrowLayout || (shouldRenderQuestionPanel && isQuestionVisible);
  const showBoardStage = !isNarrowLayout || !isQuestionVisible || isGameOver;
  const paletteSlotId = isNarrowLayout ? 'blocks-palette-slot-mobile' : 'blocks-palette-slot';
  const sidePaletteSlotStyle = isNarrowLayout
    ? undefined
    : {
        top: '50%',
        height: 'min(64dvh, 620px)',
        transform: 'translateY(-50%)',
      } as const;

  // текущий флаг избранности для показываемого слова
  const currentGe = question?.ge ?? null;
  const isCurrentFavorite =
    currentGe != null ? favoriteWords.has(currentGe) : false;
  const promptText = question
    ? (direction === 'ge-ru' ? getDisplayText(question.ge, transliterationMode, courseId) : question.ru)
    : '';
  return (
    <div className="blocks-game-root flex w-full justify-center lg:justify-start mt-1 md:mt-2">
      <div
        className={
          'blocks-game-layout relative flex w-full max-w-5xl rounded-[28px] bg-transparent px-1 sm:px-3 md:px-6 py-2 md:py-4 lg:py-5 ' +
          (isNarrowLayout
            ? 'flex-col items-center gap-2'
            : 'flex-row items-start gap-1 sm:gap-1.5 md:gap-2 lg:gap-2 xl:gap-2')
        }
      >
        {/* ЛЕВАЯ ОБЛАСТЬ: задание / фигуры */}
        <div
          className={
            (isNarrowLayout
              ? 'blocks-question-stage w-full max-w-[420px] shrink-0 ml-0 px-2'
              : 'w-[clamp(240px,32vw,380px)] shrink-0 ml-0 md:ml-[-10px] lg:ml-[-18px] -mt-2 md:-mt-4 lg:-mt-6') +
            (showQuestionStage ? '' : ' hidden')
          }
        >
          <div
            className="relative mt-0"
            style={{ height: isNarrowLayout ? 'auto' : 'min(67dvh, 620px)' }}
          >
            {shouldRenderQuestionPanel && (
              <div
                className={
                  (isNarrowLayout ? 'relative' : 'absolute inset-0 ') +
                  'transition-all duration-700 ' +
                  (isQuestionVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-16 pointer-events-none')
                }
              >
                <div className="blocks-question-stage-inner flex flex-col items-start justify-start h-full px-2 pt-5">
                  <BlocksQuestionPanel
                    hasWords={hasWords}
                    question={question}
                    promptText={promptText}
                    answer={answer}
                    answerState={answerState}
                    isAnswerAccepted={isAnswerAccepted}
                    showCorrect={showCorrect}
                    error={error}
                    attempts={attempts}
                    isFavoritesEpisode={isFavoritesEpisode || episodeId === 'custom'}
                    isCurrentFavorite={isCurrentFavorite}
                    inputRef={answerInputRef}
                    panelStyle={questionPanelStyle}
                    onSubmit={handleSubmit}
                    onAnswerChange={handleAnswerChange}
                    onRevealTranslation={handleRevealTranslation}
                    onToggleFavorite={toggleFavorite}
                  />
                </div>
              </div>
            )}

            <div
              id="blocks-palette-slot"
              className={
                'absolute left-0 right-0 flex items-center justify-end pr-4 md:pr-5 lg:pr-6 transition-opacity duration-300 ' +
                (showPalette ? 'opacity-100' : 'opacity-0 pointer-events-none')
              }
              style={sidePaletteSlotStyle}
            />
          </div>
        </div>

        {/* ПРАВАЯ ОБЛАСТЬ: игровое поле */}
        <div
          className={
            'min-w-0 flex flex-col items-center ' +
            (isNarrowLayout
              ? 'blocks-board-stage w-full max-w-[540px] px-2'
              : 'flex-1 justify-center lg:justify-start ml-0 lg:ml-0 xl:ml-0 -mt-2 md:-mt-4 lg:-mt-6') +
            (showBoardStage ? '' : ' hidden')
          }
        >
          <BlocksGrid
            roundId={roundId}
            onRoundFinished={handleRoundFinished}
            onRestartRequested={handleRestartRequested}
            onGameOver={handleGameOver}
            initialBestScore={bestScore}
            onBestScoreChange={handleBestScoreChange}
            topActions={topActions}
            answerState={answerState}
            unlockTargetScore={isMainLessonEpisode ? LESSON_UNLOCK_SCORE : undefined}
            studyHref={studyHref as Route | undefined}
            nextLessonHref={nextLessonHref as Route | undefined}
            hasUnlockedNextLesson={isMainLessonEpisode && bestScore >= LESSON_UNLOCK_SCORE}
            milestoneOverlay={showUnlockToast ? (
              <div className="lesson-unlock-toast" role="status" aria-live="polite">
                <div className="lesson-unlock-toast-card">
                  <div className="lesson-unlock-toast-title">
                    {interfaceLanguage === 'en' ? 'Next lesson unlocked' : 'Следующий урок открыт'}
                  </div>
                </div>
              </div>
            ) : undefined}
            paletteSlotId={paletteSlotId}
            palettePlacement={isNarrowLayout ? 'bottom' : 'side'}
          />
          <div
            id="blocks-palette-slot-mobile"
            className={
              (isNarrowLayout ? 'flex' : 'hidden') +
              ' w-full min-h-[clamp(82px,15vh,140px)] items-center justify-center'
            }
          />
        </div>
      </div>
    </div>
  );
}
