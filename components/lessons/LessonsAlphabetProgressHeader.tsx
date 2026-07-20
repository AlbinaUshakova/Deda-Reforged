'use client';

import Image from 'next/image';
import { AlphabetProgressRow } from '@/components/lessons/AlphabetPanel';
import { GEORGIAN_ALPHABET } from '@/lib/georgianAlphabet';
import type { AlphabetLetterStatus } from '@/lib/lessonProgress';

type LessonsAlphabetProgressHeaderProps = {
  letterStatusByChar: Record<string, AlphabetLetterStatus>;
};

export function LessonsAlphabetProgressHeader({
  letterStatusByChar,
}: LessonsAlphabetProgressHeaderProps) {
  return (
    <div className="-mt-3 md:-mt-5 mb-4 [@media(max-width:900px)]:mb-3 [@media(max-width:700px)]:hidden [@media(max-height:980px)]:-mt-3 [@media(max-height:980px)]:mb-3 flex items-center justify-start gap-1 pl-[clamp(72px,10.5vw,148px)] [@media(max-width:900px)]:pl-[clamp(52px,9vw,92px)] [@media(max-width:700px)]:pl-[clamp(38px,7vw,64px)]">
      <div className="inline-flex h-[clamp(28px,3.1vw,40px)] w-[clamp(28px,3.1vw,40px)] items-center justify-center p-0">
        <Image
          src="/images/deda-cat.png"
          alt="Deda cat"
          width={40}
          height={40}
          className="h-[clamp(28px,3.1vw,40px)] w-[clamp(28px,3.1vw,40px)] shrink-0 object-contain"
        />
      </div>
      <AlphabetProgressRow
        lessonLetters={GEORGIAN_ALPHABET}
        letterStatusByChar={letterStatusByChar}
      />
    </div>
  );
}
