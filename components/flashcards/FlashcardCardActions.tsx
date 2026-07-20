'use client';

type FlashcardCardActionsProps = {
  hintText: string;
  revealCount: number;
  isFavorite: boolean;
  showTranslit: boolean;
  onRevealHint: () => void;
  onResetHint: () => void;
  onToggleFavorite: () => void;
  onToggleTranslit: () => void;
};

const navLikeMiniControl =
  'inline-flex items-center justify-center rounded-xl border-0 bg-transparent text-[var(--text-primary)] shadow-none transition-all duration-200 hover:text-[var(--text-primary)] active:scale-[0.98]';

export function FlashcardCardActions({
  hintText,
  revealCount,
  isFavorite,
  showTranslit,
  onRevealHint,
  onResetHint,
  onToggleFavorite,
  onToggleTranslit,
}: FlashcardCardActionsProps) {
  return (
    <>
      <button
        className={`flashcard-hint-btn flashcard-secondary-label flashcard-top-muted flashcard-mini-btn group absolute left-[clamp(20px,2vw,26px)] top-[clamp(12px,1.4vw,16px)] z-10 h-8 px-2 text-[11px] md:text-xs ${navLikeMiniControl}`}
        onClick={e => {
          e.stopPropagation();
          onRevealHint();
        }}
        onContextMenu={e => {
          e.preventDefault();
          onResetHint();
        }}
        title="Показать перевод"
        aria-pressed={revealCount > 0}
      >
        <span className="text-[13px] leading-none">💡</span>
        {revealCount === 0 ? (
          <span className="flashcard-hint-label ml-1">подсказка</span>
        ) : (
          <span className="flashcard-hint-value ml-1">{hintText}</span>
        )}
      </button>

      <div className="absolute right-[clamp(20px,2vw,26px)] top-[clamp(12px,1.4vw,16px)] z-10 flex items-center gap-2">
        <button
          className={`flashcard-favorite-btn flashcard-top-muted flashcard-mini-btn h-6 w-6 text-[13px] ${navLikeMiniControl}`}
          onClick={e => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          title={isFavorite ? 'Убрать из избранного' : 'В избранное'}
          aria-pressed={isFavorite}
        >
          {isFavorite ? '⭐' : '☆'}
        </button>
        <button
          className={`flashcard-top-muted flashcard-mini-btn flashcard-translit-btn h-6 min-w-6 px-1 text-[10px] md:text-[11px] ${navLikeMiniControl}`}
          onClick={e => {
            e.stopPropagation();
            onToggleTranslit();
          }}
          title="Показать чтение"
          aria-pressed={showTranslit}
        >
          Aa
        </button>
      </div>
    </>
  );
}
