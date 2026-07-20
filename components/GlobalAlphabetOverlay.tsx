'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/lib/appStore';
import {
  readAlphabetStatusCache,
  writeAlphabetStatusCache,
} from '@/lib/alphabetProgressCache';
import { geLetterToHint } from '@/lib/transliteration';
import { getEpisodesDataCached } from '@/lib/clientContentCache';
import { deriveLessonState, type AlphabetLetterStatus } from '@/lib/lessonProgress';
import { geLetterAudioMap } from '@/lib/georgianLetterAudio';
import { playLetterAudio, stopLetterAudioPlayback } from '@/lib/playLetterAudio';

const GEORGIAN_ALPHABET = [
  'ა', 'ბ', 'გ', 'დ', 'ე', 'ვ', 'ზ', 'თ', 'ი', 'კ', 'ლ',
  'მ', 'ნ', 'ო', 'პ', 'ჟ', 'რ', 'ს', 'ტ', 'უ', 'ფ', 'ქ',
  'ღ', 'ყ', 'შ', 'ჩ', 'ც', 'ძ', 'წ', 'ჭ', 'ხ', 'ჯ', 'ჰ',
];

const GEORGIAN_ALPHABET_ROWS = [
  GEORGIAN_ALPHABET.slice(0, 6),
  GEORGIAN_ALPHABET.slice(6, 12),
  GEORGIAN_ALPHABET.slice(12, 18),
  GEORGIAN_ALPHABET.slice(18, 24),
  GEORGIAN_ALPHABET.slice(24, 30),
  GEORGIAN_ALPHABET.slice(30),
];

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
  const hydrate = useAppStore(state => state.hydrate);
  const progress = useAppStore(state => state.progressMap);
  const lessonTargetScore = useAppStore(state => state.settings.lessonTargetScore);
  const transliterationMode = useAppStore(state => state.settings.transliterationMode);
  const alphabetToggleRequest = useAppStore(state => state.alphabetToggleRequest);
  const profileMenuOpen = useAppStore(state => state.profileMenuOpen);
  const setAlphabetOpen = useAppStore(state => state.setAlphabetOpen);
  const canAutoOpenAlphabet = () =>
    typeof window !== 'undefined' &&
    (window.matchMedia?.('(min-width: 1440px) and (min-height: 760px)').matches ?? false);
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
    if (isLessonsPage) return;
    const nextOpen =
      pathname !== '/' &&
      !pathname.startsWith('/play/') &&
      canAutoOpenAlphabet();
    setOpen(nextOpen);
  }, [isLessonsPage, pathname]);

  useEffect(() => {
    if (isLessonsPage) return;
    const onResize = () => {
      if (!canAutoOpenAlphabet()) {
        setOpen(false);
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [isLessonsPage]);

  useEffect(() => {
    setAlphabetOpen(!isLessonsPage && open && pathname !== '/');
  }, [isLessonsPage, open, pathname, setAlphabetOpen]);

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
    if (isLessonsPage || isStudyPage || pathname === '/') return;
    void hydrate();
  }, [hydrate, isLessonsPage, isStudyPage, pathname]);

  useEffect(() => {
    if (isLessonsPage || isStudyPage || pathname === '/') return;
    let cancelled = false;

    const load = async (forceRefresh = false) => {
      const cachedLetterStatusByChar = readAlphabetStatusCache();
      setLetterStatusByChar(cachedLetterStatusByChar);

      const { episodes, lettersByEpisode } = await getEpisodesDataCached(forceRefresh);
      if (cancelled) return;

      const { letterStatusByChar } = deriveLessonState({
        episodes,
        progress,
        lessonTargetScore,
        lettersByEpisode,
        cachedLetterStatusByChar,
      });
      setLetterStatusByChar(letterStatusByChar);
      try {
        writeAlphabetStatusCache(letterStatusByChar);
      } catch {}
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [isLessonsPage, isStudyPage, lessonTargetScore, pathname, progress]);

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
      audioSrc: geLetterAudioMap[letter],
      fallbackText: letter,
      onEnd: finish,
      onError: finish,
    });

    playingTimerRef.current = window.setTimeout(finish, 1600);
  };

  if (pathname === '/' || isLessonsPage) return null;

  return (
    <div
      ref={overlayRef}
      className={`block fixed left-2 sm:left-3 md:left-4 top-[68px] z-[140] w-[clamp(184px,31vw,244px)] transition-all duration-200 ease-out ${
        open
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 -translate-y-1 scale-[0.98] pointer-events-none select-none'
      }`}
      aria-hidden={!open}
    >
      <div className="home-alphabet-panel max-h-[calc(100dvh-102px)] overflow-y-auto rounded-[clamp(20px,3vw,30px)] border border-slate-200/75 bg-gradient-to-b from-[#f6f8fe]/88 via-[#f1f4fc]/86 to-[#edf1f9]/84 px-[clamp(7px,1.2vw,10px)] pt-[clamp(5px,0.8vw,7px)] pb-[clamp(4px,0.7vw,6px)] shadow-[0_6px_14px_rgba(15,23,42,0.09)]">
        <div className="flex items-center justify-between gap-2">
          <h3 className="home-alphabet-title text-sm font-medium tracking-[-0.01em] text-slate-700">ანბანი</h3>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="home-alphabet-close relative top-px h-6 w-6 rounded-md text-[11px] transition-colors focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--menu-focus)] focus-visible:outline-offset-2"
            aria-label="Скрыть алфавит"
            title="Скрыть алфавит"
          >
            ✕
          </button>
        </div>
        <div className="mt-px flex items-center gap-1.5 text-[clamp(9px,1.55vw,11px)] text-[var(--text-secondary)]">
          <span className="relative inline-flex h-1.5 w-1.5" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#aab8ff] opacity-45" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#aab8ff]" />
          </span>
          <span>Нажми букву, чтобы услышать, как она звучит</span>
        </div>
        <div className="mt-1 flex flex-col gap-y-[clamp(1px,0.45vw,4px)]">
          {GEORGIAN_ALPHABET_ROWS.map((row, rowIdx) => (
            <div
              key={`alphabet-row-${rowIdx}`}
              className={row.length === 6 ? 'grid grid-cols-6 gap-x-[clamp(3px,0.8vw,7px)]' : 'grid grid-cols-3 gap-x-[clamp(3px,0.8vw,7px)] mx-auto w-[calc(50%-4px)]'}
            >
              {row.map(ch => (
                <button
                  key={ch}
                  type="button"
                  onClick={() => speakLetter(ch)}
                  className={`home-alphabet-key rounded-lg border border-slate-200/75 bg-white/90 py-[3px] text-center shadow-sm hover:bg-slate-50 transition-all ${
                    playingLetter === ch ? 'home-alphabet-key--active' : ''
                  }`}
                  title={`Озвучить букву ${ch}`}
                  aria-label={`Озвучить букву ${ch}`}
                >
                  <div className="home-alphabet-letter translate-y-[-1px] text-[clamp(14px,2.7vw,19px)] leading-none text-black">{ch}</div>
                  <div className="home-alphabet-translit mt-[2px] text-[clamp(6px,1.2vw,8px)] leading-none text-slate-400">{geLetterToHint(ch, transliterationMode)}</div>
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
