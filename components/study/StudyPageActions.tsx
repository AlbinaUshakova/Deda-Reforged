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
        <div className="topButtons study-page-actions ml-auto flex flex-wrap justify-end gap-2 lg:pr-[112px]">
          <Link
            className="study-action-pill study-action-pill--secondary"
            href="/lessons"
            aria-label="Вернуться на главную страницу уроков"
          >
            <span aria-hidden="true">←</span>
            Главная
          </Link>
          <Link
            className="study-action-pill study-action-pill--primary"
            href={playHref}
            aria-label="Перейти к игре по этому уроку"
          >
            <span aria-hidden="true">▶</span>
            Играть
          </Link>
        </div>
      </div>
    </div>
  );
}
