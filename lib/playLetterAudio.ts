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
    const preferredVoice = voices.find(v =>
      v.lang?.toLowerCase().startsWith(speechLang.toLowerCase().split('-')[0]),
    );

    utterance.lang = speechLang;
    if (preferredVoice) {
      utterance.voice = preferredVoice;
      utterance.lang = preferredVoice.lang;
    }
    utterance.rate = 0.9;
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
