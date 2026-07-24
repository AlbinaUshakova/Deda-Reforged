import test from 'node:test';
import assert from 'node:assert/strict';

import {
  getStudyDeckCards,
  resolveStudyEpisode,
} from '../app/study/[episodeId]/studyContent.ts';

const RAW_CONTENT_KEY = 'deda_content_json';

class MemoryStorage {
  private values = new Map<string, string>();

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string) {
    this.values.set(key, value);
  }
}

test('resolveStudyEpisode normalizes bundled cards without double casting', () => {
  const episode = resolveStudyEpisode(
    {
      id: 'ep-test',
      title: 'Test',
      cards: [
        {
          type: 'phrase',
          ge_text: 'გи',
          ru_meaning: 'meaning',
          topic: 'topic',
        },
      ],
    },
    'ep-test',
  );

  assert.equal(episode?.cards[0]?.type, 'word');
  assert.equal(episode?.cards[0]?.ge_text, 'გი');
});

test('resolveStudyEpisode ignores malformed cached cards', () => {
  const storage = new MemoryStorage();
  storage.setItem(
    RAW_CONTENT_KEY,
    JSON.stringify({
      episodes: [
        {
          id: 'ep1',
          title: 'Cached',
          cards: [
            { type: 'word', ge_text: 'სახლი', ru_meaning: 'дом' },
            { type: 'word', ge_text: '', ru_meaning: 'empty ge' },
            { type: 'word', ru_meaning: 'missing ge' },
            null,
          ],
        },
      ],
    }),
  );
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: { localStorage: storage },
  });

  const episode = resolveStudyEpisode(null, 'ep1');

  assert.equal(episode?.title, 'Cached');
  assert.equal(episode?.cards.length, 1);
  assert.equal(episode?.cards[0]?.type, 'word');
  assert.equal(episode?.cards[0]?.ge_text, 'სახლი');
  assert.equal(episode?.cards[0]?.ru_meaning, 'дом');
});

test('resolveStudyEpisode prefers bundled order over equally sized stale cache', () => {
  const storage = new MemoryStorage();
  storage.setItem(
    RAW_CONTENT_KEY,
    JSON.stringify({
      episodes: [
        {
          id: 'en-ep1',
          title: 'Cached',
          letters: ['A', 'T', 'E', 'S', 'O'],
          cards: [
            { type: 'word', ge_text: 'Eat toast', ru_meaning: 'ешь тост' },
            { type: 'word', ge_text: 'at', ru_meaning: 'у' },
          ],
        },
      ],
    }),
  );
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: { localStorage: storage },
  });

  const episode = resolveStudyEpisode(
    {
      id: 'en-ep1',
      title: 'Bundled',
      letters: ['A', 'T', 'E', 'S', 'O'],
      cards: [
        { type: 'word', ge_text: 'at', ru_meaning: 'у' },
        { type: 'word', ge_text: 'Eat toast', ru_meaning: 'ешь тост' },
      ],
    },
    'en-ep1',
  );

  assert.equal(episode?.title, 'Bundled');
  assert.equal(getStudyDeckCards(episode)[0]?.ge_text, 'at');
  assert.equal(getStudyDeckCards(episode).at(-1)?.ge_text, 'Eat toast');
});

test('getStudyDeckCards returns flashcard-compatible cards only', () => {
  const cards = getStudyDeckCards({
    id: 'ep',
    title: 'Episode',
    cards: [
      { type: 'letter', ge_text: 'ა', ru_meaning: 'ани' },
      { type: 'word', ge_text: 'კი', ru_meaning: 'да' },
    ],
  });

  assert.equal(cards.length, 2);
});

test('getStudyDeckCards preserves manual pronunciation hints', () => {
  const cards = getStudyDeckCards({
    id: 'en-ep',
    title: 'English',
    letters: ['T', 'E'],
    cards: [
      { type: 'word', ge_text: 'tea', ru_meaning: 'чай', translit: 'ти' },
      { type: 'word', ge_text: 'eat', ru_meaning: 'есть', translit: 'ит' },
    ],
  });

  assert.equal(cards[0]?.translit, 'ти');
  assert.equal(cards[1]?.translit, 'ит');
});
