'use client';

import { useAppStore } from '@/lib/appStore';

type FlashcardCardActionsProps = {
  hintText: string;
  revealCount: number;
  isFavorite: boolean;
  showTranslit: boolean;
  hasTranscription: boolean;
  onRevealHint: () => void;
  onResetHint: () => void;
  onToggleFavorite: () => void;
  onToggleTranslit: () => void;
  showFavorite?: boolean;
};

const navLikeMiniControl =
  'inline-flex items-center justify-center rounded-full border border-transparent text-[var(--text-primary)] transition-all duration-200 hover:text-[var(--text-primary)] active:scale-[0.98]';

export function FlashcardCardActions({
  hintText,
  revealCount,
  isFavorite,
  showTranslit,
  hasTranscription,
  onRevealHint,
  onResetHint,
  onToggleFavorite,
  onToggleTranslit,
  showFavorite = true,
}: FlashcardCardActionsProps) {
  const interfaceLanguage = useAppStore(state => state.settings.interfaceLanguage);
  const hintLabel = interfaceLanguage === 'en' ? 'Hint' : 'Подсказка';
  const hintTitle = revealCount > 0
    ? `${interfaceLanguage === 'en' ? 'Translation' : 'Перевод'}: ${hintText}`
    : (interfaceLanguage === 'en' ? 'Reveal translation letter by letter' : 'Открывать перевод по одной букве');
  const favoriteTitle = isFavorite
    ? (interfaceLanguage === 'en' ? 'Remove from saved' : 'Убрать сохранение')
    : (interfaceLanguage === 'en' ? 'Save card' : 'Сохранить карточку');
  const translitTitle = showTranslit
    ? (interfaceLanguage === 'en' ? 'Hide transcription' : 'Скрыть транскрипцию')
    : (interfaceLanguage === 'en' ? 'Show transcription' : 'Показать транскрипцию');

  return (
    <div className="flashcard-action-bar absolute left-[clamp(14px,2vw,24px)] right-[clamp(14px,2vw,24px)] top-[clamp(12px,1.4vw,16px)] z-10 flex items-start justify-between gap-2">
      <button
        type="button"
        className={`flashcard-hint-btn flashcard-secondary-label flashcard-top-muted flashcard-mini-btn group min-h-8 min-w-0 max-w-[52%] px-3 text-[11px] md:text-xs ${navLikeMiniControl}`}
        onClick={e => {
          e.preventDefault();
          e.stopPropagation();
          onRevealHint();
        }}
        onContextMenu={e => {
          e.preventDefault();
          e.stopPropagation();
          onResetHint();
        }}
        title={hintTitle}
        aria-label={hintTitle}
        aria-pressed={revealCount > 0}
        data-state={revealCount > 0 ? 'active' : 'idle'}
      >
        <span className="flashcard-action-icon" aria-hidden="true">?</span>
        {revealCount > 0 ? (
          <span className="flashcard-hint-value ml-1 truncate">{hintText}</span>
        ) : (
          <span className="flashcard-hint-label ml-1">{hintLabel}</span>
        )}
      </button>

      <div className="flashcard-action-group flex min-w-0 items-center gap-2">
        {showFavorite && (
          <button
            type="button"
            className={`flashcard-favorite-btn flashcard-top-muted flashcard-mini-btn min-h-8 px-3 text-[11px] md:text-xs ${navLikeMiniControl}`}
            onClick={e => {
              e.stopPropagation();
              onToggleFavorite();
            }}
            title={favoriteTitle}
            aria-label={favoriteTitle}
            aria-pressed={isFavorite}
            data-state={isFavorite ? 'active' : 'idle'}
          >
            <span className="flashcard-action-icon" aria-hidden="true">
              {isFavorite ? '★' : '☆'}
            </span>
          </button>
        )}

        {hasTranscription && (
          <button
            type="button"
            className={`flashcard-top-muted flashcard-mini-btn flashcard-translit-btn min-h-8 px-3 text-[11px] md:text-xs ${navLikeMiniControl}`}
            onClick={e => {
              e.stopPropagation();
              onToggleTranslit();
            }}
            title={translitTitle}
            aria-label={translitTitle}
            aria-pressed={showTranslit}
            data-state={showTranslit ? 'active' : 'idle'}
          >
            <span className="flashcard-action-icon" aria-hidden="true">Aa</span>
          </button>
        )}
      </div>
    </div>
  );
}
