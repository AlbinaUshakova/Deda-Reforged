import test from 'node:test';
import assert from 'node:assert/strict';
import { LESSON_UNLOCK_SCORE, deriveLessonState, getLessonPosition } from '../lib/lessonProgress.ts';

test('getLessonPosition exposes a user-facing number for suffixed episode ids', () => {
  const episodes = [
    { id: 'ep1', title: 'Урок 1' },
    { id: 'ep2', title: 'Урок 2' },
    { id: 'ep2b', title: 'Урок 3' },
  ];

  assert.equal(getLessonPosition(episodes, 'ep2b'), 3);
});

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

test('deriveLessonState unlocks the next lesson at the configured score threshold', () => {
  const episodes = [
    { id: 'ep1', title: 'Урок 1' },
    { id: 'ep2', title: 'Урок 2' },
    { id: 'ep3', title: 'Урок 3' },
  ];
  const lettersByEpisode = {
    ep1: ['A'],
    ep2: ['B'],
    ep3: ['C'],
  };

  const lockedState = deriveLessonState({
    episodes,
    progress: { ep1: LESSON_UNLOCK_SCORE - 1 },
    lessonTargetScore: 25,
    lettersByEpisode,
    cachedLetterStatusByChar: {},
  });

  assert.equal(lockedState.unlockedById.ep1, true);
  assert.equal(lockedState.unlockedById.ep2, false);
  assert.equal(lockedState.recommendedEpId, 'ep1');
  assert.equal(lockedState.allLessonsReady, false);

  const unlockedState = deriveLessonState({
    episodes,
    progress: { ep1: LESSON_UNLOCK_SCORE },
    lessonTargetScore: 25,
    lettersByEpisode,
    cachedLetterStatusByChar: {},
  });

  assert.equal(unlockedState.unlockedById.ep2, true);
  assert.equal(unlockedState.statusById.ep2, 'current');
  assert.equal(unlockedState.recommendedEpId, 'ep2');
  assert.equal(unlockedState.allLessonsReady, true);
});
