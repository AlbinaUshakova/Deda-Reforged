'use client';

import { useAppStore } from '@/lib/appStore';

export default function SerbianScriptSwitcher() {
  const courseId = useAppStore(state => state.settings.courseId);
  const interfaceLanguage = useAppStore(state => state.settings.interfaceLanguage);
  const transliterationMode = useAppStore(state => state.settings.transliterationMode);
  const updateSettings = useAppStore(state => state.updateSettings);

  if (courseId !== 'sr') return null;

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-[var(--border-soft)] bg-white/80 p-1 shadow-[0_8px_18px_rgba(15,23,42,0.05)]">
      <button
        type="button"
        onClick={() => updateSettings({ transliterationMode: 'latin' })}
        aria-pressed={transliterationMode === 'latin'}
        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${
          transliterationMode === 'latin'
            ? 'bg-[var(--accent)] text-white'
            : 'text-[var(--text-secondary)] hover:bg-black/5'
        }`}
      >
        {interfaceLanguage === 'en' ? 'Latinica' : 'Латиница'}
      </button>
      <button
        type="button"
        onClick={() => updateSettings({ transliterationMode: 'ru' })}
        aria-pressed={transliterationMode === 'ru'}
        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${
          transliterationMode === 'ru'
            ? 'bg-[var(--accent)] text-white'
            : 'text-[var(--text-secondary)] hover:bg-black/5'
        }`}
      >
        {interfaceLanguage === 'en' ? 'Cyrillic' : 'Кириллица'}
      </button>
    </div>
  );
}
