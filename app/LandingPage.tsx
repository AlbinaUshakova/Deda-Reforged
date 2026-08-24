'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import AuthStatus from '@/components/AuthStatus';
import InterfaceLanguageSwitcher from '@/components/InterfaceLanguageSwitcher';
import LandingAlphabet from '@/components/LandingAlphabet';
import SerbianScriptSwitcher from '@/components/SerbianScriptSwitcher';
import { useAppStore } from '@/lib/appStore';
import { COURSES, COURSE_IDS, type CourseId } from '@/lib/courses';
import { getCourseName } from '@/lib/interfaceText';
import {
  LandingCourseTitle,
  LandingFinalCtaTitle,
  LandingLanguagePicker,
} from '@/components/LandingCourseTitle';

export default function LandingPage() {
  const settings = useAppStore(state => state.settings);
  const hydrate = useAppStore(state => state.hydrate);
  const updateSettings = useAppStore(state => state.updateSettings);
  const interfaceLanguage = settings.interfaceLanguage;
  const [hydrated, setHydrated] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState<1 | 2>(1);

  useEffect(() => {
    void hydrate().finally(() => setHydrated(true));
  }, [hydrate]);

  const onboardingVisible = hydrated && !settings.hasCompletedOnboarding;
  const onboardingCourseIds = useMemo(
    () => COURSE_IDS.filter(id => !(interfaceLanguage === 'en' && id === 'en')),
    [interfaceLanguage],
  );

  const handleInterfacePick = (language: 'en' | 'ru') => {
    updateSettings({ interfaceLanguage: language });
    setOnboardingStep(2);
  };

  const handleCoursePick = (courseId: CourseId) => {
    updateSettings({
      courseId,
      hasCompletedOnboarding: true,
    });
  };

  return (
    <main className="landing-shell min-h-screen bg-[var(--app-bg)] text-[var(--app-text)]">
      {onboardingVisible && (
        <div className="fixed inset-0 z-[260] flex items-center justify-center bg-[rgba(250,244,235,0.82)] p-4 backdrop-blur-sm">
          <div className="w-full max-w-[720px] rounded-[32px] border border-white/70 bg-white/92 p-5 shadow-[0_24px_70px_rgba(31,28,23,0.16)] sm:p-7">
            <div className="text-center">
              <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[var(--text-tertiary)]">
                {onboardingStep === 1 ? 'Step 1' : 'Step 2'}
              </div>
              <h2 className="mt-2 text-[clamp(28px,4vw,40px)] font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
                {onboardingStep === 1
                  ? 'What language do you speak?'
                  : 'What language do you want to learn?'}
              </h2>
            </div>

            {onboardingStep === 1 ? (
              <div className="mx-auto mt-6 grid max-w-[460px] gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => handleInterfacePick('en')}
                  className="rounded-[22px] border border-[var(--border-soft)] bg-white px-5 py-4 text-[20px] font-semibold text-[var(--text-primary)] shadow-[0_10px_24px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5"
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => handleInterfacePick('ru')}
                  className="rounded-[22px] border border-[var(--border-soft)] bg-white px-5 py-4 text-[20px] font-semibold text-[var(--text-primary)] shadow-[0_10px_24px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5"
                >
                  Русский
                </button>
              </div>
            ) : (
              <div className="mx-auto mt-6 flex max-w-[640px] flex-wrap justify-center gap-3">
                {onboardingCourseIds.map(courseId => (
                  <button
                    key={courseId}
                    type="button"
                    onClick={() => handleCoursePick(courseId)}
                    className="rounded-[22px] border border-[var(--border-soft)] bg-white px-5 py-4 text-[20px] font-semibold text-[var(--text-primary)] shadow-[0_10px_24px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5"
                    aria-label={`Choose ${getCourseName(courseId, interfaceLanguage)}`}
                  >
                    {getCourseName(courseId, interfaceLanguage)}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      <section id="languages" className="mx-auto flex w-full max-w-[1240px] flex-col justify-center px-4 pt-6 sm:px-6 sm:pt-8 lg:px-8 lg:pt-9">
        <div className="landing-topbar">
          <div className="landing-brand">Deda</div>
          <div className="flex items-center gap-2">
            <InterfaceLanguageSwitcher />
            <SerbianScriptSwitcher />
            <AuthStatus />
          </div>
        </div>
        <div className="landing-hero-grid grid grid-cols-1 xl:grid-cols-[minmax(0,1.08fr)_minmax(250px,0.92fr)]">
          <div className="landing-copy max-w-none xl:col-start-1 xl:row-start-1">
            <h1 className="landing-title mx-auto max-w-[620px] text-[clamp(42px,5.7vw,74px)] font-semibold leading-[0.98] tracking-[-0.02em] xl:mx-0">
              <LandingCourseTitle />
            </h1>
            <div className="landing-course-label">
              {interfaceLanguage === 'en' ? 'Which language do you want to learn?' : 'Какой язык будем учить?'}
            </div>
            <LandingLanguagePicker />
            <div className="landing-cta-row mt-3">
              <Link
                href="/lessons"
                className="landing-cta-btn inline-flex h-[64px] items-center justify-center rounded-[20px] border border-[var(--accent)] bg-[var(--accent)] px-7 text-[20px] font-semibold text-white transition-opacity hover:opacity-90"
              >
                {interfaceLanguage === 'en' ? 'Start the first lesson' : 'Начать первый урок'} <span className="ml-3 text-[26px] leading-none">→</span>
              </Link>
            </div>
            <div className="landing-hero-meta" aria-label={interfaceLanguage === 'en' ? 'Getting started' : 'Условия старта'}>
              <span>{interfaceLanguage === 'en' ? 'Free' : 'Бесплатно'}</span>
              <span>{interfaceLanguage === 'en' ? 'About 5 minutes to start' : 'Займёт около 5 минут'}</span>
            </div>
          </div>

          <div className="landing-alphabet-column relative mt-8 w-full max-w-[430px] xl:col-start-2 xl:row-span-2 xl:row-start-1 xl:mt-0 lg:max-w-[470px]">
            <Image
              src="/images/cats/deda-headphones.png"
              alt=""
              width={180}
              height={180}
              priority
              className="pointer-events-none absolute bottom-0 right-full z-20 mr-2 hidden h-[150px] w-[150px] object-contain lg:block xl:mr-3 xl:h-[168px] xl:w-[168px]"
            />
            <div className="flex flex-col items-center">
              <div className="landing-alpha-card min-w-0 self-center">
                <LandingAlphabet />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-info-section" aria-label={interfaceLanguage === 'en' ? 'What is inside Deda' : 'Что внутри Deda'}>
        <div className="landing-info-grid">
          <div className="landing-info-card">
            <div className="landing-info-header">
              <div>
                <span className="landing-info-kicker">{interfaceLanguage === 'en' ? 'Inside Deda' : 'Внутри Deda'}</span>
                <h2 className="landing-preview-title">
                  {interfaceLanguage === 'en' ? 'From the first letter to the first phrases' : 'От первой буквы до первых фраз'}
                </h2>
              </div>
              <p className="landing-info-lead">
                {interfaceLanguage === 'en' ? 'Listen, read, play, and start speaking.' : 'Слушай, читай, играй и начинай говорить.'}
              </p>
            </div>
            <div className="landing-feature-strip">
              <div className="landing-feature">
                <span className="landing-feature-icon" aria-hidden="true">1</span>
                <span><span className="landing-feature-title">{interfaceLanguage === 'en' ? 'Listen' : 'Слушай'}</span><span className="landing-feature-copy">{interfaceLanguage === 'en' ? 'Tap a letter and hear its sound.' : 'Нажми на букву и послушай её звук.'}</span></span>
              </div>
              <div className="landing-feature">
                <span className="landing-feature-icon" aria-hidden="true">2</span>
                <span><span className="landing-feature-title">{interfaceLanguage === 'en' ? 'Read' : 'Читай'}</span><span className="landing-feature-copy">{interfaceLanguage === 'en' ? 'Read your first words from the first lessons.' : 'Читай первые слова уже с первых уроков.'}</span></span>
              </div>
              <div className="landing-feature">
                <span className="landing-feature-icon" aria-hidden="true">3</span>
                <span><span className="landing-feature-title">{interfaceLanguage === 'en' ? 'Play' : 'Играй'}</span><span className="landing-feature-copy">{interfaceLanguage === 'en' ? 'Understand the word and make your move.' : 'Понял слово — сделал ход.'}</span></span>
              </div>
              <div className="landing-feature">
                <span className="landing-feature-icon" aria-hidden="true">4</span>
                <span><span className="landing-feature-title">{interfaceLanguage === 'en' ? 'Start speaking' : 'Начинай говорить'}</span><span className="landing-feature-copy">{interfaceLanguage === 'en' ? 'You will start picking up words and speaking naturally.' : 'Не заметишь, как выучишь слова и заговоришь.'}</span></span>
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
            </div>
            <Link href="/lessons" className="landing-cta-btn inline-flex h-[58px] items-center justify-center rounded-[18px] px-7 text-[18px] font-semibold">
              {interfaceLanguage === 'en' ? 'Start the first lesson' : 'Начать первый урок'} <span className="ml-3 text-[24px] leading-none">→</span>
            </Link>
          </div>
        </div>
      </section>

      <footer className="landing-footer-wrap" aria-label={interfaceLanguage === 'en' ? 'About Deda' : 'Информация о Deda'}>
        <div className="landing-footer">
          <div className="landing-footer-brand">
            <div className="landing-footer-logo">Deda</div>
            <p>{interfaceLanguage === 'en' ? '© 2026 Deda. Learn to read through play.' : '© 2026 Deda. Учимся читать играя.'}</p>
          </div>
          <div className="landing-footer-links">
            <a href="#languages">{interfaceLanguage === 'en' ? 'Languages' : 'Языки'}</a>
            <Link href="/support">{interfaceLanguage === 'en' ? 'Support' : 'Поддержка'}</Link>
            <Link href="/privacy">{interfaceLanguage === 'en' ? 'Privacy' : 'Конфиденциальность'}</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
