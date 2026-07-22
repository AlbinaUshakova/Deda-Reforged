import test from 'node:test';
import assert from 'node:assert/strict';

import { letterToHint, textToHint } from '../lib/transliteration.ts';

test('letterToHint supports Russian and latin hints for all non-Georgian courses', () => {
  assert.equal(letterToHint('Љ', 'ru', 'sr'), 'ль');
  assert.equal(letterToHint('Љ', 'latin', 'sr'), 'lj');
  assert.equal(letterToHint('Ш', 'latin', 'sr'), 'sh');

  assert.equal(letterToHint('İ', 'ru', 'tr'), 'и');
  assert.equal(letterToHint('İ', 'latin', 'tr'), 'i');
  assert.equal(letterToHint('I', 'ru', 'tr'), 'ы');
  assert.equal(letterToHint('I', 'latin', 'tr'), 'i');
  assert.equal(letterToHint('Ş', 'latin', 'tr'), 'sh');

  assert.equal(letterToHint('Ñ', 'ru', 'es'), 'нь');
  assert.equal(letterToHint('Ñ', 'latin', 'es'), 'ny');

  assert.equal(letterToHint('Ü', 'ru', 'de'), 'ю');
  assert.equal(letterToHint('Ü', 'latin', 'de'), 'ue');
  assert.equal(letterToHint('ẞ', 'ru', 'de'), 'сс');
  assert.equal(letterToHint('ẞ', 'latin', 'de'), 'ss');
});

test('textToHint builds course-aware card transcription strings', () => {
  assert.equal(textToHint('Здраво', 'ru', 'sr'), 'здраво');
  assert.equal(textToHint('Здраво', 'latin', 'sr'), 'zdravo');

  assert.equal(textToHint('iyi', 'ru', 'tr'), 'ийи');
  assert.equal(textToHint('kapı', 'ru', 'tr'), 'капы');
  assert.equal(textToHint('kapı', 'latin', 'tr'), 'kapi');
  assert.equal(textToHint('yağmur', 'ru', 'tr'), 'йамур');
  assert.equal(textToHint('şeker', 'latin', 'tr'), 'sheker');

  assert.equal(textToHint('niño', 'ru', 'es'), 'ниньо');
  assert.equal(textToHint('niño', 'latin', 'es'), 'ninyo');
  assert.equal(textToHint('gracias', 'ru', 'es'), 'грасиас');
  assert.equal(textToHint('queso', 'ru', 'es'), 'кесо');

  assert.equal(textToHint('grün', 'ru', 'de'), 'грюн');
  assert.equal(textToHint('grün', 'latin', 'de'), 'gruen');
  assert.equal(textToHint('ich', 'ru', 'de'), 'их');
  assert.equal(textToHint('Straße', 'ru', 'de'), 'штрассэ');
  assert.equal(textToHint('Straße', 'latin', 'de'), 'strasse');
});
