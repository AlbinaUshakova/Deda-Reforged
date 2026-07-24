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

test('isSameAnswer accepts the same words in a different order', () => {
  assert.equal(isSameAnswer('спасибо не надо', 'Не надо, спасибо'), true);
  assert.equal(isSameAnswer('стула 2', 'два стула'), true);
  assert.equal(isSameAnswer('люблю тебя я', 'Я тебя люблю'), true);
  assert.equal(isSameAnswer('тебя люблю', 'Я тебя люблю'), true);
  assert.equal(isSameAnswer('я тебя очень люблю', 'Я тебя люблю'), false);
});

test('isSameAnswer accepts explicit semantic variants', () => {
  assert.equal(isSameAnswer('благодарю', ['Спасибо', 'Благодарю']), true);
  assert.equal(isSameAnswer('не нужно', ['Не надо, спасибо', 'Не нужно']), true);
  assert.equal(isSameAnswer('дайте чек', ['Мне нужен чек', 'Дайте чек']), true);
  assert.equal(isSameAnswer('хочу есть', ['Я голоден / голодна', 'Хочу есть']), true);
  assert.equal(isSameAnswer('хлеб шоти', ['шоти', 'хлеб шоти']), true);
  assert.equal(isSameAnswer('грузинка', 'грузин / грузинка'), true);
});

test('isSameAnswer tolerates safe omitted Russian pronouns only', () => {
  assert.equal(isSameAnswer('хочу кофе', 'Я хочу кофе'), true);
  assert.equal(isSameAnswer('нужна помощь', 'Мне нужна помощь'), true);
  assert.equal(isSameAnswer('фиалка', 'Вот фиалка'), false);
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

test('pickNextIndexFromQueue keeps a wider gap before repeating words', () => {
  const words = [
    { ge: 'ა', ru: 'а' },
    { ge: 'ბ', ru: 'б' },
    { ge: 'გ', ru: 'в' },
    { ge: 'დ', ru: 'г' },
    { ge: 'ე', ru: 'д' },
    { ge: 'ვ', ru: 'е' },
    { ge: 'ზ', ru: 'ж' },
    { ge: 'თ', ru: 'з' },
  ];
  const picked = pickNextIndexFromQueue(
    [0, 6, 7],
    words,
    [0, 1, 2, 3, 4, 5],
    [0, 1, 2, 3, 4, 5].map(idx => wordKey(words[idx])),
  );

  assert.deepEqual(picked, { nextIdx: 6, rest: [0, 7] });
});

test('pickNextIndexFromQueue delays hard-word duplicates when fresh words exist', () => {
  const words = [
    { ge: 'ა', ru: 'а' },
    { ge: 'ბ', ru: 'б' },
    { ge: 'გ', ru: 'в' },
    { ge: 'დ', ru: 'г' },
    { ge: 'ე', ru: 'д' },
    { ge: 'ვ', ru: 'е' },
    { ge: 'ზ', ru: 'ж' },
  ];
  const picked = pickNextIndexFromQueue(
    [0, 1, 0, 2],
    words,
    [3, 4, 0, 5, 6],
    [3, 4, 0, 5, 6].map(idx => wordKey(words[idx])),
  );

  assert.deepEqual(picked, { nextIdx: 1, rest: [0, 0, 2] });
});
