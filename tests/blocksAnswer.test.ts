import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildCycle,
  evaluateLetterCells,
  isSameAnswer,
  normalizeRu,
  pickNextIndexFromQueue,
  wordKey,
} from '../lib/blocksAnswer.ts';

test('normalizeRu lowercases Georgian mtavruli and sanitizes Russian text', () => {
  assert.equal(normalizeRu('  Ёж (подсказка) '), 'еж');
  assert.equal(normalizeRu('ᲐᲑᲒ'), 'აბგ');
});

test('isSameAnswer accepts punctuation, line breaks, alternatives, and numbers', () => {
  assert.equal(isSameAnswer('Пакет нет спасибо', 'Пакет?\nНет, спасибо.'), true);
  assert.equal(isSameAnswer('гамарджоба', 'привет / гамарджоба'), true);
  assert.equal(isSameAnswer('2 стула', 'два стула'), true);
  assert.equal(isSameAnswer('один два три', '1 2 3'), true);
});

test('evaluateLetterCells marks exact and misplaced characters', () => {
  assert.deepEqual(evaluateLetterCells('кот', 'кто'), [
    { char: 'к', state: 'correct' },
    { char: 'о', state: 'present' },
    { char: 'т', state: 'present' },
  ]);
});

test('buildCycle includes hard words one extra time', () => {
  const cycle = buildCycle(3, new Set([1, 9]));

  assert.equal(cycle.length, 4);
  assert.equal(cycle.filter(idx => idx === 1).length, 2);
  assert.equal(cycle.every(idx => idx >= 0 && idx < 3), true);
});

test('pickNextIndexFromQueue avoids recent words when possible', () => {
  const words = [
    { ge: 'ა', ru: 'а' },
    { ge: 'ბ', ru: 'б' },
    { ge: 'გ', ru: 'в' },
  ];
  const picked = pickNextIndexFromQueue(
    [0, 1, 2],
    words,
    [0, 1],
    [wordKey(words[0]), wordKey(words[1])],
  );

  assert.deepEqual(picked, { nextIdx: 2, rest: [0, 1] });
});
