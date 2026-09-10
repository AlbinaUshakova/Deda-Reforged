'use client';

import type { Ref } from 'react';
import { useAppStore } from '@/lib/appStore';
import {
  getAlphabetAudioLabel,
  getAlphabetCloseLabel,
  getAlphabetDisplayTitle,
  getAlphabetInstruction,
  getAlphabetTitleLabel,
} from '@/lib/interfaceText';
import { getDisplayText, type TransliterationMode } from '@/lib/transliteration';
import { getCourse, getLetterHint, type CourseId } from '@/lib/courses';
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
  const interfaceLanguage = useAppStore(state => state.settings.interfaceLanguage);
  const storedTransliterationMode = useAppStore(state => state.settings.transliterationMode);
  const letterFontClass = courseId === 'ka' ? 'alphabet-letter--georgian' : 'alphabet-letter--latin';
  const alphabetColumnCount = Math.max(
    1,
    ...course.alphabetRows.map(row => row.length),
  );

  return (
    <aside
      ref={alphabetRef}
      role="dialog"
      aria-label={getAlphabetTitleLabel(interfaceLanguage, course.scriptTitleNative)}
      aria-hidden={!showAlphabet}
      className={`app-alphabet-overlay alphabet-compact fixed ${alphabetOverlapsLessons ? 'z-[221]' : 'z-[210]'} w-[clamp(196px,40vw,260px)] overflow-y-auto rounded-[20px] border border-slate-200/80 bg-white/95 px-3 pb-3 pt-2 shadow-[0_16px_40px_rgba(31,28,23,0.18)] backdrop-blur-md transition-all duration-200 ease-out ${showAlphabet ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 select-none opacity-0'}`}
    >
        <div className="mx-auto mt-2.5 w-full max-w-[224px] space-y-2">
          {course.alphabetRows.map((row, rowIdx) => (
            <div
              key={`home-alpha-row-${rowIdx}`}
              className="grid gap-x-[clamp(2px,0.6vw,5px)] gap-y-[clamp(2px,0.6vw,5px)]"
              style={{
                gridTemplateColumns: `repeat(${alphabetColumnCount}, minmax(0, 1fr))`,
              }}
            >
              {row.map((ch) => {
                const visibleUppercase = getDisplayText(ch, transliterationMode, courseId);
                const soundHint = getLetterHint(ch, transliterationMode, courseId);
                const audioLabel = getAlphabetAudioLabel(interfaceLanguage, ch, courseId);
                const isVowel = course.vowels.includes(ch);
                const isCompositeSerbianLetter =
                  courseId === 'sr' && ['Lj', 'Nj', 'Dž'].includes(visibleUppercase);

                return (
                  <button
                    key={ch}
                    type="button"
                    onClick={() => onSpeakLetter(ch)}
                    className={`home-alphabet-key home-alphabet-key--${isVowel ? 'vowel' : 'consonant'} ${isCompositeSerbianLetter ? 'home-alphabet-key--composite' : ''} cursor-pointer rounded-lg border border-slate-200/75 bg-white/90 py-[3px] text-center shadow-sm transition-all hover:bg-slate-50`}
                    title={
                      interfaceLanguage === 'en'
                        ? `Play the name of the letter ${visibleUppercase}`
                        : `Прослушать название буквы ${visibleUppercase}`
                    }
                    aria-label={audioLabel}
                  >
                    <div className={`home-alphabet-letter ${letterFontClass} translate-y-[-1px] leading-none`}>{visibleUppercase}</div>
                    {soundHint && (
                      <div className="home-alphabet-translit mt-[3px] truncate leading-none">
                        {soundHint}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
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
