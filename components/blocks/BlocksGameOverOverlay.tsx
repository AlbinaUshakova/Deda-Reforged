'use client';

import Link from 'next/link';
import type { Route } from 'next';

type BlocksGameOverOverlayProps = {
  interfaceLanguage: 'ru' | 'en';
  studyHref?: Route;
  nextLessonHref?: Route;
  hasUnlockedNextLesson?: boolean;
  onRestart: () => void;
};

export function BlocksGameOverOverlay({
  interfaceLanguage,
  studyHref,
  nextLessonHref,
  hasUnlockedNextLesson = false,
  onRestart,
}: BlocksGameOverOverlayProps) {
  return (
    <div className="absolute inset-0 rounded-3xl flex items-center justify-center pointer-events-none">
      <div className="blocks-grid-gameover-overlay absolute inset-0 rounded-3xl" />
      <div className="blocks-grid-gameover-card pointer-events-auto relative mx-4 w-[min(100%,286px)] rounded-[24px] border border-white/80 bg-white px-5 py-4 text-center shadow-[0_16px_34px_rgba(15,23,42,0.16)]">
        <div className="blocks-grid-gameover-title text-slate-800 text-[19px] font-semibold tracking-[-0.02em]">
          {interfaceLanguage === 'en' ? 'No moves left' : 'Ходов больше нет'}
        </div>
        <div className="blocks-grid-gameover-text mt-1.5 text-[14px] leading-[1.3] text-slate-600">
          {hasUnlockedNextLesson
            ? (interfaceLanguage === 'en'
              ? 'Open the next lesson now or restart this practice.'
              : 'Можно перейти к следующему уроку или перезапустить эту практику.')
            : (interfaceLanguage === 'en'
              ? 'Restart this practice or go back to the cards.'
              : 'Перезапусти практику или вернись к карточкам.')}
        </div>
        <div className="mt-3 flex flex-col items-stretch gap-2">
          {hasUnlockedNextLesson && nextLessonHref && (
            <Link
              href={nextLessonHref}
              className="blocks-grid-gameover-button blocks-grid-gameover-button--primary inline-flex min-h-[42px] items-center justify-center rounded-2xl px-5 text-[15px] font-semibold"
            >
              {interfaceLanguage === 'en' ? 'Open next lesson' : 'Открыть следующий урок'}
            </Link>
          )}
          <button
            onClick={onRestart}
            className="blocks-grid-gameover-button inline-flex min-h-[42px] items-center justify-center rounded-2xl px-5 text-[15px] font-semibold"
          >
            {interfaceLanguage === 'en' ? 'Try again' : 'Сыграть снова'}
          </button>
          {studyHref && (
            <Link
              href={studyHref}
              className="blocks-grid-gameover-link"
            >
              {interfaceLanguage === 'en' ? 'Back to cards' : 'Вернуться к карточкам'}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
