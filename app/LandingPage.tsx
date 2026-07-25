import Image from 'next/image';
import Link from 'next/link';
import AuthStatus from '@/components/AuthStatus';
import LandingAlphabet from '@/components/LandingAlphabet';
import {
  LandingAlphabetTitle,
  LandingCourseTitle,
  LandingFinalCtaTitle,
  LandingLanguagePicker,
} from '@/components/LandingCourseTitle';

export const landingMetadata = {
  title: 'Deda - учимся читать на разных языках играя.',
  description:
    'Грузинский, английский, испанский, немецкий, сербский и турецкий: слушай буквы, читай карточки и закрепляй чтение в игре.',
};

export default function LandingPage() {

  return (
    <main className="landing-shell min-h-screen bg-[var(--app-bg)] text-[var(--app-text)]">
      <section id="languages" className="mx-auto flex w-full max-w-[1240px] flex-col justify-center px-4 pt-6 sm:px-6 sm:pt-8 lg:px-8 lg:pt-9">
        <div className="landing-topbar">
          <div className="landing-brand">Deda</div>
          <AuthStatus />
        </div>
        <div className="landing-hero-grid grid grid-cols-1 md:grid-cols-[minmax(0,1.08fr)_minmax(250px,0.92fr)]">
          <div className="landing-copy max-w-none md:col-start-1 md:row-start-1">
            <h1 className="landing-title max-w-[620px] text-[clamp(42px,5.7vw,74px)] font-semibold leading-[0.98] tracking-[-0.02em]">
              <LandingCourseTitle />
            </h1>
            <p className="landing-subtitle mt-6 text-[clamp(18px,1.8vw,22px)] leading-[1.42] text-[var(--text-secondary)]">
              Слушай буквы, читай слова, закрепляй в игре.
            </p>
            <div className="landing-course-label">Какой язык будем учить?</div>
            <LandingLanguagePicker />
            <div className="landing-cta-row mt-3">
              <Link
                href="/lessons"
                className="landing-cta-btn inline-flex h-[64px] items-center justify-center rounded-[20px] border border-[var(--accent)] bg-[var(--accent)] px-7 text-[20px] font-semibold text-white transition-opacity hover:opacity-90"
              >
                Начать первый урок <span className="ml-3 text-[26px] leading-none">→</span>
              </Link>
            </div>
            <div className="landing-hero-meta" aria-label="Условия старта">
              <span>Бесплатно</span>
              <span>Займёт около 5 минут</span>
            </div>
          </div>

          <div className="landing-alphabet-column relative mt-8 w-full max-w-[430px] md:col-start-2 md:row-span-2 md:row-start-1 md:mt-0 lg:max-w-[470px]">
            <Image
              src="/images/cats/deda-headphones.png"
              alt=""
              width={180}
              height={180}
              priority
              className="pointer-events-none absolute bottom-0 right-full z-20 mr-2 hidden h-[150px] w-[150px] object-contain lg:block xl:mr-3 xl:h-[168px] xl:w-[168px]"
            />
            <div className="flex flex-col items-start">
              <div className="landing-alpha-card min-w-0 self-center">
                <div className="landing-alpha-title">
                  <LandingAlphabetTitle />
                </div>
                <div className="landing-alphabet-hint">
                  <span>
                    Нажми на букву и послушай, как она звучит
                  </span>
                </div>
                <LandingAlphabet />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-info-section" aria-label="Что внутри Deda">
        <div className="landing-info-grid">
          <div className="landing-info-card">
            <div className="landing-info-header">
              <div>
                <span className="landing-info-kicker">Внутри Deda</span>
                <h2 className="landing-preview-title">От первой буквы до первых фраз</h2>
              </div>
              <p className="landing-info-lead">
                Слушай, читай, играй и начинай говорить.
              </p>
            </div>
            <div className="landing-feature-strip">
              <div className="landing-feature">
                <span className="landing-feature-icon" aria-hidden="true">1</span>
                <span><span className="landing-feature-title">Слушай</span><span className="landing-feature-copy">Нажми на букву и послушай её звук.</span></span>
              </div>
              <div className="landing-feature">
                <span className="landing-feature-icon" aria-hidden="true">2</span>
                <span><span className="landing-feature-title">Читай</span><span className="landing-feature-copy">Читай первые слова уже с первых уроков.</span></span>
              </div>
              <div className="landing-feature">
                <span className="landing-feature-icon" aria-hidden="true">3</span>
                <span><span className="landing-feature-title">Играй</span><span className="landing-feature-copy">Понял слово — сделал ход.</span></span>
              </div>
            </div>
          </div>
          <div className="landing-info-card landing-final-cta">
            <Image
              src="/images/cats/deda-landing-curious.png"
              alt=""
              width={140}
              height={140}
              className="h-16 w-16 justify-self-center object-contain md:h-24 md:w-24 md:self-end"
            />
            <div>
              <h2 className="landing-preview-title"><LandingFinalCtaTitle /></h2>
              <p className="landing-info-copy mt-2">
                Первый урок займёт несколько минут.
              </p>
            </div>
            <Link href="/lessons" className="landing-cta-btn inline-flex h-[58px] items-center justify-center rounded-[18px] px-7 text-[18px] font-semibold">
              Начать первый урок <span className="ml-3 text-[24px] leading-none">→</span>
            </Link>
          </div>
        </div>
      </section>

      <footer className="landing-footer-wrap" aria-label="Информация о Deda">
        <div className="landing-footer">
          <div className="landing-footer-brand">
            <div className="landing-footer-logo">Deda</div>
            <p>© 2026 Deda. Учимся читать играя.</p>
          </div>
          <div className="landing-footer-links">
            <a href="#languages">Языки</a>
            <Link href="/support">Поддержка</Link>
            <Link href="/privacy">Конфиденциальность</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
