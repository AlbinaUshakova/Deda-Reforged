import test from 'node:test';
import assert from 'node:assert/strict';

import { listEpisodes, loadEpisode, loadNewLettersPerEpisode } from '../lib/content.ts';

test('listEpisodes returns lessons plus special sections', async () => {
  const episodes = await listEpisodes();

  assert.equal(episodes[0]?.id, 'ep1');
  assert.equal(episodes[8]?.id, 'ep9');
  assert.ok(episodes.some((episode) => episode.id === 'favorites'));
  assert.ok(episodes.some((episode) => episode.id === 'all'));
  assert.ok(episodes.some((episode) => episode.id === 'phrases'));
});

test('loadEpisode returns normalized phrases episode', async () => {
  const episode = await loadEpisode('phrases');

  assert.ok(episode);
  assert.equal(episode.id, 'phrases');
  assert.ok(episode.cards.length > 0);
  assert.ok(episode.cards.every((card) => !card.ge_text.includes('и')));
});

test('loadNewLettersPerEpisode returns letters for each numbered lesson', async () => {
  const lettersByEpisode = await loadNewLettersPerEpisode();

  assert.ok(Array.isArray(lettersByEpisode.ep1));
  assert.ok(Array.isArray(lettersByEpisode.ep9));
});
