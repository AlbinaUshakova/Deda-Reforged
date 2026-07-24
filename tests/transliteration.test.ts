import test from 'node:test';
import assert from 'node:assert/strict';

import { COURSES, COURSE_IDS } from '../lib/courses.ts';
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
  assert.equal(letterToHint('ẞ', 'ru', 'de'), 'с');
  assert.equal(letterToHint('ẞ', 'latin', 'de'), 's');
  assert.equal(letterToHint('C', 'latin', 'de'), 'k/ts');
  assert.equal(letterToHint('Q', 'latin', 'de'), 'kv');
  assert.equal(letterToHint('V', 'latin', 'de'), 'f/v');
  assert.equal(letterToHint('W', 'latin', 'de'), 'v');
  assert.equal(letterToHint('X', 'latin', 'de'), 'ks');
  assert.equal(letterToHint('Y', 'latin', 'de'), 'ue/i/y');
  assert.equal(letterToHint('Z', 'latin', 'de'), 'ts');

  assert.equal(letterToHint('A', 'ru', 'en'), 'э');
  assert.equal(letterToHint('A', 'latin', 'en'), 'a');
  assert.equal(letterToHint('C', 'ru', 'en'), 'к');
  assert.equal(letterToHint('Q', 'ru', 'en'), 'кв');
  assert.equal(letterToHint('X', 'latin', 'en'), 'ks');
});

test('textToHint builds course-aware sound hint strings', () => {
  assert.equal(textToHint('Здраво', 'ru', 'sr'), 'здраво');
  assert.equal(textToHint('Здраво', 'latin', 'sr'), 'zdravo');

  assert.equal(textToHint('iyi', 'ru', 'tr'), 'ийи');
  assert.equal(textToHint('kapı', 'ru', 'tr'), 'капы');
  assert.equal(textToHint('kapı', 'latin', 'tr'), 'kapi');
  assert.equal(textToHint('yağmur', 'ru', 'tr'), 'йаамур');
  assert.equal(textToHint('soğuk', 'ru', 'tr'), 'соук');
  assert.equal(textToHint('şeker', 'latin', 'tr'), 'sheker');

  assert.equal(textToHint('hielo', 'ru', 'es'), 'йэло');
  assert.equal(textToHint('niño', 'ru', 'es'), 'ниньо');
  assert.equal(textToHint('niño', 'latin', 'es'), 'ninyo');
  assert.equal(textToHint('gracias', 'ru', 'es'), 'грасиас');
  assert.equal(textToHint('queso', 'ru', 'es'), 'кэсо');

  assert.equal(textToHint('See', 'ru', 'de'), 'зээ');
  assert.equal(textToHint('Seite', 'ru', 'de'), 'зайтэ');
  assert.equal(textToHint('Quark', 'ru', 'de'), 'кварк');
  assert.equal(textToHint('grün', 'ru', 'de'), 'грюн');
  assert.equal(textToHint('grün', 'latin', 'de'), 'gruen');
  assert.equal(textToHint('ich', 'ru', 'de'), 'их');
  assert.equal(textToHint('Straße', 'ru', 'de'), 'штрассэ');
  assert.equal(textToHint('Straße', 'latin', 'de'), 'strasse');
});

test('single-letter sound hints match alphabet hints where reading is not contextual', () => {
  const contextualLetters = new Set([
    'Ğ',
    'C',
    'G',
    'H',
    'Q',
    'V',
    'W',
    'Y',
    'S',
  ]);

  for (const courseId of COURSE_IDS) {
    for (const letter of COURSES[courseId].alphabet) {
      if (contextualLetters.has(letter)) continue;

      assert.equal(
        textToHint(letter, 'ru', courseId),
        letterToHint(letter, 'ru', courseId),
        `${courseId}:${letter} should use one ru hint`,
      );
      assert.equal(
        textToHint(letter, 'latin', courseId),
        letterToHint(letter, 'latin', courseId),
        `${courseId}:${letter} should use one latin hint`,
      );
    }
  }
});
