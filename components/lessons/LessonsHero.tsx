'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Route } from 'next';
import type { LessonListItem } from '@/lib/lessonProgress';
import { geLetterToHint, type TransliterationMode } from '@/lib/transliteration';

type LessonsHeroProps = {
  recommendedLesson?: LessonListItem;
  recommendedLessonNumber?: number;
  recommendedLetters: string[];
  recommendedScore: number;
  lessonTargetScore: number;
  transliterationMode: TransliterationMode;
  onSpeakLetter: (letter: string) => void;
};

export function LessonsHero({
  recommendedLesson,
  recommendedLessonNumber,
  recommendedLetters,
  recommendedScore,
  lessonTargetScore,
  transliterationMode,
  onSpeakLetter,
}: LessonsHeroProps) {
  const lessonHref = (recommendedLesson ? `/study/${recommendedLesson.id}` : '/study/ep1') as Route;
  const lessonLabel = recommendedLessonNumber
    ? `Урок ${recommendedLessonNumber}`
    : 'Первый урок';
  const progressPercent = lessonTargetScore > 0
    ? Math.min(Math.round((recommendedScore / lessonTargetScore) * 100), 100)
    : 0;

  return (
    <section className="lessons-hero mx-auto grid w-full max-w-[1000px] grid-cols-[minmax(0,1fr)_minmax(280px,0.56fr)] items-stretch gap-4 rounded-[32px] px-5 py-5 md:px-7 md:py-6 [@media(max-width:820px)]:grid-cols-1">
      <div className="lessons-hero-art" aria-hidden="true">ა</div>
      <div className="lessons-hero-copy relative z-10 flex min-w-0 flex-col justify-center gap-3">
        <div>
          <p className="lessons-hero-subtitle lessons-hero-subtitle--lead">
            Вначале читай карточки урока, потом играй в Блоки.
          </p>
        </div>
      </div>

      <div className="lessons-hero-card group self-start">
        <Link
          href={lessonHref}
          className="lessons-hero-card-link"
          aria-label={`Открыть ${lessonLabel}`}
        />
          <div className="lessons-hero-card-glow" aria-hidden="true" />
          <div className="pointer-events-none relative z-10 flex items-start justify-between gap-3">
            <div>
              <div className="lessons-hero-card-label">
                Сейчас лучше пройти
              </div>
              <div className="lessons-hero-card-title">
                {lessonLabel}
              </div>
            </div>
            <span className="lessons-hero-start" aria-hidden="true">→</span>
          </div>
          <Image
            src="/images/deda-cat.png"
            alt=""
            width={92}
            height={92}
            className="lessons-hero-cat"
            priority
          />

          <div className="lessons-hero-letter-panel pointer-events-none relative z-20 mt-4 flex min-h-[62px] items-center justify-center rounded-[22px] bg-white/62 px-4 py-2.5">
            <div className="w-full">
              <div className="lessons-hero-listen-cue">
                <span className="lessons-hero-listen-dot" aria-hidden="true" />
                Нажми букву и послушай
              </div>
              <div className="lessons-hero-letters" aria-label="Буквы рекомендованного урока">
                {(recommendedLetters.length ? recommendedLetters : ['ა', 'ი', 'ს', 'ო']).map((letter) => (
                  <button
                    key={letter}
                    type="button"
                    className="lessons-hero-letter"
                    title={`Послушать букву ${letter}`}
                    aria-label={`Послушать букву ${letter}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      onSpeakLetter(letter);
                  }}
                >
                    <span className="lessons-hero-letter-char">{letter}</span>
                    <span className="lessons-hero-letter-hint">
                      {geLetterToHint(letter, transliterationMode)}
                    </span>
                    <span className="lessons-hero-letter-sound" aria-hidden="true">♪</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lessons-hero-rule pointer-events-none relative z-10 mt-2">
            Слова только из этих и прошлых букв
          </div>

          <div className="lessons-hero-progress pointer-events-none relative z-10 mt-2.5 flex items-center gap-3">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-orange-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-orange-400 to-emerald-400"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="lessons-hero-score">
              {progressPercent}%
            </span>
          </div>
      </div>
    </section>
  );
}
