'use client';

import type { Ref } from 'react';
import { letterToHint, type TransliterationMode } from '@/lib/transliteration';
import { getAlphabetLetter, getCourse, getLetterSoundLabel, type CourseId } from '@/lib/courses';
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
      role="dialog"
      aria-label={`Алфавит: ${course.scriptTitleNative}`}
      aria-hidden={!showAlphabet}
      className={`alphabet-compact fixed left-2 top-[64px] ${alphabetOverlapsLessons ? 'z-[221]' : 'z-[210]'} w-[clamp(196px,40vw,260px)] max-h-[calc(100dvh-84px)] overflow-y-auto rounded-[20px] border border-slate-200/80 bg-white/95 px-3 pb-3 pt-2 shadow-[0_16px_40px_rgba(31,28,23,0.18)] backdrop-blur-md transition-all duration-200 ease-out sm:left-3 sm:top-[70px] ${showAlphabet ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 select-none opacity-0'}`}
    >
        <div className="mb-1 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="truncate text-[13px] font-semibold text-[var(--text-primary)]">{course.scriptTitleNative}</div>
            <div className="text-[11px] text-[var(--text-secondary)]">Нажми на букву и послушай, как она звучит.</div>
          </div>
          <button
            type="button"
            onClick={onToggleAlphabet}
            className="home-alphabet-close grid h-7 w-7 shrink-0 place-items-center rounded-full text-[12px] text-[var(--text-tertiary)] transition-colors hover:bg-black/5 hover:text-[var(--text-secondary)] focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--menu-focus)] focus-visible:outline-offset-2"
            aria-label="Закрыть панель алфавита"
            title="Закрыть панель алфавита"
          >
            ✕
          </button>
        </div>
        <div className="mx-auto mt-2.5 w-full max-w-[224px] space-y-2">
          {visibleAlphabetSections.map((section, sectionIdx) => {
            return (
              <section
                key={`home-alpha-section-${section.title}`}
                className={`min-w-0 ${sectionIdx > 0 ? 'alphabet-section--additional' : ''}`}
              >
                {sectionIdx > 0 && (
                  <div className="alphabet-section-label">{section.title}</div>
                )}
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
                        const info = getAlphabetLetter(ch, courseId);
                        const pronRaw =
                          (transliterationMode === 'latin' ? info.pronunciationLatin : info.pronunciationCyrillic) ||
                          letterToHint(ch, transliterationMode, courseId) ||
                          '';
                        // не больше двух вариантов чтения
                        const pron = pronRaw.split('/').slice(0, 2).join('/');
                        const audioLabel = courseId === 'en'
                          ? `Прослушать название буквы ${ch}`
                          : `Прослушать произношение буквы ${ch}`;
                        const isHighlightedLetter = course.alphabetHighlightedLetters?.includes(ch) ?? false;

                        return (
                          <button
                            key={ch}
                            type="button"
                            onClick={() => onSpeakLetter(ch)}
                            className={`home-alphabet-key home-alphabet-key--${info.isVowel ? 'vowel' : 'consonant'} ${isHighlightedLetter ? 'home-alphabet-key--highlighted' : ''} cursor-pointer rounded-lg border border-slate-200/75 bg-white/90 py-[3px] text-center shadow-sm transition-all hover:bg-slate-50`}
                            title={`Озвучить букву ${ch}. Звучит как: ${soundLabel}`}
                            aria-label={audioLabel}
                          >
                            <div className={`home-alphabet-letter ${letterFontClass} translate-y-[-1px] leading-none`}>{info.uppercase}</div>
                            {info.lowercase && (
                              <div className={`home-alphabet-lower ${letterFontClass} leading-none`}>{info.lowercase}</div>
                            )}
                            <div className="home-alphabet-translit mt-[2px] leading-none">
                              {String(pron).toLowerCase()}
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
