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

test('loadEpisode returns 100 practical conversational phrases', async () => {
  const episode = await loadEpisode('phrases');

  assert.ok(episode);
  assert.equal(episode.cards.length, 100);
  assert.ok(episode.cards.every((card) => card.type === 'word'));
  assert.ok(episode.cards.every((card) => /[\u10D0-\u10FF]/.test(card.ge_text)));
  assert.ok(episode.cards.every((card) => card.ru_meaning.trim().length > 0));
});

test('loadEpisode marks fill-in conversational templates as non-playable', async () => {
  const episode = await loadEpisode('phrases');

  assert.ok(episode);
  const templates = episode.cards.filter((card) => card.ru_meaning.includes('...'));
  assert.ok(templates.length > 0);
  assert.ok(templates.every((card) => card.playable === false));
});

test('loadEpisode generates short Russian variants for у меня есть answers', async () => {
  const episode = await loadEpisode('ep4');

  assert.ok(episode);
  const tea = episode.cards.find((card) => card.ge_text === 'მე მაქვს ჩაი');
  assert.ok(tea);
  assert.ok(tea.accepted_ru?.includes('есть чай'));
});

test('loadEpisode favorites includes conversational phrases', async () => {
  const episode = await loadEpisode('favorites');

  assert.ok(episode);
  assert.equal(episode.id, 'favorites');
  assert.ok(episode.cards.some((card) => card.ge_text === 'გამარჯობა'));
});

test('loadNewLettersPerEpisode returns letters for each numbered lesson', async () => {
  const lettersByEpisode = await loadNewLettersPerEpisode();

  assert.ok(Array.isArray(lettersByEpisode.ep1));
  assert.ok(Array.isArray(lettersByEpisode.ep9));
});
