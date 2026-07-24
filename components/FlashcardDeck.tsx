// components/FlashcardDeck.tsx
'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { useAppStore } from '@/lib/appStore';
import {
  readFavoriteWordMap,
  toggleFavoriteWord,
} from '@/lib/studyPreferences';
import { FlashcardCardActions } from '@/components/flashcards/FlashcardCardActions';
import { FlashcardCardContent } from '@/components/flashcards/FlashcardCardContent';
import { FlashcardFilters } from '@/components/flashcards/FlashcardFilters';
import { FlashcardLessonLetters } from '@/components/flashcards/FlashcardLessonLetters';
import {
  getMobileTextSizeClass,
  insertSoftHyphens,
  splitDialogLines,
} from '@/components/flashcards/flashcardText';
import { useFlashcardKeyboardShortcuts } from '@/components/flashcards/useFlashcardKeyboardShortcuts';
import { textToHint, type TransliterationMode } from '@/lib/transliteration';
import { getEpisodesDataCached, getEpisodesDataSync } from '@/lib/clientContentCache';
import { getCourse } from '@/lib/courses';

type Card = {
  id?: string;
  ge_text: string;
  translit?: string;
  ru_meaning?: string;
  info_notes?: Array<{ kind: 'grammar' | 'speech' | 'mistake'; text: string }>;
  type?: 'word' | 'letter';
  level?: number; // 1–3 сложность (используем, если нет topic)
  topic?: string; // тема фразы (location_movement, questions и т.п.)
};

