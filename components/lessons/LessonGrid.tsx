'use client';

import Link from 'next/link';
import type { MouseEvent, Ref } from 'react';
import { useAppStore } from '@/lib/appStore';
import type { CourseId } from '@/lib/courses';
import { LESSON_UNLOCK_SCORE, type LessonListItem, type LessonStatus } from '@/lib/lessonProgress';
import { getDisplayText, type TransliterationMode } from '@/lib/transliteration';

function getLessonSymbolSize(symbol: string, baseSizePx: number) {
  return Math.max(14, baseSizePx - Math.max(0, symbol.length - 1) * 5);
}

function plural(count: number, one: string, few: string, many: string): string {
  const lastTwo = Math.abs(count) % 100;
  const last = Math.abs(count) % 10;
  if (lastTwo >= 11 && lastTwo <= 14) return many;
  if (last === 1) return one;
  if (last >= 2 && last <= 4) return few;
  return many;
}

export function LessonGrid({
  courseId,
  normalEpisodes,
  progress,
  lettersByEp,
  lessonTargetScore,
  lessonLetterSizePx,
  transliterationMode,
  statusById,
  recommendedEpId,
  recommendedLessonRef,
  lockedLessonTooltipEpId,
  onScheduleLockedLessonTooltip,
  onHideLockedLessonTooltip,
  onLockedLessonClick,
}: {
  courseId: CourseId;
  normalEpisodes: LessonListItem[];
  progress: Record<string, number>;
  lettersByEp: Record<string, string[]>;
  lessonTargetScore: number;
  lessonLetterSizePx: number;
  transliterationMode: TransliterationMode;
  statusById: Record<string, LessonStatus>;
  recommendedEpId?: string;
  recommendedLessonRef: Ref<HTMLAnchorElement>;
  lockedLessonTooltipEpId: string | null;
  onScheduleLockedLessonTooltip: (episodeId: string) => void;
  onHideLockedLessonTooltip: () => void;
  onLockedLessonClick: (episodeId: string, event: MouseEvent<HTMLAnchorElement>) => void;
}) {
  const interfaceLanguage = useAppStore(state => state.settings.interfaceLanguage);
  return (
    <div className="relative z-[150] mx-auto w-full max-w-[1160px]">
      <div className="lessons-shelf flex gap-3 overflow-x-auto snap-x snap-mandatory pb-3 pt-1 -mx-[clamp(18px,4.4vw,36px)] px-[clamp(18px,4.4vw,36px)]">
        {normalEpisodes.map((ep, i) => {
          const best = progress[ep.id] ?? 0;
          const letters = lettersByEp[ep.id] ?? [];
          const visualSymbols = letters.map((letter) => getDisplayText(letter, transliterationMode, courseId));
          const earnedPoints = Math.min(Math.max(best, 0), lessonTargetScore);
          const progressRatio = Math.min(best / lessonTargetScore, 1);
          const progressPercent = Math.round(progressRatio * 100);
          const status = statusById[ep.id];
          const isRecommended = status === 'current';
          const previousLessonTitle = i > 0
            ? (interfaceLanguage === 'en' ? `lesson ${i}` : `урока ${i}`)
            : (interfaceLanguage === 'en' ? 'the previous lesson' : 'предыдущего урока');
          const progressTone = `home-progress-fill--${status ?? 'unknown'}`;
          const hasVisualSymbols = visualSymbols.length > 0;
          const statusLabel =
            status === 'mastered'
              ? (interfaceLanguage === 'en' ? 'Done' : 'Готово')
              : status === 'current'
                ? best > 0
                  ? (interfaceLanguage === 'en' ? 'Continue' : 'Продолжить')
                  : (interfaceLanguage === 'en' ? 'Start' : 'Начать')
                : status === 'almost'
                  ? (interfaceLanguage === 'en' ? 'Review' : 'Закрепить')
                  : undefined;
          const lockedLabel =
            status === 'locked'
              ? interfaceLanguage === 'en'
                    ? `After ${previousLessonTitle}`
                    : `После ${previousLessonTitle}`
              : undefined;

          return (
            <div
              key={ep.id}
              className="relative shrink-0 snap-start w-[clamp(180px,74vw,212px)]"
            >
              <Link href={`/study/${ep.id}`} legacyBehavior>
                <a
                  ref={ep.id === recommendedEpId ? recommendedLessonRef : null}
                  className={`lesson-card home-lesson-card ${best >= lessonTargetScore ? 'home-lesson-card--complete' : ''} ${status === 'current' ? 'home-lesson-card--current' : ''} ${status === 'locked' ? 'home-lesson-card--locked' : ''} relative flex w-full flex-col gap-2 min-h-[128px] [@media(max-width:560px)]:min-h-[100px] overflow-hidden rounded-[20px] bg-white border border-slate-200 p-[clamp(12px,1.4vw,16px)] [@media(max-width:560px)]:p-3.5 transition-all duration-200 ease-out shadow-[0_8px_18px_rgba(15,23,42,0.075)] ${status !== 'locked' ? 'lesson-card--interactive hover:z-30 hover:border-slate-300 hover:bg-[#fafbfd]' : 'cursor-not-allowed'}`}
                  onMouseEnter={() => {
                    if (status !== 'locked') return;
                    onScheduleLockedLessonTooltip(ep.id);
                  }}
                  onMouseLeave={() => {
                    if (status !== 'locked') return;
                    onHideLockedLessonTooltip();
                  }}
                  onFocus={() => {
                    if (status !== 'locked') return;
                    onScheduleLockedLessonTooltip(ep.id);
                  }}
                  onBlur={() => {
                    if (status !== 'locked') return;
                    onHideLockedLessonTooltip();
                  }}
                  onClick={(event) => {
                    if (status === 'locked') {
                      onLockedLessonClick(ep.id, event);
                    }
                  }}
                  aria-disabled={status === 'locked'}
                >
                  <div className="z-10 flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <span className={`home-lesson-badge home-lesson-badge--${status ?? 'unknown'}`} aria-hidden="true">
                        {status === 'mastered'
                          ? '✓'
                          : status === 'current'
                            ? '🐾'
                            : status === 'locked'
                              ? '🔒'
                              : '•'}
                      </span>
                      <span className="flex min-w-0 flex-col text-left">
                        <span className="home-lesson-title text-[13px] [@media(max-width:560px)]:text-[12px] font-medium text-slate-700">
                          {interfaceLanguage === 'en' ? `Lesson ${i + 1}` : `Урок ${i + 1}`}
                        </span>
                        {statusLabel && (
                          <span className="home-lesson-state-label">{statusLabel}</span>
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="mx-auto flex min-h-0 w-full flex-1 flex-wrap content-center items-center justify-center gap-0.5 sm:gap-1 overflow-visible px-2 [@media(max-width:560px)]:px-1 text-center">
                    {hasVisualSymbols && (
                      <div className="flex w-full flex-col items-center justify-center gap-1">
                        <div className="flex flex-wrap items-center justify-center gap-0.5 sm:gap-1">
                          {visualSymbols.map((ch) => (
                            <div
                              key={ch}
                              className={`home-lesson-letter home-lesson-letter--${status ?? 'unknown'} flex flex-col items-center`}
                            >
                              <span
                                className="block leading-[1.05] tracking-[0.015em] pb-[3px]"
                                style={{
                                  fontSize: `${getLessonSymbolSize(ch, lessonLetterSizePx)}px`,
                                  fontFamily: courseId === 'ka' ? 'var(--font-georgian)' : 'var(--font-display)',
                                  fontWeight: courseId === 'ka' ? 650 : 720,
                                  letterSpacing: courseId === 'ka' ? '-0.005em' : '-0.022em',
                                }}
                              >
                                {ch}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {!hasVisualSymbols && (
                      <span className="max-w-[86%] text-[clamp(15px,1.65vw,22px)] font-medium leading-[1.08] tracking-[-0.035em] text-slate-800">
                        {ep.title}
                      </span>
                    )}
                  </div>

                  <div className="z-10 mt-auto w-full">
                    {status === 'locked' ? (
                      <div className="home-lesson-lock-copy">{lockedLabel}</div>
                    ) : (
                      <div className="home-lesson-progress-block">
                        <div className="home-progress-bg h-[4px] [@media(max-width:480px)]:h-[3px] flex-1 rounded-[4px] bg-slate-200 overflow-hidden">
                          <div
                            className={`home-progress-fill h-full rounded-full transition-all ${progressTone}`}
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                        <span className="home-progress-score">
                          {interfaceLanguage === 'en'
                            ? `${earnedPoints}/${lessonTargetScore} points`
                            : `${earnedPoints}/${lessonTargetScore} очков`}
                        </span>
                      </div>
                    )}
                  </div>
                  {status === 'locked' && lockedLessonTooltipEpId === ep.id && (
                    <div className="locked-lesson-tooltip pointer-events-none absolute left-1/2 top-1/2 z-40 -translate-x-1/2 -translate-y-1/2 text-center">
                      <span
                        aria-hidden="true"
                        className="locked-lesson-tooltip-arrow absolute left-1/2 top-0 h-0 w-0 -translate-x-1/2 -translate-y-[5px] border-l-[5px] border-r-[5px] border-b-[5px] border-l-transparent border-r-transparent"
                      />
                      <span>
                        {interfaceLanguage === 'en' ? (
                          <>
                            Score <span className="font-semibold text-[var(--progress-current)]">{LESSON_UNLOCK_SCORE} points</span>
                            <br />
                            in the previous lesson
                            <br />
                            to unlock this one.
                          </>
                        ) : (
                          <>
                            Наберите <span className="font-semibold text-[var(--progress-current)]">{LESSON_UNLOCK_SCORE} очков</span>
                            <br />
                            в предыдущем уроке,
                            <br />
                            чтобы открыть этот.
                          </>
                        )}
                      </span>
                    </div>
                  )}
                  {isRecommended && <span className="sr-only">{interfaceLanguage === 'en' ? 'Recommended lesson' : 'Рекомендуемый урок'}</span>}
                </a>
              </Link>
            </div>
          );
        })}

      </div>
    </div>
  );
}
