import test from 'node:test';
import assert from 'node:assert/strict';

import {
  GEORGIAN_ALPHABET,
  GEORGIAN_ALPHABET_ROWS,
  geLetterAudioMap,
  geLetterName,
  toGeorgianMtavruli,
} from '../lib/georgianAlphabet.ts';

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

test('toGeorgianMtavruli renders print-style Georgian letters', () => {
  assert.equal(toGeorgianMtavruli('აბგდ'), 'ᲐᲑᲒᲓ');
});
