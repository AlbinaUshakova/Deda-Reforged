'use client';

import Link from 'next/link';
import type { Route } from 'next';

export default function StudyPageActions({
  playHref,
}: {
  playHref: Route;
}) {
  return (
    <div className="relative z-30 mb-2 mx-auto w-full max-w-[980px]">
      <div className="relative flex min-h-[52px] items-center justify-end">
        <div className="topButtons ml-auto flex flex-wrap justify-end gap-2 lg:pr-[112px]">
          <Link
            className="play-tab--secondary inline-flex items-center justify-center rounded-xl border border-slate-300 bg-transparent px-3.5 sm:px-4 max-[1000px]:px-3 py-2 max-[1000px]:py-1.5 text-sm max-[1000px]:text-xs font-medium text-[var(--text-secondary)] shadow-sm transition-all duration-200 hover:border-slate-400 hover:bg-white/70 hover:text-[var(--text-primary)]"
            href="/lessons"
          >
            Главная
          </Link>
          <Link
            className="play-tab--secondary inline-flex items-center justify-center rounded-xl border border-slate-300 bg-transparent px-3.5 sm:px-4 max-[1000px]:px-3 py-2 max-[1000px]:py-1.5 text-sm max-[1000px]:text-xs font-medium text-[var(--text-secondary)] shadow-sm transition-all duration-200 hover:border-slate-400 hover:bg-white/70 hover:text-[var(--text-primary)]"
            href={playHref}
          >
            Играть
          </Link>
        </div>
      </div>
    </div>
  );
}
