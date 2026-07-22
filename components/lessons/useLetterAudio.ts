'use client';

import { useEffect, useState } from 'react';
import { getCourse, type CourseId } from '@/lib/courses';
import { playLetterAudio } from '@/lib/playLetterAudio';

export function useLetterAudio(courseId: CourseId) {
  const [ttsVoices, setTtsVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [audioError, setAudioError] = useState('');
  const course = getCourse(courseId);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const synth = window.speechSynthesis;
    const refreshVoices = () => setTtsVoices(synth.getVoices());
    refreshVoices();
    synth.onvoiceschanged = refreshVoices;
    return () => {
      synth.onvoiceschanged = null;
    };
  }, []);

  const speakLetter = (letter: string) => {
    if (typeof window === 'undefined') return;
    setAudioError('');

    void playLetterAudio({
      audioSrc: course.letterAudioMap[letter],
      fallbackText: course.letterNames[letter] ?? letter,
      speechLang: course.speechLang,
      preferredVoices: ttsVoices,
      onStart: () => setAudioError(''),
      onError: () => {
        const hasSpeech = typeof window !== 'undefined' && 'speechSynthesis' in window;
        setAudioError(
          hasSpeech
            ? 'Озвучка недоступна на этом устройстве'
            : 'Озвучка недоступна в этом браузере',
        );
      },
    });
  };

  return {
    audioError,
    speakLetter,
  };
}
