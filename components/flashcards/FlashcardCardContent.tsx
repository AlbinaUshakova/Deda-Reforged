'use client';

import type React from 'react';
import { useAppStore } from '@/lib/appStore';

type FlashcardCardContentProps = {
  hasCard: boolean;
  isFavoritesPage: boolean;
  flipped: boolean;
  idx: number;
  geText: string;
  ruText: string;
  geDialogLines: string[];
  ruDialogLines: string[];
  isGeDialog: boolean;
  isRuDialog: boolean;
  geMobileTextClass: string;
  ruMobileTextClass: string;
  geMobileLayoutClass: string;
  ruMobileLayoutClass: string;
  transcriptionText: string;
  hintText: string;
  showTranslit: boolean;
  showHint: boolean;
  isReviewPriority: boolean;
  renderCardText: (text: string, kind: 'ge' | 'ru') => React.ReactNode;
  renderLessonLetterHighlight: (text: string) => React.ReactNode;
};

export function FlashcardCardContent({
  hasCard,
  isFavoritesPage,
  flipped,
  idx,
  geText,
  ruText,
  geDialogLines,
  ruDialogLines,
  isGeDialog,
  isRuDialog,
  geMobileTextClass,
  ruMobileTextClass,
  geMobileLayoutClass,
  ruMobileLayoutClass,
  transcriptionText,
  hintText,
  showTranslit,
  showHint,
  isReviewPriority,
  renderCardText,
  renderLessonLetterHighlight,
}: FlashcardCardContentProps) {
  const interfaceLanguage = useAppStore(state => state.settings.interfaceLanguage);
  const faceLabel = flipped
    ? (interfaceLanguage === 'en' ? 'Translation' : 'Перевод')
    : isReviewPriority
      ? (interfaceLanguage === 'en' ? 'Review again' : 'На повторение')
      : (interfaceLanguage === 'en' ? 'Word' : 'Слово');
  const faceHint = flipped
    ? (interfaceLanguage === 'en' ? 'Tap to return to the original word' : 'Нажми, чтобы вернуться к слову')
    : (interfaceLanguage === 'en' ? 'Read first, then flip the card' : 'Сначала прочитай, потом переверни карточку');
  if (!hasCard) {
    return (
      <div className="text-[var(--text-secondary)]">
        {isFavoritesPage
          ? (interfaceLanguage === 'en' ? 'No saved words yet' : 'Пока нет сохраненных слов')
          : (interfaceLanguage === 'en' ? 'No cards' : 'Нет карточек')}
      </div>
    );
  }

  const renderSupplementaryInfo = () => (
    <div className="flashcard-supplementary-info flex flex-col items-center gap-2">
      {showTranslit && transcriptionText.trim() && (
        <div className="flashcard-translit-panel">
          <span className="flashcard-translit-value">{transcriptionText}</span>
        </div>
      )}
      {showHint && hintText.trim() && (
        <div className="flashcard-hint-btn flashcard-secondary-label inline-flex items-center justify-center rounded-full border border-[rgba(15,118,110,0.14)] bg-[rgba(255,255,255,0.75)] px-3 py-1.5 text-[11px] font-semibold text-slate-600 shadow-sm">
          <span className="flashcard-hint-label">{interfaceLanguage === 'en' ? 'Hint' : 'Подсказка'}</span>
          <span className="flashcard-hint-value">{hintText}</span>
        </div>
      )}
    </div>
  );

  if (!flipped) {
    return (
      <div key={`front-${idx}`} className="flashcard-face flashcard-face--front flex -translate-y-[14px] flex-col items-center justify-center gap-3">
        <div className="flashcard-face-meta">
          <span className={`flashcard-face-label ${isReviewPriority ? 'flashcard-face-label--review' : ''}`}>{faceLabel}</span>
          <span className="flashcard-face-hint">{faceHint}</span>
        </div>
        <div
          className={`flashcard-ge-text mx-auto w-full max-w-[20ch] max-[640px]:max-w-full whitespace-normal break-normal text-[clamp(34px,5vw,56px)] ${geMobileTextClass} ${geMobileLayoutClass} leading-[1.12] text-slate-800`}
          style={{ fontFamily: 'var(--font-georgian)' }}
        >
          {isGeDialog ? (
            <div className="flex flex-col items-center gap-2">
              {geDialogLines.map((line, lineIdx) => (
                <div
                  key={`${line}-${lineIdx}`}
                  className={`flashcard-dialog-line ${lineIdx === 0 ? 'flashcard-dialog-line--question' : 'flashcard-dialog-line--answer'
                    }`}
                >
                  {renderLessonLetterHighlight(line)}
                </div>
              ))}
            </div>
          ) : (
            renderCardText(geText, 'ge')
          )}
        </div>
        {renderSupplementaryInfo()}
      </div>
    );
  }

  return (
    <div key={`back-${idx}`} className="flashcard-face flashcard-face--back flex -translate-y-[14px] flex-col items-center justify-center gap-3">
      <div className="flashcard-face-meta">
        <span className="flashcard-face-label">{faceLabel}</span>
        <span className="flashcard-face-hint">{faceHint}</span>
      </div>
      <div className={`flashcard-ru-text mx-auto w-full max-w-[20ch] max-[640px]:max-w-full whitespace-normal break-normal text-[clamp(30px,5vw,48px)] ${ruMobileTextClass} ${ruMobileLayoutClass} leading-tight text-[var(--text-primary)]`}>
        {isRuDialog ? (
          <div className="flex flex-col items-center gap-1.5">
            {ruDialogLines.map((line, lineIdx) => (
              <div
                key={`${line}-${lineIdx}`}
                className={`flashcard-dialog-line ${lineIdx === 0 ? 'flashcard-dialog-line--question' : 'flashcard-dialog-line--answer'
                  }`}
              >
                {line}
              </div>
            ))}
          </div>
        ) : (
          renderCardText(ruText || '—', 'ru')
        )}
      </div>
      {renderSupplementaryInfo()}
    </div>
  );
}
