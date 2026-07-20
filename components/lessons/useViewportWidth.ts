'use client';

import { useEffect, useState } from 'react';

export function useViewportWidth() {
  const [viewportWidth, setViewportWidth] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const updateViewportWidth = () => setViewportWidth(window.innerWidth);
    updateViewportWidth();
    window.addEventListener('resize', updateViewportWidth);
    return () => window.removeEventListener('resize', updateViewportWidth);
  }, []);

  return viewportWidth;
}
