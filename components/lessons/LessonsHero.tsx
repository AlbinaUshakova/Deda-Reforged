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
  const lessonLabel = recommendedLessonNumber
    ? `Урок ${recommendedLessonNumber}`
    : 'Первый урок';
  const earnedPoints = Math.min(Math.max(recommendedScore, 0), lessonTargetScore);
  const progressPercent = lessonTargetScore > 0
    ? Math.min(Math.round((recommendedScore / lessonTargetScore) * 100), 100)
    : 0;
  const hasStarted = recommendedScore > 0;
  const remainingPoints = Math.max(lessonTargetScore - earnedPoints, 0);
  const actionLabel = hasStarted
    ? `Продолжить ${lessonLabel.toLowerCase()} →`
    : `Начать ${lessonLabel.toLowerCase()} →`;
  const eyebrowLabel = hasStarted ? 'Продолжить обучение' : 'Начни с этого урока';
  const lessonLettersRule = recommendedLessonNumber === 1
    ? 'Слова и фразы только из этих букв'
    : 'Слова и фразы из этих и прошлых букв';
  const heroLetters = recommendedLetters.length
    ? recommendedLetters
    : course.alphabet.slice(0, 4);
  const hasDenseLetterSet = heroLetters.length > 7;

  return (
    <section className="lessons-hero mx-auto grid w-full max-w-[1200px] grid-cols-[minmax(470px,0.6fr)_minmax(260px,0.4fr)] items-stretch gap-5 rounded-[32px] px-5 py-5 md:px-7 md:py-6 [@media(max-width:820px)]:grid-cols-1">
      <div className="lessons-hero-art" aria-hidden="true">{course.alphabet[0]}</div>

      <div className="lessons-hero-card group self-stretch">
        <Link
          href={lessonHref}
          className="lessons-hero-card-link"
          aria-label={`Открыть ${lessonLabel}`}
        />
          <div className="lessons-hero-card-glow" aria-hidden="true" />
          <div className="pointer-events-none relative z-10 flex items-start justify-between gap-3">
            <div>
              <div className="lessons-hero-card-label">
                {eyebrowLabel}
              </div>
              <div className="lessons-hero-card-title">
                {lessonLabel}
              </div>
            </div>
          </div>

          <div className={`lessons-hero-letter-panel pointer-events-none relative z-20 mt-3 flex min-h-[62px] items-center justify-center rounded-[22px] bg-white/62 px-4 py-2.5 ${
            hasDenseLetterSet ? 'lessons-hero-letter-panel--dense' : ''
          }`}>
            <div className="w-full">
              <div
                className={`lessons-hero-letters ${
                  hasDenseLetterSet ? 'lessons-hero-letters--dense' : ''
                }`}
                aria-label="Буквы рекомендованного урока"
              >
                {heroLetters.map((letter) => (
                  <button
                    key={letter}
                    type="button"
                    className={`lessons-hero-letter ${
                      hasDenseLetterSet ? 'lessons-hero-letter--dense' : ''
                    }`}
                    title={`Послушать букву ${letter}`}
                    aria-label={`Послушать букву ${letter}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      onSpeakLetter(letter);
                  }}
                >
                    <span className="lessons-hero-letter-char">{letter}</span>
                    <span className="lessons-hero-letter-hint">
                      {letterToHint(letter, transliterationMode, courseId)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lessons-hero-rule pointer-events-none relative z-10 mt-2">
            {lessonLettersRule}
          </div>

          <div className="lessons-hero-progress pointer-events-none relative z-10 mt-3">
            <div className="lessons-hero-progress-top">
              <span>Прогресс в игре</span>
              <span>{earnedPoints} из {lessonTargetScore} очков</span>
            </div>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-orange-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-orange-400 to-emerald-400"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
          <div className="lessons-hero-action pointer-events-none relative z-10 mt-3">
            {actionLabel}
          </div>
      </div>

      <div className="lessons-hero-copy relative z-10 flex min-w-0 flex-col justify-center gap-3">
        <div>
          <div className="lessons-hero-kicker">Как проходить</div>
          <p className="lessons-hero-subtitle lessons-hero-subtitle--lead">
            {hasStarted && remainingPoints > 0
              ? `Набери ещё ${formatPointsCount(remainingPoints)} в игре, чтобы пройти урок.`
              : 'Сначала изучи карточки, затем сыграй в блоки.'}
          </p>
        </div>
        <div className="lessons-hero-mascot" aria-hidden="true">
          <Image
            src="/images/cats/deda-lessons-book.png"
            alt=""
            width={92}
            height={92}
            className="lessons-hero-cat"
            priority
          />
        </div>
      </div>
    </section>
  );
}
