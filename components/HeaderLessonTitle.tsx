'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/lib/appStore';

type HeaderRoute = {
  episodeId: string;
  fallbackTitle: string;
};

function getKnownFallbackTitle(episodeId: string, interfaceLanguage: 'ru' | 'en'): string {
  const match = episodeId.match(/^ep(\d+)$/i);
  if (match) return interfaceLanguage === 'en' ? `Lesson ${match[1]}` : `Урок ${match[1]}`;
  if (episodeId === 'favorites') return interfaceLanguage === 'en' ? 'Saved words' : 'Сохраненные слова';
  if (episodeId === 'all') return interfaceLanguage === 'en' ? 'Review deck' : 'Повторение';
  if (episodeId === 'phrases') return interfaceLanguage === 'en' ? 'Phrase pack' : 'Набор фраз';
  if (episodeId === 'custom') return interfaceLanguage === 'en' ? 'My cards' : 'Мои карточки';
  return '';
}

function getHeaderRoute(pathname: string, interfaceLanguage: 'ru' | 'en'): HeaderRoute | null {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length < 2) return null;

  const section = parts[0];
  const episodeId = decodeURIComponent(parts[1] || '');
  if (!episodeId) return null;

  if (section !== 'play' && section !== 'study' && section !== 'blocks') {
    return null;
  }

  return {
    episodeId,
    fallbackTitle: getKnownFallbackTitle(episodeId, interfaceLanguage),
  };
}

export default function HeaderLessonTitle() {
  const pathname = usePathname();
  const courseId = useAppStore(state => state.settings.courseId);
  const interfaceLanguage = useAppStore(state => state.settings.interfaceLanguage);
  const route = useMemo(() => getHeaderRoute(pathname, interfaceLanguage), [interfaceLanguage, pathname]);
  const [resolvedTitle, setResolvedTitle] = useState('');

  useEffect(() => {
    if (!route) {
      setResolvedTitle('');
      return;
    }

    setResolvedTitle(route.fallbackTitle);
    if (route.fallbackTitle) return;

    let cancelled = false;
    const episodeId = route.episodeId;

    async function resolveEpisodeTitle() {
      try {
        const response = await fetch(
          `/api/content/episode?id=${encodeURIComponent(episodeId)}&course=${encodeURIComponent(courseId)}`,
          { cache: 'no-store' },
        );
        if (!response.ok) return;

        const data = (await response.json()) as {
          episode?: { title?: unknown };
        };
        const title = typeof data.episode?.title === 'string'
          ? data.episode.title.trim()
          : '';

        if (!cancelled) {
          setResolvedTitle(title);
        }
      } catch {
        if (!cancelled) {
          setResolvedTitle('');
        }
      }
    }

    void resolveEpisodeTitle();

    return () => {
      cancelled = true;
    };
  }, [courseId, route]);

  const title = resolvedTitle;

  if (!title) return null;

  return (
    <div className="pointer-events-none flex h-full items-center justify-center">
      <h1 className="header-lesson-title max-w-[58vw] truncate text-center text-[clamp(1rem,1.55vw,1.4rem)] font-semibold leading-none tracking-[-0.01em] text-slate-700">
        {title}
      </h1>
    </div>
  );
}
