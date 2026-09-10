'use client';

type PlayLetterAudioOptions = {
  audioSrc?: string;
  fallbackText: string;
  speechLang?: string;
  preferredVoices?: SpeechSynthesisVoice[];
  onStart?: (mode: 'audio' | 'speech') => void;
  onEnd?: () => void;
  onError?: () => void;
};

type InlinePlayableAudio = HTMLAudioElement & { playsInline?: boolean };

let sharedAudio: InlinePlayableAudio | null = null;
let playbackToken = 0;

export function selectSpeechVoice<T extends Pick<SpeechSynthesisVoice, 'lang' | 'localService' | 'default'>>(
  voices: T[],
  speechLang: string,
): T | undefined {
  const normalizedTarget = speechLang.toLowerCase().replace('_', '-');
  const targetLanguage = normalizedTarget.split('-')[0];
  const candidates = voices.filter(voice =>
    voice.lang?.toLowerCase().replace('_', '-').split('-')[0] === targetLanguage,
  );

  return candidates.sort((left, right) => {
    const score = (voice: T) => {
      const normalizedVoiceLang = voice.lang.toLowerCase().replace('_', '-');
      return (normalizedVoiceLang === normalizedTarget ? 4 : 0) +
        (voice.localService ? 2 : 0) +
        (voice.default ? 1 : 0);
    };
    return score(right) - score(left);
  })[0];
}

function resetAudio(audio: InlinePlayableAudio) {
  audio.pause();
  if (audio.readyState > 0) {
    try {
      audio.currentTime = 0;
    } catch {
      // Some mobile browsers reject seeking until media metadata is loaded.
    }
  }
}

export function stopLetterAudioPlayback() {
  playbackToken += 1;
  if (typeof window === 'undefined') return;

  if (sharedAudio) {
    resetAudio(sharedAudio);
    sharedAudio.onended = null;
    sharedAudio.onerror = null;
    sharedAudio = null;
  }

  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

export async function playLetterAudio({
  audioSrc,
  fallbackText,
  speechLang = 'ka-GE',
  preferredVoices,
  onStart,
  onEnd,
  onError,
}: PlayLetterAudioOptions) {
  if (typeof window === 'undefined') return;

  stopLetterAudioPlayback();
  const token = playbackToken;

  const finish = () => {
    if (token !== playbackToken) return;
    onEnd?.();
  };

  const playSpeechFallback = () => {
    if (!('speechSynthesis' in window)) {
      onError?.();
      finish();
      return;
    }

    const synth = window.speechSynthesis;
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(fallbackText);
    const voices = preferredVoices?.length ? preferredVoices : synth.getVoices();
    const preferredVoice = selectSpeechVoice(voices, speechLang);

    utterance.lang = speechLang;
    if (preferredVoice) {
      utterance.voice = preferredVoice;
      utterance.lang = preferredVoice.lang;
    }
    utterance.rate = 0.88;
    utterance.onend = finish;
    utterance.onerror = () => {
      if (token !== playbackToken) return;
      onError?.();
      finish();
    };

    try {
      onStart?.('speech');
      synth.resume();
      synth.speak(utterance);
    } catch {
      if (token !== playbackToken) return;
      onError?.();
      finish();
    }
  };

  if (!audioSrc) {
    playSpeechFallback();
    return;
  }

  try {
    const audio: InlinePlayableAudio = new Audio(audioSrc);
    sharedAudio = audio;
    audio.preload = 'auto';
    audio.playsInline = true;
    audio.setAttribute('playsinline', '');
    audio.volume = 1;
    audio.onended = finish;
    audio.onerror = () => {
      if (token !== playbackToken) return;
      playSpeechFallback();
    };

    onStart?.('audio');
    await audio.play();
  } catch {
    if (token !== playbackToken) return;
    playSpeechFallback();
  }
}
