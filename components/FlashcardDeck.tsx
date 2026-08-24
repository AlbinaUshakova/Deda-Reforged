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
import { getDisplayText, type TransliterationMode } from '@/lib/transliteration';
import { getEpisodesDataCached, getEpisodesDataSync } from '@/lib/clientContentCache';
import { getCourse } from '@/lib/courses';
import { translateRussianMeaningToEnglish } from '@/lib/englishMeanings';
import { getActiveTransliterationMode } from '@/lib/settings';
import { resolveCardTranscription } from '@/lib/cardTranscription';

type Card = {
  id?: string;
  ge_text: string;
  translit?: string;
  transcription_ru?: string;
  transcription_en?: string;
  ipa?: string;
  ru_meaning?: string;
  info_notes?: Array<{ kind: 'grammar' | 'speech' | 'mistake'; text: string }>;
  type?: 'word' | 'letter';
  level?: number;
  topic?: string;
};

const HINT_LETTER_RE = /[A-Za-zА-Яа-яЁёІіЇїЄєҐґ\u0400-\u04FF]/;

function buildProgressiveHint(text: string, revealCount: number): string {
  const chars = Array.from(text.trim());
  const totalLetters = chars.filter(ch => HINT_LETTER_RE.test(ch)).length;
  const shownLetters = Math.min(revealCount, totalLetters);
  let revealedLetters = 0;

  return chars.map(ch => {
    if (!HINT_LETTER_RE.test(ch)) return ch;
    if (revealedLetters < shownLetters) {
      revealedLetters += 1;
      return ch;
    }
    return '_';
  }).join('');
}

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
  const [showTranslit, setShowTranslit] = useState(false);
  const [revealCount, setRevealCount] = useState(0);

  const [levelFilter, setLevelFilter] = useState<number | null>(null);
  const [levelInfo, setLevelInfo] = useState<number | null>(null);
  const [topicFilter, setTopicFilter] = useState<string | null>(null);
  const [favMap, setFavMap] = useState<Record<string, true>>({});

  const interfaceLanguage = useAppStore(state => state.settings.interfaceLanguage);
  const courseId = useAppStore(state => state.settings.courseId);
  const storedTransliterationMode = useAppStore(state => state.settings.transliterationMode);
  const transliterationMode = getActiveTransliterationMode(interfaceLanguage, courseId, storedTransliterationMode) as TransliterationMode;
  const course = getCourse(courseId);
  const [lessonLetters, setLessonLetters] = useState<string[]>([]);

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
  const currentLessonLettersList = useMemo(
    () => lessonLetters.map((letter) => getDisplayText(letter, transliterationMode, courseId)),
    [courseId, lessonLetters, transliterationMode],
  );

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
  const translationText = useMemo(
    () =>
      interfaceLanguage === 'en'
        ? translateRussianMeaningToEnglish(card?.ru_meaning || '')
        : (card?.ru_meaning || ''),
    [card?.ru_meaning, interfaceLanguage],
  );
  const displayGeText = useMemo(
    () => getDisplayText(card?.ge_text || '', transliterationMode, courseId),
    [card?.ge_text, courseId, transliterationMode],
  );
  const transcriptionText = useMemo(
    () => resolveCardTranscription(card, interfaceLanguage, transliterationMode, courseId),
    [card, courseId, interfaceLanguage, transliterationMode],
  );
  const progressiveHintText = useMemo(
    () => buildProgressiveHint(translationText, revealCount),
    [translationText, revealCount],
  );
  const geDialogLines = splitDialogLines(displayGeText);
  const ruDialogLines = splitDialogLines(translationText);
  const isGeDialog = geDialogLines.length > 1;
  const isRuDialog = ruDialogLines.length > 1;
  const geLength = Array.from(String(displayGeText).trim()).length;
  const ruLength = Array.from(String(translationText).trim()).length;
  const geMobileLayoutClass =
    !isGeDialog && geLength >= 10 && !/\s/.test(displayGeText || '')
      ? 'max-[640px]:px-[34px] max-[420px]:px-[38px] max-[640px]:[hyphens:manual] max-[640px]:break-normal'
      : 'max-[640px]:px-[26px]';
  const ruMobileLayoutClass =
    !isRuDialog && ruLength >= 18 && !/\s/.test(translationText || '')
      ? 'max-[640px]:px-[34px] max-[420px]:px-[38px] max-[640px]:[hyphens:manual] max-[640px]:break-normal'
      : 'max-[640px]:px-[26px]';
  const geMobileTextClass = useMemo(
    () => getMobileTextSizeClass(displayGeText, 'ge'),
    [displayGeText],
  );
  const ruMobileTextClass = useMemo(
    () => getMobileTextSizeClass(translationText, 'ru'),
    [translationText],
  );

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

  const revealHint = useCallback(() => {
    const totalLetters = Array.from(translationText.trim()).filter(ch => HINT_LETTER_RE.test(ch)).length;
    if (totalLetters === 0) return;
    setRevealCount(count => Math.min(totalLetters, count + 1));
  }, [translationText]);

  const resetHint = useCallback(() => {
    setRevealCount(0);
  }, []);

  const toggleCurrentFavorite = useCallback(() => {
    if (!card) return;
    toggleFav(card.ge_text);
  }, [card, toggleFav]);

  const hasTranscription = !!transcriptionText.trim();

  useEffect(() => {
    if (!card) return;
    setShowTranslit(false);
    setRevealCount(0);
  }, [card?.id, card?.ge_text]);

  return (
    <div className="flashcard-screen-root relative w-full min-w-0">
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

      <div className="flashcard-stage relative mx-auto flex w-full max-w-[900px] flex-col items-center justify-center px-[clamp(14px,3.6vw,40px)] pt-[clamp(8px,1.4vh,18px)] pb-[clamp(24px,4vh,44px)]">
        <FlashcardLessonLetters
          letters={currentLessonLettersList}
          kind="letters"
          title={interfaceLanguage === 'en' ? 'Lesson letters' : 'Буквы урока'}
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
            className={`flashcard-main-card group relative z-10 mx-auto cursor-pointer rounded-3xl border border-slate-200 bg-white ${flipped ? 'flashcard-main-card--flipped' : ''}`}
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
            {hasCard && total > 0 && (
              <div className="study-progress" aria-hidden="true">
                <div
                  className="study-progress-fill"
                  style={{ width: `${((idx + 1) / total) * 100}%` }}
                />
              </div>
            )}

            {hasCard && (
              <FlashcardCardActions
                hintText={progressiveHintText}
                revealCount={revealCount}
                isFavorite={isFav}
                showTranslit={showTranslit}
                hasTranscription={hasTranscription}
                onRevealHint={revealHint}
                onResetHint={resetHint}
                onToggleFavorite={toggleCurrentFavorite}
                onToggleTranslit={() => setShowTranslit(v => !v)}
              />
            )}

            <div className="flashcard-content grid h-full w-full select-none place-items-center text-center">
              <FlashcardCardContent
                hasCard={hasCard}
                isFavoritesPage={isFavoritesPage}
                flipped={flipped}
                idx={idx}
                geText={displayGeText}
                ruText={translationText}
                geDialogLines={geDialogLines}
                ruDialogLines={ruDialogLines}
                isGeDialog={isGeDialog}
                isRuDialog={isRuDialog}
                geMobileTextClass={geMobileTextClass}
                ruMobileTextClass={ruMobileTextClass}
                geMobileLayoutClass={geMobileLayoutClass}
                ruMobileLayoutClass={ruMobileLayoutClass}
                transcriptionText={transcriptionText}
                hintText=""
                showTranslit={showTranslit}
                showHint={false}
                renderCardText={renderCardText}
                renderLessonLetterHighlight={renderLessonLetterHighlight}
              />
            </div>

            <div
              className="flashcard-corner-fold pointer-events-none absolute bottom-[clamp(12px,1.8vw,18px)] right-[clamp(16px,1.8vw,22px)] z-10"
              aria-hidden="true"
            />
          </div>
        </div>

        <nav className="flashcard-nav-bar" aria-label={interfaceLanguage === 'en' ? 'Card navigation' : 'Навигация по карточкам'}>
          <button
            type="button"
            className="flashcard-nav-step flashcard-nav-step--prev"
            onClick={onPrev}
            disabled={!canPrev}
          >
            <span className="flashcard-nav-icon" aria-hidden="true">‹</span>
            <span>{interfaceLanguage === 'en' ? 'Back' : 'Назад'}</span>
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
            <span>{interfaceLanguage === 'en' ? 'Next' : 'Дальше'}</span>
            <span className="flashcard-nav-icon" aria-hidden="true">›</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
