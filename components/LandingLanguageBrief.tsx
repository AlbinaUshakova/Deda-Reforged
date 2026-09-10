'use client';

import Image from 'next/image';
import { useEffect } from 'react';
import { useAppStore } from '@/lib/appStore';
import { type CourseId } from '@/lib/courses';

type LanguageBrief = {
  title: string;
  subtitle: string;
  points: Array<{
    label: string;
    text: string;
  }>;
};

const languageBriefs: Record<CourseId, LanguageBrief> = {
  ka: {
    title: 'Грузинский: главное для чтения',
    subtitle: 'Алфавит непривычный, но чтение довольно последовательное.',
    points: [
      { label: 'Буква почти всегда = звук', text: 'Выучила знак — чаще всего уже читаешь его в словах.' },
      { label: 'Есть резкие согласные', text: 'კ, პ, ტ лучше сразу ловить на слух.' },
      { label: 'Слова бывают очень ёмкими', text: 'Одно длинное слово может заменить целую фразу.' },
    ],
  },
  ru: {
    title: 'Russian: what matters for reading',
    subtitle: 'Cyrillic looks unfamiliar, but many letters read consistently.',
    points: [
      { label: 'Start with familiar shapes', text: 'Some letters look and sound familiar: A, K, M, O and T.' },
      { label: 'Watch the false friends', text: 'В sounds like v, Н like n, Р like r, С like s, and У like u.' },
      { label: 'Signs change nearby sounds', text: 'Ь softens a consonant, while Ъ separates it from the following vowel.' },
    ],
  },
  en: {
    title: 'Английский: главное для чтения',
    subtitle: 'Буквы часто звучат по-разному, и это нормально.',
    points: [
      { label: 'Одна буква — несколько звуков', text: 'A звучит по-разному в cat, car, cake и about. Это свойство языка, а не твоя ошибка.' },
      { label: 'Ударение может менять роль слова', text: 'Record бывает существительным и глаголом: меняется ударение — меняется роль слова.' },
      { label: 'Сочетания проще учить целиком', text: 'Sh, th, ch, ee и oo часто удобнее запоминать как готовые кусочки.' },
    ],
  },
  es: {
    title: 'Испанский: главное для чтения',
    subtitle: 'Несколько правил, и большинство слов читается с первого раза.',
    points: [
      { label: '27 букв и понятные правила', text: 'Многие слова можно увидеть впервые и правильно произнести после нескольких базовых правил.' },
      { label: 'Ударение обычно предсказуемо', text: 'Без значка действует правило по последней букве. Знак ударения показывает исключение.' },
      { label: 'Глагол часто показывает, кто действует', text: 'Hablo уже значит “я говорю”: местоимение нередко можно опустить.' },
    ],
  },
  de: {
    title: 'Немецкий: главное для чтения',
    subtitle: 'Многие буквы и сочетания читаются предсказуемо.',
    points: [
      { label: 'Многие буквы читаются стабильно', text: '26 основных букв плюс Ä, Ö, Ü и ß. Умлауты лучше сразу услышать отдельно.' },
      { label: 'Несколько букв читаются не по-английски', text: 'W звучит как “в”, V часто как “ф”, а Z — как “ц”.' },
      { label: 'Читай готовыми сочетаниями', text: 'Sch, ch, ei и ie удобнее узнавать целиком — они повторяются во многих словах.' },
    ],
  },
  sr: {
    title: 'Сербский: главное для чтения',
    subtitle: 'Сербская кириллица читается очень последовательно.',
    points: [
      { label: 'Чтение почти без скрытых правил', text: '30 букв: 5 гласных и 25 согласных. Обычно слово читается так, как написано.' },
      { label: 'Некоторые звуки имеют отдельные буквы', text: 'Љ, Њ и Џ — самостоятельные знаки, каждый читается как единое целое.' },
      { label: 'Знакомые буквы могут звучать иначе', text: 'Похожее на русское слово иногда обманывает. Читай по-сербски, буква за буквой.' },
    ],
  },
  tr: {
    title: 'Турецкий: главное для чтения',
    subtitle: 'Латиница здесь хорошо подстроена под звуки языка.',
    points: [
      { label: '29 букв и немного исключений', text: 'Большинство букв читается стабильно: выучи звук — и узнавай его в словах.' },
      { label: 'Гласные влияют на окончания', text: 'Суффиксы меняют гласную под корень. Так работает гармония гласных.' },
      { label: 'Слова собираются из частей', text: 'К корню добавляются суффиксы, каждый со своим смыслом: evlerimden = ev + ler + im + den.' },
    ],
  },
  fr: {
    title: 'Французский: главное для чтения',
    subtitle: 'Немых букв много, зато сочетания часто читаются стабильно.',
    points: [
      { label: 'Конечные буквы часто немые', text: 'e, s, t, d на конце обычно не звучат: petit → «пёти». Это регулярно.' },
      { label: 'Буквы читаются блоками', text: 'ou, on, an, ai, eau — устойчивые сочетания. Выучил один раз — узнаёшь везде.' },
      { label: 'Диакритика помогает', text: 'é, è, ê, ç меняют звук предсказуемо — это подсказка, а не помеха.' },
    ],
  },
  it: {
    title: 'Итальянский: главное для чтения',
    subtitle: 'Итальянский читается довольно честно и быстро начинает складываться.',
    points: [
      { label: 'Гласные звучат стабильно', text: 'A, E, I, O, U обычно читаются предсказуемо. Это помогает быстро начать читать целые слова.' },
      { label: 'C и G зависят от следующей буквы', text: 'Перед e и i они мягче: cena, gelato. Перед a, o, u звучат твёрже: casa, gatto.' },
      { label: 'Двойные согласные важно замечать', text: 'pala и palla звучат по-разному. Удвоение в итальянском реально слышно и влияет на слово.' },
    ],
  },
};

