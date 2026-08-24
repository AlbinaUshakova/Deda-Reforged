'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/appStore';
import {
  getCourse,
  getLetterSpeechLang,
  getLetterSpeechText,
  type CourseId,
} from '@/lib/courses';
import { playLetterAudio } from '@/lib/playLetterAudio';

export function useLetterAudio(courseId: CourseId) {
  const interfaceLanguage = useAppStore(state => state.settings.interfaceLanguage);
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
      fallbackText: getLetterSpeechText(letter, courseId),
      speechLang: getLetterSpeechLang(courseId),
      preferredVoices: ttsVoices,
      onStart: () => setAudioError(''),
      onError: () => {
        const hasSpeech = typeof window !== 'undefined' && 'speechSynthesis' in window;
        setAudioError(
          hasSpeech
            ? (interfaceLanguage === 'en'
              ? 'Audio is not available on this device'
              : 'Озвучка недоступна на этом устройстве')
            : (interfaceLanguage === 'en'
              ? 'Audio is not available in this browser'
              : 'Озвучка недоступна в этом браузере'),
        );
      },
    });
  };

  return {
    audioError,
    speakLetter,
  };
}
