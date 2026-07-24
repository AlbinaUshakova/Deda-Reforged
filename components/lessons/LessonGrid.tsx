'use client';

import Link from 'next/link';
import type { MouseEvent, Ref } from 'react';
import type { CourseId } from '@/lib/courses';
import type { LessonListItem, LessonStatus } from '@/lib/lessonProgress';

function getLessonSymbolSize(symbol: string, baseSizePx: number) {
  return Math.max(14, baseSizePx - Math.max(0, symbol.length - 1) * 5);
}

export function LessonGrid({
  courseId,
  normalEpisodes,
  progress,
  lettersByEp,
  lessonTargetScore,
  lessonLetterSizePx,
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
  statusById: Record<string, LessonStatus>;
  recommendedEpId?: string;
  recommendedLessonRef: Ref<HTMLAnchorElement>;
  lockedLessonTooltipEpId: string | null;
  onScheduleLockedLessonTooltip: (episodeId: string) => void;
  onHideLockedLessonTooltip: () => void;
  onLockedLessonClick: (episodeId: string, event: MouseEvent<HTMLAnchorElement>) => void;
}) {
  return (
    <div className="relative z-[150] mx-auto w-full max-w-[1160px] [@media(max-height:980px)]:max-w-[1040px]">
      <div className="grid grid-cols-3 [@media(max-width:900px)]:grid-cols-2 [@media(max-width:520px)]:grid-cols-1 gap-x-[clamp(10px,1.35vw,20px)] [@media(max-width:700px)]:gap-x-3 gap-y-[clamp(8px,1vw,15px)] [@media(max-width:700px)]:gap-y-4 [@media(max-height:980px)]:gap-y-3 justify-center">
        {normalEpisodes.map((ep, i) => {
          const best = progress[ep.id] ?? 0;
          const letters = lettersByEp[ep.id] ?? [];
          const visualSymbols = letters;
          const earnedPoints = Math.min(Math.max(best, 0), lessonTargetScore);
          const progressRatio = Math.min(best / lessonTargetScore, 1);
          const progressPercent = Math.round(progressRatio * 100);
          const status = statusById[ep.id];
          const isRecommended = status === 'current';
          const previousLessonTitle = i > 0 ? `урока ${i}` : 'предыдущего урока';
          const progressTone = `home-progress-fill--${status ?? 'unknown'}`;
          const hasVisualSymbols = visualSymbols.length > 0;
          const statusLabel =
            status === 'mastered'
              ? 'Пройдено'
              : status === 'current'
                ? best > 0 ? 'Продолжить' : 'Начать'
                : status === 'almost'
                  ? 'Доступен'
                  : `Откроется после ${previousLessonTitle}`;

          return (
            <div
              key={ep.id}
              className="relative w-full min-w-0 [@media(max-width:520px)]:mx-auto [@media(max-width:520px)]:max-w-[296px]"
            >
              <Link href={`/study/${ep.id}`} legacyBehavior>
                <a
                  ref={ep.id === recommendedEpId ? recommendedLessonRef : null}
                  className={`lesson-card home-lesson-card ${best >= lessonTargetScore ? 'home-lesson-card--complete' : ''} ${status === 'current' ? 'home-lesson-card--current' : ''} ${status === 'locked' ? 'home-lesson-card--locked' : ''} relative grid w-full aspect-[2.35/1] [@media(max-width:560px)]:aspect-[2.15/0.82] grid-rows-[auto_1fr_auto] overflow-hidden rounded-2xl bg-white border border-slate-200 px-[clamp(10px,1.25vw,16px)] [@media(max-width:560px)]:px-[7px] pt-[clamp(6px,0.75vw,9px)] [@media(max-width:560px)]:pt-[4px] pb-[clamp(8px,1vw,12px)] [@media(max-width:560px)]:pb-[7px] transition-all duration-200 ease-out shadow-[0_8px_18px_rgba(15,23,42,0.075)] ${status !== 'locked' ? 'lesson-card--interactive hover:z-30 hover:border-slate-300 hover:bg-[#fafbfd]' : 'cursor-not-allowed'}`}
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
                  <div className="z-10 row-start-1 justify-self-start self-start pl-3 -mt-[1px] text-left">
                    <span className="home-lesson-title text-[13px] [@media(max-width:900px)]:text-[11px] [@media(max-width:560px)]:text-[10px] font-normal text-slate-700">
                      Урок {i + 1}{isRecommended ? ' · Сейчас' : ''}
                    </span>
                    {status !== 'locked' && (
                      <span className="home-lesson-state-label">{statusLabel}</span>
                    )}
                  </div>
                  <div className="home-lesson-status-icon" aria-hidden="true">
                    {status === 'mastered' && (
                      <span className="home-lesson-status home-lesson-status--mastered">✓</span>
                    )}
                    {status === 'current' && (
                      <span className="home-lesson-status home-lesson-status--current">🐾</span>
                    )}
                    {status === 'almost' && (
                      <span className="home-lesson-status home-lesson-status--almost">•</span>
                    )}
                    {status === 'locked' && (
                      <span
                        className={`home-lesson-status home-lesson-status--locked transition-all duration-150 ${
                          lockedLessonTooltipEpId === ep.id ? 'opacity-100 brightness-110' : 'opacity-90'
                        }`}
                      >
                        🔒
                      </span>
                    )}
                  </div>

                  <div className="row-start-2 mx-auto flex h-full min-h-0 w-full -translate-y-[5px] [@media(max-width:1200px)]:-translate-y-[2px] [@media(max-width:900px)]:translate-y-0 flex-wrap content-center justify-center gap-0.5 sm:gap-1 overflow-visible px-2 [@media(max-width:560px)]:px-1 py-1 [@media(max-width:560px)]:py-0.5 text-center">
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

                  <div className="z-10 row-start-3 self-end w-full translate-y-[2px]">
                    {status === 'locked' ? (
                      <div className="home-lesson-lock-copy">{statusLabel}</div>
                    ) : (
                      <div className="home-lesson-progress-block">
                        <div className="home-progress-bg h-[4px] [@media(max-width:480px)]:h-[3px] flex-1 rounded-[4px] bg-slate-200 overflow-hidden">
                          <div
                            className={`home-progress-fill h-full rounded-full transition-all ${progressTone}`}
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                        <span className="home-progress-score">
                          {earnedPoints} из {lessonTargetScore} очков
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
                        Наберите <span className="font-semibold text-[var(--progress-current)]">1 очко</span>
                        <br />
                        в предыдущем уроке,
                        <br />
                        чтобы открыть этот.
                      </span>
                    </div>
                  )}
                  {isRecommended && <span className="sr-only">Рекомендуемый урок</span>}
                </a>
              </Link>
            </div>
          );
        })}

      </div>
    </div>
  );
}
