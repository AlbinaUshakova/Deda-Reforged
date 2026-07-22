'use client';

import type { ReactNode } from 'react';

type FlashcardCardActionsProps = {
  hintText: string;
  revealCount: number;
  isFavorite: boolean;
  showTranslit: boolean;
  modeControl?: ReactNode;
  onRevealHint: () => void;
  onResetHint: () => void;
  onToggleFavorite: () => void;
  onToggleTranslit: () => void;
};

const navLikeMiniControl =
  'inline-flex items-center justify-center rounded-full border border-transparent text-[var(--text-primary)] transition-all duration-200 hover:text-[var(--text-primary)] active:scale-[0.98]';

export function FlashcardCardActions({
  hintText,
  revealCount,
  isFavorite,
  showTranslit,
  modeControl,
  onRevealHint,
  onResetHint,
  onToggleFavorite,
  onToggleTranslit,
}: FlashcardCardActionsProps) {
  return (
    <div className="flashcard-action-bar absolute left-[clamp(14px,2vw,24px)] right-[clamp(14px,2vw,24px)] top-[clamp(12px,1.4vw,16px)] z-10 flex items-start justify-between gap-2">
      <button
        className={`flashcard-hint-btn flashcard-secondary-label flashcard-top-muted flashcard-mini-btn group min-h-8 min-w-0 max-w-[46%] px-3 text-[11px] md:text-xs ${navLikeMiniControl}`}
        onClick={e => {
          e.stopPropagation();
          onRevealHint();
        }}
        onContextMenu={e => {
          e.preventDefault();
          onResetHint();
        }}
        title="Подсказка по переводу"
        aria-pressed={revealCount > 0}
      >
        <span className="flashcard-action-icon" aria-hidden="true">?</span>
        {revealCount === 0 ? (
          <span className="flashcard-hint-label ml-1">Подсказка</span>
        ) : (
          <span className="flashcard-hint-value ml-1">Перевод: {hintText}</span>
        )}
      </button>

      <div className="flashcard-action-group flex min-w-0 items-center gap-2">
        <button
          className={`flashcard-favorite-btn flashcard-top-muted flashcard-mini-btn min-h-8 px-3 text-[11px] md:text-xs ${navLikeMiniControl}`}
          onClick={e => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          title={isFavorite ? 'Убрать из избранного' : 'В избранное'}
          aria-pressed={isFavorite}
        >
          <span className="flashcard-action-icon" aria-hidden="true">
            {isFavorite ? '★' : '☆'}
          </span>
          <span className="flashcard-action-label ml-1">
            {isFavorite ? 'В избранном' : 'Избранное'}
          </span>
        </button>
        <button
          className={`flashcard-top-muted flashcard-mini-btn flashcard-translit-btn min-h-8 px-3 text-[11px] md:text-xs ${navLikeMiniControl}`}
          onClick={e => {
            e.stopPropagation();
            onToggleTranslit();
          }}
          title="Показать транскрипцию"
          aria-pressed={showTranslit}
        >
          <span className="flashcard-action-icon" aria-hidden="true">Aa</span>
          <span className="flashcard-action-label ml-1">Транскрипция</span>
        </button>
        {modeControl}
      </div>
    </div>
  );
}
