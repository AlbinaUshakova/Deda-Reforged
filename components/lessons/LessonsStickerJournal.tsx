'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { CourseId } from '@/lib/courses';

// Последовательность дня: зарядка → пробежка → тренировка → готовит →
// цветок → коробка → скейт → игра → чтение ночью → сон
const ACH_SEQUENCE = [1, 2, 6, 8, 5, 3, 7, 9, 4, 10];
const ACH_POOL = ACH_SEQUENCE.map((n) => `/images/cats/deda-ach-${n}.png`);

const costumeByCourse: Record<CourseId, string> = {
  ka: '/images/cats/deda-cost-ka.png',
  en: '/images/cats/deda-cost-en.png',
  es: '/images/cats/deda-cost-es.png',
  de: '/images/cats/deda-cost-de.png',
  sr: '/images/cats/deda-cost-sr.png',
  tr: '/images/cats/deda-cost-tr.png',
  fr: '/images/cats/deda-cost-fr.png',
};

type ZoomBadge = { src: string; label: string; isFinal: boolean };

export function LessonsStickerJournal({
  courseId,
  episodeIds,
  masteredEpisodeIds,
  lessonTargetScore,
}: {
  courseId: CourseId;
  episodeIds: string[];
  masteredEpisodeIds: string[];
  lessonTargetScore: number;
}) {
  const [zoom, setZoom] = useState<ZoomBadge | null>(null);

  if (episodeIds.length === 0) return null;

  const mastered = new Set(masteredEpisodeIds);
  const lastIndex = episodeIds.length - 1;
  const collected = episodeIds.filter((id) => mastered.has(id)).length;
  const finalCat = costumeByCourse[courseId] ?? costumeByCourse.ka;
  // самая свежая открытая ачивка (последняя пройденная по порядку) — её покачаем
  let recentIndex = -1;
  episodeIds.forEach((id, i) => {
    if (mastered.has(id)) recentIndex = i;
  });
  const remaining = episodeIds.length - collected;
  const message =
    collected === 0
      ? 'Проходи уроки — собирай котика Deda за разными занятиями.'
      : collected === episodeIds.length
        ? '😺 Весь альбом котика Deda собран — даже финальное фото в национальном костюме!'
        : remaining === 1
          ? 'Осталось одно фото — котик Deda в национальном костюме!'
          : `😺 Уже ${collected} в альбоме! Осталось ${remaining}.`;
  const unlockRule = `Открывается за ${lessonTargetScore} очков в игре урока.`;

  return (
    <section className="lessons-journal mx-auto mt-4 w-full max-w-[900px] px-[clamp(18px,4.4vw,36px)] [@media(max-width:700px)]:mt-3">
      <div className="rounded-[24px] border border-[var(--border-soft)] bg-white px-[clamp(18px,3.2vw,34px)] py-[clamp(16px,2.6vw,22px)] shadow-[0_10px_30px_rgba(31,28,23,0.07)]">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
            Фотоальбом котика Deda
          </span>
          <span className="text-[12px] font-semibold text-[var(--text-secondary)]">
            {collected} из {episodeIds.length}
          </span>
        </div>

        <div className="mt-3 grid grid-cols-5 gap-[clamp(7px,1.8vw,11px)] sm:grid-cols-8">
          {episodeIds.map((id, i) => {
            const isFinal = i === lastIndex;
            const revealed = mastered.has(id);
            const label = isFinal ? `Урок ${i + 1} · национальный костюм` : `Урок ${i + 1}`;

            if (!revealed) {
              return (
                <div
                  key={id}
                  className={`ach-badge ach-badge--locked ${isFinal ? 'ach-badge--final' : ''}`}
                  title={isFinal ? `Урок ${i + 1} — финал в костюме, ещё закрыт` : `Урок ${i + 1} — пройди, чтобы открыть котика`}
                >
                  <span className="ach-badge-q" aria-hidden="true">{isFinal ? '★' : '?'}</span>
                </div>
              );
            }

            const src = isFinal ? finalCat : ACH_POOL[i % ACH_POOL.length];
            const isRecent = i === recentIndex;

            return (
              <button
                key={id}
                type="button"
                onClick={() => setZoom({ src, label, isFinal })}
                className={`ach-badge ach-badge--on ${isFinal ? 'ach-badge--final' : ''} ${isRecent ? 'ach-badge--recent' : ''} cursor-pointer focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--menu-focus)] focus-visible:outline-offset-2`}
                aria-label={`${label} — увеличить`}
                title={label}
              >
                <Image
                  src={src}
                  alt=""
                  width={132}
                  height={132}
                  className={isFinal ? 'ach-badge-img ach-badge-img--contain' : 'ach-badge-img'}
                />
              </button>
            );
          })}
        </div>

        <p className="mt-2.5 text-[12px] font-medium leading-snug text-[var(--text-secondary)]">
          {message}
        </p>
        <p className="mt-1 text-[11px] leading-snug text-[var(--text-tertiary)]">
          {unlockRule}
        </p>
      </div>

      {zoom && (
        <div
          className="fixed inset-0 z-[300] grid place-items-center bg-black/50 p-6 backdrop-blur-sm"
          onClick={() => setZoom(null)}
          role="dialog"
          aria-modal="true"
          aria-label={zoom.label}
        >
          <div
            className="relative flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`grid place-items-center overflow-hidden rounded-full bg-white shadow-[0_24px_60px_rgba(0,0,0,0.35)] ${zoom.isFinal ? 'p-4' : ''}`}
              style={{ width: 'min(76vw, 320px)', height: 'min(76vw, 320px)' }}
            >
              <Image
                src={zoom.src}
                alt=""
                width={480}
                height={480}
                unoptimized
                className={zoom.isFinal ? 'h-full w-full object-contain' : 'h-full w-full object-cover'}
              />
            </div>
            <div className="mt-3 rounded-full bg-white/90 px-4 py-1.5 text-[13px] font-semibold text-[var(--text-primary)]">
              {zoom.label}
            </div>
            <button
              type="button"
              onClick={() => setZoom(null)}
              className="mt-3 rounded-full bg-white/20 px-4 py-1.5 text-[13px] font-medium text-white transition hover:bg-white/30"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
