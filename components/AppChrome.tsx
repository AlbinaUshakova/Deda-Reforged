'use client';

import { usePathname } from 'next/navigation';
import AuthStatus from '@/components/AuthStatus';
import BrandToggle from '@/components/BrandToggle';
import GlobalAlphabetOverlay from '@/components/GlobalAlphabetOverlay';
import InterfaceLanguageSwitcher from '@/components/InterfaceLanguageSwitcher';

export default function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLandingPage = pathname === '/';

  return (
    <>
      {!isLandingPage && (
        <header className="sticky top-0 z-[260] h-[clamp(48px,7.2vh,66px)] w-full border-b border-[var(--header-border)] bg-[var(--header-bg)] text-[var(--header-text)] backdrop-blur-md">
          <div className="app-header-shell mx-auto flex h-full w-full items-center justify-between gap-[clamp(8px,1.8vw,16px)] px-[clamp(12px,2.4vw,24px)] sm:px-[clamp(14px,2.8vw,28px)] lg:w-[78vw] xl:w-[73vw] 2xl:w-[66vw] min-[1900px]:w-[60vw] min-[2100px]:w-[58vw] max-w-[1820px]">
            <div className="app-header-left justify-self-start">
              <BrandToggle />
            </div>
            <div className="app-header-controls justify-self-end flex items-center gap-2">
              <InterfaceLanguageSwitcher />
              <AuthStatus />
            </div>
          </div>
        </header>
      )}
      <GlobalAlphabetOverlay />

      <main className="min-h-screen min-h-[100dvh] w-full bg-[var(--app-bg)]">
        <div className={`mx-auto w-full bg-[var(--app-bg)] ${
          isLandingPage
            ? ''
            : 'lg:w-[92vw] xl:w-[86vw] 2xl:w-[78vw] min-[1900px]:w-[70vw] min-[2100px]:w-[68vw] max-w-[1820px]'
        }`}>
          {children}
        </div>
      </main>
    </>
  );
}
