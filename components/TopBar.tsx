'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import SettingsPanel from '@/components/SettingsPanel';
import FeedbackPanel from '@/components/FeedbackPanel';
import { supabase } from '@/lib/supabase';

export default function TopBar() {
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // загрузка аккаунта
  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) setUser(data.user);
    });

    const clickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', clickOutside);
    return () => document.removeEventListener('mousedown', clickOutside);
  }, []);

  const logout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const username =
    user?.user_metadata?.name ||
    user?.email?.split('@')[0] ||
    'Гость';

  return (
    <>
      <header className="flex items-center justify-between mb-6 px-3">
        <Link href="/lessons" className="text-lg font-semibold">
          Deda
        </Link>

        {/* если НЕ залогинен */}
        {!user && (
          <Link href="/login" className="text-sm hover:text-blue-300">
            Войти
          </Link>
        )}

        {/* если залогинен */}
        {user && (
          <div className="relative" ref={menuRef}>
            <button
              className="flex items-center gap-2 text-sm hover:text-blue-300"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span className="max-w-[180px] truncate">{username}</span>
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 bg-[var(--menu-bg)] border border-[var(--menu-border)] rounded-xl shadow-xl w-56 py-2 z-50 text-[var(--menu-text)]">
                {/* блок с именем и почтой */}
                <div className="px-4 pb-2 border-b border-[var(--menu-divider)] text-sm">
                  <div className="font-medium truncate">{username}</div>
                  {user?.email && (
                    <div className="text-xs text-[var(--menu-text-muted)] truncate">
                      {user.email}
                    </div>
                  )}
                </div>

                {/* Настройки */}
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-[var(--menu-text)] hover:bg-[var(--menu-hover)]"
                  onClick={() => {
                    setMenuOpen(false);
                    setShowSettings(true);
                  }}
                >
                  Настройки
                </button>

                {/* Помощь и обратная связь */}
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-[var(--menu-text)] hover:bg-[var(--menu-hover)]"
                  onClick={() => {
                    setMenuOpen(false);
                    setShowFeedback(true);
                  }}
                >
                  Помощь и обратная связь
                </button>

                {/* Выйти */}
                <button
                  onClick={logout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-[var(--menu-hover)]"
                >
                  Выйти
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      {/* панель настроек поверх текущей страницы */}
      {showSettings && (
        <SettingsPanel onClose={() => setShowSettings(false)} />
      )}

      {showFeedback && (
        <FeedbackPanel onClose={() => setShowFeedback(false)} />
      )}
    </>
  );
}
