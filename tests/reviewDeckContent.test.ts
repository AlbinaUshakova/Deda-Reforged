import test from 'node:test';
import assert from 'node:assert/strict';

import { listEpisodes, loadEpisode } from '../lib/content.ts';

test('mixed review cards retain their source lesson', async () => {
  const episode = await loadEpisode('all', 'ka');

  assert.ok(episode);
  assert.ok(episode.cards.length > 0);
  assert.ok(episode.cards.every(card => /^ep\d+[a-z]*$/i.test(card.source_episode_id ?? '')));
  assert.ok(episode.cards.some(card => card.source_episode_id === 'ep1'));
  assert.ok(episode.cards.some(card => card.source_episode_id === 'ep2'));
});

test('lesson list card counts match the compact decks used for review', async () => {
  const episodes = await listEpisodes('ka');

  for (const item of episodes.filter(episode => /^ep(?:1|2|2b)$/i.test(episode.id))) {
    const episode = await loadEpisode(item.id, 'ka');
    assert.equal(item.cardCount, episode?.cards.length, item.id);
  }
});
