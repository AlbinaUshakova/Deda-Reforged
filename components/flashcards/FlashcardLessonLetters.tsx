'use client';

import { useEffect, useRef, useState } from 'react';
import { useAppStore } from '@/lib/appStore';
import { getCourse, getLetterHint, getLetterSpeechLang, getLetterSpeechText } from '@/lib/courses';
import { playLetterAudio, stopLetterAudioPlayback } from '@/lib/playLetterAudio';
import { getDisplayText, type TransliterationMode } from '@/lib/transliteration';
import { getActiveTransliterationMode } from '@/lib/settings';

type FlashcardLessonLettersProps = {
  letters: string[];
  kind?: 'letters' | 'rules';
  title?: string;
  description?: string;
};

export function FlashcardLessonLetters({
  letters,
  kind = 'letters',
  title,
  description,
}: FlashcardLessonLettersProps) {
  const interfaceLanguage = useAppStore(state => state.settings.interfaceLanguage);
  const courseId = useAppStore(state => state.settings.courseId);
  const storedTransliterationMode = useAppStore(state => state.settings.transliterationMode);
  const transliterationMode = getActiveTransliterationMode(interfaceLanguage, courseId, storedTransliterationMode) as TransliterationMode;
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

  const resolvedTitle = title ?? (interfaceLanguage === 'en' ? 'Lesson letters' : 'Буквы урока');
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
      aria-label={resolvedTitle}
    >
      <div className="flashcard-lesson-letters-copy">
        <span className="flashcard-lesson-letters-kicker">{resolvedTitle}</span>
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
          const visibleLetter = getDisplayText(letter, transliterationMode, courseId);
          const soundHint = getLetterHint(letter, transliterationMode, courseId);

          if (!canPlayAudio) {
            return (
              <span key={letter} className={className}>
                <span className={`flashcard-lesson-letter-char ${letterFontClass}`}>{visibleLetter}</span>
              </span>
            );
          }

          return (
            <button
              key={letter}
              type="button"
              className={className}
              onClick={() => speakLetter(letter)}
              title={
                interfaceLanguage === 'en'
                  ? `Play letter ${visibleLetter}`
                  : `Озвучить букву ${visibleLetter}`
              }
              aria-label={
                interfaceLanguage === 'en'
                  ? `Play letter ${visibleLetter}`
                  : `Озвучить букву ${visibleLetter}`
              }
              aria-pressed={playingLetter === letter}
            >
              <span className={`flashcard-lesson-letter-char ${letterFontClass}`}>{visibleLetter}</span>
              {soundHint && (
                <span className="flashcard-lesson-letter-hint">{soundHint}</span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
