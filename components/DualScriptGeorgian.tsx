// components/DualScriptGeorgian.tsx
'use client';
/**
 * DualScriptGeorgian
 * Toggle between Printed (Mkhedruli) and Handwritten (stroke-order images).
 *
 * Printed:
 *   - By default renders with the app's Georgian-capable font stack.
 *   - If you add per-letter images to /public/print/mkhedruli/<LETTER>.svg,
 *     set `preferPrintedImages` = true to render printed via images instead of font.
 *
 * Handwritten:
 *   - Renders each letter as an image from /public/handwriting/mkhedruli/<LETTER>.svg
 *   - If an image is missing, we gracefully fall back to the text glyph.
 */
import Image from 'next/image';
import React, { useMemo, useState } from 'react';

type Props = {
  word: string;
  size?: number;                 // glyph height in px for image rendering
  gap?: number;                  // gap between letters when using images
  defaultMode?: 'printed' | 'handwritten';
  preferPrintedImages?: boolean; // use /public/print/mkhedruli assets for printed
};

function LetterImage({
  ch,
  dir,
  size,
}: {
  ch: string;
  dir: 'print' | 'handwriting';
  size: number;
}) {
  const [failed, setFailed] = useState(false);
  const base = dir === 'print' ? '/print/mkhedruli' : '/handwriting/mkhedruli';

  if (failed) {
    return (
      <span
        style={{
          fontSize: `${Math.floor(size * 0.9)}px`,
          lineHeight: `${size}px`,
          display: 'inline-block',
        }}
      >
        {ch}
      </span>
    );
  }

  return (
    <Image
      src={`${base}/${ch}.svg`}
      alt={`${dir} ${ch}`}
      width={size}
      height={size}
      unoptimized
      style={{ height: size, width: 'auto', display: 'block' }}
      onError={() => setFailed(true)}
    />
  );
}

function LettersAsImages({ word, dir, size, gap }: { word: string; dir: 'print' | 'handwriting'; size: number; gap: number }) {
  const letters = useMemo(() => Array.from(word), [word]);
  return (
    <div className="flex items-end" style={{ gap }}>
      {letters.map((ch, i) => {
        return (
          <LetterImage
            key={`${ch}-${i}`}
            ch={ch}
            dir={dir}
            size={size}
          />
        );
      })}
    </div>
  );
}

export default function DualScriptGeorgian({
  word,
  size = 56,
  gap = 6,
  defaultMode = 'printed',
  preferPrintedImages = false,
}: Props) {
  const [mode, setMode] = useState<'printed' | 'handwritten'>(defaultMode);

  return (
    <div className="space-y-2">
      {/* Toggle */}
      <div className="inline-flex overflow-hidden rounded-xl border border-[var(--progress-bg)]">
        <button
          className={`px-3 py-1 text-sm transition ${mode === 'printed' ? 'bg-[var(--accent)] text-white' : 'bg-black/5 text-[var(--text-secondary)] hover:bg-black/10'}`}
          onClick={() => setMode('printed')}
        >
          Печатное
        </button>
        <button
          className={`px-3 py-1 text-sm transition ${mode === 'handwritten' ? 'bg-[var(--accent)] text-white' : 'bg-black/5 text-[var(--text-secondary)] hover:bg-black/10'}`}
          onClick={() => setMode('handwritten')}
        >
          Письменное
        </button>
      </div>

      {/* Content */}
      <div className="rounded-xl bg-black/5 p-3 text-[var(--text-primary)]">
        {mode === 'printed' ? (
          preferPrintedImages ? (
            <LettersAsImages word={word} dir="print" size={size} gap={gap} />
          ) : (
            <div
              className="text-3xl"
              style={{ fontFamily: 'var(--font-georgian)' }}
            >
              {word}
            </div>
          )
        ) : (
          <>
            <LettersAsImages word={word} dir="handwriting" size={size} gap={gap} />
            <div className="mt-2 text-[11px] text-[var(--text-tertiary)]">
              Изображения со штрихами возьми из ресурса урока 9 и положи в <code>/public/handwriting/mkhedruli/LETTER.svg</code>.
            </div>
          </>
        )}
      </div>
    </div>
  );
}
