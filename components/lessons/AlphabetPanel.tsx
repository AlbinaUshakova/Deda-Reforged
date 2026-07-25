'use client';

import type { Ref } from 'react';
import { letterToHint, type TransliterationMode } from '@/lib/transliteration';
import { getCourse, getLetterKind, getLetterSoundLabel, type CourseId } from '@/lib/courses';
import type { AlphabetLetterStatus } from '@/lib/lessonProgress';

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
  courseId,
  audioError,
  onToggleAlphabet,
  onSpeakLetter,
}: {
  alphabetRef: Ref<HTMLElement>;
  alphabetOverlapsLessons: boolean;
  showAlphabet: boolean;
  transliterationMode: TransliterationMode;
  courseId: CourseId;
  audioError: string;
  onToggleAlphabet: () => void;
  onSpeakLetter: (letter: string) => void;
}) {
  const course = getCourse(courseId);
  const letterFontClass = courseId === 'ka' ? 'alphabet-letter--georgian' : 'alphabet-letter--latin';
  const visibleAlphabetSections = course.alphabetSections.filter(section => section.title !== 'Запомни отдельно');
  const alphabetColumnCount = Math.max(
    1,
    ...visibleAlphabetSections.flatMap(section => section.rows.map(row => row.length)),
  );

  return (
    <>
      <div
        className={`fixed inset-0 z-[200] bg-black/30 transition-opacity duration-200 ${showAlphabet ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        onClick={onToggleAlphabet}
        aria-hidden="true"
      />
      <aside
        ref={alphabetRef}
        role="dialog"
        aria-modal="true"
        aria-hidden={!showAlphabet}
        className={`alphabet-sheet fixed inset-x-0 bottom-0 ${alphabetOverlapsLessons ? 'z-[221]' : 'z-[210]'} mx-auto w-full max-w-[560px] max-h-[82dvh] overflow-y-auto rounded-t-[24px] border border-slate-200/70 bg-white px-[clamp(14px,4vw,22px)] pb-[max(18px,env(safe-area-inset-bottom))] pt-2 shadow-[0_-16px_44px_rgba(31,28,23,0.16)] transition-all duration-300 ease-out sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:w-[440px] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-[24px] sm:px-6 sm:pb-5 sm:pt-4 sm:shadow-[0_24px_64px_rgba(31,28,23,0.20)] ${showAlphabet ? 'max-sm:translate-y-0 sm:opacity-100 sm:scale-100' : 'pointer-events-none select-none max-sm:translate-y-full sm:opacity-0 sm:scale-95'}`}
      >
        <div className="mx-auto mb-2 h-1 w-10 rounded-full bg-slate-200 sm:hidden" aria-hidden="true" />
        <div className="mb-1 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="truncate text-[clamp(15px,1.6vw,17px)] font-semibold text-[var(--text-primary)]">{course.scriptTitleNative}</div>
            <div className="text-[clamp(11px,1.3vw,12px)] text-[var(--text-secondary)]">Нажми на букву — послушай, как она звучит</div>
          </div>
          <button
            type="button"
            onClick={onToggleAlphabet}
            className="home-alphabet-close grid h-8 w-8 shrink-0 place-items-center rounded-full text-[14px] text-[var(--text-secondary)] transition-colors hover:bg-black/5 focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--menu-focus)] focus-visible:outline-offset-2"
            aria-label="Закрыть панель алфавита"
            title="Закрыть панель алфавита"
          >
            ✕
          </button>
        </div>
        <div className="mx-auto mt-2 w-full max-w-[340px] space-y-[clamp(6px,1.4vw,10px)]">
          {visibleAlphabetSections.map((section) => {
            return (
              <section
                key={`home-alpha-section-${section.title}`}
                className="min-w-0"
              >
                <div className="space-y-[clamp(1px,0.45vw,4px)]">
                  {section.rows.map((row, rowIdx) => (
                    <div
                      key={`home-alpha-row-${section.title}-${rowIdx}`}
                      className="grid gap-x-[clamp(2px,0.6vw,5px)] gap-y-[clamp(2px,0.6vw,5px)]"
                      style={{
                        gridTemplateColumns: `repeat(${alphabetColumnCount}, minmax(0, 1fr))`,
                      }}
                    >
                      {row.map((ch) => {
                        const soundLabel = getLetterSoundLabel(ch, courseId);
                        const letterKind = getLetterKind(ch, courseId);
                        const readingHint = letterToHint(ch, transliterationMode, courseId) || ch;
                        const audioLabel = courseId === 'en'
                          ? `Прослушать название буквы ${ch}`
                          : `Прослушать произношение буквы ${ch}`;
                        const isHighlightedLetter = course.alphabetHighlightedLetters?.includes(ch) ?? false;

                        return (
                          <button
                            key={ch}
                            type="button"
                            onClick={() => onSpeakLetter(ch)}
                            className={`home-alphabet-key home-alphabet-key--${letterKind} ${isHighlightedLetter ? 'home-alphabet-key--highlighted' : ''} cursor-pointer rounded-lg border border-slate-200/75 bg-white/90 py-[3px] text-center shadow-sm transition-all hover:bg-slate-50`}
                            title={`Озвучить букву ${ch}. Звучит как: ${soundLabel}`}
                            aria-label={audioLabel}
                          >
                            <div className={`home-alphabet-letter ${letterFontClass} translate-y-[-1px] leading-none`}>{ch}</div>
                            <div className="home-alphabet-translit mt-[2px] leading-none">
                              {String(readingHint).toLowerCase()}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
        {audioError && (
          <div className="mt-2 text-[11px] text-red-500">
            {audioError}
          </div>
        )}
      </aside>
    </>
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
            style={{ fontFamily: 'var(--font-georgian)' }}
          >
            {ch}
          </span>
        ))}
      </div>
    </div>
  );
}
