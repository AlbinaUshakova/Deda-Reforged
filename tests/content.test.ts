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

test('loadEpisode generates short Russian variants for хочу and нужен answers', async () => {
  const lessonWithWant = await loadEpisode('ep9');
  const phrases = await loadEpisode('phrases');

  assert.ok(lessonWithWant);
  assert.ok(phrases);

  const water = lessonWithWant.cards.find((card) => card.ge_text === 'მე მინდა წყალი');
  assert.ok(water);
  assert.ok(water.accepted_ru?.includes('хочу воду'));

  const doctor = phrases.cards.find((card) => card.ge_text === 'ექიმი მჭირდება');
  assert.ok(doctor);
  assert.ok(doctor.accepted_ru?.some((answer) => answer.toLowerCase() === 'нужен врач'));
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

test('non-Georgian courses load separate lessons without Georgian phrases section', async () => {
  for (const courseId of ['sr', 'tr'] as const) {
    const episodes = await listEpisodes(courseId);
    const ids = episodes.map((episode) => episode.id);

    assert.ok(ids.includes('ep1'), `${courseId} should include ep1`);
    assert.ok(ids.includes('all'), `${courseId} should include all lessons`);
    assert.ok(ids.includes('favorites'), `${courseId} should include favorites`);
    assert.ok(!ids.includes('phrases'), `${courseId} should not include Georgian phrases`);
  }
});

test('Serbian and Turkish numbered lessons contain 15 cards each', async () => {
  for (const courseId of ['sr', 'tr'] as const) {
    const episodes = await listEpisodes(courseId);
    const numberedLessons = episodes.filter((episode) => /^ep\d+$/.test(episode.id));

    assert.ok(numberedLessons.length > 0);

    for (const episode of numberedLessons) {
      const content = await loadEpisode(episode.id, courseId);

      assert.ok(content);
      assert.equal(content.cards.length, 15, `${courseId}:${episode.id} should contain 15 cards`);
    }
  }
});

test('Serbian and Turkish lesson cards use only current and previous lesson letters', async () => {
  for (const courseId of ['sr', 'tr'] as const) {
    const lettersByEpisode = await loadNewLettersPerEpisode(courseId);
    const seen = new Set<string>();

    for (const episodeId of Object.keys(lettersByEpisode).sort()) {
      for (const letter of lettersByEpisode[episodeId]) {
        seen.add(letter);
        seen.add(letter.toLocaleLowerCase(courseId));
      }

      const episode = await loadEpisode(episodeId, courseId);
      assert.ok(episode);

      for (const card of episode.cards) {
        for (const character of card.ge_text.replace(/\s|-/g, '')) {
          assert.ok(
            seen.has(character),
            `${courseId}:${episodeId}: ${card.ge_text} uses unopened letter ${character}`,
          );
        }
      }
    }
  }
});
