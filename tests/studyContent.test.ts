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
