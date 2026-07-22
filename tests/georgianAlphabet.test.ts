import test from 'node:test';
import assert from 'node:assert/strict';

import {
  GEORGIAN_ALPHABET,
  GEORGIAN_ALPHABET_ROWS,
  geLetterAudioMap,
  geLetterName,
} from '../lib/georgianAlphabet.ts';
import { COURSES } from '../lib/courses.ts';

test('Georgian alphabet metadata covers all letters', () => {
  assert.equal(GEORGIAN_ALPHABET.length, 33);
  assert.deepEqual(GEORGIAN_ALPHABET_ROWS.flat(), GEORGIAN_ALPHABET);
  assert.equal(Object.keys(geLetterName).length, GEORGIAN_ALPHABET.length);
  assert.equal(Object.keys(geLetterAudioMap).length, GEORGIAN_ALPHABET.length);
});

test('Georgian alphabet has known first and last letter metadata', () => {
  assert.equal(GEORGIAN_ALPHABET[0], 'ა');
  assert.equal(GEORGIAN_ALPHABET.at(-1), 'ჰ');
  assert.equal(geLetterName['ა'], 'ანი');
  assert.equal(geLetterAudioMap['ჰ'], '/audio/letters/33-hae.mp3');
});

test('course alphabet sections cover every course letter once', () => {
  for (const course of Object.values(COURSES)) {
    const sectionLetters = course.alphabetSections.flatMap(section => section.letters);

    assert.deepEqual(
      [...sectionLetters].sort(),
      [...course.alphabet].sort(),
      `${course.id} alphabet sections should cover all letters`,
    );
    assert.equal(
      new Set(sectionLetters).size,
      sectionLetters.length,
      `${course.id} alphabet sections should not duplicate letters`,
    );
  }
});

test('courses with teaching-specific signs expose a separate visual section', () => {
  assert.equal(COURSES.de.alphabetSections.at(-1)?.title, 'Умлауты и ß');
  assert.deepEqual(COURSES.de.alphabetSections.at(-1)?.letters, ['Ä', 'Ö', 'Ü', 'ẞ']);
  assert.equal(COURSES.tr.alphabetSections.at(-1)?.title, 'Особые буквы');
  assert.deepEqual(COURSES.tr.alphabetSections.at(-1)?.letters, ['Ç', 'Ğ', 'İ', 'Ö', 'Ş', 'Ü']);
  assert.equal(COURSES.es.alphabetSections.at(-1)?.title, 'Особая буква');
  assert.deepEqual(COURSES.es.alphabetSections.at(-1)?.letters, ['Ñ']);
});
