'use client';

import type React from 'react';
import { FlashcardInfoNotes } from '@/components/flashcards/FlashcardInfoNotes';

type InfoNote = {
  kind: 'grammar' | 'speech' | 'mistake';
  text: string;
};

type FlashcardCardContentProps = {
  hasCard: boolean;
  isFavoritesPage: boolean;
  flipped: boolean;
  idx: number;
  geText: string;
  ruText: string;
  geDialogLines: string[];
  ruDialogLines: string[];
  translitDialogLines: string[];
  cardTranslit: string;
  showTranslit: boolean;
  isGeDialog: boolean;
  isRuDialog: boolean;
  geMobileTextClass: string;
  ruMobileTextClass: string;
  geMobileLayoutClass: string;
  ruMobileLayoutClass: string;
  infoNotes: InfoNote[];
  expandedInfoKinds: Record<string, boolean>;
  renderCardText: (text: string, kind: 'ge' | 'ru') => React.ReactNode;
  renderLessonLetterHighlight: (text: string) => React.ReactNode;
  onToggleInfoNote: (noteKey: string) => void;
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
  translitDialogLines,
  cardTranslit,
  showTranslit,
  isGeDialog,
  isRuDialog,
  geMobileTextClass,
  ruMobileTextClass,
  geMobileLayoutClass,
  ruMobileLayoutClass,
  infoNotes,
  expandedInfoKinds,
  renderCardText,
  renderLessonLetterHighlight,
  onToggleInfoNote,
}: FlashcardCardContentProps) {
  if (!hasCard) {
    return (
      <div className="text-[var(--text-secondary)]">
        {isFavoritesPage
          ? 'Нет отмеченных карточек'
          : 'Нет карточек'}
      </div>
    );
  }

  if (!flipped) {
    return (
      <div key={`front-${idx}`} className="flex -translate-y-[14px] flex-col items-center justify-center gap-3">
        <div
          className={`flashcard-ge-text mx-auto w-full max-w-[20ch] max-[640px]:max-w-full whitespace-normal break-normal text-[clamp(34px,5vw,56px)] ${geMobileTextClass} ${geMobileLayoutClass} leading-[1.12] text-slate-800`}
          style={{
            fontFamily:
              "'Noto Sans Georgian','DejaVu Sans',system-ui,sans-serif",
          }}
        >
          {isGeDialog ? (
            <div className="flex flex-col items-center gap-2">
              {geDialogLines.map((line, lineIdx) => (
                <div
                  key={`${line}-${lineIdx}`}
                  className={`flashcard-dialog-line ${
                    lineIdx === 0 ? 'flashcard-dialog-line--question' : 'flashcard-dialog-line--answer'
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
        {showTranslit && (
          <div className="flashcard-translit-panel mb-2 max-[640px]:mb-4 max-[460px]:mb-5">
            <div className="flashcard-translit-value">
              {isGeDialog && translitDialogLines.length > 1 ? (
                <div className="flex flex-col items-center gap-1.5">
                  {translitDialogLines.map((line, lineIdx) => (
                    <div
                      key={`${line}-${lineIdx}`}
                      className={`flashcard-dialog-line ${
                        lineIdx === 0 ? 'flashcard-dialog-line--question' : 'flashcard-dialog-line--answer'
                      }`}
                    >
                      {line}
                    </div>
                  ))}
                </div>
              ) : (
                cardTranslit
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div key={`back-${idx}`} className="flex -translate-y-[14px] flex-col items-center justify-center gap-3">
      <div className={`flashcard-ru-text mx-auto w-full max-w-[20ch] max-[640px]:max-w-full whitespace-normal break-normal text-[clamp(30px,5vw,48px)] ${ruMobileTextClass} ${ruMobileLayoutClass} leading-tight text-[var(--text-primary)]`}>
        {isRuDialog ? (
          <div className="flex flex-col items-center gap-1.5">
            {ruDialogLines.map((line, lineIdx) => (
              <div
                key={`${line}-${lineIdx}`}
                className={`flashcard-dialog-line ${
                  lineIdx === 0 ? 'flashcard-dialog-line--question' : 'flashcard-dialog-line--answer'
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
      <FlashcardInfoNotes
        notes={infoNotes}
        expandedKinds={expandedInfoKinds}
        onToggle={onToggleInfoNote}
      />
    </div>
  );
}
