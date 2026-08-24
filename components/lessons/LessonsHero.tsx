'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { useAppStore } from '@/lib/appStore';
import type { LessonListItem } from '@/lib/lessonProgress';
import { getCourse, type CourseId } from '@/lib/courses';
import { getDisplayText, letterToHint, type TransliterationMode } from '@/lib/transliteration';

type LessonsHeroProps = {
  recommendedLesson?: LessonListItem;
  recommendedLessonNumber?: number;
  recommendedLetters: string[];
  recommendedScore: number;
  lessonTargetScore: number;
  transliterationMode: TransliterationMode;
  courseId: CourseId;
  totalLessons: number;
  masteredCount: number;
  onSpeakLetter: (letter: string) => void;
};

function plural(count: number, one: string, few: string, many: string): string {
  const lastTwo = Math.abs(count) % 100;
  const last = Math.abs(count) % 10;
  if (lastTwo >= 11 && lastTwo <= 14) return `${count} ${many}`;
  if (last === 1) return `${count} ${one}`;
  if (last >= 2 && last <= 4) return `${count} ${few}`;
  return `${count} ${many}`;
}

export function LessonsHero({
  recommendedLesson,
  recommendedLessonNumber,
  recommendedLetters,
  recommendedScore,
  lessonTargetScore,
  transliterationMode,
  courseId,
  totalLessons,
  masteredCount,
  onSpeakLetter,
}: LessonsHeroProps) {
  const interfaceLanguage = useAppStore(state => state.settings.interfaceLanguage);
  const course = getCourse(courseId);
  const lessonHref = (recommendedLesson ? `/study/${recommendedLesson.id}` : '/study/ep1') as Route;
  const lessonLabel = recommendedLessonNumber
    ? (interfaceLanguage === 'en' ? `Lesson ${recommendedLessonNumber}` : `Урок ${recommendedLessonNumber}`)
    : (interfaceLanguage === 'en' ? 'First lesson' : 'Первый урок');
  const hasStarted = recommendedScore > 0;
  const ctaLabel = hasStarted
    ? (interfaceLanguage === 'en' ? 'Continue' : 'Продолжить')
    : (interfaceLanguage === 'en' ? 'Start lesson' : 'Начать урок');
  const heroLetters = recommendedLetters.length ? recommendedLetters : course.alphabet.slice(0, 4);
  const visibleHeroLetters = heroLetters.map((letter) => getDisplayText(letter, transliterationMode, courseId));

  // Мета для снижения неопределённости перед уроком
  const cardCount = Math.max(0, recommendedLesson?.cardCount ?? 0);
  const estMinutes = cardCount > 0 ? Math.max(4, Math.round(cardCount * 0.5) + 3) : 0;

  // Прогресс всего курса
  const coursePercent =
    totalLessons > 0 ? Math.min(Math.round((masteredCount / totalLessons) * 100), 100) : 0;
  const lessonsLeft = Math.max(totalLessons - masteredCount, 0);
  const courseHint =
    totalLessons > 0
      ? lessonsLeft === 0
        ? (interfaceLanguage === 'en' ? 'Course complete, all achievements collected!' : 'Курс пройден — все ачивки собраны!')
        : interfaceLanguage === 'en'
          ? `Completed ${masteredCount} of ${totalLessons} · ${lessonsLeft} left`
          : `Пройдено ${masteredCount} из ${totalLessons} · осталось ${plural(lessonsLeft, 'урок', 'урока', 'уроков')}`
      : '';

  const subtitle = hasStarted
    ? (interfaceLanguage === 'en' ? 'A little more play and the lesson is yours.' : 'Ещё немного игры — и урок засчитан, ачивка твоя.')
    : (interfaceLanguage === 'en' ? 'New letters → game → new achievement.' : 'Новые буквы → игра → новая ачивка в коллекции.');

  const decorGlyph = visibleHeroLetters[0] ?? getDisplayText(course.alphabet[0] ?? '', transliterationMode, courseId);

  return (
    <section className="mx-auto w-full max-w-[900px] px-[clamp(18px,4.4vw,36px)]">
      <div className="relative overflow-hidden rounded-[24px] border border-[var(--border-soft)] bg-white px-[clamp(18px,3.2vw,34px)] py-[clamp(18px,3vw,26px)] shadow-[0_10px_30px_rgba(31,28,23,0.07)]">
        {/* мягкое цветное пятно */}
        <div
          className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(255,107,53,0.12), transparent 70%)' }}
          aria-hidden="true"
        />
        {/* фирменный полупрозрачный символ письменности */}
        {decorGlyph && (
          <span
            className="pointer-events-none absolute right-[-6px] bottom-[-56px] hidden select-none leading-none text-[var(--text-primary)] opacity-[0.06] sm:block"
            style={{
              fontFamily: courseId === 'ka' ? 'var(--font-georgian)' : 'var(--font-display)',
              fontSize: 'clamp(200px, 26vw, 300px)',
              fontWeight: 800,
            }}
            aria-hidden="true"
          >
            {decorGlyph}
          </span>
        )}

        <div className="relative z-10 mx-auto flex flex-col items-center text-center sm:mx-0 sm:block sm:max-w-[74%] sm:text-left">
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
            {hasStarted
              ? (interfaceLanguage === 'en' ? 'Continue' : 'Продолжаем')
              : (interfaceLanguage === 'en' ? 'Now' : 'Сейчас')} · {lessonLabel}
            {totalLessons > 0 ? interfaceLanguage === 'en' ? ` of ${totalLessons}` : ` из ${totalLessons}` : ''}
          </span>
          <h2 className="mt-1 text-[clamp(26px,5.2vw,38px)] font-extrabold leading-[0.98] tracking-[-0.03em] text-[var(--text-primary)]">
            {lessonLabel}
          </h2>
          <p className="mt-1.5 text-[clamp(13px,1.4vw,15px)] font-medium text-[var(--text-secondary)]">
            {subtitle}
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 sm:justify-start">
            <Link
              href={lessonHref}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-7 py-3.5 text-[15px] font-semibold text-white shadow-[0_10px_24px_rgba(255,107,53,0.24)] transition-all duration-150 hover:-translate-y-0.5 hover:bg-[var(--accent-hover)] active:scale-[0.98]"
              aria-label={interfaceLanguage === 'en' ? `Open ${lessonLabel}` : `Открыть ${lessonLabel}`}
            >
              <span aria-hidden="true">▶</span>
              {ctaLabel}
            </Link>

            <div className="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1 text-[12px] font-medium text-[var(--text-tertiary)] sm:justify-start">
              {estMinutes > 0 && <span>≈ {estMinutes} {interfaceLanguage === 'en' ? 'min' : 'мин'}</span>}
              {estMinutes > 0 && heroLetters.length > 0 && <span aria-hidden="true">·</span>}
            {visibleHeroLetters.length > 0 && (
                <span>{interfaceLanguage === 'en'
                  ? `${visibleHeroLetters.length} new ${visibleHeroLetters.length === 1 ? 'letter' : 'letters'}`
                  : plural(visibleHeroLetters.length, 'новая буква', 'новые буквы', 'новых букв')}</span>
              )}
              {cardCount > 0 && <span aria-hidden="true">·</span>}
              {cardCount > 0 && <span>{interfaceLanguage === 'en'
                ? `${cardCount} ${cardCount === 1 ? 'card' : 'cards'} + game`
                : `${plural(cardCount, 'карточка', 'карточки', 'карточек')} + игра`}</span>}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap justify-center gap-1.5 sm:justify-start" aria-label={interfaceLanguage === 'en' ? 'Lesson letters' : 'Буквы урока'}>
            {heroLetters.map((letter, index) => {
              const visibleLetter = visibleHeroLetters[index] ?? letter;
              return (
              <button
                key={letter}
                type="button"
                onClick={() => onSpeakLetter(letter)}
                className="flex min-w-[40px] flex-col items-center rounded-xl border border-[var(--border-soft)] bg-[#fbf7f1] px-2.5 py-1.5 transition-colors hover:bg-[#fff2e8]"
                aria-label={interfaceLanguage === 'en' ? `Hear letter ${visibleLetter}` : `Послушать букву ${visibleLetter}`}
                title={interfaceLanguage === 'en' ? `Hear letter ${visibleLetter}` : `Послушать букву ${visibleLetter}`}
              >
                <span
                  className="text-[clamp(16px,1.9vw,20px)] font-semibold leading-none text-[var(--text-primary)]"
                  style={{ fontFamily: courseId === 'ka' ? 'var(--font-georgian)' : 'var(--font-display)' }}
                >
                  {visibleLetter}
                </span>
              </button>
            )})}
          </div>

          {totalLessons > 0 && (
            <div className="mt-5">
              <div className="mb-1 flex items-center justify-between text-[11px] font-medium text-[var(--text-tertiary)]">
                <span>{courseHint}</span>
                <span>{coursePercent}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-[var(--progress-bg)]">
                <div
                  className="h-full rounded-full bg-[var(--accent)] transition-all duration-500"
                  style={{ width: `${coursePercent}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
