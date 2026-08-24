'use client';

import { useAppStore } from '@/lib/appStore';

export default function InterfaceLanguageSwitcher() {
  const interfaceLanguage = useAppStore(state => state.settings.interfaceLanguage);
  const updateSettings = useAppStore(state => state.updateSettings);

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-[var(--border-soft)] bg-white/80 p-1 shadow-[0_8px_18px_rgba(15,23,42,0.05)]">
      <button
        type="button"
        onClick={() => updateSettings({ interfaceLanguage: 'en' })}
        aria-pressed={interfaceLanguage === 'en'}
        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${
          interfaceLanguage === 'en'
            ? 'bg-[var(--accent)] text-white'
            : 'text-[var(--text-secondary)] hover:bg-black/5'
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => updateSettings({ interfaceLanguage: 'ru' })}
        aria-pressed={interfaceLanguage === 'ru'}
        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${
          interfaceLanguage === 'ru'
            ? 'bg-[var(--accent)] text-white'
            : 'text-[var(--text-secondary)] hover:bg-black/5'
        }`}
      >
        RU
      </button>
    </div>
  );
}
