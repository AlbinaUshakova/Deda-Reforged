'use client';

import { useEffect, useState } from 'react';
import { geLetterAudioMap, geLetterName } from '@/lib/georgianAlphabet';
import { playLetterAudio } from '@/lib/playLetterAudio';

export function useLetterAudio() {
  const [ttsVoices, setTtsVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [audioError, setAudioError] = useState('');

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
      audioSrc: geLetterAudioMap[letter],
      fallbackText: geLetterName[letter] ?? letter,
      preferredVoices: ttsVoices,
      onStart: () => setAudioError(''),
      onError: () => {
        const hasSpeech = typeof window !== 'undefined' && 'speechSynthesis' in window;
        setAudioError(
          hasSpeech
            ? 'Озвучка недоступна на этом устройстве'
            : 'Грузинская озвучка недоступна в этом браузере',
        );
      },
    });
  };

  return {
    audioError,
    speakLetter,
  };
}
