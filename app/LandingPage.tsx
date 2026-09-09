'use client';

import { useEffect, useMemo, useState, useTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Route } from 'next';
import AuthStatus from '@/components/AuthStatus';
import InterfaceLanguageSwitcher from '@/components/InterfaceLanguageSwitcher';
import LandingAlphabet from '@/components/LandingAlphabet';
import SerbianScriptSwitcher from '@/components/SerbianScriptSwitcher';
import { useAppStore } from '@/lib/appStore';
import { getEpisodesDataSync } from '@/lib/clientContentCache';
import {
  PRIMARY_ACTIVE_COURSE_IDS,
  SECONDARY_ACTIVE_COURSE_IDS,
  type CourseId,
  progressKeyForEpisode,
} from '@/lib/courses';
import { getCourseName } from '@/lib/interfaceText';
import { deriveLessonState, getLessonPosition } from '@/lib/lessonProgress';
import {
  LandingCourseTitle,
  LandingFinalCtaTitle,
  LandingLanguagePicker,
} from '@/components/LandingCourseTitle';

export default function LandingPage() {
  const router = useRouter();
  const settings = useAppStore(state => state.settings);
  const progressMap = useAppStore(state => state.progressMap);
  const hydrate = useAppStore(state => state.hydrate);
  const updateSettings = useAppStore(state => state.updateSettings);
  const interfaceLanguage = settings.interfaceLanguage;
  const courseId = settings.courseId;
  const lessonTargetScore = settings.lessonTargetScore;
  const [hydrated, setHydrated] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState<1 | 2>(1);
  const [isRoutingAfterOnboarding, startRoutingAfterOnboarding] = useTransition();

  useEffect(() => {
    setHydrated(true);
    void hydrate();
  }, [hydrate]);

  const onboardingVisible = hydrated && !settings.hasCompletedOnboarding;
  const onboardingPrimaryCourseIds = useMemo(() => PRIMARY_ACTIVE_COURSE_IDS, []);
  const onboardingSecondaryCourseIds = useMemo(() => SECONDARY_ACTIVE_COURSE_IDS, []);
  const initialEpisodesData = useMemo(() => getEpisodesDataSync(courseId), [courseId]);
  const courseProgress = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(progressMap).flatMap(([key, value]) => {
          if (courseId === 'ka') return [[key, value]];
          const prefix = `${courseId}:`;
          return key.startsWith(prefix) ? [[key.slice(prefix.length), value]] : [];
        }),
      ),
    [courseId, progressMap],
  );
  const { recommendedEpId, normalEpisodes } = useMemo(
    () =>
      deriveLessonState({
        episodes: initialEpisodesData.episodes,
        progress: courseProgress,
        lessonTargetScore,
        lettersByEpisode: initialEpisodesData.lettersByEpisode,
        cachedLetterStatusByChar: {},
      }),
    [courseProgress, initialEpisodesData.episodes, initialEpisodesData.lettersByEpisode, lessonTargetScore],
  );
  const ctaEpisodeId = recommendedEpId ?? 'ep1';
  const ctaLessonNumber = getLessonPosition(normalEpisodes, ctaEpisodeId) ?? 1;
  const ctaProgress = progressMap[progressKeyForEpisode(courseId, ctaEpisodeId)] ?? 0;
  const ctaHref = (settings.hasCompletedOnboarding ? `/study/${ctaEpisodeId}` : '/lessons') as Route;
  const ctaLabel = settings.hasCompletedOnboarding
    ? ctaProgress > 0
      ? interfaceLanguage === 'en'
        ? 'Continue'
        : 'Продолжить'
      : interfaceLanguage === 'en'
        ? `Start lesson ${ctaLessonNumber}`
        : `Начать урок ${ctaLessonNumber}`
    : interfaceLanguage === 'en'
      ? 'Start the first lesson'
      : 'Первый урок';
  const ctaMeta = settings.hasCompletedOnboarding
    ? ctaProgress > 0
      ? interfaceLanguage === 'en'
        ? 'Pick up where you left off.'
        : 'Продолжай с места паузы.'
      : interfaceLanguage === 'en'
        ? 'Recommended next step.'
        : 'Рекомендуемый первый шаг.'
    : interfaceLanguage === 'en'
      ? 'Choose a language first.'
      : 'Сначала выбери язык.';
  const backgroundAriaHidden = onboardingVisible ? true : undefined;

  const handleInterfacePick = (language: 'en' | 'ru') => {
    updateSettings({ interfaceLanguage: language });
    setOnboardingStep(2);
  };

  const handleCoursePick = (courseId: CourseId) => {
    updateSettings({
      courseId,
      hasCompletedOnboarding: true,
    });
    startRoutingAfterOnboarding(() => {
      router.push('/lessons');
    });
  };

  return (
    <main className="landing-shell min-h-screen bg-[var(--app-bg)] text-[var(--app-text)]">
      {onboardingVisible && (
        <div className="fixed inset-0 z-[260] flex items-center justify-center bg-[rgba(250,244,235,0.82)] p-4 backdrop-blur-sm">
          <div className="w-full max-w-[720px] rounded-[32px] border border-white/70 bg-white/92 p-5 shadow-[0_24px_70px_rgba(31,28,23,0.16)] sm:p-7">
            <div className="text-center">
              <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[var(--text-tertiary)]">
                {interfaceLanguage === 'en'
                  ? `Step ${onboardingStep} of 2`
                  : `Шаг ${onboardingStep} из 2`}
              </div>
              <h2 className="mt-2 text-[clamp(28px,4vw,40px)] font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
                {onboardingStep === 1
                  ? (interfaceLanguage === 'en' ? 'Choose app language' : 'Выбери язык приложения')
                  : (interfaceLanguage === 'en' ? 'Choose your first language' : 'Выбери первую письменность')}
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
              <div className="mx-auto mt-6 flex w-full max-w-[640px] flex-col gap-4">
                <div className="flex flex-wrap justify-center gap-3">
                  {onboardingPrimaryCourseIds.map(courseId => (
                    <button
                      key={courseId}
                      type="button"
                      onClick={() => handleCoursePick(courseId)}
                      disabled={isRoutingAfterOnboarding}
                      className="rounded-[22px] border border-[var(--border-soft)] bg-white px-5 py-4 text-[20px] font-semibold text-[var(--text-primary)] shadow-[0_10px_24px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5"
                      aria-label={`Choose ${getCourseName(courseId, interfaceLanguage)}`}
                    >
                      {getCourseName(courseId, interfaceLanguage)}
                    </button>
                  ))}
                </div>
                <div className="text-center text-[13px] font-medium text-[var(--text-secondary)]">
                  {interfaceLanguage === 'en' ? 'Also available now: Serbian' : 'Также доступен: Сербский'}
                </div>
                <div className="flex flex-wrap justify-center gap-3">
                  {onboardingSecondaryCourseIds.map(courseId => (
                    <button
                      key={courseId}
                      type="button"
                      onClick={() => handleCoursePick(courseId)}
                      disabled={isRoutingAfterOnboarding}
                      className="rounded-[18px] border border-[var(--border-soft)] bg-white px-4 py-3 text-[17px] font-semibold text-[var(--text-primary)] shadow-[0_10px_24px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5"
                      aria-label={`Choose ${getCourseName(courseId, interfaceLanguage)}`}
                    >
                      {getCourseName(courseId, interfaceLanguage)}
                    </button>
                  ))}
                </div>
                <div className="text-center text-[12px] font-medium text-[var(--text-secondary)]">
                  {interfaceLanguage === 'en'
                    ? 'Korean, Russian, Japanese, and Arabic come next.'
                    : 'Дальше: корейский, русский, японский и арабский.'}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      <section
        id="languages"
        aria-hidden={backgroundAriaHidden}
        className="mx-auto flex w-full max-w-[1240px] flex-col justify-center px-4 pt-6 sm:px-6 sm:pt-8 lg:px-8 lg:pt-9"
      >
        <div className="landing-topbar">
          <div className="landing-brand">Deda</div>
          <div className="landing-topbar-controls flex items-center gap-2">
            <InterfaceLanguageSwitcher />
            <AuthStatus />
          </div>
        </div>
        <div className="landing-hero-grid grid grid-cols-1 xl:grid-cols-[minmax(0,1.08fr)_minmax(250px,0.92fr)]">
          <div className="landing-copy max-w-none xl:col-start-1 xl:row-start-1">
            <h1 className="landing-title mx-auto max-w-[620px] text-[clamp(42px,5.7vw,74px)] font-semibold leading-[0.98] tracking-[-0.02em] xl:mx-0">
              <LandingCourseTitle />
            </h1>
            <div className="landing-course-label">
              {settings.hasCompletedOnboarding
                ? interfaceLanguage === 'en'
                  ? 'Choose language'
                  : 'Выбери письменность'
                : interfaceLanguage === 'en'
                  ? 'Choose language'
                  : 'Выбери язык'}
            </div>
            <LandingLanguagePicker />
            <div className="landing-cta-row mt-3">
              <Link
                href={ctaHref}
                className="landing-cta-btn inline-flex h-[64px] items-center justify-center rounded-[20px] border border-[var(--accent)] bg-[var(--accent)] px-7 text-[20px] font-semibold text-white transition-opacity hover:opacity-90"
              >
                {ctaLabel} <span className="ml-3 text-[26px] leading-none">→</span>
              </Link>
            </div>
            <div className="landing-hero-meta" aria-label={interfaceLanguage === 'en' ? 'Getting started' : 'Условия старта'}>
              <span>{interfaceLanguage === 'en' ? 'Free' : 'Бесплатно'}</span>
              <span>{interfaceLanguage === 'en' ? 'First words in about 5 minutes' : 'Первые слова за 5 минут'}</span>
              {settings.hasCompletedOnboarding && <span>{ctaMeta}</span>}
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
              {courseId === 'sr' && (
                <div className="landing-script-switcher-wrap mb-3 flex w-full justify-center">
                  <SerbianScriptSwitcher />
                </div>
              )}
              <div className="landing-alpha-card min-w-0 self-center">
                <LandingAlphabet />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="landing-info-section"
        aria-hidden={backgroundAriaHidden}
        aria-label={interfaceLanguage === 'en' ? 'What is inside Deda' : 'Что внутри Deda'}
      >
        <div className="landing-info-grid">
          <div className="landing-info-card">
            <div className="landing-info-header">
              <div>
                <span className="landing-info-kicker">{interfaceLanguage === 'en' ? 'Inside Deda' : 'Внутри Deda'}</span>
                <h2 className="landing-preview-title">
                  {interfaceLanguage === 'en' ? 'From unfamiliar symbols to readable words' : 'От букв к словам'}
                </h2>
              </div>
              <p className="landing-info-lead">
                {interfaceLanguage === 'en' ? 'Learn a few letters, read real words, and lock them in with a short game.' : 'Несколько букв, реальные слова и короткая игра.'}
              </p>
            </div>
            <div className="landing-feature-strip">
              <div className="landing-feature">
                <span className="landing-feature-icon" aria-hidden="true">1</span>
                <span><span className="landing-feature-title">{interfaceLanguage === 'en' ? 'Learn letters' : 'Буквы'}</span><span className="landing-feature-copy">{interfaceLanguage === 'en' ? 'Tap a symbol and hear its sound.' : 'Нажми и услышь звук.'}</span></span>
              </div>
              <div className="landing-feature">
                <span className="landing-feature-icon" aria-hidden="true">2</span>
                <span><span className="landing-feature-title">{interfaceLanguage === 'en' ? 'Read words' : 'Слова'}</span><span className="landing-feature-copy">{interfaceLanguage === 'en' ? 'Read with the letters you already know.' : 'Читай из уже знакомых букв.'}</span></span>
              </div>
              <div className="landing-feature">
                <span className="landing-feature-icon" aria-hidden="true">3</span>
                <span><span className="landing-feature-title">{interfaceLanguage === 'en' ? 'Practice' : 'Игра'}</span><span className="landing-feature-copy">{interfaceLanguage === 'en' ? 'Practice new words in a short game.' : 'Закрепи слова в игре.'}</span></span>
              </div>
              <div className="landing-feature">
                <span className="landing-feature-icon" aria-hidden="true">4</span>
                <span><span className="landing-feature-title">{interfaceLanguage === 'en' ? 'Read directly' : 'Самостоятельно'}</span><span className="landing-feature-copy">{interfaceLanguage === 'en' ? 'Rely less on transliteration as you go.' : 'Постепенно без транслитерации.'}</span></span>
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
            <Link href={ctaHref} className="landing-cta-btn inline-flex h-[58px] items-center justify-center rounded-[18px] px-7 text-[18px] font-semibold">
              {ctaLabel} <span className="ml-3 text-[24px] leading-none">→</span>
            </Link>
          </div>
        </div>
      </section>

      <footer
        className="landing-footer-wrap"
        aria-hidden={backgroundAriaHidden}
        aria-label={interfaceLanguage === 'en' ? 'About Deda' : 'Информация о Deda'}
      >
        <div className="landing-footer">
          <div className="landing-footer-brand">
            <div className="landing-footer-logo">Deda</div>
            <p>{interfaceLanguage === 'en' ? '© 2026 Deda. Start reading through play.' : '© 2026 Deda. Начни читать через игру.'}</p>
          </div>
          <div className="landing-footer-links">
            <Link href={'/support-deda' as Route}>{interfaceLanguage === 'en' ? 'Support the project' : 'Поддержать проект'}</Link>
            <Link href="/support">{interfaceLanguage === 'en' ? 'Help' : 'Помощь'}</Link>
            <Link href="/privacy">{interfaceLanguage === 'en' ? 'Privacy' : 'Конфиденциальность'}</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
