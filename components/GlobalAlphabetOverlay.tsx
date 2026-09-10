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
  getLetterHint,
  getLetterSpeechLang,
  getLetterSpeechText,
} from '@/lib/courses';
import {
  getAlphabetAudioLabel,
  getAlphabetCloseLabel,
  getAlphabetDisplayTitle,
  getAlphabetInstruction,
  getAlphabetTitleLabel,
} from '@/lib/interfaceText';
import { playLetterAudio, stopLetterAudioPlayback } from '@/lib/playLetterAudio';
import { getDisplayText, type TransliterationMode } from '@/lib/transliteration';
import { getActiveTransliterationMode } from '@/lib/settings';

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
  const interfaceLanguage = useAppStore(state => state.settings.interfaceLanguage);
  const storedTransliterationMode = useAppStore(state => state.settings.transliterationMode);
  const transliterationMode = getActiveTransliterationMode(interfaceLanguage, courseId, storedTransliterationMode) as TransliterationMode;
  const course = getCourse(courseId);
  const letterFontClass = courseId === 'ka' ? 'alphabet-letter--georgian' : 'alphabet-letter--latin';
  const alphabetColumnCount = Math.max(
    1,
    ...course.alphabetRows.map(row => row.length),
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
      aria-label={getAlphabetTitleLabel(interfaceLanguage, course.scriptTitleNative)}
      aria-hidden={!open}
      className={`app-alphabet-overlay alphabet-compact fixed z-[140] w-[clamp(196px,40vw,260px)] overflow-y-auto rounded-[20px] border border-slate-200/80 bg-white/95 px-3 pb-3 pt-2 shadow-[0_16px_40px_rgba(31,28,23,0.18)] backdrop-blur-md transition-all duration-200 ease-out ${open
        ? 'translate-y-0 opacity-100'
        : 'pointer-events-none -translate-y-2 select-none opacity-0'
        }`}
    >
        <div className="mx-auto mt-2.5 flex w-full max-w-[224px] flex-col gap-y-2">
          {course.alphabetRows.map((row, rowIdx) => (
            <div
              key={`alphabet-row-${rowIdx}`}
              className="grid gap-x-[clamp(2px,0.6vw,5px)] gap-y-[clamp(2px,0.6vw,5px)]"
              style={{
                gridTemplateColumns: `repeat(${alphabetColumnCount}, minmax(0, 1fr))`,
              }}
            >
              {row.map(ch => {
                const visibleUppercase = getDisplayText(ch, transliterationMode, courseId);
                const soundHint = getLetterHint(ch, transliterationMode, courseId);
                const audioLabel = getAlphabetAudioLabel(interfaceLanguage, ch, courseId);
                const isVowel = course.vowels.includes(ch);
                const isCompositeSerbianLetter =
                  courseId === 'sr' && ['Lj', 'Nj', 'Dž'].includes(visibleUppercase);

                return (
                  <button
                    key={ch}
                    type="button"
                    onClick={() => speakLetter(ch)}
                    className={`home-alphabet-key home-alphabet-key--${isVowel ? 'vowel' : 'consonant'} ${isCompositeSerbianLetter ? 'home-alphabet-key--composite' : ''} rounded-lg border border-slate-200/75 bg-white/90 py-[4px] text-center shadow-sm hover:bg-slate-50 transition-all ${playingLetter === ch ? 'home-alphabet-key--active' : ''}`}
                    title={
                      interfaceLanguage === 'en'
                        ? `Play the name of the letter ${visibleUppercase}`
                        : `Прослушать название буквы ${visibleUppercase}`
                    }
                    aria-label={audioLabel}
                  >
                    <div className={`home-alphabet-letter ${letterFontClass} translate-y-[-1px] leading-none`}>{visibleUppercase}</div>
                    {soundHint && (
                      <div className="mt-[3px] truncate text-[9px] font-semibold leading-none text-[var(--text-tertiary)] sm:text-[10px]">
                        {soundHint}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
    </div>
  );
}
