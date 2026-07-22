import Image from 'next/image';
import Link from 'next/link';
import LandingAlphabet from '@/components/LandingAlphabet';
import { LandingAlphabetTitle, LandingCourseTitle } from '@/components/LandingCourseTitle';
import { LandingLanguageBrief } from '@/components/LandingLanguageBrief';

export const landingMetadata = {
  title: 'Deda - учимся читать на разных языках играя.',
  description:
    'Грузинский, испанский, немецкий, сербский и турецкий: слушай буквы, читай карточки и закрепляй чтение в игре.',
};

export default function LandingPage() {
  const landingStyles = `
    .header-control-btn--alphabet {
      display: none !important;
    }

    .landing-shell {
      overflow-x: clip;
      background: var(--deda-gradient-aurora) !important;
    }

    .landing-hero-grid {
      align-items: start;
      gap: clamp(24px, 4vw, 58px);
    }

    .landing-copy {
      max-width: min(100%, 650px);
      position: relative;
      z-index: 1;
      padding-top: clamp(4px, 1vw, 12px);
    }

    .landing-copy p {
      text-wrap: balance;
    }

    .landing-subtitle {
      max-width: 560px;
      text-wrap: balance;
      margin-top: clamp(18px, 2.2vw, 28px) !important;
    }

    .landing-title {
      max-width: 640px;
      color: var(--text-primary);
      font-weight: 950;
      letter-spacing: -0.07em;
      text-wrap: balance;
    }

    .landing-course-flags {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.56);
      padding: 4px;
      box-shadow:
        0 12px 28px rgba(31, 28, 23, 0.08),
        inset 0 1px 0 rgba(255, 255, 255, 0.76);
      vertical-align: middle;
      backdrop-filter: blur(12px);
    }

    .landing-course-flag {
      display: inline-flex;
      width: clamp(34px, 4vw, 46px);
      height: clamp(34px, 4vw, 46px);
      align-items: center;
      justify-content: center;
      border-radius: 999px;
      border: 1px solid transparent;
      background: transparent;
      font-size: clamp(18px, 2.3vw, 26px);
      line-height: 1;
      transition:
        transform 160ms ease,
        background 160ms ease,
        border-color 160ms ease,
        box-shadow 160ms ease;
    }

    .landing-course-flag:hover {
      transform: translateY(-1px);
      background: rgba(255, 255, 255, 0.62);
      border-color: rgba(23, 21, 19, 0.08);
    }

    .landing-course-flag--active {
      background: #171513;
      border-color: rgba(23, 21, 19, 0.16);
      box-shadow: 0 8px 18px rgba(23, 21, 19, 0.16);
    }

    .landing-cta-btn {
      position: relative;
      z-index: 4;
      border-color: transparent !important;
      background: #171513 !important;
      color: #fffaf2 !important;
      pointer-events: auto;
      box-shadow:
        0 16px 36px rgba(23, 21, 19, 0.18),
        inset 0 1px 0 rgba(255, 255, 255, 0.12);
      transition: transform 160ms ease, box-shadow 160ms ease, background 160ms ease;
    }

    .landing-cta-btn:hover {
      opacity: 1;
      transform: translateY(-2px);
      background: #28231e !important;
      box-shadow:
        0 22px 48px rgba(23, 21, 19, 0.22),
        inset 0 1px 0 rgba(255, 255, 255, 0.12);
    }

    .landing-alphabet-hint {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 14px;
      padding-left: 18px;
      max-width: 680px;
      font-size: 14px;
      line-height: 1.42;
      color: var(--text-secondary);
      letter-spacing: -0.01em;
      text-align: center;
    }

    .landing-alphabet-hint::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      width: 8px;
      height: 8px;
      border-radius: 999px;
      transform: translateY(-50%);
      background: var(--accent);
      box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.28);
      animation: landingHintPulse 1.4s ease-in-out infinite;
    }

    .landing-alphabet-hint strong {
      color: inherit;
      font-weight: 500;
    }

    .landing-list-arrow {
      display: inline-flex;
      margin-left: 8px;
      color: var(--accent);
      font-size: 20px;
      line-height: 1;
      animation: landingHintNudge 1.1s ease-in-out infinite;
      transform-origin: left center;
      will-change: transform, opacity;
    }

    @keyframes landingHintNudge {
      0%, 100% {
        transform: translateX(0);
        opacity: 0.65;
      }
      50% {
        transform: translateX(7px);
        opacity: 1;
      }
    }

    @keyframes landingHintPulse {
      0%, 100% {
        opacity: 0.75;
        box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.12);
      }
      50% {
        opacity: 1;
        box-shadow: 0 0 0 6px rgba(249, 115, 22, 0.02);
      }
    }

    .landing-alpha-card {
      position: relative;
      width: 100%;
      max-width: clamp(306px, 32vw, 456px);
      margin-inline: auto;
      border-radius: 28px;
      background:
        linear-gradient(145deg, rgba(255, 255, 255, 0.74), rgba(255, 255, 255, 0.46)),
        radial-gradient(circle at 92% 8%, rgba(0, 168, 132, 0.13), transparent 36%);
      padding: 10px;
      box-shadow:
        0 24px 64px rgba(31, 28, 23, 0.12),
        inset 0 1px 0 rgba(255, 255, 255, 0.86);
      backdrop-filter: blur(22px) saturate(1.12);
      border: 1px solid rgba(255, 255, 255, 0.26);
    }

    .landing-alphabet-column {
      justify-self: end;
      width: min(100%, 520px);
      padding-top: clamp(0px, 1.2vw, 18px);
    }

    .landing-alpha-cat {
      position: absolute;
      right: 10px;
      bottom: -88px;
      pointer-events: none;
    }

    .landing-screens-grid {
      display: grid;
      grid-auto-flow: column;
      grid-auto-columns: max-content;
      gap: 16px;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      overscroll-behavior-x: contain;
      padding: 0 2px 14px;
      scrollbar-width: thin;
      -webkit-overflow-scrolling: touch;
    }

    .landing-screen-item {
      width: fit-content;
      scroll-snap-align: start;
      scroll-snap-stop: always;
      border-radius: 28px;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.28);
      background: rgba(255, 255, 255, 0.52);
      box-shadow:
        0 18px 46px rgba(31, 28, 23, 0.10),
        inset 0 1px 0 rgba(255, 255, 255, 0.82);
      backdrop-filter: blur(16px) saturate(1.08);
    }

    .landing-screen-item--crop-frame {
      width: min(78vw, 360px);
      max-height: min(50vh, 520px);
    }

    .landing-screen-media {
      width: min(84vw, 404px);
      max-width: min(84vw, 404px);
      height: auto;
      max-height: min(32vh, 258px);
      display: block;
      object-fit: cover;
      object-position: top center;
    }

    .landing-screen-item--crop-frame .landing-screen-media {
      width: 100%;
      height: min(50vh, 520px);
      max-width: none;
      object-fit: cover;
      object-position: 64% 54%;
      transform: scale(1.2);
      transform-origin: center center;
    }

    .landing-swipe-hint {
      display: none;
      margin-top: 6px;
      font-size: 12px;
      color: var(--text-secondary);
      letter-spacing: -0.01em;
    }

    .landing-stat-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 160px));
      gap: 14px;
    }

    .landing-cta-btn {
      width: fit-content;
      min-width: 154px;
    }

    .landing-cta-row {
      position: relative;
      z-index: 3;
      display: inline-flex;
      align-items: flex-end;
      flex-wrap: nowrap;
      gap: 2px;
      margin-top: clamp(12px, 1.8vw, 22px) !important;
    }

    .landing-cta-cat {
      flex: 0 0 auto;
      transform: translateY(24px);
      pointer-events: none;
    }

    .landing-info-section {
      width: 100%;
      max-width: 1240px;
      margin: 0 auto;
      padding: 0 16px clamp(36px, 5vw, 64px);
    }

    .landing-info-grid {
      display: grid;
      grid-template-columns: minmax(0, 1.04fr) minmax(0, 0.96fr);
      gap: clamp(14px, 2.4vw, 26px);
    }

    .landing-info-card,
    .landing-footer {
      border-radius: clamp(26px, 3.8vw, 38px);
      background:
        radial-gradient(circle at 10% 0%, rgba(255, 255, 255, 0.92), transparent 38%),
        rgba(255, 255, 255, 0.58);
      box-shadow:
        0 22px 62px rgba(31, 28, 23, 0.09),
        inset 0 1px 0 rgba(255, 255, 255, 0.78);
      backdrop-filter: blur(16px);
    }

    .landing-info-card {
      padding: clamp(20px, 3.4vw, 34px);
    }

    .landing-info-kicker {
      width: fit-content;
      border-radius: 999px;
      background: rgba(23, 21, 19, 0.08);
      padding: 7px 11px;
      color: var(--text-secondary);
      font-size: 12px;
      font-weight: 760;
      letter-spacing: -0.01em;
    }

    .landing-info-title {
      margin-top: 15px;
      max-width: 680px;
      color: var(--text-primary);
      font-size: clamp(26px, 4vw, 46px);
      font-weight: 920;
      letter-spacing: -0.06em;
      line-height: 0.98;
      text-wrap: balance;
    }

    .landing-info-copy {
      margin-top: 14px;
      color: var(--text-secondary);
      font-size: clamp(14px, 1.55vw, 17px);
      line-height: 1.48;
      letter-spacing: -0.012em;
      text-wrap: balance;
    }

    .landing-step-list {
      margin-top: 22px;
      display: grid;
      gap: 10px;
    }

    .landing-step {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr);
      gap: 12px;
      align-items: start;
      border-radius: 22px;
      background: rgba(255, 255, 255, 0.56);
      padding: 13px 14px;
      color: var(--text-primary);
      font-size: 14px;
      line-height: 1.36;
      letter-spacing: -0.01em;
    }

    .landing-step strong {
      display: block;
      margin-bottom: 2px;
      font-weight: 800;
      letter-spacing: -0.02em;
    }

    .landing-step-index {
      display: inline-flex;
      width: 27px;
      height: 27px;
      align-items: center;
      justify-content: center;
      border-radius: 999px;
      background: #171513;
      color: #fffaf2;
      font-size: 12px;
      font-weight: 820;
      line-height: 1;
    }

    .landing-mini-grid {
      margin-top: 20px;
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
    }

    .landing-mini-card {
      border-radius: 20px;
      background: rgba(255, 255, 255, 0.54);
      padding: 14px;
      color: var(--text-primary);
      font-size: 14px;
      line-height: 1.34;
      letter-spacing: -0.012em;
    }

    .landing-mini-card strong {
      display: block;
      margin-bottom: 4px;
      font-size: 15px;
      font-weight: 820;
      letter-spacing: -0.025em;
    }

    .landing-footer-wrap {
      width: 100%;
      max-width: 1240px;
      margin: 0 auto;
      padding: 0 16px 28px;
    }

    .landing-footer {
      display: grid;
      grid-template-columns: minmax(0, 1.15fr) repeat(3, minmax(120px, 0.35fr));
      gap: clamp(18px, 3vw, 34px);
      padding: clamp(22px, 3.6vw, 34px);
      color: var(--text-secondary);
      font-size: 13px;
      line-height: 1.5;
      letter-spacing: -0.01em;
    }

    .landing-footer-brand {
      max-width: 360px;
    }

    .landing-footer-logo {
      color: var(--text-primary);
      font-size: 22px;
      font-weight: 920;
      letter-spacing: -0.06em;
      line-height: 1;
    }

    .landing-footer-title {
      margin-bottom: 8px;
      color: var(--text-primary);
      font-size: 13px;
      font-weight: 820;
      letter-spacing: -0.015em;
    }

    .landing-footer-links {
      display: grid;
      gap: 6px;
    }

    .landing-footer a {
      width: fit-content;
      color: inherit;
      transition: color 160ms ease;
    }

    .landing-footer a:hover {
      color: var(--text-primary);
    }

    @media (min-width: 768px) {
      .landing-hero-grid {
        gap: clamp(28px, 4vw, 52px);
        grid-template-columns: minmax(0, 1.05fr) minmax(290px, 0.95fr);
      }
    }

    @media (min-width: 1024px) {
      .landing-hero-grid {
        gap: clamp(34px, 4vw, 58px);
        grid-template-columns: minmax(0, 1.02fr) minmax(330px, 0.98fr);
      }
    }

    @media (min-width: 1280px) {
      .landing-hero-grid {
        gap: clamp(44px, 4.5vw, 76px);
        grid-template-columns: minmax(0, 0.98fr) minmax(390px, 500px);
      }

      .landing-screens-grid {
        grid-auto-columns: max-content;
      }
    }

    @media (min-width: 1600px) {
      .landing-hero-grid {
        gap: clamp(56px, 4.4vw, 88px);
        grid-template-columns: minmax(0, 1fr) minmax(440px, 560px);
      }

      .landing-alpha-card {
        max-width: 500px;
      }
    }

    @media (max-width: 767px) {
      .landing-hero-grid {
        justify-items: center;
        gap: 24px;
      }

      .landing-copy {
        max-width: 720px;
        padding-top: 0;
      }

      .landing-alphabet-hint {
        max-width: 100%;
        font-size: 15px;
        color: color-mix(in srgb, var(--text-primary) 72%, white 28%);
      }

      .landing-alpha-card {
        max-width: min(100%, 460px);
      }

      .landing-alpha-cat {
        right: 8px;
        bottom: -66px;
      }

      .landing-screens-grid {
        grid-auto-columns: max-content;
      }
    }

    @media (max-width: 767px) {
      .landing-shell {
        overflow-x: hidden;
      }

      .landing-copy {
        max-width: 100%;
        text-align: center;
      }

      .landing-alphabet-hint {
        max-width: min(100%, 360px);
        justify-content: center;
        padding: 10px 14px;
        border-radius: 18px;
        background: transparent;
        box-shadow: none;
        font-size: 14px;
        line-height: 1.4;
      }

      .landing-alpha-card {
        max-width: min(100%, 392px);
      }

      .landing-alpha-cat {
        display: none;
      }

      .landing-stat-grid {
        grid-template-columns: 1fr;
      }

      .landing-cta-btn {
        width: 100%;
        min-width: 0;
      }

      .landing-cta-row {
        display: flex;
        width: 100%;
        justify-content: center;
        align-items: flex-end;
        flex-wrap: nowrap;
        gap: 3px;
      }

      .landing-cta-cat {
        margin-right: -6px;
        transform: translateY(24px);
      }

      .landing-screens-grid {
        grid-auto-columns: max-content;
        gap: 8px;
        padding-bottom: 4px;
        overflow-x: auto;
        overflow-y: hidden;
        padding-inline: 6px;
        scrollbar-width: none;
        scroll-padding-inline: 6px;
        scroll-snap-type: x proximity;
      }

      .landing-screens-grid::-webkit-scrollbar {
        display: none;
      }

      .landing-screen-item {
        width: min(78vw, 296px);
        aspect-ratio: 296 / 214;
        border-color: rgba(148, 163, 184, 0.22);
        background: rgba(255, 255, 255, 0.6);
        box-shadow: none;
      }

      .landing-screen-media {
        width: 100%;
        max-width: none;
        height: 100%;
        max-height: none;
        object-fit: cover;
        object-position: top center;
      }

      .landing-screen-item {
        scroll-snap-align: center;
      }

      .landing-screen-item--crop-frame {
        width: min(78vw, 286px);
        aspect-ratio: 286 / 360;
        max-height: none;
      }

      .landing-screen-item--crop-frame .landing-screen-media {
        width: 100%;
        height: 100%;
      }

      .landing-screen-media--contain-mobile {
        object-fit: contain;
        object-position: center top;
      }

      .landing-swipe-hint {
        display: block;
        margin-top: 8px;
      }

      .landing-screen-item:nth-child(n + 5) {
        display: none;
      }

      .landing-method-section {
        display: none;
      }

      .landing-info-section {
        padding-bottom: 34px;
      }

      .landing-info-grid {
        grid-template-columns: 1fr;
      }

      .landing-mini-grid {
        grid-template-columns: 1fr;
      }

      .landing-footer {
        grid-template-columns: 1fr;
        border-radius: 28px;
      }

      .landing-screens-grid {
        margin-top: 20px;
      }
    }

    @media (max-width: 479px) {
      .landing-hero-grid {
        gap: 18px;
      }

      .landing-alphabet-hint {
        font-size: 12px;
        line-height: 1.45;
      }

      .landing-alpha-card {
        max-width: 100%;
      }
    }

    @media (display-mode: standalone) and (max-width: 767px) {
      .landing-screens-grid {
        grid-auto-columns: 296px;
        scroll-snap-type: none;
        scroll-padding-inline: 0;
      }

      .landing-screen-item {
        width: 296px;
      }

      .landing-screen-item--crop-frame {
        width: 286px;
      }
    }

    @media (max-width: 767px) {
      html[data-standalone='true'] .landing-screens-grid {
        grid-auto-columns: 296px;
        scroll-snap-type: none;
        scroll-padding-inline: 0;
      }

      html[data-standalone='true'] .landing-screen-item {
        width: 296px;
      }

      html[data-standalone='true'] .landing-screen-item--crop-frame {
        width: 286px;
      }
    }
  `;

  return (
    <main className="landing-shell min-h-screen bg-[var(--app-bg)] text-[var(--app-text)]">
      <style dangerouslySetInnerHTML={{ __html: landingStyles }} />
      <section className="mx-auto flex w-full max-w-[1240px] flex-col justify-center px-4 pt-9 sm:px-6 sm:pt-14 lg:px-8 lg:pt-16">
        <div className="landing-hero-grid grid grid-cols-1 md:grid-cols-[minmax(0,1.08fr)_minmax(250px,0.92fr)]">
          <div className="landing-copy max-w-none md:col-start-1 md:row-start-1">
            <h1 className="landing-title max-w-[620px] text-[clamp(23px,3.8vw,47px)] font-semibold leading-[1.02] tracking-[-0.02em]">
              <LandingCourseTitle />
            </h1>
            <p className="landing-subtitle mt-6 text-[clamp(15px,2vw,20px)] leading-[1.4] text-[var(--text-secondary)]">
              Слушай буквы, читай карточки{' '}
              <br />
              и закрепляй чтение в игре.
            </p>
            <div className="landing-cta-row mt-3">
              <Image
                src="/images/deda-cat.png"
                alt="Deda cat"
                width={136}
                height={136}
                priority
                className="landing-cta-cat h-auto w-[114px] shrink-0 object-contain drop-shadow-[0_8px_18px_rgba(15,23,42,0.08)] sm:w-[128px] lg:w-[150px]"
              />
              <Link
                href="/lessons"
                className="landing-cta-btn inline-flex h-[54px] items-center justify-center rounded-2xl border border-[var(--accent)] bg-[var(--accent)] px-[14px] text-[18px] font-semibold text-white transition-opacity hover:opacity-90"
              >
                Начать читать
              </Link>
            </div>
          </div>

          <div className="landing-alphabet-column relative mt-8 w-full max-w-[458px] md:col-start-2 md:row-span-2 md:row-start-1 md:mt-0 lg:max-w-[540px]">
            <div className="flex flex-col items-center gap-1">
              <div className="text-[14px] font-semibold tracking-[-0.01em] text-[var(--text-primary)]">
                <LandingAlphabetTitle />
              </div>
              <div className="landing-alphabet-hint self-center">
                <div>
                  Нажми на букву и послушай звук
                </div>
              </div>
              <div className="landing-alpha-card min-w-0 self-center">
                <LandingAlphabet />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div id="languages">
        <LandingLanguageBrief />
      </div>

      <section id="how-it-works" className="landing-info-section" aria-labelledby="landing-how-title">
        <div className="landing-info-grid">
          <div className="landing-info-card">
            <div className="landing-info-kicker">Метод Deda</div>
            <h2 id="landing-how-title" className="landing-info-title">Сначала читать, потом играть</h2>
            <p className="landing-info-copy">
              Deda не просит зубрить списки. Пользователь слышит букву, читает короткие карточки и закрепляет навык в игре «Блоки».
            </p>
            <div className="landing-step-list">
              <div className="landing-step">
                <span className="landing-step-index">1</span>
                <span><strong>Слушай буквы</strong>Открой алфавит, нажми букву и запомни звук.</span>
              </div>
              <div className="landing-step">
                <span className="landing-step-index">2</span>
                <span><strong>Читай карточки</strong>Слова собраны из букв урока и уже знакомых букв.</span>
              </div>
              <div className="landing-step">
                <span className="landing-step-index">3</span>
                <span><strong>Закрепляй в игре</strong>Переводи слова и фразы, чтобы чтение стало автоматическим.</span>
              </div>
            </div>
          </div>

          <div className="landing-info-card">
            <div className="landing-info-kicker">Что внутри</div>
            <h2 className="landing-info-title">Для поездок, учёбы и первого контакта с языком</h2>
            <p className="landing-info-copy">
              Сейчас доступны грузинский, испанский, немецкий, сербский и турецкий. В каждом курсе есть алфавит, уроки чтения, разговорные фразы, счёт и покупки.
            </p>
            <div className="landing-mini-grid">
              <div className="landing-mini-card"><strong>Без регистрации</strong>Можно начать сразу и сохранить прогресс на устройстве.</div>
              <div className="landing-mini-card"><strong>Для новичков</strong>Карточки идут от простого к сложному.</div>
              <div className="landing-mini-card"><strong>Практичные темы</strong>Приветствия, покупки, вес, оплата, базовые просьбы.</div>
              <div className="landing-mini-card"><strong>Мобильный формат</strong>Короткие уроки удобно проходить с телефона.</div>
            </div>
          </div>
        </div>
      </section>

      <footer className="landing-footer-wrap" aria-label="Информация о Deda">
        <div className="landing-footer">
          <div className="landing-footer-brand">
            <div className="landing-footer-logo">Deda</div>
            <p className="mt-3">
              Мини-приложение для первого чтения на новом языке: буквы, карточки, игра и практичные фразы для жизни и поездок.
            </p>
            <p className="mt-3">© 2026 Deda. Учимся читать играя.</p>
          </div>
          <div>
            <div className="landing-footer-title">Продукт</div>
            <div className="landing-footer-links">
              <Link href="/lessons">Начать уроки</Link>
              <a href="#how-it-works">Как работает</a>
              <a href="#languages">Языки</a>
            </div>
          </div>
          <div>
            <div className="landing-footer-title">Курсы</div>
            <div className="landing-footer-links">
              <span>Грузинский</span>
              <span>Испанский</span>
              <span>Немецкий</span>
              <span>Сербский</span>
              <span>Турецкий</span>
            </div>
          </div>
          <div>
            <div className="landing-footer-title">Помощь</div>
            <div className="landing-footer-links">
              <Link href="/support">Поддержка</Link>
              <Link href="/privacy">Конфиденциальность</Link>
              <span>Прогресс хранится локально и в аккаунте, если пользователь вошёл.</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
