'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { useAppStore } from '@/lib/appStore';

export default function StudyPageActions({
  playHref,
}: {
  playHref: Route;
}) {
  const interfaceLanguage = useAppStore(state => state.settings.interfaceLanguage);

  return (
    <div className="relative z-30 mb-2 mx-auto w-full max-w-[980px]">
      <div className="relative flex min-h-[52px] items-center justify-end">
        <div className="topButtons study-page-actions ml-auto flex flex-wrap justify-end gap-2 lg:pr-[112px]">
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
            {interfaceLanguage === 'en' ? 'Play' : 'Играть'}
          </Link>
        </div>
      </div>
    </div>
  );
}
