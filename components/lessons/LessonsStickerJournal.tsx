'use client';

import Image from 'next/image';
import type { CourseId } from '@/lib/courses';

const STICKER_POOL = Array.from({ length: 10 }, (_, i) => `/images/cats/deda-sticker-${i + 1}.png`);

const costumeByCourse: Record<CourseId, string> = {
  ka: '/images/cats/deda-cost-ka.png',
  en: '/images/cats/deda-cost-en.png',
  es: '/images/cats/deda-cost-es.png',
  de: '/images/cats/deda-cost-de.png',
  sr: '/images/cats/deda-cost-sr.png',
  tr: '/images/cats/deda-cost-tr.png',
};

export function LessonsStickerJournal({
  courseId,
  episodeIds,
  masteredEpisodeIds,
}: {
  courseId: CourseId;
  episodeIds: string[];
  masteredEpisodeIds: string[];
}) {
  if (episodeIds.length === 0) return null;

  const mastered = new Set(masteredEpisodeIds);
  const lastIndex = episodeIds.length - 1;
  const collected = episodeIds.filter((id) => mastered.has(id)).length;
  const finalCat = costumeByCourse[courseId] ?? costumeByCourse.ka;

  return (
    <section className="lessons-journal mx-auto mt-4 w-full max-w-[900px] px-[clamp(18px,4.4vw,36px)] [@media(max-width:700px)]:mt-3">
      <div className="scrapbook-card rounded-[22px] px-[clamp(14px,2.4vw,22px)] py-[clamp(14px,2vw,18px)]">
        <div className="flex items-center justify-between gap-2">
          <span className="scrapbook-eyebrow inline-block -rotate-1">журнал котиков</span>
          <span className="text-[12px] font-semibold text-[var(--text-secondary)]">
            {collected} из {episodeIds.length}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-[clamp(7px,1.6vw,10px)]">
          {episodeIds.map((id, i) => {
            const isFinal = i === lastIndex;
            const src = isFinal ? finalCat : STICKER_POOL[i % STICKER_POOL.length];
            const revealed = mastered.has(id);
            const rotation = (i % 2 === 0 ? -1 : 1) * 4;

            return (
              <div
                key={id}
                className={`journal-slot ${isFinal ? 'journal-slot--final' : ''} ${revealed ? 'journal-slot--on' : ''}`}
                title={isFinal ? `Урок ${i + 1} · финал в костюме` : `Урок ${i + 1}`}
              >
                <Image
                  src={src}
                  alt=""
                  width={90}
                  height={90}
                  className={`journal-cat ${revealed ? 'journal-cat--on' : 'journal-cat--off'}`}
                  style={{ transform: revealed ? `rotate(${rotation}deg)` : 'none' }}
                />
                {isFinal && !revealed && (
                  <span className="journal-final-star" aria-hidden="true">★</span>
                )}
              </div>
            );
          })}
        </div>

        <p className="mt-2.5 text-[12px] leading-snug text-[var(--text-tertiary)]">
          Проходи уроки — наклеивай котиков. Последний ждёт в национальном костюме!
        </p>
      </div>
    </section>
  );
}
