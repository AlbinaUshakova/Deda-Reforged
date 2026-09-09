// components/SettingsPanel.tsx
'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/appStore';
import { type CourseId } from '@/lib/courses';
import { getCourseName } from '@/lib/interfaceText';

export default function SettingsPanel({
    onClose,
    onBack,
}: {
    onClose: () => void;
    onBack?: () => void;
}) {
    const settings = useAppStore(state => state.settings);
    const updateSettings = useAppStore(state => state.updateSettings);
    const interfaceLanguage = settings.interfaceLanguage;
    const [translationDirection, setTranslationDirection] = useState<'ge-ru' | 'ru-ge'>('ge-ru');
    const courseId = settings.courseId;

    useEffect(() => {
        setTranslationDirection(settings.translationDirection);
    }, [settings.translationDirection]);

    const applyAndExit = (afterApply: () => void) => {
        updateSettings({
            translationDirection,
        });
        afterApply();
    };

    const handleClose = () => {
        applyAndExit(onClose);
    };

    const handleBack = () => {
        if (!onBack) return;
        applyAndExit(onBack);
    };
    return (
        <div className="menu-floating-anchor">
            <div
                className="menu-panel-shell menu-panel-size animate-modal-in overflow-y-auto rounded-2xl border border-[var(--menu-border)] bg-[var(--menu-bg)] p-[clamp(8px,1.5vw,10px)] text-[clamp(11px,1.8vw,12px)] text-[var(--menu-text)] shadow-[var(--menu-shadow)]"
            >
                <div
                    className="relative flex h-7 items-center justify-center border-b px-0.5 pb-0"
                    style={{ borderColor: 'color-mix(in srgb, var(--menu-divider) 68%, transparent 32%)' }}
                >
                    {onBack && (
                        <button
                            aria-label={interfaceLanguage === 'en' ? 'Back to menu' : 'Назад в меню'}
                            className="absolute left-1 top-1/2 h-6 w-6 -translate-y-1/2 rounded-md text-[var(--menu-text-muted)] opacity-85 transition hover:bg-transparent hover:text-[var(--menu-text)] focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--menu-focus)] focus-visible:outline-offset-2"
                            onClick={handleBack}
                        >
                            <svg viewBox="0 0 20 20" className="mx-auto h-[11px] w-[11px]" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M12.5 4.5L7 10l5.5 5.5" />
                            </svg>
                        </button>
                    )}
                    <div className="whitespace-nowrap px-7 text-center text-[clamp(9px,1.55vw,13px)] font-semibold text-[var(--menu-text)]">
                        {interfaceLanguage === 'en' ? 'Game settings' : 'Настройки игры'}
                    </div>
                    <button
                        type="button"
                        aria-label={interfaceLanguage === 'en' ? 'Close' : 'Закрыть'}
                        className="home-alphabet-close absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 rounded-md text-[11px] transition-colors focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--menu-focus)] focus-visible:outline-offset-2"
                        onClick={handleClose}
                    >
                        ✕
                    </button>
                </div>
                <div className="pt-2.5">
                    <div className="mb-2 text-[clamp(10px,1.8vw,12px)] text-[var(--menu-text)]">
                        {interfaceLanguage === 'en' ? 'Practice direction' : 'Направление тренировки'}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            type="button"
                            onClick={() => {
                                setTranslationDirection('ge-ru');
                            }}
                            aria-pressed={translationDirection === 'ge-ru'}
                            className={`relative rounded-[10px] border px-2 py-1 text-[clamp(10px,1.65vw,11px)] font-medium transition-colors ${translationDirection === 'ge-ru'
                                ? 'text-[var(--btn-active-text)] shadow-none'
                                : 'border-[#3E4B5E] bg-transparent text-[#A8B3C7] hover:bg-white/5 hover:border-[#6C6CFF] hover:text-[var(--menu-text)]'
                                }`}
                            style={
                                translationDirection === 'ge-ru'
                                    ? {
                                        background: 'color-mix(in srgb, var(--btn-active-bg) 72%, white 28%)',
                                        borderColor: 'color-mix(in srgb, var(--btn-active-border) 48%, transparent 52%)',
                                    }
                                    : undefined
                            }
                        >
                            <div>{getCourseName(courseId as CourseId, interfaceLanguage)} → {interfaceLanguage === 'en' ? 'English' : 'Русский'}</div>
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setTranslationDirection('ru-ge');
                            }}
                            aria-pressed={translationDirection === 'ru-ge'}
                            className={`relative rounded-[10px] border px-2 py-1 text-[clamp(10px,1.65vw,11px)] font-medium transition-colors ${translationDirection === 'ru-ge'
                                ? 'text-[var(--btn-active-text)] shadow-none'
                                : 'border-[#3E4B5E] bg-transparent text-[#A8B3C7] hover:bg-white/5 hover:border-[#6C6CFF] hover:text-[var(--menu-text)]'
                                }`}
                            style={
                                translationDirection === 'ru-ge'
                                    ? {
                                        background: 'color-mix(in srgb, var(--btn-active-bg) 72%, white 28%)',
                                        borderColor: 'color-mix(in srgb, var(--btn-active-border) 48%, transparent 52%)',
                                    }
                                    : undefined
                            }
                        >
                            <div>{interfaceLanguage === 'en' ? 'English' : 'Русский'} → {getCourseName(courseId as CourseId, interfaceLanguage)}</div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
