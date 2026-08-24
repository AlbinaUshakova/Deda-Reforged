'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/appStore';
import { getAlphabetAudioLabel, getAlphabetDisplayTitle, getAlphabetInstruction, getAlphabetLegend } from '@/lib/interfaceText';
import { getDisplayText } from '@/lib/transliteration';
import {
  getCourse,
  getLetterKind,
  getLetterSpeechLang,
  getLetterSpeechText,
} from '@/lib/courses';
import { playLetterAudio } from '@/lib/playLetterAudio';
import { getActiveTransliterationMode } from '@/lib/settings';

export default function LandingAlphabet() {
  const courseId = useAppStore(state => state.settings.courseId);
  const course = getCourse(courseId);
  const interfaceLanguage = useAppStore(state => state.settings.interfaceLanguage);
  const storedTransliterationMode = useAppStore(state => state.settings.transliterationMode);
  const transliterationMode = getActiveTransliterationMode(interfaceLanguage, courseId, storedTransliterationMode);
  const [playingLetter, setPlayingLetter] = useState<string | null>(null);
  const letterFontClass = courseId === 'ka' ? 'alphabet-letter--georgian' : 'alphabet-letter--latin';
  const hasVowels = course.vowels.length > 0;
  const alphabetColumnCount = Math.max(
    ...course.alphabetRows.map(row => row.length),
  );

  const speakLetter = (letter: string) => {
    setPlayingLetter(letter);
    window.setTimeout(() => setPlayingLetter(current => current === letter ? null : current), 520);
    void playLetterAudio({
      audioSrc: course.letterAudioMap[letter],
      fallbackText: getLetterSpeechText(letter, courseId),
      speechLang: getLetterSpeechLang(courseId),
    });
  };

  return (
    <div className="landing-alphabet-shell rounded-[clamp(10px,1.2vw,15px)] border border-white/70 bg-white/55 p-[clamp(3px,0.48vw,6px)] shadow-[0_10px_24px_rgba(15,23,42,0.06)] backdrop-blur-[6px]">
      <div className="px-1 pb-1 text-[clamp(12px,1.35vw,14px)] font-semibold tracking-[-0.01em] text-[var(--text-primary)]">
        {getAlphabetDisplayTitle(courseId, transliterationMode) ?? getDisplayText(course.scriptTitleNative, transliterationMode, courseId)}
      </div>
      <div className="landing-alphabet-rows flex flex-col gap-[clamp(4px,0.5vw,6px)]">
        {course.alphabetRows.map((row, rowIdx) => (
          <div
            key={`landing-alphabet-row-${rowIdx}`}
            className="landing-alphabet-grid grid gap-[clamp(2px,0.42vw,5px)]"
            style={{
              gridTemplateColumns: `repeat(${alphabetColumnCount}, minmax(0, 1fr))`,
            }}
          >
            {row.map((ch) => {
              const letterKind = getLetterKind(ch, courseId);
              const visibleLetter = getDisplayText(ch, transliterationMode, courseId);
              const audioLabel = getAlphabetAudioLabel(interfaceLanguage, ch, courseId);
              const isCompositeSerbianLetter =
                courseId === 'sr' && ['Lj', 'Nj', 'Dž'].includes(visibleLetter);

              return (
                <button
                  key={ch}
                  type="button"
                  onClick={() => speakLetter(ch)}
                  className={`landing-alphabet-key landing-alphabet-key--${letterKind} ${isCompositeSerbianLetter ? 'landing-alphabet-key--composite' : ''} home-alphabet-key rounded-lg border border-slate-200/75 bg-white/90 py-[3px] text-center shadow-sm transition-all hover:border-[rgba(249,115,22,0.35)] hover:bg-slate-50 ${playingLetter === ch ? 'landing-alphabet-key--active' : ''}`}
                  title={
                    interfaceLanguage === 'en'
                      ? `Play the name of the letter ${visibleLetter}`
                      : `Прослушать название буквы ${visibleLetter}`
                  }
                  aria-label={audioLabel}
                >
                  <div className={`landing-alphabet-letter home-alphabet-letter ${letterFontClass} translate-y-[-1px] leading-none`}>{visibleLetter}</div>
                </button>
              );
            })}
          </div>
        ))}
      </div>
      {hasVowels && (
        <div className="landing-alphabet-legend" aria-label={getAlphabetInstruction(interfaceLanguage)}>
          <span className="landing-alphabet-legend-dot" aria-hidden="true" />
          <span>{getAlphabetLegend(interfaceLanguage)}</span>
        </div>
      )}
      <style jsx>{`
        .landing-alphabet-key--vowel {
          border-color: rgba(232, 145, 54, 0.18);
          background: linear-gradient(145deg, rgba(255, 250, 242, 0.98), rgba(255, 231, 199, 0.56));
        }

        .landing-alphabet-key--consonant {
          border-color: rgba(0, 168, 132, 0.13);
          background: linear-gradient(145deg, rgba(255, 255, 255, 0.96), rgba(225, 246, 238, 0.48));
        }

        .landing-alphabet-legend {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 7px;
          padding-inline: 4px;
          color: #4b5563;
          font-size: clamp(9px, 1.1vw, 11px);
          font-weight: 650;
          letter-spacing: -0.01em;
          line-height: 1.2;
        }

        .landing-alphabet-legend-dot {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: #e89136;
          box-shadow: 0 0 0 3px rgba(232, 145, 54, 0.12);
        }

        .landing-alphabet-key {
          min-height: clamp(44px, 6vw, 60px);
          padding: 3px !important;
        }

        .landing-alphabet-letter {
          font-size: clamp(15px, 2.2vw, 20px) !important;
        }

        .landing-alphabet-key--composite .landing-alphabet-letter {
          font-size: clamp(13px, 1.9vw, 17px) !important;
          letter-spacing: -0.035em;
        }

        .landing-alphabet-key--active {
          border-color: rgba(255, 113, 56, 0.62) !important;
          background: linear-gradient(145deg, rgba(255, 240, 229, 0.98), rgba(234, 247, 241, 0.82)) !important;
          box-shadow:
            0 12px 22px rgba(255, 113, 56, 0.16),
            inset 0 1px 0 rgba(255, 255, 255, 0.88) !important;
          transform: translateY(-1px) scale(0.98);
          animation: landingAlphabetPress 0.52s ease-out;
        }

        .landing-alphabet-key:hover {
          transform: translateY(-1px);
          box-shadow: 0 10px 22px rgba(31, 28, 23, 0.12);
        }

        @keyframes landingAlphabetPress {
          0% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-1px) scale(0.98);
          }
          100% {
            transform: translateY(0) scale(1);
          }
        }

        @media (max-width: 767px) {
          .landing-alphabet-shell {
            width: 92%;
            margin-inline: auto;
            padding: 3px;
          }

          .landing-alphabet-grid {
            gap: 3px;
          }

          .landing-alphabet-key {
            border-radius: 7px;
            padding-top: 2px;
            padding-bottom: 2px;
          }

          .landing-alphabet-letter {
            font-size: clamp(14px, 4vw, 18px) !important;
          }

          .landing-alphabet-key--composite .landing-alphabet-letter {
            font-size: clamp(11px, 3.2vw, 14px) !important;
            letter-spacing: -0.045em;
          }

        }
      `}</style>
    </div>
  );
}
