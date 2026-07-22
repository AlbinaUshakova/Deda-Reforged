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
    title: 'Мини-урок: грузинский',
    subtitle: 'В грузинском 33 буквы: 5 гласных и 28 согласных. Буквы непривычные, но читаются честно: видишь букву — произносишь звук.',
    points: [
      'Читаем слева направо, как в русском. Скрытых букв почти нет.',
      'Заглавных букв нет: в начале слова буква выглядит так же, как в середине.',
      'Пять гласных очень важны: ა, ე, ი, ო, უ. Если узнал их, слово уже легче собрать.',
      'Есть похожие пары: კ/ქ, ც/წ, ჩ/ჭ. Сначала просто слушай их рядом, ухо привыкнет.',
    ],
  },
  sr: {
    title: 'Мини-урок: сербский',
    subtitle: 'В сербской кириллице 30 букв: 5 гласных и 25 согласных. Главное правило простое: как написано, так и читаем.',
    points: [
      'Не ищем подвох: одна буква обычно даёт один звук.',
      'Гласные простые и знакомые: А, Е, И, О, У. Они держат слово, как бусины на нитке.',
      'Особые буквы Љ, Њ, Ћ, Ђ, Џ читаются одним звуком, не по частям.',
      'Многие слова похожи на русские, но произносить их нужно по-сербски, буква за буквой.',
    ],
  },
  tr: {
    title: 'Мини-урок: турецкий',
    subtitle: 'В турецком 29 букв: 8 гласных и 21 согласная. Чтение очень аккуратное: каждая буква любит свой звук.',
    points: [
      'Самая важная пара: I читается ближе к “ы”, а İ — как “и”. Точка меняет звук.',
      'Ç всегда помогает сказать “ч”, Ş — “ш”. Это не украшения, а подсказки для чтения.',
      'Ö и Ü — особые гласные. Сначала слушай их, потом повторяй коротко.',
      'Ğ почти не звучит резко: она как мягкая пауза, которая растягивает соседний звук.',
    ],
  },
  es: {
    title: 'Мини-урок: испанский',
    subtitle: 'В испанском 27 букв: 5 гласных и 22 согласные. Буквы знакомые, но несколько правил лучше запомнить сразу.',
    points: [
      'Пять гласных звучат ясно: A, E, I, O, U. Они не прячутся и не меняются сильно.',
      'H молчит. В слове hola первую букву видим, но не произносим.',
      'C и G смотрят на соседей: перед E и I они могут звучать иначе.',
      'Ñ — отдельная буква, она звучит как мягкое “нь”. Это буква, а не просто N с хвостиком.',
    ],
  },
  de: {
    title: 'Мини-урок: немецкий',
    subtitle: 'В немецком 26 основных букв, 5 главных гласных и 21 согласная. Ещё есть особые знаки: Ä, Ö, Ü и ß.',
    points: [
      'Ä, Ö, Ü — это не украшенные буквы, а отдельные звуки. Слушаем их отдельно.',
      'ß читается как “сс”. Если видишь Straße, не пугаемся: читаем спокойно по кусочкам.',
      'W часто звучит как “в”, V часто как “ф”, Z — как “ц”. Это три быстрых ключа к чтению.',
      'Сочетания лучше учить целиком: sch — “ш”, ch — “х”, ei — “ай”, ie — долгий “и”.',
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
    <section className="landing-language-brief mx-auto mt-10 w-full max-w-[1240px] px-4 pb-10 pt-0 sm:mt-8 sm:px-6 sm:pb-12 sm:pt-0 lg:mt-10 lg:px-8 lg:pb-14 lg:pt-0">
      <div className="landing-language-card">
        <div className="landing-language-kicker">Перед первым уроком</div>
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
