'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { useAppStore } from '@/lib/appStore';

export default function StudyPageActions({
  playHref,
  lessonLabel,
  courseProgressLabel,
  progressSummary,
  nextLessonHref,
  manageHref,
}: {
  playHref: Route;
  lessonLabel?: string;
  courseProgressLabel?: string;
  progressSummary?: string;
  nextLessonHref?: Route;
  manageHref?: Route;
}) {
  const interfaceLanguage = useAppStore(state => state.settings.interfaceLanguage);

  return (
    <div className="study-panel study-context-panel relative z-30 mb-3 mx-auto w-full max-w-[980px] rounded-[24px] border border-white/70 bg-white/72 px-[clamp(14px,2vw,22px)] py-[clamp(12px,1.8vw,18px)] shadow-[0_16px_38px_rgba(31,28,23,0.08)] backdrop-blur-[14px]">
      <div className="study-panel-main relative flex min-h-[52px] flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="study-panel-copy min-w-0">
          <div className="study-panel-topline flex flex-wrap items-center justify-between gap-2 lg:hidden">
            <div className="study-panel-mobile-copy min-w-0">
              {lessonLabel && (
                <div className="study-panel-label text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--accent)]">
                  {lessonLabel}
                </div>
              )}
            </div>
            <div className="study-panel-actions topButtons study-page-actions flex flex-wrap justify-end gap-2">
              <Link
                className="study-action-pill study-action-pill--secondary"
                href="/lessons"
                aria-label={interfaceLanguage === 'en' ? 'Back to lessons' : 'Вернуться на главную страницу уроков'}
              >
                <span aria-hidden="true">←</span>
                {interfaceLanguage === 'en' ? 'Home' : 'Главная'}
              </Link>
              <Link
                className="study-action-pill study-action-pill--primary"
                href={playHref}
                aria-label={interfaceLanguage === 'en' ? 'Open the game for this lesson' : 'Перейти к игре по этому уроку'}
              >
                <span aria-hidden="true">▶</span>
                {interfaceLanguage === 'en' ? 'Practice' : 'Практика'}
              </Link>
              {nextLessonHref && (
                <Link
                  className="study-action-pill study-action-pill--secondary"
                  href={nextLessonHref}
                  aria-label={interfaceLanguage === 'en' ? 'Open the next lesson' : 'Открыть следующий урок'}
                >
                  <span aria-hidden="true">→</span>
                  {interfaceLanguage === 'en' ? 'Next lesson' : 'Дальше'}
                </Link>
              )}
              {manageHref && (
                <Link
                  className="study-action-pill study-action-pill--secondary"
                  href={manageHref}
                  aria-label={interfaceLanguage === 'en' ? 'Manage personal cards' : 'Изменить личные карточки'}
                >
                  <span aria-hidden="true">✎</span>
                  {interfaceLanguage === 'en' ? 'Manage' : 'Изменить'}
                </Link>
              )}
            </div>
          </div>
          {lessonLabel && (
            <div className="study-panel-label hidden text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--accent)] lg:block">
              {lessonLabel}
            </div>
          )}
          {courseProgressLabel && (
            <div className="study-panel-progress-copy mt-1 hidden text-[13px] font-medium text-[var(--text-secondary)] lg:block">
              {courseProgressLabel}
            </div>
          )}
          {progressSummary && (
            <div className="study-panel-summary mt-2 hidden items-center rounded-full bg-[rgba(255,107,53,0.10)] px-3 py-1 text-[12px] font-semibold text-[var(--accent)] lg:inline-flex">
              {progressSummary}
            </div>
          )}
        </div>
        <div className="study-panel-actions topButtons study-page-actions ml-auto hidden flex-wrap justify-end gap-2 lg:pr-[112px] lg:flex">
          <Link
            className="study-action-pill study-action-pill--secondary"
            href="/lessons"
            aria-label={interfaceLanguage === 'en' ? 'Back to lessons' : 'Вернуться на главную страницу уроков'}
          >
            <span aria-hidden="true">←</span>
            {interfaceLanguage === 'en' ? 'Home' : 'Главная'}
          </Link>
          <Link
            className="study-action-pill study-action-pill--primary"
            href={playHref}
            aria-label={interfaceLanguage === 'en' ? 'Open the game for this lesson' : 'Перейти к игре по этому уроку'}
          >
            <span aria-hidden="true">▶</span>
            {interfaceLanguage === 'en' ? 'Practice' : 'Практика'}
          </Link>
          {nextLessonHref && (
            <Link
              className="study-action-pill study-action-pill--secondary"
              href={nextLessonHref}
              aria-label={interfaceLanguage === 'en' ? 'Open the next lesson' : 'Открыть следующий урок'}
            >
              <span aria-hidden="true">→</span>
              {interfaceLanguage === 'en' ? 'Next lesson' : 'Дальше'}
            </Link>
          )}
          {manageHref && (
            <Link
              className="study-action-pill study-action-pill--secondary"
              href={manageHref}
              aria-label={interfaceLanguage === 'en' ? 'Manage personal cards' : 'Изменить личные карточки'}
            >
              <span aria-hidden="true">✎</span>
              {interfaceLanguage === 'en' ? 'Manage' : 'Изменить'}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
