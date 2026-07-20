'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Route } from 'next';
import type { LessonListItem } from '@/lib/lessonProgress';

type LessonsHeroProps = {
  recommendedLesson?: LessonListItem;
  recommendedLessonNumber?: number;
  recommendedLetters: string[];
  recommendedScore: number;
  lessonTargetScore: number;
  phrasesLesson: LessonListItem;
};

export function LessonsHero({
  recommendedLesson,
  recommendedLessonNumber,
  recommendedLetters,
  recommendedScore,
  lessonTargetScore,
  phrasesLesson,
}: LessonsHeroProps) {
  const lessonHref = (recommendedLesson ? `/study/${recommendedLesson.id}` : '/study/ep1') as Route;
  const phrasesHref = `/study/${phrasesLesson.id}` as Route;
  const lessonLabel = recommendedLessonNumber
    ? `Урок ${recommendedLessonNumber}`
    : 'Первый урок';
  const primaryLabel = recommendedLessonNumber
    ? `Начать урок ${recommendedLessonNumber}`
    : 'Начать первый урок';
  const progressPercent = lessonTargetScore > 0
    ? Math.min(Math.round((recommendedScore / lessonTargetScore) * 100), 100)
    : 0;

  return (
    <section className="lessons-hero mx-auto grid w-full max-w-[1060px] grid-cols-[minmax(0,1.1fr)_minmax(280px,0.72fr)] items-stretch gap-5 rounded-[34px] px-5 py-5 md:px-7 md:py-6 [@media(max-width:820px)]:grid-cols-1">
      <div className="lessons-hero-copy relative z-10 flex min-w-0 flex-col justify-between gap-5">
        <div>
          <div className="lessons-hero-kicker">Твой путь к чтению</div>
          <h1 className="lessons-hero-title">
            Читай грузинские буквы играя
          </h1>
          <p className="lessons-hero-subtitle">
            Нажми на рекомендованный урок: сначала услышишь буквы, потом закрепишь их на карточках и в игре.
          </p>
          <div className="lessons-hero-steps" aria-label="Как устроено обучение">
            <span>1. Слушай</span>
            <span>2. Читай</span>
            <span>3. Играй</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link href={lessonHref} legacyBehavior>
            <a className="lessons-hero-primary">
              {primaryLabel}
              <span aria-hidden="true">→</span>
            </a>
          </Link>
          <Link href={phrasesHref} legacyBehavior>
            <a className="lessons-hero-secondary">
              Разговорные фразы
            </a>
          </Link>
        </div>
      </div>

      <Link href={lessonHref} legacyBehavior>
        <a className="lessons-hero-card group self-start">
          <div className="lessons-hero-card-glow" aria-hidden="true" />
          <div className="relative z-10 flex items-start justify-between gap-3">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-orange-700/70">
                Сейчас лучше пройти
              </div>
              <div className="mt-1 text-[clamp(22px,3vw,34px)] font-black leading-none tracking-[-0.04em] text-slate-900">
                {lessonLabel}
              </div>
            </div>
            <Image
              src="/images/deda-cat.png"
              alt=""
              width={92}
              height={92}
              className="lessons-hero-cat"
              priority
            />
          </div>

          <div className="relative z-10 mt-4 flex min-h-[62px] items-center justify-center rounded-[22px] bg-white/62 px-4 py-2.5">
            <div
              className="lessons-hero-letters"
              style={{
                fontFamily:
                  "'Noto Sans Georgian','DejaVu Sans',system-ui,sans-serif",
              }}
            >
              {recommendedLetters.length ? recommendedLetters.join(' ') : 'ა ი ს ო'}
            </div>
          </div>

          <div className="relative z-10 mt-3 flex items-center gap-3">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-orange-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-orange-400 to-emerald-400"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-slate-600">
              {recommendedScore}/{lessonTargetScore}
            </span>
          </div>
        </a>
      </Link>
    </section>
  );
}
