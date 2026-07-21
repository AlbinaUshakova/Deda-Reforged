'use client';

import type { Ref } from 'react';
import type { TransliterationMode } from '@/lib/transliteration';
import { geLetterToHint } from '@/lib/transliteration';
import type { AlphabetLetterStatus } from '@/lib/lessonProgress';

const GEORGIAN_ALPHABET_ROWS = [
  ['ა', 'ბ', 'გ', 'დ', 'ე', 'ვ'],
  ['ზ', 'თ', 'ი', 'კ', 'ლ', 'მ'],
  ['ნ', 'ო', 'პ', 'ჟ', 'რ', 'ს'],
  ['ტ', 'უ', 'ფ', 'ქ', 'ღ', 'ყ'],
  ['შ', 'ჩ', 'ც', 'ძ', 'წ', 'ჭ'],
  ['ხ', 'ჯ', 'ჰ'],
] as const;

const alphabetLetterColorByStatus: Record<AlphabetLetterStatus, string> = {
  mastered: 'text-[var(--progress-good)]',
  almost: 'text-[var(--progress-low)]',
  current: 'text-[var(--progress-current)]',
  locked: 'text-[var(--text-tertiary)]',
  unknown: 'text-[var(--ui-accent)]',
};

export function AlphabetPanel({
  alphabetRef,
  alphabetOverlapsLessons,
  showAlphabet,
  transliterationMode,
  audioError,
  onToggleAlphabet,
  onSpeakLetter,
}: {
  alphabetRef: Ref<HTMLElement>;
  alphabetOverlapsLessons: boolean;
  showAlphabet: boolean;
  transliterationMode: TransliterationMode;
  audioError: string;
  onToggleAlphabet: () => void;
  onSpeakLetter: (letter: string) => void;
}) {
  return (
    <aside
      ref={alphabetRef}
      className={`block fixed left-2 sm:left-3 md:left-4 top-[68px] ${alphabetOverlapsLessons ? 'z-[220]' : 'z-[140]'} h-fit w-[clamp(202px,31vw,244px)] pointer-events-none`}
    >
      <div
        className={`home-alphabet-panel max-h-[calc(100dvh-102px)] overflow-y-auto rounded-[clamp(20px,3vw,30px)] border border-slate-200/75 bg-gradient-to-b from-[#f6f8fe]/88 via-[#f1f4fc]/86 to-[#edf1f9]/84 px-[clamp(7px,1.2vw,10px)] pt-[clamp(5px,0.8vw,7px)] pb-[clamp(4px,0.7vw,6px)] shadow-[0_6px_14px_rgba(15,23,42,0.09)] transition-all duration-200 ${showAlphabet ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-1 pointer-events-none select-none'}`}
        aria-hidden={!showAlphabet}
      >
        <div className="flex items-center justify-between gap-2">
          <h3 className="home-alphabet-title text-sm font-medium tracking-[-0.01em] text-slate-700">ანბანი</h3>
          <button
            type="button"
            onClick={onToggleAlphabet}
            className="home-alphabet-close relative top-px h-6 w-6 rounded-md text-[11px] transition-colors focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--menu-focus)] focus-visible:outline-offset-2"
            aria-label="Закрыть панель алфавита"
            title="Закрыть панель алфавита"
          >
            ✕
          </button>
        </div>
        <div className="mt-px flex items-center gap-1.5 text-[clamp(9px,1.55vw,11px)] text-slate-500">
          <span className="relative inline-flex h-1.5 w-1.5" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#aab8ff] opacity-45" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#97a6ff]" />
          </span>
          <span>Нажми на букву</span>
        </div>
        <div className="mt-1 space-y-[clamp(1px,0.45vw,4px)]">
          {GEORGIAN_ALPHABET_ROWS.map((row, rowIdx) => (
            <div
              key={`home-alpha-row-${rowIdx}`}
              className={`grid gap-x-[clamp(3px,0.8vw,7px)] gap-y-[clamp(3px,0.8vw,6px)] ${
                row.length < 6 ? 'mx-auto w-[calc(50%-4px)] grid-cols-3' : 'grid-cols-6'
              }`}
            >
              {row.map((ch) => (
                <button
                  key={ch}
                  type="button"
                  onClick={() => onSpeakLetter(ch)}
                  className="home-alphabet-key cursor-pointer rounded-lg border border-slate-200/75 bg-white/90 py-[3px] text-center shadow-sm transition-all hover:bg-slate-50"
                  title={`Озвучить букву ${ch}`}
                  aria-label={`Озвучить букву ${ch}`}
                >
                  <div className="home-alphabet-letter translate-y-[-1px] text-[clamp(14px,2.7vw,19px)] leading-none text-black">{ch}</div>
                  <div className="home-alphabet-translit mt-[2px] text-[clamp(6px,1.2vw,8px)] leading-none text-slate-400">
                    {geLetterToHint(ch, transliterationMode)}
                  </div>
                </button>
              ))}
            </div>
          ))}
        </div>
        {audioError && (
          <div className="mt-2 text-[11px] text-red-500">
            {audioError}
          </div>
        )}
      </div>
    </aside>
  );
}

export function AlphabetProgressRow({
  lessonLetters,
  letterStatusByChar,
}: {
  lessonLetters: readonly string[];
  letterStatusByChar: Record<string, AlphabetLetterStatus>;
}) {
  return (
    <div className="alphabet-writing-area min-w-0 -ml-1 w-[72%] max-w-[72%]">
      <div className="alphabet-writing-row w-full">
        {lessonLetters.map((ch) => (
          <span
            key={`progress-alpha-${ch}`}
            className={`alphabet-writing-letter text-[clamp(11px,1.55vw,19px)] leading-none ${alphabetLetterColorByStatus[letterStatusByChar[ch] ?? 'unknown']}`}
            aria-label={`Буква ${ch}`}
            style={{
              fontFamily:
                "'Noto Sans Georgian','DejaVu Sans',system-ui,sans-serif",
            }}
          >
            {ch}
          </span>
        ))}
      </div>
    </div>
  );
}
