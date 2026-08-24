'use client';

import { useAppStore } from '@/lib/appStore';

type FlashcardCardActionsProps = {
  isFavorite: boolean;
  showTranslit: boolean;
  showHint: boolean;
  hasTranscription: boolean;
  hasHint: boolean;
  onToggleFavorite: () => void;
  onToggleTranslit: () => void;
  onToggleHint: () => void;
};

const navLikeMiniControl =
  'inline-flex items-center justify-center rounded-full border border-transparent text-[var(--text-primary)] transition-all duration-200 hover:text-[var(--text-primary)] active:scale-[0.98]';

export function FlashcardCardActions({
  isFavorite,
  showTranslit,
  showHint,
  hasTranscription,
  hasHint: hasHintText,
  onToggleFavorite,
  onToggleTranslit,
  onToggleHint,
}: FlashcardCardActionsProps) {
  const interfaceLanguage = useAppStore(state => state.settings.interfaceLanguage);
  const favoriteTitle = isFavorite
    ? (interfaceLanguage === 'en' ? 'Remove from saved' : 'Убрать сохранение')
    : (interfaceLanguage === 'en' ? 'Save card' : 'Сохранить карточку');
  const translitTitle = interfaceLanguage === 'en' ? 'Show transcription' : 'Показать транскрипцию';
  const hintTitle = interfaceLanguage === 'en' ? 'Hint' : 'Подсказка';

  return (
    <div className="flashcard-action-bar absolute left-[clamp(14px,2vw,24px)] right-[clamp(14px,2vw,24px)] top-[clamp(12px,1.4vw,16px)] z-10 flex items-start justify-between gap-2">
      <button
        type="button"
        className={`flashcard-hint-btn flashcard-secondary-label flashcard-top-muted flashcard-mini-btn group min-h-8 min-w-0 max-w-[46%] px-3 text-[11px] md:text-xs ${navLikeMiniControl}`}
        title={hintTitle}
        aria-label={hintTitle}
        aria-pressed={showHint}
        data-has-hint={hasHintText ? 'true' : 'false'}
        onClick={e => {
          e.preventDefault();
          e.stopPropagation();
          onToggleHint();
        }}
      >
        <span className="flashcard-action-icon" aria-hidden="true">?</span>
        <span className="flashcard-hint-label ml-1">
          {interfaceLanguage === 'en' ? 'Hint' : 'Подсказка'}
        </span>
      </button>

      <div className="flashcard-action-group flex min-w-0 items-center gap-2">
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
        >
          <span className="flashcard-action-icon" aria-hidden="true">
            {isFavorite ? '★' : '☆'}
          </span>
        </button>

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
          >
            <span className="flashcard-action-icon" aria-hidden="true">Aa</span>
          </button>
        )}
      </div>
    </div>
  );
}
