'use client';

import type React from 'react';
import { useAppStore } from '@/lib/appStore';

type AnswerState = 'idle' | 'wrong' | 'correct';

type Question = {
  ge: string;
  ru: string;
};

type QuestionPanelStyleVars = React.CSSProperties & {
  '--input-size': string;
  '--prompt-size': string;
};

type BlocksQuestionPanelProps = {
  hasWords: boolean;
  question: Question | null;
  promptText: string;
  answer: string;
  answerState: AnswerState;
  isAnswerAccepted: boolean;
  showCorrect: boolean;
  error: boolean;
  attempts: number;
  isFavoritesEpisode: boolean;
  isCurrentFavorite: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  panelStyle: QuestionPanelStyleVars;
  onSubmit: (event: React.FormEvent) => void;
  onAnswerChange: (value: string) => void;
  onRevealTranslation: () => void;
  onToggleFavorite: (ge: string) => void;
};

export function BlocksQuestionPanel({
  hasWords,
  question,
  promptText,
  answer,
  answerState,
  isAnswerAccepted,
  showCorrect,
  error,
  attempts,
  isFavoritesEpisode,
  isCurrentFavorite,
  inputRef,
  panelStyle,
  onSubmit,
  onAnswerChange,
  onRevealTranslation,
  onToggleFavorite,
}: BlocksQuestionPanelProps) {
  const interfaceLanguage = useAppStore(state => state.settings.interfaceLanguage);
  if (!hasWords) {
    return (
      <div className="text-sm text-slate-500">
        {interfaceLanguage === 'en' ? 'There are no words here yet.' : 'Здесь пока нет слов.'}
      </div>
    );
  }

  if (!question) return null;

  return (
    <div
      className="blocks-question-card w-full lg:translate-x-3 rounded-3xl p-3 sm:p-4"
      style={panelStyle}
    >
      <div className="blocks-question-meta mb-3 flex items-center justify-between gap-2">
        <span className="blocks-question-chip">{interfaceLanguage === 'en' ? 'Translate' : 'Переведи'}</span>
        <span className="blocks-question-shortcut">Enter ↵</span>
      </div>

      <div className="labelRow mb-2 sm:mb-3 md:mb-4 flex items-center gap-2">
        <div
          className="blocks-prompt-text max-w-full break-words overflow-visible text-[var(--text-primary)] font-semibold tracking-[0.2px] leading-[1.16]"
          style={{
            overflowWrap: 'break-word',
            wordBreak: 'normal',
            fontSize: 'var(--prompt-size)',
          }}
        >
          {promptText}
        </div>
      </div>

      <div className="-mt-1 mb-1 w-full rounded-2xl bg-transparent transition-all duration-200">
        <form onSubmit={onSubmit} className="w-full md:-mt-0.5">
          <div className="blocks-answer-stack">
            <input
              type="text"
              ref={inputRef}
              value={answer}
              onChange={e => onAnswerChange(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  e.currentTarget.form?.requestSubmit();
                }
              }}
              placeholder={interfaceLanguage === 'en' ? 'Type the translation' : 'Введите перевод'}
              readOnly={showCorrect}
              autoComplete="off"
              spellCheck={false}
              className={
                'blocks-answer-input w-full rounded-2xl border-2 border-transparent outline-none tracking-[-0.01em] resize-none overflow-hidden transition-all duration-200 focus:ring-0 focus:shadow-none ' +
                (answerState === 'wrong' && !showCorrect
                  ? 'animate-input-shake bg-red-50/85 text-slate-800'
                  : answerState === 'correct'
                    ? 'bg-white/70 text-slate-800 shadow-none'
                    : 'bg-white/70 text-slate-800 shadow-none')
              }
            />
            <button
              type="submit"
              className={`blocks-submit-btn${isAnswerAccepted ? ' blocks-submit-btn--accepted' : ''}`}
              disabled={isAnswerAccepted || (!showCorrect && !answer.trim())}
            >
              {isAnswerAccepted
                ? (interfaceLanguage === 'en' ? 'Correct' : 'Верно')
                : showCorrect
                ? (interfaceLanguage === 'en' ? 'Next' : 'Дальше')
                : (interfaceLanguage === 'en' ? 'Check' : 'Проверить')}
            </button>
          </div>
        </form>
      </div>

      <div className="blocks-question-secondary-row mt-2 inline-flex w-full items-center gap-[clamp(8px,1.1vw,12px)] flex-wrap">
        <button
          type="button"
          onClick={onRevealTranslation}
          className="blocks-translation-btn blocks-refresh-btn inline-flex h-[clamp(28px,4vh,36px)] items-center rounded-lg border border-transparent bg-transparent px-[clamp(6px,0.9vw,9px)] text-[clamp(11px,1.05vw,13px)] font-normal transition-all duration-150 focus:outline-none [-webkit-tap-highlight-color:transparent]"
          disabled={showCorrect}
        >
          <span className="leading-none">{interfaceLanguage === 'en' ? 'Show answer' : 'Перевод'}</span>
        </button>
        {!isFavoritesEpisode && (
          <button
            type="button"
            onClick={() => onToggleFavorite(question.ge)}
            className={
              'h-[clamp(29px,4vh,38px)] w-[clamp(29px,4vh,38px)] inline-flex shrink-0 items-center justify-center rounded-xl border-0 bg-transparent text-[clamp(18px,2.24vw,24px)] transition-all duration-150 ' +
              (isCurrentFavorite
                ? 'text-amber-500 hover:text-amber-600'
                : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]')
            }
            title={
              isCurrentFavorite
                ? (interfaceLanguage === 'en' ? 'Remove from favorites' : 'Убрать из избранного')
                : (interfaceLanguage === 'en' ? 'Add to favorites' : 'Добавить в избранное')
            }
            aria-label={
              isCurrentFavorite
                ? (interfaceLanguage === 'en' ? 'Remove word from favorites' : 'Убрать слово из избранного')
                : (interfaceLanguage === 'en' ? 'Add word to favorites' : 'Добавить слово в избранное')
            }
          >
            {isCurrentFavorite ? '★' : '☆'}
          </button>
        )}
      </div>

      {error && !showCorrect && (
        <div className="mt-2 text-[13px] text-red-500">
          {attempts >= 3
            ? (interfaceLanguage === 'en' ? 'Added to review. We will show the answer now.' : 'Слово в повторении. Сейчас покажем ответ.')
            : (interfaceLanguage === 'en' ? 'Not quite. Added to review.' : 'Неверно. Слово добавлено в повторение.')}
        </div>
      )}
    </div>
  );
}
