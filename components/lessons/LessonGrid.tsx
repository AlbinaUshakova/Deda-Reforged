'use client';

import Link from 'next/link';
import type { MouseEvent, Ref } from 'react';
import { toGeorgianMtavruli } from '@/lib/georgianAlphabet';
import type { LessonListItem, LessonStatus } from '@/lib/lessonProgress';

export function LessonGrid({
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
  allLessonsSpecial,
  allLessonsReady,
}: {
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
  allLessonsSpecial?: LessonListItem;
  allLessonsReady: boolean;
}) {
  return (
    <div className="relative z-[150] mx-auto w-full max-w-[980px] [@media(max-height:980px)]:max-w-[900px]">
      <div className="grid grid-cols-3 [@media(max-width:700px)]:grid-cols-2 gap-x-[clamp(10px,1.35vw,20px)] [@media(max-width:700px)]:gap-x-3 gap-y-[clamp(8px,1vw,15px)] [@media(max-width:700px)]:gap-y-4 [@media(max-height:980px)]:gap-y-3 justify-center">
        {normalEpisodes.map((ep, i) => {
          const best = progress[ep.id] ?? 0;
          const letters = lettersByEp[ep.id] ?? [];
          const progressRatio = Math.min(best / lessonTargetScore, 1);
          const progressPercent = Math.round(progressRatio * 100);
          const status = statusById[ep.id];
          const isRecommended = status === 'current';
          const progressTone = `home-progress-fill--${status ?? 'unknown'}`;

          return (
            <div
              key={ep.id}
              className="relative w-full min-w-0 [@media(max-width:700px)]:mx-auto [@media(max-width:700px)]:max-w-[296px]"
            >
              <Link href={`/study/${ep.id}`} legacyBehavior>
                <a
                  ref={ep.id === recommendedEpId ? recommendedLessonRef : null}
                  className={`lesson-card home-lesson-card ${best >= lessonTargetScore ? 'home-lesson-card--complete' : ''} ${status === 'current' ? 'home-lesson-card--current' : ''} ${status === 'locked' ? 'home-lesson-card--locked' : ''} relative grid w-full aspect-[2/1] [@media(max-width:560px)]:aspect-[2.1/0.92] grid-rows-[auto_1fr_auto] overflow-hidden rounded-2xl bg-white border border-slate-200 px-[clamp(10px,1.4vw,18px)] [@media(max-width:560px)]:px-[7px] pt-[clamp(6px,0.8vw,10px)] [@media(max-width:560px)]:pt-[4px] pb-[clamp(10px,1.2vw,14px)] [@media(max-width:560px)]:pb-[7px] transition-all duration-200 ease-out shadow-[0_8px_18px_rgba(15,23,42,0.09)] ${status !== 'locked' ? 'lesson-card--interactive hover:z-30 hover:border-slate-300 hover:bg-[#fafbfd]' : 'cursor-not-allowed'}`}
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
                    <span className="home-lesson-title text-[13px] [@media(max-width:900px)]:text-[11px] [@media(max-width:560px)]:text-[10px] font-normal text-slate-700">Урок {i + 1}</span>
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

                  <div className="row-start-2 mx-auto flex h-full min-h-0 w-full -translate-y-[8px] [@media(max-width:1200px)]:-translate-y-[4px] [@media(max-width:900px)]:translate-y-0 flex-wrap content-center justify-center gap-0.5 sm:gap-1 overflow-visible px-2 [@media(max-width:560px)]:px-1 py-1.5 [@media(max-width:560px)]:py-1 text-center">
                    {letters.map((ch) => (
                      <div
                        key={ch}
                        className={`home-lesson-letter home-lesson-letter--${status ?? 'unknown'} flex flex-col items-center`}
                      >
                        <span
                          className="block leading-none tracking-[0.015em]"
                          style={{
                            fontSize: `${lessonLetterSizePx}px`,
                            fontFamily:
                              "'Noto Sans Georgian','DejaVu Sans',system-ui,sans-serif",
                          }}
                        >
                          {toGeorgianMtavruli(ch)}
                        </span>
                      </div>
                    ))}
                    {!letters.length && (
                      <span className="text-xs text-slate-400">
                        без новых букв
                      </span>
                    )}
                  </div>

                  <div className="z-10 row-start-3 justify-self-start self-end w-[40%] max-w-[144px] min-w-[96px] [@media(max-width:480px)]:w-[34%] [@media(max-width:480px)]:max-w-[108px] [@media(max-width:480px)]:min-w-[72px] translate-y-[6px] [@media(max-width:480px)]:translate-y-[4px]">
                    <div className="flex items-center gap-2 [@media(max-width:480px)]:gap-1">
                      <div className="home-progress-bg h-[4px] [@media(max-width:480px)]:h-[3px] flex-1 rounded-[4px] bg-slate-200 overflow-hidden">
                        <div
                          className={`home-progress-fill h-full rounded-full transition-all ${progressTone}`}
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                      <span className="home-progress-score text-[clamp(10px,1vw,12px)] text-slate-500 whitespace-nowrap">{best}/{lessonTargetScore}</span>
                    </div>
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

        {allLessonsSpecial && (
          <div className="hidden [@media(max-width:700px)]:block relative w-full min-w-0 [@media(max-width:700px)]:mx-auto [@media(max-width:700px)]:max-w-[296px]">
            <Link href={`/study/${allLessonsSpecial.id}`} legacyBehavior>
              <a
                className={`lesson-card home-lesson-card relative grid w-full aspect-[2/1] [@media(max-width:560px)]:aspect-[2.1/0.92] grid-rows-[auto_1fr_auto] overflow-hidden rounded-2xl border px-[clamp(10px,1.4vw,18px)] [@media(max-width:560px)]:px-[7px] pt-[clamp(6px,0.8vw,10px)] [@media(max-width:560px)]:pt-[4px] pb-[clamp(10px,1.2vw,14px)] [@media(max-width:560px)]:pb-[7px] transition-all duration-200 ease-out shadow-[0_8px_18px_rgba(15,23,42,0.09)] ${
                  allLessonsReady
                    ? 'bg-[#E6ECFF] border-[#d4defd] text-[var(--text-secondary)] lesson-card--interactive hover:z-30 hover:border-[#c5d4ff] hover:bg-[#edf2ff] hover:text-[var(--text-primary)]'
                    : 'bg-white border-slate-200 text-slate-400 cursor-not-allowed opacity-60'
                }`}
                onClick={(e) => {
                  if (!allLessonsReady) e.preventDefault();
                }}
                aria-disabled={!allLessonsReady}
                title={!allLessonsReady ? 'Сначала набери минимум 1 очко в каждом уроке' : undefined}
              >
                {!allLessonsReady && (
                  <div className="home-lesson-status-icon" aria-hidden="true">
                    <span className="home-lesson-status home-lesson-status--locked opacity-90">🔒</span>
                  </div>
                )}

                <div className="row-start-2 mx-auto flex h-full min-h-0 w-full items-center justify-center px-2 [@media(max-width:560px)]:px-1 py-1 text-center">
                  <span className="text-[clamp(16px,1.7vw,22px)] [@media(max-width:560px)]:text-[14px] font-medium leading-[1.15] tracking-[-0.01em]">
                    {allLessonsSpecial.title.replace(/^⭐\s*/, '')}
                  </span>
                </div>
              </a>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
