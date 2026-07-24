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
    <aside
      ref={alphabetRef}
      className={`block fixed left-2 sm:left-3 md:left-4 top-[68px] ${alphabetOverlapsLessons ? 'z-[220]' : 'z-[140]'} h-fit w-[clamp(184px,31vw,244px)] pointer-events-none`}
    >
      <div
        className={`home-alphabet-panel menu-panel-size max-h-[calc(100dvh-102px)] overflow-y-auto rounded-[clamp(18px,2.4vw,24px)] border border-slate-200/75 bg-gradient-to-b from-[#f6f8fe]/88 via-[#f1f4fc]/86 to-[#edf1f9]/84 px-[clamp(5px,0.9vw,8px)] pt-[clamp(4px,0.7vw,6px)] pb-[clamp(4px,0.6vw,5px)] shadow-[0_6px_14px_rgba(15,23,42,0.09)] transition-all duration-200 ${showAlphabet ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-1 pointer-events-none select-none'}`}
        aria-hidden={!showAlphabet}
      >
        <div className="flex justify-end">
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
        <div className="mt-1 space-y-[clamp(5px,0.9vw,8px)]">
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
            style={{ fontFamily: 'var(--font-georgian)' }}
          >
            {ch}
          </span>
        ))}
      </div>
    </div>
  );
}
