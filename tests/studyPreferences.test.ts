import test from 'node:test';
import assert from 'node:assert/strict';

import {
  FAVORITE_WORDS_KEY,
  LEGACY_FAVORITE_WORDS_KEY,
  readFavoriteWords,
  toggleFavoriteWord,
} from '../lib/studyPreferences.ts';

class MemoryStorage {
  private values = new Map<string, string>();

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string) {
    this.values.set(key, value);
  }

  removeItem(key: string) {
    this.values.delete(key);
  }
}

test('readFavoriteWords merges and migrates legacy favorites', () => {
  const storage = new MemoryStorage();
  storage.setItem(FAVORITE_WORDS_KEY, JSON.stringify(['აი']));
  storage.setItem(LEGACY_FAVORITE_WORDS_KEY, JSON.stringify(['ია', 'აი']));

  const words = readFavoriteWords(storage);

  assert.deepEqual(Array.from(words).sort(), ['აი', 'ია']);
  assert.equal(storage.getItem(LEGACY_FAVORITE_WORDS_KEY), null);
  assert.deepEqual(
    JSON.parse(storage.getItem(FAVORITE_WORDS_KEY) ?? '[]').sort(),
    ['აი', 'ია'],
  );
});

test('toggleFavoriteWord persists the next favorite set', () => {
  const storage = new MemoryStorage();

  const added = toggleFavoriteWord([], 'სოსო', storage);
  const removed = toggleFavoriteWord(added, 'სოსო', storage);

  assert.deepEqual(Array.from(added), ['სოსო']);
  assert.deepEqual(Array.from(removed), []);
  assert.equal(storage.getItem(FAVORITE_WORDS_KEY), '[]');
});
