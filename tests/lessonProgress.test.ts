import test from 'node:test';
import assert from 'node:assert/strict';
import { deriveLessonState } from '../lib/lessonProgress.ts';

test('deriveLessonState separates letter lessons from practical special sections', () => {
  const state = deriveLessonState({
    episodes: [
      { id: 'ep1', title: 'Урок 1' },
      { id: 'ep1b', title: 'Урок 2' },
      { id: 'ep2', title: 'Урок 2' },
      { id: 'ep3', title: 'Вежливые фразы', cardCount: 6 },
      { id: 'ep4', title: 'Помощь и самочувствие', cardCount: 3 },
      { id: 'favorites', title: 'Избранное' },
    ],
    progress: {
      ep3: 4,
    },
    lessonTargetScore: 25,
    lettersByEpisode: {
      ep1: ['A', 'M'],
      ep1b: ['E'],
      ep2: ['O'],
      ep3: [],
      ep4: [],
    },
    cachedLetterStatusByChar: {},
  });

  assert.deepEqual(state.normalEpisodes.map(episode => episode.id), ['ep1', 'ep1b', 'ep2']);
  assert.deepEqual(state.practicalSpecials.map(episode => episode.title), [
    'Вежливые фразы',
    'Помощь и самочувствие',
  ]);
  assert.equal(state.statusById.ep3, undefined);
  assert.equal(state.statusById.ep4, undefined);
  assert.equal(state.practicalSpecials[0]?.best, 4);
  assert.equal(state.practicalSpecials[1]?.best, 0);
});
