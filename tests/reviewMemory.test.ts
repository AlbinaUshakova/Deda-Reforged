import test from 'node:test';
import assert from 'node:assert/strict';

import {
  orderReviewCards,
  readReviewMemory,
  recordReviewMistake,
  recordReviewSuccess,
} from '../lib/reviewMemory.ts';

class MemoryStorage {
  private values = new Map<string, string>();
  writes = 0;

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string) {
    this.writes += 1;
    this.values.set(key, value);
  }
}

test('mistakes raise difficulty and correct answers reduce it gradually', () => {
  const storage = new MemoryStorage();

  recordReviewMistake('ka', 'მამა', storage, 100);
  recordReviewMistake('ka', 'მამა', storage, 200);
  recordReviewSuccess('ka', 'მამა', storage, 300);

  assert.deepEqual(readReviewMemory('ka', storage)['მამა'], {
    difficulty: 3,
    lastSeenAt: 300,
  });
});

test('review ordering puts difficult words first and mixes the rest', () => {
  const cards = [
    { ge_text: 'ერთი' },
    { ge_text: 'ორი' },
    { ge_text: 'სამი' },
    { ge_text: 'ოთხი' },
  ];
  const memory = {
    სამი: { difficulty: 4, lastSeenAt: 100 },
    ორი: { difficulty: 2, lastSeenAt: 200 },
  };

  const ordered = orderReviewCards(cards, memory, 'test-seed');

  assert.deepEqual(ordered.slice(0, 2).map(card => card.ge_text), ['სამი', 'ორი']);
  assert.deepEqual(
    ordered.map(card => card.ge_text).sort(),
    cards.map(card => card.ge_text).sort(),
  );
});

test('review memory stays separate for each course', () => {
  const storage = new MemoryStorage();
  recordReviewMistake('ka', 'მამა', storage, 100);

  assert.equal(readReviewMemory('ka', storage)['მამა']?.difficulty, 2);
  assert.deepEqual(readReviewMemory('sr', storage), {});
});

test('correct answers without prior mistakes do not create review data', () => {
  const storage = new MemoryStorage();

  recordReviewSuccess('ka', 'მამა', storage, 100);

  assert.deepEqual(readReviewMemory('ka', storage), {});
  assert.equal(storage.writes, 0);
});
