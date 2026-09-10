import test from 'node:test';
import assert from 'node:assert/strict';
import { selectSpeechVoice } from '../lib/playLetterAudio.ts';

type TestVoice = {
  lang: string;
  localService: boolean;
  default: boolean;
  name: string;
};

test('selectSpeechVoice prefers an exact native locale and a local voice', () => {
  const voices: TestVoice[] = [
    { lang: 'tr-TR', localService: false, default: true, name: 'remote Turkish' },
    { lang: 'tr_TR', localService: true, default: false, name: 'local Turkish' },
    { lang: 'ru-RU', localService: true, default: true, name: 'Russian' },
  ];

  assert.equal(selectSpeechVoice(voices, 'tr-TR')?.name, 'local Turkish');
});

test('selectSpeechVoice falls back to another locale of the same language', () => {
  const voices: TestVoice[] = [
    { lang: 'en-GB', localService: true, default: false, name: 'British' },
    { lang: 'ru-RU', localService: true, default: true, name: 'Russian' },
  ];

  assert.equal(selectSpeechVoice(voices, 'en-US')?.name, 'British');
  assert.equal(selectSpeechVoice(voices, 'tr-TR'), undefined);
});