const nationalCatByCourse: Record<CourseId, string> = {
  ka: '/images/cats/national/deda-ka.png',
  ru: '/images/cats/national/deda-en.png',
  es: '/images/cats/national/deda-es.png',
  de: '/images/cats/national/deda-de.png',
  en: '/images/cats/national/deda-en.png',
  sr: '/images/cats/national/deda-sr.png',
  tr: '/images/cats/national/deda-tr.png',
  fr: '/images/cats/national/deda-fr.png',
  it: '/images/cats/national/deda-en.png',
};

export function LandingLanguageBrief() {
  const courseId = useAppStore(state => state.settings.courseId);
  const hydrate = useAppStore(state => state.hydrate);
  const brief = languageBriefs[courseId];

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  return (
    <section className="landing-language-brief mx-auto mt-4 w-full max-w-[1240px] px-4 pb-10 pt-0 sm:mt-5 sm:px-6 sm:pb-12 sm:pt-0 lg:mt-6 lg:px-8 lg:pb-14 lg:pt-0">
      <div className="landing-language-card">
        <div className="landing-language-content">
          <div className="landing-language-copy">
            <div className="landing-language-kicker">Перед первым уроком</div>
            <h2 className="landing-language-title">{brief.title}</h2>
            <p className="landing-language-subtitle">{brief.subtitle}</p>
          </div>
          <div className="landing-language-cat-wrap" aria-hidden="true">
            <Image
              src={nationalCatByCourse[courseId]}
              alt=""
              width={190}
              height={224}
              className="landing-language-cat"
              priority={false}
            />
          </div>
          <div className="landing-language-points" aria-label="Особенности чтения">
            {brief.points.map((point, index) => (
              <div key={point.label} className="landing-language-point">
                <span className="landing-language-index">{index + 1}</span>
                <span className="landing-language-point-copy">
                  <span className="landing-language-point-label">{point.label}</span>
                  <span className="landing-language-point-text">{point.text}</span>
                </span>
              </div>
            ))}
          </div>
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

        .landing-language-content {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(150px, 230px);
          column-gap: clamp(18px, 4vw, 44px);
          align-items: center;
        }

        .landing-language-copy {
          min-width: 0;
        }

        .landing-language-cat-wrap {
          position: relative;
          z-index: 2;
          display: flex;
          align-self: end;
          justify-content: center;
          margin-bottom: -12px;
        }

        .landing-language-cat {
          width: clamp(132px, 16vw, 212px);
          height: auto;
          object-fit: contain;
          filter: drop-shadow(0 18px 30px rgba(120, 53, 15, 0.14));
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
          max-width: 680px;
          color: var(--text-secondary);
          font-size: clamp(16px, 1.9vw, 21px);
          line-height: 1.36;
          letter-spacing: -0.018em;
          text-wrap: balance;
        }

        .landing-language-points {
          position: relative;
          z-index: 1;
          margin-top: clamp(22px, 3.5vw, 34px);
          grid-column: 1 / -1;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
        }

        .landing-language-point {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr);
          gap: 12px;
          align-items: start;
          min-height: 132px;
          border-radius: 24px;
          background:
            linear-gradient(145deg, rgba(255, 255, 255, 0.74), rgba(255, 249, 240, 0.5));
          padding: 16px;
          color: var(--text-primary);
          font-size: clamp(13px, 1.35vw, 15px);
          line-height: 1.34;
          letter-spacing: -0.012em;
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.78),
            0 10px 24px rgba(31, 28, 23, 0.045);
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

        .landing-language-point-copy {
          display: grid;
          gap: 7px;
          min-width: 0;
        }

        .landing-language-point-label {
          color: var(--text-primary);
          font-size: clamp(14px, 1.4vw, 17px);
          font-weight: 860;
          letter-spacing: -0.035em;
          line-height: 1.02;
        }

        .landing-language-point-text {
          color: var(--text-secondary);
          font-weight: 540;
        }

        @media (max-width: 1023px) {
          .landing-language-points {
            grid-template-columns: 1fr;
          }

          .landing-language-point {
            min-height: 0;
          }
        }

        @media (max-width: 767px) {
          .landing-language-content {
            grid-template-columns: minmax(0, 1fr);
            column-gap: 0;
            align-items: start;
          }

          .landing-language-copy {
            padding-right: clamp(74px, 24vw, 120px);
          }

          .landing-language-title {
            max-width: 100%;
            font-size: clamp(29px, 9.8vw, 44px);
            letter-spacing: -0.06em;
          }

          .landing-language-cat-wrap {
            position: absolute;
            top: -6px;
            right: -2px;
            margin: 0;
          }

          .landing-language-cat {
            width: clamp(84px, 25vw, 124px);
          }

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
