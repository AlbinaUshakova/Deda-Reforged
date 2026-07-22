'use client';

import Link from 'next/link';
import type { LessonListItem } from '@/lib/lessonProgress';

export function SpecialLessonLinks({
  allLessonsSpecial,
  favoritesSpecial,
  phrasesSpecial,
  allLessonsReady,
}: {
  allLessonsSpecial?: LessonListItem;
  favoritesSpecial?: LessonListItem;
  phrasesSpecial?: LessonListItem;
  allLessonsReady: boolean;
}) {
  if (!allLessonsSpecial && !favoritesSpecial && !phrasesSpecial) {
    return null;
  }

  return (
    <section className="relative z-[170] mt-4 min-[1512px]:mt-11 min-[1700px]:mt-12 [@media(max-height:980px)]:mt-8 flex justify-center max-w-6xl mx-auto">
      <div className="flex items-center justify-center gap-2.5 [@media(max-width:720px)]:gap-2 [@media(max-width:480px)]:gap-1.5">
        {allLessonsSpecial && (
          <Link href={`/study/${allLessonsSpecial.id}`} legacyBehavior>
            <a
              className={`home-special-btn h-9 min-w-[152px] px-3 text-[12px] [@media(max-width:900px)]:h-8 [@media(max-width:900px)]:min-w-[136px] [@media(max-width:900px)]:px-2.5 [@media(max-width:900px)]:text-[11px] [@media(max-width:720px)]:h-7.5 [@media(max-width:720px)]:min-w-[120px] [@media(max-width:720px)]:px-2 [@media(max-width:720px)]:text-[10px] [@media(max-width:700px)]:hidden rounded-2xl border flex items-center justify-center gap-1.5 transition-all duration-200 [@media(max-width:700px)]:shadow-[0_5px_12px_rgba(15,23,42,0.07)] ${
                allLessonsReady
                  ? 'bg-[#E6ECFF] border-[#d4defd] text-[#3B5BDB] shadow-[0_8px_18px_rgba(15,23,42,0.1)]'
                  : 'bg-white border-slate-200/80 text-slate-400 cursor-not-allowed opacity-60'
              }`}
              onClick={(e) => {
                if (!allLessonsReady) e.preventDefault();
              }}
              aria-disabled={!allLessonsReady}
              title={!allLessonsReady ? 'Сначала набери минимум 1 очко в каждом уроке' : undefined}
            >
              <span>{allLessonsSpecial.title.replace(/^⭐\s*/, '')}</span>
              {!allLessonsReady && <span aria-hidden>🔒</span>}
            </a>
          </Link>
        )}

        {favoritesSpecial && (
          <Link href={`/study/${favoritesSpecial.id}`} legacyBehavior>
            <a className="home-special-btn h-9 min-w-[152px] px-3 text-[12px] [@media(max-width:900px)]:h-8 [@media(max-width:900px)]:min-w-[136px] [@media(max-width:900px)]:px-2.5 [@media(max-width:900px)]:text-[11px] [@media(max-width:720px)]:h-7.5 [@media(max-width:720px)]:min-w-[120px] [@media(max-width:720px)]:px-2 [@media(max-width:720px)]:text-[10px] [@media(max-width:480px)]:min-w-[112px] [@media(max-width:480px)]:px-2 rounded-2xl border border-slate-200/80 bg-transparent text-[var(--text-secondary)] flex items-center justify-center gap-1.5 transition-all duration-200 hover:bg-[var(--button-hover)] hover:text-[var(--text-primary)] shadow-[0_8px_18px_rgba(15,23,42,0.1)] [@media(max-width:700px)]:shadow-[0_5px_12px_rgba(15,23,42,0.07)]">
              <span aria-hidden>⭐</span>
              <span>{favoritesSpecial.title.replace(/^⭐\s*/, '')}</span>
            </a>
          </Link>
        )}

        {phrasesSpecial && (
          <Link href={`/study/${phrasesSpecial.id}`} legacyBehavior>
            <a className="home-special-btn h-9 min-w-[152px] px-3 text-[12px] [@media(max-width:900px)]:h-8 [@media(max-width:900px)]:min-w-[136px] [@media(max-width:900px)]:px-2.5 [@media(max-width:900px)]:text-[11px] [@media(max-width:720px)]:h-7.5 [@media(max-width:720px)]:min-w-[120px] [@media(max-width:720px)]:px-2 [@media(max-width:720px)]:text-[10px] [@media(max-width:480px)]:min-w-[112px] [@media(max-width:480px)]:px-2 rounded-2xl border border-slate-200/80 bg-transparent text-[var(--text-secondary)] flex items-center justify-center gap-1.5 transition-all duration-200 hover:bg-[var(--button-hover)] hover:text-[var(--text-primary)] shadow-[0_8px_18px_rgba(15,23,42,0.1)] [@media(max-width:700px)]:shadow-[0_5px_12px_rgba(15,23,42,0.07)]">
              <span>{phrasesSpecial.title}</span>
            </a>
          </Link>
        )}
      </div>
    </section>
  );
}
