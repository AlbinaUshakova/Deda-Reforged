'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Route } from 'next';
import type { LessonListItem } from '@/lib/lessonProgress';
import { getCourse, type CourseId } from '@/lib/courses';
import { letterToHint, type TransliterationMode } from '@/lib/transliteration';

type LessonsHeroProps = {
  recommendedLesson?: LessonListItem;
  recommendedLessonNumber?: number;
  recommendedLetters: string[];
  recommendedScore: number;
  lessonTargetScore: number;
  transliterationMode: TransliterationMode;
  courseId: CourseId;
  onSpeakLetter: (letter: string) => void;
};

function formatPointsCount(count: number): string {
  const abs = Math.abs(count);
  const lastTwo = abs % 100;
  const last = abs % 10;
  if (lastTwo >= 11 && lastTwo <= 14) return `${count} очков`;
  if (last === 1) return `${count} очко`;
  if (last >= 2 && last <= 4) return `${count} очка`;
  return `${count} очков`;
}

export function LessonsHero({
  recommendedLesson,
  recommendedLessonNumber,
  recommendedLetters,
  recommendedScore,
  lessonTargetScore,
  transliterationMode,
  courseId,
  onSpeakLetter,
}: LessonsHeroProps) {
  const course = getCourse(courseId);
  const lessonHref = (recommendedLesson ? `/study/${recommendedLesson.id}` : '/study/ep1') as Route;
  const lessonLabel = recommendedLessonNumber ? `Урок ${recommendedLessonNumber}` : 'Первый урок';
  const earnedPoints = Math.min(Math.max(recommendedScore, 0), lessonTargetScore);
  const hasStarted = recommendedScore > 0;
  const remainingPoints = Math.max(lessonTargetScore - earnedPoints, 0);
  const ctaLabel = hasStarted ? 'Продолжить' : 'Начать урок';
  const heroLetters = recommendedLetters.length ? recommendedLetters : course.alphabet.slice(0, 4);
  const subtitle =
    hasStarted && remainingPoints > 0
      ? `Ещё ${formatPointsCount(remainingPoints)} в игре — и урок в коллекции.`
      : 'Сначала карточки, потом игра в блоки.';

  return (
    <section className="mx-auto w-full max-w-[900px] px-[clamp(18px,4.4vw,36px)]">
      <div className="scrapbook-card relative overflow-hidden rounded-[26px] px-[clamp(16px,3vw,28px)] py-[clamp(18px,3vw,26px)]">
        <div className="relative z-10 flex items-center gap-[clamp(14px,3.4vw,28px)]">
          {/* полароид кота */}
          <div className="relative shrink-0 -rotate-3">
            <span className="scrapbook-tape absolute -top-2.5 left-1/2 h-5 w-16 -translate-x-1/2 -rotate-6" aria-hidden="true" />
            <div className="rounded-[7px] bg-white p-2 pb-5 shadow-[0_12px_26px_rgba(31,28,23,0.18)]">
              <div className="grid h-[clamp(72px,13vw,104px)] w-[clamp(72px,13vw,104px)] place-items-center overflow-hidden rounded-[4px] bg-[#FBE7D3]">
                <Image
                  src="/images/cats/deda-reading-clean.png"
                  alt=""
                  width={120}
                  height={120}
                  priority
                  className="h-[86%] w-[86%] object-contain"
                />
              </div>
              <div className="mt-1.5 text-center text-[11px] font-semibold tracking-[-0.01em] text-[#8a837a]">
                {lessonLabel.toLowerCase()}
              </div>
            </div>
          </div>

          {/* контент */}
          <div className="min-w-0 flex-1">
            <span className="scrapbook-eyebrow inline-block -rotate-1">{hasStarted ? 'продолжаем' : 'сейчас'}</span>
            <h2 className="mt-1.5 text-[clamp(28px,6.4vw,42px)] font-extrabold leading-[0.95] tracking-[-0.03em] text-[var(--text-primary)]">
              {lessonLabel}
            </h2>

            <div className="mt-3 flex flex-wrap gap-2" aria-label="Буквы урока">
              {heroLetters.map((letter, i) => (
                <button
                  key={letter}
                  type="button"
                  onClick={() => onSpeakLetter(letter)}
                  className="scrapbook-letter flex min-w-[42px] flex-col items-center rounded-[12px] bg-white px-2.5 py-1.5 shadow-[0_5px_12px_rgba(31,28,23,0.1)] transition-transform hover:-translate-y-0.5"
                  style={{ transform: `rotate(${(i % 2 === 0 ? -1 : 1) * 2.5}deg)` }}
                  aria-label={`Послушать букву ${letter}`}
                  title={`Послушать букву ${letter}`}
                >
                  <span
                    className="text-[clamp(17px,2.1vw,22px)] font-semibold leading-none text-[var(--text-primary)]"
                    style={{ fontFamily: courseId === 'ka' ? 'var(--font-georgian)' : 'var(--font-display)' }}
                  >
                    {letter}
                  </span>
                  <span className="mt-0.5 text-[10px] leading-none text-[var(--text-tertiary)]">
                    {letterToHint(letter, transliterationMode, courseId)}
                  </span>
                </button>
              ))}
            </div>

            <Link
              href={lessonHref}
              className="mt-4 inline-flex rotate-[-1deg] items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3 text-[15px] font-semibold text-white shadow-[0_10px_24px_rgba(255,107,53,0.28)] transition-all duration-150 hover:-translate-y-0.5 hover:bg-[var(--accent-hover)] active:scale-[0.98]"
              aria-label={`Открыть ${lessonLabel}`}
            >
              <span aria-hidden="true">▶</span>
              {ctaLabel}
            </Link>

            <p className="mt-2.5 text-[clamp(12px,1.3vw,13px)] text-[var(--text-secondary)]">{subtitle}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
