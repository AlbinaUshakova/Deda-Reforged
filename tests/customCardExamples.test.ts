import assert from 'node:assert/strict';
import test from 'node:test';
import { getCustomCardExample } from '../lib/customCardExamples.ts';

test('Russian custom-card examples use familiar letters and mean hello', () => {
  const examples = ['ka', 'sr', 'tr', 'es', 'de', 'en', 'fr', 'it'] as const;

  for (const courseId of examples) {
    const example = getCustomCardExample(courseId, 'ru');
    assert.equal(example.meaning, 'Здравствуйте');
    assert.match(example.entered, /^[а-яё\s]+$/i);
    assert.ok(example.original.length > 0);
  }
});

test('Turkish example shows both comfortable and original spellings', () => {
  assert.deepEqual(getCustomCardExample('tr', 'ru'), {
    entered: 'мерхаба',
    original: 'Merhaba',
    meaning: 'Здравствуйте',
  });
});
