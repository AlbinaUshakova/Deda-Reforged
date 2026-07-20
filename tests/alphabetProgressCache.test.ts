import test from 'node:test';
import assert from 'node:assert/strict';

import {
  ALPHABET_STATUS_CACHE_KEY,
  readAlphabetStatusCache,
  writeAlphabetStatusCache,
} from '../lib/alphabetProgressCache.ts';

class MemoryStorage {
  private values = new Map<string, string>();

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string) {
    this.values.set(key, value);
  }
}

test('readAlphabetStatusCache returns valid cached letter statuses', () => {
  const storage = new MemoryStorage();
  storage.setItem(
    ALPHABET_STATUS_CACHE_KEY,
    JSON.stringify({ 'ა': 'mastered', 'ბ': 'current' }),
  );

  assert.deepEqual(readAlphabetStatusCache(storage), {
    'ა': 'mastered',
    'ბ': 'current',
  });
});

test('readAlphabetStatusCache ignores invalid cached values', () => {
  const storage = new MemoryStorage();
  storage.setItem(
    ALPHABET_STATUS_CACHE_KEY,
    JSON.stringify({ 'ა': 'bad-status', 'ბ': 'locked', '': 'current' }),
  );

  assert.deepEqual(readAlphabetStatusCache(storage), {
    'ბ': 'locked',
  });
});

test('writeAlphabetStatusCache stores letter status map', () => {
  const storage = new MemoryStorage();

  writeAlphabetStatusCache({ 'ა': 'almost' }, storage);

  assert.equal(
    storage.getItem(ALPHABET_STATUS_CACHE_KEY),
    JSON.stringify({ 'ა': 'almost' }),
  );
});
