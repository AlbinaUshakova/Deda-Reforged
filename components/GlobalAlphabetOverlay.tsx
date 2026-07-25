'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/lib/appStore';
import {
  readAlphabetStatusCache,
  writeAlphabetStatusCache,
} from '@/lib/alphabetProgressCache';
import { getEpisodesDataCached } from '@/lib/clientContentCache';
import { deriveLessonState, type AlphabetLetterStatus } from '@/lib/lessonProgress';
import {
  getCourse,
  getLetterKind,
  getLetterSoundLabel,
  getLetterSpeechLang,
  getLetterSpeechText,
} from '@/lib/courses';
import { playLetterAudio, stopLetterAudioPlayback } from '@/lib/playLetterAudio';
import { letterToHint, type TransliterationMode } from '@/lib/transliteration';

const alphabetLetterColorByStatus: Record<AlphabetLetterStatus, string> = {
  mastered: 'text-[var(--progress-good)]',
  almost: 'text-[var(--progress-low)]',
  current: 'text-[var(--progress-current)]',
  locked: 'text-[var(--text-tertiary)]',
  unknown: 'text-[var(--ui-accent)]',
};

export default function GlobalAlphabetOverlay() {
  const pathname = usePathname();
  const isLessonsPage = pathname === '/lessons';
  const isStudyPage = pathname.startsWith('/study/');
  const isGamePage = pathname.startsWith('/play/');
  const isServicePage = pathname === '/support' || pathname === '/privacy';
  const hydrate = useAppStore(state => state.hydrate);
  const progress = useAppStore(state => state.progressMap);
  const courseId = useAppStore(state => state.settings.courseId);
  const transliterationMode = useAppStore(state => state.settings.transliterationMode) as TransliterationMode;
  const course = getCourse(courseId);
  const letterFontClass = courseId === 'ka' ? 'alphabet-letter--georgian' : 'alphabet-letter--latin';
  const visibleAlphabetSections = course.alphabetSections.filter(section => section.title !== 'Запомни отдельно');
  const alphabetColumnCount = Math.max(
    1,
    ...visibleAlphabetSections.flatMap(section => section.rows.map(row => row.length)),
  );
  const lessonTargetScore = useAppStore(state => state.settings.lessonTargetScore);
  const alphabetToggleRequest = useAppStore(state => state.alphabetToggleRequest);
  const profileMenuOpen = useAppStore(state => state.profileMenuOpen);
  const setAlphabetOpen = useAppStore(state => state.setAlphabetOpen);
  const [open, setOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const [letterStatusByChar, setLetterStatusByChar] = useState<Record<string, AlphabetLetterStatus>>({});
  const [playingLetter, setPlayingLetter] = useState<string | null>(null);
  const playingTimerRef = useRef<number | null>(null);
  const handledAlphabetToggleRef = useRef(alphabetToggleRequest);

  useEffect(() => {
    if (isLessonsPage) return;
    if (handledAlphabetToggleRef.current === alphabetToggleRequest) return;
    handledAlphabetToggleRef.current = alphabetToggleRequest;
    if (pathname === '/') return;
    setOpen(v => !v);
  }, [alphabetToggleRequest, isLessonsPage, pathname]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);


  useEffect(() => {
    return () => {
      if (playingTimerRef.current !== null) {
        window.clearTimeout(playingTimerRef.current);
        playingTimerRef.current = null;
      }
      stopLetterAudioPlayback();
    };
  }, []);

  useEffect(() => {
    if (isLessonsPage) return;
    if (profileMenuOpen) {
      setOpen(false);
    }
  }, [isLessonsPage, profileMenuOpen]);

  useEffect(() => {
    setAlphabetOpen(!isLessonsPage && !isServicePage && open && pathname !== '/');
  }, [isLessonsPage, isServicePage, open, pathname, setAlphabetOpen]);

  useEffect(() => {
    if (isLessonsPage) return;
    if (pathname === '/' || !open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (overlayRef.current && !overlayRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isLessonsPage, open, pathname]);

  useEffect(() => {
    if (isLessonsPage || isStudyPage || isGamePage || pathname === '/') return;
    void hydrate();
  }, [hydrate, isGamePage, isLessonsPage, isStudyPage, pathname]);

  useEffect(() => {
    if (isLessonsPage || isStudyPage || isGamePage || pathname === '/') return;
    let cancelled = false;

    const load = async (forceRefresh = false) => {
      const cachedLetterStatusByChar = readAlphabetStatusCache(courseId);
      setLetterStatusByChar(cachedLetterStatusByChar);

      const { episodes, lettersByEpisode } = await getEpisodesDataCached(forceRefresh, courseId);
      if (cancelled) return;
      const courseProgress = Object.fromEntries(
        Object.entries(progress).flatMap(([key, value]) => {
          if (courseId === 'ka') return [[key, value]];
          const prefix = `${courseId}:`;
          return key.startsWith(prefix) ? [[key.slice(prefix.length), value]] : [];
        }),
      );

      const { letterStatusByChar } = deriveLessonState({
        episodes,
        progress: courseProgress,
        lessonTargetScore,
        lettersByEpisode,
        cachedLetterStatusByChar,
      });
      setLetterStatusByChar(letterStatusByChar);
      try {
        writeAlphabetStatusCache(letterStatusByChar, courseId);
      } catch { }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [courseId, isGamePage, isLessonsPage, isStudyPage, lessonTargetScore, pathname, progress]);

  const speakLetter = (letter: string) => {
    if (typeof window === 'undefined') return;
    setPlayingLetter(letter);
    if (playingTimerRef.current !== null) {
      window.clearTimeout(playingTimerRef.current);
      playingTimerRef.current = null;
    }
    const finish = () => {
      if (playingTimerRef.current !== null) {
        window.clearTimeout(playingTimerRef.current);
        playingTimerRef.current = null;
      }
      setPlayingLetter(prev => (prev === letter ? null : prev));
    };

    void playLetterAudio({
      audioSrc: course.letterAudioMap[letter],
      fallbackText: getLetterSpeechText(letter, courseId),
      speechLang: getLetterSpeechLang(courseId),
      onEnd: finish,
      onError: finish,
    });

    playingTimerRef.current = window.setTimeout(finish, 1600);
  };

  if (pathname === '/' || isLessonsPage || isServicePage) return null;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-label={`Алфавит: ${course.scriptTitleNative}`}
      aria-hidden={!open}
      className={`fixed bottom-2 left-2 z-[140] w-[min(300px,92vw)] max-h-[52vh] overflow-y-auto rounded-[20px] border border-slate-200/80 bg-white/95 px-3 pb-3 pt-2 shadow-[0_16px_40px_rgba(31,28,23,0.18)] backdrop-blur-md transition-all duration-200 ease-out sm:bottom-3 sm:left-3 sm:w-[300px] ${open
        ? 'translate-y-0 opacity-100'
        : 'pointer-events-none translate-y-2 select-none opacity-0'
        }`}
    >
        <div className="mb-1 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="truncate text-[13px] font-semibold text-[var(--text-primary)]">{course.scriptTitleNative}</div>
            <div className="text-[11px] text-[var(--text-secondary)]">нажми — послушай</div>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="home-alphabet-close grid h-8 w-8 shrink-0 place-items-center rounded-full text-[14px] text-[var(--text-secondary)] transition-colors hover:bg-black/5 focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--menu-focus)] focus-visible:outline-offset-2"
            aria-label="Закрыть панель алфавита"
            title="Закрыть панель алфавита"
          >
            ✕
          </button>
        </div>
        <div className="mx-auto mt-1 flex w-full max-w-[260px] flex-col gap-y-2">
          {visibleAlphabetSections.map((section) => {
            return (
              <section
                key={`alphabet-section-${section.title}`}
                className="min-w-0"
              >
                <div className="flex flex-col gap-y-[clamp(1px,0.45vw,4px)]">
                  {section.rows.map((row, rowIdx) => (
                    <div
                      key={`alphabet-row-${section.title}-${rowIdx}`}
                      className="grid gap-x-[clamp(2px,0.6vw,5px)] gap-y-[clamp(2px,0.6vw,5px)]"
                      style={{
                        gridTemplateColumns: `repeat(${alphabetColumnCount}, minmax(0, 1fr))`,
                      }}
                    >
                      {row.map(ch => {
                        const soundLabel = getLetterSoundLabel(ch, courseId);
                        const letterKind = getLetterKind(ch, courseId);
                        const readingHint = letterToHint(ch, transliterationMode, courseId) || ch;
                        const audioLabel = courseId === 'en'
                          ? `Прослушать название буквы ${ch}`
                          : `Прослушать произношение буквы ${ch}`;
                        const isHighlightedLetter = course.alphabetHighlightedLetters?.includes(ch) ?? false;

                        return (
                          <button
                            key={ch}
                            type="button"
                            onClick={() => speakLetter(ch)}
                            className={`home-alphabet-key home-alphabet-key--${letterKind} ${isHighlightedLetter ? 'home-alphabet-key--highlighted' : ''} rounded-lg border border-slate-200/75 bg-white/90 py-[3px] text-center shadow-sm hover:bg-slate-50 transition-all ${playingLetter === ch ? 'home-alphabet-key--active' : ''
                              }`}
                            title={`Озвучить букву ${ch}. Звучит как: ${soundLabel}`}
                            aria-label={audioLabel}
                          >
                            <div className={`home-alphabet-letter ${letterFontClass} translate-y-[-1px] leading-none`}>{ch}</div>
                            <div className="home-alphabet-translit mt-[2px] leading-none">{String(readingHint).toLowerCase()}</div>
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
    </div>
  );
}
