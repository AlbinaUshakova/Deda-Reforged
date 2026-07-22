'use client';

import { useAppStore } from '@/lib/appStore';
import { getCourse } from '@/lib/courses';
import { playLetterAudio } from '@/lib/playLetterAudio';
import { letterToHint } from '@/lib/transliteration';

export default function LandingAlphabet() {
  const transliterationMode = useAppStore(state => state.settings.transliterationMode);
  const courseId = useAppStore(state => state.settings.courseId);
  const course = getCourse(courseId);

  const speakLetter = (letter: string) => {
    void playLetterAudio({
      audioSrc: course.letterAudioMap[letter],
      fallbackText: course.letterNames[letter] ?? letter,
      speechLang: course.speechLang,
    });
  };

  return (
    <div className="landing-alphabet-shell rounded-[clamp(10px,1.3vw,15px)] border border-white/70 bg-white/55 p-[clamp(2px,0.45vw,5px)] shadow-[0_10px_24px_rgba(15,23,42,0.06)] backdrop-blur-[6px]">
      <div className="landing-alphabet-rows flex flex-col gap-[clamp(4px,0.55vw,7px)]">
        {course.alphabetSections.map((section, sectionIdx) => {
          const alphabetColumnCount = Math.max(...section.rows.map(row => row.length));

          return (
            <section key={`landing-alphabet-section-${section.title}`} className="min-w-0">
              {course.alphabetSections.length > 1 && (
                <div className="mb-[3px] flex items-center justify-between gap-2 px-1">
                  <span className="text-[clamp(7px,1vw,9px)] font-semibold uppercase tracking-[0.12em] text-slate-400">
                    {section.title}
                  </span>
                  {section.description && (
                    <span className="hidden min-[860px]:inline text-[clamp(7px,0.9vw,8px)] text-slate-400">
                      {section.description}
                    </span>
                  )}
                </div>
              )}
              <div className="flex flex-col gap-[clamp(1px,0.34vw,4px)]">
                {section.rows.map((row, rowIdx) => (
                  <div
                    key={`landing-alphabet-row-${section.title}-${rowIdx}`}
                    className="landing-alphabet-grid grid gap-[clamp(1px,0.34vw,4px)]"
                    style={{ gridTemplateColumns: `repeat(${alphabetColumnCount}, minmax(0, 1fr))` }}
                  >
                    {row.map((ch, index) => (
                      <button
                        key={ch}
                        type="button"
                        onClick={() => speakLetter(ch)}
                        className={`landing-alphabet-key home-alphabet-key aspect-square rounded-lg border border-slate-200/75 bg-white/90 py-[3px] text-center shadow-sm transition-all hover:border-[rgba(249,115,22,0.35)] hover:bg-slate-50${sectionIdx === 0 && rowIdx === 0 && index === 0 ? ' home-alphabet-key--active' : ''}`}
                        title={`Озвучить букву ${ch}`}
                        aria-label={`Озвучить букву ${ch}`}
                      >
                        <div className="landing-alphabet-letter home-alphabet-letter translate-y-[-1px] text-[clamp(14px,2.7vw,19px)] leading-none text-black">{ch}</div>
                        <div className="landing-alphabet-translit home-alphabet-translit mt-[2px] text-[clamp(6px,1.2vw,8px)] leading-none text-slate-400">{letterToHint(ch, transliterationMode, courseId)}</div>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
      <style jsx>{`
        @media (max-width: 767px) {
          .landing-alphabet-shell {
            width: 86%;
            margin-inline: auto;
            padding: 2px;
          }

          .landing-alphabet-grid {
            gap: 2px;
          }

          .landing-alphabet-key {
            border-radius: 8px;
            padding-top: 2px;
            padding-bottom: 2px;
          }

          .landing-alphabet-letter {
            font-size: clamp(13px, 4.4vw, 18px);
          }

          .landing-alphabet-translit {
            font-size: clamp(6px, 2vw, 8px);
          }
        }
      `}</style>
    </div>
  );
}
