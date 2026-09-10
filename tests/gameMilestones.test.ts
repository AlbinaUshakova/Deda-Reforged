import test from 'node:test';
import assert from 'node:assert/strict';
import { crossedLessonUnlockScore } from '../lib/gameMilestones.ts';

test('lesson unlock is announced only when the score crosses the threshold', () => {
  assert.equal(crossedLessonUnlockScore({
    previousBest: 4,
    nextBest: 5,
    unlockScore: 5,
    hasNextLesson: true,
  }), true);

  assert.equal(crossedLessonUnlockScore({
    previousBest: 5,
    nextBest: 6,
    unlockScore: 5,
    hasNextLesson: true,
  }), false);
});

test('lesson unlock is not announced when there is no next lesson', () => {
  assert.equal(crossedLessonUnlockScore({
    previousBest: 4,
    nextBest: 5,
    unlockScore: 5,
    hasNextLesson: false,
  }), false);
});
