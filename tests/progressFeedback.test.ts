import assert from 'node:assert/strict';
import test from 'node:test';
import {
  getLessonProgressGuidance,
  getLessonProgressSummary,
} from '../lib/progressFeedback.ts';

test('progress feedback moves from instruction to unlocked lesson to completion', () => {
  assert.equal(getLessonProgressSummary({
    score: 0,
    targetScore: 25,
    hasNextLesson: true,
    interfaceLanguage: 'ru',
  }), undefined);
  assert.equal(getLessonProgressGuidance({
    score: 0,
    targetScore: 25,
    hasNextLesson: true,
    surface: 'play',
    interfaceLanguage: 'ru',
  }), '5 очков открывают следующий урок.');
  assert.equal(getLessonProgressSummary({
    score: 5,
    targetScore: 25,
    hasNextLesson: true,
    interfaceLanguage: 'ru',
  }), 'Следующий урок открыт');
  assert.equal(getLessonProgressSummary({
    score: 25,
    targetScore: 25,
    hasNextLesson: true,
    interfaceLanguage: 'ru',
  }), 'Урок пройден');
});

test('final lesson never promises a next lesson', () => {
  assert.equal(getLessonProgressSummary({
    score: 5,
    targetScore: 25,
    hasNextLesson: false,
    interfaceLanguage: 'ru',
  }), undefined);
  assert.equal(getLessonProgressGuidance({
    score: 5,
    targetScore: 25,
    hasNextLesson: false,
    surface: 'play',
    interfaceLanguage: 'ru',
  }), 'Продолжай практику, чтобы завершить урок.');
});
