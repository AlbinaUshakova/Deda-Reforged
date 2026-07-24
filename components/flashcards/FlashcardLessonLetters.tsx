'use client';

import { useEffect, useRef, useState } from 'react';
import { useAppStore } from '@/lib/appStore';
import { getCourse, getLetterSpeechLang, getLetterSpeechText } from '@/lib/courses';
import { playLetterAudio, stopLetterAudioPlayback } from '@/lib/playLetterAudio';
import { letterToHint, type TransliterationMode } from '@/lib/transliteration';

type FlashcardLessonLettersProps = {
  letters: string[];
  kind?: 'letters' | 'rules';
  title?: string;
  description?: string;
};

export function FlashcardLessonLetters({
  letters,
  kind = 'letters',
  title = 'Буквы урока',
  description,
}: FlashcardLessonLettersProps) {
  const transliterationMode = useAppStore(
    state => state.settings.transliterationMode,
  ) as TransliterationMode;
  const courseId = useAppStore(state => state.settings.courseId);
  const course = getCourse(courseId);
  const letterFontClass = courseId === 'ka' ? 'alphabet-letter--georgian' : 'alphabet-letter--latin';
  const [playingLetter, setPlayingLetter] = useState<string | null>(null);
  const playingTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (playingTimerRef.current !== null) {
        window.clearTimeout(playingTimerRef.current);
        playingTimerRef.current = null;
      }
      stopLetterAudioPlayback();
    };
  }, []);

  if (letters.length === 0) return null;

  const hasDenseLetterSet = letters.length > 7;
  const canPlayAudio = kind === 'letters';

  const speakLetter = (letter: string) => {
    if (typeof window === 'undefined') return;
    setPlayingLetter(letter);

    if (playingTimerRef.current !== null) {
      window.clearTimeout(playingTimerRef.current);
      playingTimerRef.current = null;
    }

    const finish = () => {
      if (playingTimerRef.current !== null) {
        window.clearTimeout(playingTimerRef.current);
        playingTimerRef.current = null;
      }
      setPlayingLetter(prev => (prev === letter ? null : prev));
    };

    void playLetterAudio({
      audioSrc: course.letterAudioMap[letter],
      fallbackText: getLetterSpeechText(letter, courseId),
      speechLang: getLetterSpeechLang(courseId),
      onEnd: finish,
      onError: finish,
    });

    playingTimerRef.current = window.setTimeout(finish, 1600);
  };

  return (
    <section
      className={`flashcard-lesson-letters ${
        hasDenseLetterSet ? 'flashcard-lesson-letters--dense' : ''
      }`}
      aria-label={title}
    >
      <div className="flashcard-lesson-letters-copy">
        <span className="flashcard-lesson-letters-kicker">{title}</span>
        {description && (
          <span className="mt-1 block text-[11px] font-medium leading-tight text-slate-500">
            {description}
          </span>
        )}
      </div>
      <div className={`flashcard-lesson-letters-list ${
        hasDenseLetterSet ? 'flashcard-lesson-letters-list--dense' : ''
      }`}>
        {letters.map(letter => {
          const className = `flashcard-lesson-letter ${
            !canPlayAudio ? 'flashcard-lesson-letter--rule' : ''
          } ${
            hasDenseLetterSet ? 'flashcard-lesson-letter--dense' : ''
          } ${
            playingLetter === letter ? 'flashcard-lesson-letter--active' : ''
          }`;
          const readingHint = letterToHint(letter, transliterationMode, courseId);

          if (!canPlayAudio) {
            return (
              <span key={letter} className={className}>
                <span className={`flashcard-lesson-letter-char ${letterFontClass}`}>{letter}</span>
              </span>
            );
          }

          return (
            <button
              key={letter}
              type="button"
              className={className}
              onClick={() => speakLetter(letter)}
              title={`Озвучить букву ${letter}. Подсказка чтения: ${readingHint}`}
              aria-label={`Озвучить букву ${letter}. Подсказка чтения: ${readingHint}`}
              aria-pressed={playingLetter === letter}
            >
              <span className={`flashcard-lesson-letter-char ${letterFontClass}`}>{letter}</span>
              <span className="flashcard-lesson-letter-hint">
                {readingHint}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
