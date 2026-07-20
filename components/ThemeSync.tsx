'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/appStore';
import { applyThemeToDocument } from '@/lib/settings';

export default function ThemeSync() {
  const hydrate = useAppStore(state => state.hydrate);
  const theme = useAppStore(state => state.settings.theme);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  useEffect(() => {
    applyThemeToDocument(theme);
  }, [theme]);

  return null;
}
