'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/appStore';
import { type CourseId } from '@/lib/courses';

type LanguageBrief = {
  title: string;
  subtitle: string;
  points: string[];
};

const languageBriefs: Record<CourseId, LanguageBrief> = {
  ka: {
    title: 'Перед стартом: грузинский',
    subtitle: 'Письмо выглядит необычно, но чтение почти честное: одна буква обычно даёт один звук.',
    points: [
      'Нет заглавных букв: форма буквы не меняется в начале предложения.',
      'Ударение мягкое и редко мешает пониманию, поэтому сначала важнее узнавать буквы.',
      'Есть похожие для русского уха звуки: კ/ქ, ც/წ, ჩ/ჭ. Их лучше различать постепенно.',
      'Читай слева направо, без скрытых букв и сложных сочетаний.',
    ],
  },
  sr: {
    title: 'Перед стартом: сербский',
    subtitle: 'Сербский очень удобен для чтения: как написано, так чаще всего и звучит.',
    points: [
      'Кириллица фонетическая: одна буква почти всегда означает один звук.',
      'Особое внимание буквам Љ, Њ, Ћ, Ђ, Џ: они не читаются как две отдельные буквы.',
      'Ударение может меняться, но на первом этапе достаточно уверенно читать буквы.',
      'Много слов визуально знакомы русскоязычному пользователю, но звучат по-сербски.',
    ],
  },
  tr: {
    title: 'Перед стартом: турецкий',
    subtitle: 'Турецкий читается регулярно, но важно сразу не путать похожие буквы.',
    points: [
      'I и İ — разные буквы: ı звучит ближе к “ы”, i — к “и”.',
      'Ç, Ş, Ö, Ü читаются стабильно: ч, ш, ё/ö, ю/ü.',
      'Ğ обычно не даёт отдельного резкого звука, а удлиняет или смягчает соседнюю гласную.',
      'Ударение чаще ближе к концу слова, но в начале важнее точность букв.',
    ],
  },
  es: {
    title: 'Перед стартом: испанский',
    subtitle: 'Испанский алфавит знакомый, но правила чтения зависят от соседних букв.',
    points: [
      'H не произносится: hola читается без начального “х”.',
      'C и G меняют звук перед e/i: c может звучать как “с”, g — ближе к “х”.',
      'Ñ — отдельная буква, звучит как мягкое “нь”.',
      'Ударение важно: знак акцента показывает, какой слог выделить.',
    ],
  },
  de: {
    title: 'Перед стартом: немецкий',
    subtitle: 'Немецкий читается достаточно регулярно, если отдельно запомнить сочетания и умлауты.',
    points: [
      'Ä, Ö, Ü — отдельные гласные оттенки, не просто A/O/U с украшением.',
      'ß читается как долгий “с”; в верхнем регистре ему соответствует ẞ.',
      'W обычно звучит как “в”, V часто как “ф”, Z как “ц”.',
      'Буквосочетания ch, sch, ei, ie лучше учить на словах, а не по отдельности.',
    ],
  },
};

export function LandingLanguageBrief() {
  const courseId = useAppStore(state => state.settings.courseId);
  const hydrate = useAppStore(state => state.hydrate);
  const brief = languageBriefs[courseId];

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  return (
    <section className="landing-language-brief mx-auto mt-12 w-full max-w-[1240px] px-4 pb-12 pt-0 sm:mt-4 sm:px-6 sm:pb-16 sm:pt-0 lg:mt-6 lg:px-8 lg:pb-20 lg:pt-1">
      <div className="landing-language-card">
        <div className="landing-language-kicker">Что важно знать до первого урока</div>
        <h2 className="landing-language-title">{brief.title}</h2>
        <p className="landing-language-subtitle">{brief.subtitle}</p>
        <div className="landing-language-points" aria-label="Особенности чтения">
          {brief.points.map((point, index) => (
            <div key={point} className="landing-language-point">
              <span className="landing-language-index">{index + 1}</span>
              <span>{point}</span>
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        .landing-language-card {
          position: relative;
          overflow: hidden;
          border-radius: clamp(28px, 4vw, 42px);
          background:
            radial-gradient(circle at 12% 8%, rgba(255, 255, 255, 0.92), transparent 34%),
            linear-gradient(135deg, rgba(255, 255, 255, 0.76), rgba(255, 246, 229, 0.58));
          padding: clamp(22px, 4vw, 42px);
          box-shadow:
            0 24px 70px rgba(31, 28, 23, 0.10),
            inset 0 1px 0 rgba(255, 255, 255, 0.86);
          backdrop-filter: blur(16px);
        }

        .landing-language-card::after {
          content: '';
          position: absolute;
          right: clamp(20px, 5vw, 72px);
          top: clamp(18px, 4vw, 48px);
          width: clamp(72px, 12vw, 148px);
          height: clamp(72px, 12vw, 148px);
          border-radius: 999px;
          background: rgba(249, 115, 22, 0.12);
          filter: blur(2px);
          pointer-events: none;
        }

        .landing-language-kicker {
          position: relative;
          z-index: 1;
          width: fit-content;
          border-radius: 999px;
          background: rgba(23, 21, 19, 0.08);
          padding: 7px 12px;
          color: var(--text-secondary);
          font-size: 12px;
          font-weight: 750;
          letter-spacing: -0.01em;
        }

        .landing-language-title {
          position: relative;
          z-index: 1;
          margin-top: 18px;
          max-width: 720px;
          color: var(--text-primary);
          font-size: clamp(27px, 4.8vw, 58px);
          font-weight: 920;
          letter-spacing: -0.065em;
          line-height: 0.96;
          text-wrap: balance;
        }

        .landing-language-subtitle {
          position: relative;
          z-index: 1;
          margin-top: 16px;
          max-width: 700px;
          color: var(--text-secondary);
          font-size: clamp(15px, 1.8vw, 20px);
          line-height: 1.42;
          letter-spacing: -0.018em;
          text-wrap: balance;
        }

        .landing-language-points {
          position: relative;
          z-index: 1;
          margin-top: clamp(22px, 3.5vw, 34px);
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }

        .landing-language-point {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr);
          gap: 11px;
          align-items: start;
          border-radius: 22px;
          background: rgba(255, 255, 255, 0.58);
          padding: 14px;
          color: var(--text-primary);
          font-size: clamp(13px, 1.55vw, 16px);
          line-height: 1.36;
          letter-spacing: -0.012em;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.72);
        }

        .landing-language-index {
          display: inline-flex;
          width: 24px;
          height: 24px;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          background: #171513;
          color: #fffaf2;
          font-size: 12px;
          font-weight: 820;
          line-height: 1;
        }

        @media (max-width: 767px) {
          .landing-language-points {
            grid-template-columns: 1fr;
          }

          .landing-language-card {
            border-radius: 28px;
          }
        }
      `}</style>
    </section>
  );
}
