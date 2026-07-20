'use client';

import { useEffect, useRef, useState } from 'react';
import { useAppStore } from '@/lib/appStore';
import { geLetterAudioMap } from '@/lib/georgianLetterAudio';
import { playLetterAudio, stopLetterAudioPlayback } from '@/lib/playLetterAudio';
import { geLetterToHint, type TransliterationMode } from '@/lib/transliteration';

type FlashcardLessonLettersProps = {
  letters: string[];
};

export function FlashcardLessonLetters({ letters }: FlashcardLessonLettersProps) {
  const transliterationMode = useAppStore(
    state => state.settings.transliterationMode,
  ) as TransliterationMode;
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
      audioSrc: geLetterAudioMap[letter],
      fallbackText: letter,
      onEnd: finish,
      onError: finish,
    });

    playingTimerRef.current = window.setTimeout(finish, 1600);
  };

  return (
    <section className="flashcard-lesson-letters" aria-label="Буквы этого урока">
      <div className="flashcard-lesson-letters-copy">
        <span className="flashcard-lesson-letters-kicker">Буквы урока</span>
        <span className="flashcard-lesson-letters-hint">♪ нажми букву</span>
        <span className="flashcard-lesson-letters-alphabet">остальные - Алфавит</span>
      </div>
      <div className="flashcard-lesson-letters-list">
        {letters.map(letter => (
          <button
            key={letter}
            type="button"
            className={`flashcard-lesson-letter ${
              playingLetter === letter ? 'flashcard-lesson-letter--active' : ''
            }`}
            onClick={() => speakLetter(letter)}
            title={`Озвучить букву ${letter}`}
            aria-label={`Озвучить букву ${letter}`}
            aria-pressed={playingLetter === letter}
          >
            <span className="flashcard-lesson-letter-audio" aria-hidden="true">♪</span>
            <span className="flashcard-lesson-letter-char">{letter}</span>
            <span className="flashcard-lesson-letter-hint">
              {geLetterToHint(letter, transliterationMode)}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