export default function FlashcardDeck({
  cards,
  episodeId,
  onTopicChange,
}: {
  cards: Card[];
  episodeId?: string;
  onTopicChange?: (topic: string | null) => void;
}) {
  const [isFavoritesPage, setIsFavoritesPage] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    setIsFavoritesPage(/\/study\/favorites\/?$/.test(window.location.pathname));
  }, []);

  const [idx, setIdx] = useState(0);
  const [progressStep, setProgressStep] = useState(0);
  const [order, setOrder] = useState<number[]>([]);
  const [flipped, setFlipped] = useState(false);

  // фильтр по сложности (используем только если нет topic)
  const [levelFilter, setLevelFilter] = useState<number | null>(null);
  const [levelInfo, setLevelInfo] = useState<number | null>(null);

  // фильтр по теме
  const [topicFilter, setTopicFilter] = useState<string | null>(null);

  const [favMap, setFavMap] = useState<Record<string, true>>({});

  const [showTranslit, setShowTranslit] = useState(false);
  const transliterationMode = useAppStore(
    state => state.settings.transliterationMode,
  ) as TransliterationMode;
  const courseId = useAppStore(state => state.settings.courseId);
  const course = getCourse(courseId);
  const [lessonLetters, setLessonLetters] = useState<string[]>([]);
  const [revealCount, setRevealCount] = useState(0);
  const [expandedInfoKinds, setExpandedInfoKinds] = useState<Record<string, boolean>>({});

  const hasTopics = useMemo(
    () => cards.some(c => !!c.topic),
    [cards],
  );

  useEffect(() => {
    let cancelled = false;
    const { lettersByEpisode } = getEpisodesDataSync(courseId);
    const syncLetters = episodeId ? (lettersByEpisode[episodeId] ?? []) : [];
    setLessonLetters(syncLetters);

    if (!episodeId) return;

    void getEpisodesDataCached(false, courseId).then((data) => {
      if (cancelled) return;
      setLessonLetters(data.lettersByEpisode[episodeId] ?? []);
    });

    return () => {
      cancelled = true;
    };
  }, [courseId, episodeId]);

  const currentLessonLetters = useMemo(
    () => new Set(lessonLetters),
    [lessonLetters],
  );
  const currentLessonLettersList = lessonLetters;

  const renderLessonLetterHighlight = useCallback(
    (text: string) => {
      if (!text || currentLessonLetters.size === 0) return text;
      return Array.from(text).map((ch, idx) => {
        const normalizedChar = ch.toLocaleUpperCase(course.locale);
        const normalizedSharpS = ch === 'ß' ? 'ẞ' : normalizedChar;
        return ch === '\u00AD' ? (
          <span key={`${idx}-shy`}>{ch}</span>
        ) : currentLessonLetters.has(ch) ||
          currentLessonLetters.has(normalizedChar) ||
          currentLessonLetters.has(normalizedSharpS) ? (
          <span
            key={`${ch}-${idx}`}
            className="flashcard-new-letter"
          >
            {ch}
          </span>
        ) : (
          <span key={`${ch}-${idx}`}>{ch}</span>
        );
      });
    },
    [course.locale, currentLessonLetters],
  );

  const renderCardText = useCallback(
    (text: string, kind: 'ge' | 'ru') => {
      const prepared =
        kind === 'ge'
          ? insertSoftHyphens(text, 6)
          : insertSoftHyphens(text, 7);

      if (kind === 'ge') {
        return renderLessonLetterHighlight(prepared);
      }

      return prepared;
    },
    [renderLessonLetterHighlight],
  );

  const hasLevels = useMemo(
    () => !hasTopics && cards.some(c => typeof c.level === 'number'),
    [cards, hasTopics],
  );

  const topics = useMemo(() => {
    if (!hasTopics) return [] as string[];
    const set = new Set<string>();
    cards.forEach(c => {
      if (c.topic) set.add(c.topic);
    });
    return Array.from(set);
  }, [cards, hasTopics]);

  // говорим наружу, какая тема выбрана (или null)
  useEffect(() => {
    if (!onTopicChange) return;
    if (!hasTopics) {
      onTopicChange(null);
    } else {
      onTopicChange(topicFilter);
    }
  }, [topicFilter, hasTopics, onTopicChange]);

  useEffect(() => {
    try {
      setFavMap(readFavoriteWordMap());
    } catch { }
  }, []);

  const visible = useMemo(() => {
    let base = isFavoritesPage ? cards.filter(c => !!favMap[c.ge_text]) : cards;

    if (hasTopics && topicFilter) {
      base = base.filter(c => c.topic === topicFilter);
    } else if (!hasTopics && hasLevels && levelFilter !== null) {
      base = base.filter(c => (c.level ?? 1) === levelFilter);
    }

    return base;
  }, [cards, favMap, isFavoritesPage, hasTopics, topicFilter, hasLevels, levelFilter]);

  useEffect(() => {
    setOrder(visible.map((_, i) => i));
    setIdx(0);
    setProgressStep(visible.length ? 1 : 0);
    setFlipped(false);
    setShowTranslit(false);
    setRevealCount(0);
  }, [visible]);

  const card = visible[order[idx]];
  const hasCard = !!card;
  const geDialogLines = splitDialogLines(card?.ge_text || '');
  const ruDialogLines = splitDialogLines(card?.ru_meaning || '');
  const isGeDialog = geDialogLines.length > 1;
  const isRuDialog = ruDialogLines.length > 1;
  const geLength = Array.from(String(card?.ge_text || '').trim()).length;
  const ruLength = Array.from(String(card?.ru_meaning || '').trim()).length;
  const geMobileLayoutClass =
    !isGeDialog && geLength >= 10 && !/\s/.test(card?.ge_text || '')
      ? 'max-[640px]:px-[34px] max-[420px]:px-[38px] max-[640px]:[hyphens:manual] max-[640px]:break-normal'
      : 'max-[640px]:px-[26px]';
  const ruMobileLayoutClass =
    !isRuDialog && ruLength >= 18 && !/\s/.test(card?.ru_meaning || '')
      ? 'max-[640px]:px-[34px] max-[420px]:px-[38px] max-[640px]:[hyphens:manual] max-[640px]:break-normal'
      : 'max-[640px]:px-[26px]';
  const geMobileTextClass = useMemo(
    () => getMobileTextSizeClass(card?.ge_text || '', 'ge'),
    [card?.ge_text],
  );
  const ruMobileTextClass = useMemo(
    () => getMobileTextSizeClass(card?.ru_meaning || '', 'ru'),
    [card?.ru_meaning],
  );
  const infoNotes = card?.info_notes ?? [];
  const cardTranslit = useMemo(() => {
    if (!card) return '';
    const manualTranslit = card.translit?.trim();
    if (courseId === 'en' && manualTranslit) {
      return manualTranslit;
    }
    if (transliterationMode === 'latin' && manualTranslit) {
      return manualTranslit;
    }
    return textToHint(card.ge_text, transliterationMode, courseId);
  }, [card, courseId, transliterationMode]);

  const translitDialogLines = splitDialogLines(
    cardTranslit,
  );
  useEffect(() => {
    setExpandedInfoKinds({});
  }, [card?.ge_text, flipped]);

  const onPrev = useCallback(() => {
    if (!visible.length) return;
    setIdx(i => {
      const wrapped = i <= 0;
      const nextIdx = wrapped ? visible.length - 1 : i - 1;
      setProgressStep(wrapped ? visible.length : nextIdx + 1);
      return nextIdx;
    });
    setFlipped(false);
    setShowTranslit(false);
    setRevealCount(0);
  }, [visible.length]);

  const onNext = useCallback(() => {
    if (!visible.length) return;
    setIdx(i => {
      if (i >= visible.length - 1) {
        setProgressStep(0);
        return 0;
      }
      const nextIdx = i + 1;
      setProgressStep(nextIdx + 1);
      return nextIdx;
    });
    setFlipped(false);
    setShowTranslit(false);
    setRevealCount(0);
  }, [visible.length]);

  const toggleFav = useCallback(
    (ge: string) => {
      setFavMap(prev => {
        const next = toggleFavoriteWord(Object.keys(prev), ge);
        return Object.fromEntries(
          Array.from(next).map(word => [word, true] as const),
        );
      });
    },
    [],
  );

  const flipCard = useCallback(() => {
    setFlipped(f => !f);
  }, []);

  useFlashcardKeyboardShortcuts({
    hasCard,
    currentCardGeText: card?.ge_text,
    onFlip: flipCard,
    onNext,
    onPrev,
    onToggleFavorite: toggleFav,
  });

  const hintText = useMemo(() => {
    if (!card) return '';
    const t = (card.ru_meaning || '').trim();
    if (!t) return '';
    const chars = Array.from(t);
    const shownLetters = Math.min(
      revealCount,
      chars.filter(ch => /[A-Za-zА-Яа-яЁёІіЇїЄєҐґ\u0400-\u04FF]/.test(ch)).length,
    );
    let revealedLetters = 0;
    return chars
      .map(ch => {
        const isLetter =
          /[A-Za-zА-Яа-яЁёІіЇїЄєҐґ\u0400-\u04FF]/.test(ch);
        if (!isLetter) return ch;
        if (revealedLetters < shownLetters) {
          revealedLetters += 1;
          return ch;
        }
        return '_';
      })
      .join('');
  }, [card, revealCount]);

  const total = visible.length;
  const counter = total ? `${idx + 1} / ${total}` : '0 / 0';
  const isFav = !!(card && favMap[card.ge_text]);
  const canPrev = hasCard && total > 1;
  const canNext = hasCard && total > 1;

  const clearFilters = useCallback(() => {
    setTopicFilter(null);
    setLevelFilter(null);
    setLevelInfo(null);
  }, []);

  const selectTopic = useCallback((topic: string) => {
    setTopicFilter(prev => (prev === topic ? null : topic));
    setLevelFilter(null);
    setLevelInfo(null);
  }, []);

  const selectLevel = useCallback((level: number) => {
    setLevelFilter(prev => (prev === level ? null : level));
    setLevelInfo(prev => (prev === level ? null : level));
  }, []);

  const toggleInfoNote = useCallback((noteKey: string) => {
    setExpandedInfoKinds(prev => ({
      ...prev,
      [noteKey]: !prev[noteKey],
    }));
  }, []);

  const revealHint = useCallback(() => {
    const t = (card?.ru_meaning || '').trim();
    if (!t) return;
    const lettersTotal = Array.from(t).filter(ch =>
      /[A-Za-zА-Яа-яЁёІіЇїЄєҐґ\u0400-\u04FF]/.test(ch),
    ).length;
    setRevealCount(c => Math.min(lettersTotal, c + 1));
  }, [card?.ru_meaning]);

  const toggleCurrentFavorite = useCallback(() => {
    if (!card) return;
    toggleFav(card.ge_text);
  }, [card, toggleFav]);

  return (
    <div className="flashcard-screen-root relative w-full min-w-0">
      {/* Верх: счётчик и заголовок */}
      <div className="mb-1 flex w-full flex-col items-center justify-center gap-1.5">
        <FlashcardFilters
          hasTopics={hasTopics}
          hasLevels={hasLevels}
          topics={topics}
          topicFilter={topicFilter}
          levelFilter={levelFilter}
          levelInfo={levelInfo}
          onClearFilters={clearFilters}
          onSelectTopic={selectTopic}
          onSelectLevel={selectLevel}
        />
      </div>

      {/* Карточка */}
      <div className="flashcard-stage relative mx-auto flex w-full max-w-[900px] flex-col items-center justify-center px-[clamp(14px,3.6vw,40px)] pt-[clamp(8px,1.4vh,18px)] pb-[clamp(24px,4vh,44px)]">
        <FlashcardLessonLetters
          letters={currentLessonLettersList}
          kind="letters"
          title="Буквы урока"
        />

        <div className="flashcard-card-shell relative mx-auto">
          <div className="flashcard-cat-peek pointer-events-none absolute z-20" aria-hidden="true">
            <Image
              src="/images/cats/deda-flashcards-writing.png"
              alt=""
              width={132}
              height={170}
              className="select-none object-contain drop-shadow-[0_12px_22px_rgba(120,53,15,0.12)]"
              priority={false}
            />
          </div>

          <div
            className={`flashcard-main-card group relative z-10 mx-auto cursor-pointer rounded-3xl border border-slate-200 bg-white ${
              flipped ? 'flashcard-main-card--flipped' : ''
            }`}
            onClick={() => hasCard && setFlipped(f => !f)}
            role="button"
            tabIndex={0}
            onKeyDown={e => {
              if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                hasCard && setFlipped(f => !f);
              }
            }}
          >
          {hasCard && (
            <FlashcardCardActions
              hintText={hintText}
              revealCount={revealCount}
              isFavorite={isFav}
              showTranslit={showTranslit}
              onRevealHint={revealHint}
              onResetHint={() => setRevealCount(0)}
              onToggleFavorite={toggleCurrentFavorite}
              onToggleTranslit={() => setShowTranslit(v => !v)}
            />
          )}

          {/* Контент */}
          <div className="flashcard-content grid h-full w-full select-none place-items-center text-center">
            <FlashcardCardContent
              hasCard={hasCard}
              isFavoritesPage={isFavoritesPage}
              flipped={flipped}
              idx={idx}
              geText={card?.ge_text || ''}
              ruText={card?.ru_meaning || ''}
              geDialogLines={geDialogLines}
              ruDialogLines={ruDialogLines}
              translitDialogLines={translitDialogLines}
              cardTranslit={cardTranslit}
              showTranslit={showTranslit}
              isGeDialog={isGeDialog}
              isRuDialog={isRuDialog}
              geMobileTextClass={geMobileTextClass}
              ruMobileTextClass={ruMobileTextClass}
              geMobileLayoutClass={geMobileLayoutClass}
              ruMobileLayoutClass={ruMobileLayoutClass}
              infoNotes={infoNotes}
              expandedInfoKinds={expandedInfoKinds}
              renderCardText={renderCardText}
              renderLessonLetterHighlight={renderLessonLetterHighlight}
              onToggleInfoNote={toggleInfoNote}
            />
          </div>

            <div
              className="flashcard-corner-fold pointer-events-none absolute bottom-[clamp(12px,1.8vw,18px)] right-[clamp(16px,1.8vw,22px)] z-10"
              aria-hidden="true"
            />

          </div>
        </div>

        <nav className="flashcard-nav-bar" aria-label="Навигация по карточкам">
          <button
            type="button"
            className="flashcard-nav-step flashcard-nav-step--prev"
            onClick={onPrev}
            disabled={!canPrev}
          >
            <span className="flashcard-nav-icon" aria-hidden="true">‹</span>
            <span>Назад</span>
          </button>

          <div className="flashcard-nav-progress" aria-live="polite">
            {counter}
          </div>

          <button
            type="button"
            className="flashcard-nav-step flashcard-nav-step--next"
            onClick={onNext}
            disabled={!canNext}
          >
            <span>Дальше</span>
            <span className="flashcard-nav-icon" aria-hidden="true">›</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
