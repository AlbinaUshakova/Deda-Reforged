'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { useEffect, useMemo } from 'react';

const CONFETTI_COLORS = ['#ff6b35', '#22c55e', '#facc15', '#5a95e6', '#8b82f1', '#ff9f1c'];

export function LessonPassedCelebration({
  onDone,
  interfaceLanguage = 'ru',
  nextLessonHref,
}: {
  onDone: () => void;
  interfaceLanguage?: 'ru' | 'en';
  nextLessonHref?: Route;
}) {
  useEffect(() => {
    const timer = setTimeout(onDone, 3600);
    return () => clearTimeout(timer);
  }, [onDone]);

  const pieces = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        left: Math.round(Math.random() * 100),
        delay: Math.round(Math.random() * 60) / 100,
        duration: Math.round((2.2 + Math.random() * 1.4) * 100) / 100,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        size: 6 + Math.round(Math.random() * 7),
      })),
    [],
  );

  return (
    <div className="lesson-celebrate" role="status" aria-live="polite">
      <div className="lesson-celebrate-confetti" aria-hidden="true">
        {pieces.map((p, i) => (
          <span
            key={i}
            className="lesson-celebrate-piece"
            style={{
              left: `${p.left}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              background: p.color,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          />
        ))}
      </div>
      <div className="lesson-celebrate-card">
        <div className="lesson-celebrate-emoji" aria-hidden="true">🎉</div>
        <div className="lesson-celebrate-title">
          {interfaceLanguage === 'en' ? 'Lesson complete!' : 'Урок пройден!'}
        </div>
        <div className="lesson-celebrate-sub">
          {nextLessonHref
            ? (interfaceLanguage === 'en'
              ? 'Nice. You can open the next lesson right away.'
              : 'Отлично. Можно сразу открыть следующий урок.')
            : (interfaceLanguage === 'en'
              ? 'Nice. Keep practicing or go back to the lessons.'
              : 'Отлично. Можно ещё попрактиковаться или вернуться к урокам.')}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {nextLessonHref && (
            <Link href={nextLessonHref} className="btn-primary lesson-celebrate-btn">
              {interfaceLanguage === 'en' ? 'Next lesson' : 'Следующий урок'}
            </Link>
          )}
          <button type="button" className="btn-primary lesson-celebrate-btn" onClick={onDone}>
            {interfaceLanguage === 'en' ? 'Keep practicing' : 'Продолжить'}
          </button>
        </div>
        {!nextLessonHref && (
          <Link href={'/support-deda' as Route} className="mt-3 inline-flex text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--accent)]">
            {interfaceLanguage === 'en' ? 'Support the project' : 'Поддержать проект'}
          </Link>
        )}
      </div>
    </div>
  );
}
