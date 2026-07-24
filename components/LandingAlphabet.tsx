'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/appStore';
import { letterToHint } from '@/lib/transliteration';
import {
  getCourse,
  getLetterKind,
  getLetterSoundLabel,
  getLetterSpeechLang,
  getLetterSpeechText,
} from '@/lib/courses';
import { playLetterAudio } from '@/lib/playLetterAudio';

export default function LandingAlphabet() {
  const courseId = useAppStore(state => state.settings.courseId);
  const course = getCourse(courseId);
  const transliterationMode = useAppStore(state => state.settings.transliterationMode);
  const [playingLetter, setPlayingLetter] = useState<string | null>(null);
  const letterFontClass = courseId === 'ka' ? 'alphabet-letter--georgian' : 'alphabet-letter--latin';
  const hasVowels = course.vowels.length > 0;
  const alphabetColumnCount = Math.max(
    ...course.alphabetSections.flatMap(section => section.rows.map(row => row.length)),
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
      <div className="landing-alphabet-rows flex flex-col gap-[clamp(4px,0.5vw,6px)]">
        {course.alphabetSections.map((section) => {
          const isMemorySection = section.title === 'Запомни отдельно';
          const isDiacriticSection = courseId === 'es' && isMemorySection;
          const showSectionHeader = isMemorySection;

          return (
            <section
              key={`landing-alphabet-section-${section.title}`}
              className={`min-w-0 ${isMemorySection ? 'landing-alphabet-memory-section' : ''}`}
            >
              {showSectionHeader && (
                <div className={`mb-[3px] flex gap-2 px-1 ${isMemorySection ? 'landing-alphabet-memory-note flex-col items-start' : 'items-center justify-between'
                  }`}>
                  <span className="text-[clamp(8px,1vw,10px)] font-bold tracking-[-0.01em] text-slate-600">
                    {section.title}
                  </span>
                  {section.description && (
                    <span className={`text-slate-400 ${isMemorySection
                      ? 'landing-alphabet-memory-text'
                      : 'hidden min-[860px]:inline text-[clamp(7px,0.9vw,8px)]'
                      }`}>
                      {section.description}
                    </span>
                  )}
                </div>
              )}
              <div className="flex flex-col gap-[clamp(2px,0.42vw,5px)]">
                {section.rows.map((row, rowIdx) => (
                  <div
                    key={`landing-alphabet-row-${section.title}-${rowIdx}`}
                    className="landing-alphabet-grid grid gap-[clamp(2px,0.42vw,5px)]"
                    style={{
                      gridTemplateColumns: `repeat(${alphabetColumnCount}, minmax(0, 1fr))`,
                    }}
                  >
                    {row.map((ch) => {
                      const soundLabel = getLetterSoundLabel(ch, courseId);
                      const letterKind = getLetterKind(ch, courseId);
                      const rawSoundHint = letterToHint(ch, transliterationMode, courseId);
                      const soundHint = String(rawSoundHint || ch).toLowerCase();
                      const audioLabel = `Прослушать звук буквы ${ch}`;
                      const isHighlightedLetter = course.alphabetHighlightedLetters?.includes(ch) ?? false;

                      return (
                        <button
                          key={ch}
                          type="button"
                          onClick={() => speakLetter(ch)}
                          className={`landing-alphabet-key landing-alphabet-key--${letterKind} ${isHighlightedLetter ? 'landing-alphabet-key--highlighted' : ''} ${isDiacriticSection ? 'landing-alphabet-key--diacritic' : ''} home-alphabet-key rounded-lg border border-slate-200/75 bg-white/90 py-[3px] text-center shadow-sm transition-all hover:border-[rgba(249,115,22,0.35)] hover:bg-slate-50 ${playingLetter === ch ? 'landing-alphabet-key--active' : ''
                            }`}
                          title={`Озвучить букву ${ch}. Звучит как: ${soundLabel}`}
                          aria-label={audioLabel}
                        >
                          <div className={`landing-alphabet-letter home-alphabet-letter ${letterFontClass} translate-y-[-1px] leading-none`}>{ch}</div>
                          <div className="landing-alphabet-translit home-alphabet-translit mt-[2px] leading-none">{soundHint}</div>
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
      {hasVowels && (
        <div className="landing-alphabet-legend" aria-label="Легенда алфавита">
          <span className="landing-alphabet-legend-dot" aria-hidden="true" />
          <span>Оранжевым выделены гласные</span>
        </div>
      )}
      {course.alphabetLegendNote && (
        <div className="landing-alphabet-note">
          {course.alphabetLegendNote}
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

        .landing-alphabet-key--diacritic {
          border-color: rgba(107, 114, 128, 0.20) !important;
          background: linear-gradient(145deg, rgba(255, 255, 255, 0.94), rgba(244, 244, 245, 0.66)) !important;
          box-shadow:
            0 6px 14px rgba(31, 28, 23, 0.035),
            inset 0 1px 0 rgba(255, 255, 255, 0.86) !important;
        }

        .landing-alphabet-memory-section {
          margin-top: clamp(10px, 1.25vw, 16px);
        }

        .landing-alphabet-memory-note {
          border-radius: 12px;
          background: rgba(255, 247, 237, 0.72);
          padding: clamp(6px, 0.8vw, 9px);
        }

        .landing-alphabet-memory-text {
          display: block;
          max-width: 100%;
          font-size: clamp(8px, 0.95vw, 10px);
          font-weight: 560;
          line-height: 1.28;
          letter-spacing: -0.01em;
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

        .landing-alphabet-note {
          margin-top: 6px;
          padding-inline: 4px;
          color: #4b5563;
          font-size: clamp(8.5px, 1vw, 10px);
          font-weight: 600;
          letter-spacing: -0.01em;
          line-height: 1.28;
        }

        .landing-alphabet-key {
          padding: 3px !important;
        }

        .landing-alphabet-letter {
          font-size: clamp(15px, 2.2vw, 20px) !important;
        }

        .landing-alphabet-translit {
          font-size: clamp(8px, 0.95vw, 10px) !important;
          white-space: normal;
          overflow-wrap: break-word;
          word-break: break-word;
          hyphens: auto;
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

        }
      `}</style>
    </div>
  );
}
