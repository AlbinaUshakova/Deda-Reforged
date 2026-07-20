import test from 'node:test';
import assert from 'node:assert/strict';

import {
  FAVORITE_WORDS_KEY,
  FLASHCARD_AUTO_PLAY_KEY,
  FLASHCARD_AUTO_SPEED_KEY,
  LEGACY_FAVORITE_WORDS_KEY,
  readFavoriteWords,
  readFlashcardPreferences,
  toggleFavoriteWord,
  writeFlashcardAutoPlay,
  writeFlashcardAutoSpeed,
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

test('readFlashcardPreferences sanitizes persisted values', () => {
  const storage = new MemoryStorage();
  storage.setItem(FLASHCARD_AUTO_PLAY_KEY, '1');
  storage.setItem(FLASHCARD_AUTO_SPEED_KEY, '999');

  assert.deepEqual(readFlashcardPreferences(storage), {
    autoPlay: true,
    autoSpeedMs: 1500,
  });
});

test('flashcard preference writers normalize values', () => {
  const storage = new MemoryStorage();

  writeFlashcardAutoPlay(true, storage);
  writeFlashcardAutoSpeed(2500, storage);

  assert.equal(storage.getItem(FLASHCARD_AUTO_PLAY_KEY), '1');
  assert.equal(storage.getItem(FLASHCARD_AUTO_SPEED_KEY), '2500');
});
