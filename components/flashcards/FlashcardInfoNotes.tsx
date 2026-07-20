'use client';

import {
  getGrammarDisplay,
  getInfoNoteMeta,
} from '@/components/flashcards/flashcardText';

type InfoNote = {
  kind: 'grammar' | 'speech' | 'mistake';
  text: string;
};

type FlashcardInfoNotesProps = {
  notes: InfoNote[];
  expandedKinds: Record<string, boolean>;
  onToggle: (key: string) => void;
};

export function FlashcardInfoNotes({
  notes,
  expandedKinds,
  onToggle,
}: FlashcardInfoNotesProps) {
  if (notes.length === 0) return null;

  return (
    <div className="flashcard-info-notes mt-3 flex w-full max-w-[26ch] flex-col gap-2">
      {notes.map((note, noteIdx) => {
        const meta = getInfoNoteMeta(note.kind);
        const noteKey = `${note.kind}-${noteIdx}`;
        const isExpanded = !!expandedKinds[noteKey];
        const grammarDisplay =
          note.kind === 'grammar'
            ? getGrammarDisplay(note.text)
            : null;

        return (
          <button
            key={`${note.kind}-${noteIdx}-${note.text}`}
            type="button"
            onClick={e => {
              e.stopPropagation();
              onToggle(noteKey);
            }}
            className={`flashcard-info-note w-full overflow-hidden rounded-[16px] border px-3.5 py-2.5 text-left transition-all duration-200 ${meta.cardClass}`}
            aria-expanded={isExpanded}
            aria-label={`Открыть пояснение: ${meta.eyebrow}`}
          >
            <div className="flex items-start justify-between gap-2.5">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${meta.iconClass}`}
                    aria-hidden="true"
                  >
                    {meta.icon}
                  </span>
                  <div className="min-w-0">
                    {meta.eyebrow ? (
                      <span className={`block text-[9px] font-semibold uppercase tracking-[0.08em] ${meta.eyebrowClass}`}>
                        {meta.eyebrow}
                      </span>
                    ) : null}
                    <span className="block text-[clamp(13px,1.45vw,15px)] font-semibold leading-[1.18] text-slate-800">
                      {grammarDisplay ? grammarDisplay.title : meta.title}
                    </span>
                  </div>
                </div>
                {grammarDisplay ? (
                  <div className="mt-2 space-y-0.5 pl-8">
                    <span className="block text-[clamp(12px,1.35vw,14px)] leading-snug text-slate-700">
                      {grammarDisplay.summary}
                    </span>
                  </div>
                ) : (
                  <span className="mt-2 block pl-8 text-[clamp(12px,1.35vw,14px)] leading-snug text-slate-700">
                    {note.text}
                  </span>
                )}
              </div>
              <span
                className={`mt-0.5 shrink-0 text-[12px] transition-transform duration-200 ${meta.chevronClass} ${
                  isExpanded ? 'rotate-180' : ''
                }`}
                aria-hidden="true"
              >
                ▾
              </span>
            </div>

            <div
              className={`grid transition-all duration-300 ease-out ${
                isExpanded ? 'grid-rows-[1fr] opacity-100 pt-2.5' : 'grid-rows-[0fr] opacity-0 pt-0'
              }`}
            >
              <div className="overflow-hidden">
                <div className={`rounded-[12px] border px-3 py-2.5 text-[clamp(11px,1.25vw,13px)] leading-snug text-slate-700 ${meta.innerClass}`}>
                  {grammarDisplay ? (
                    <div className="space-y-2.5">
                      {grammarDisplay.detail ? (
                        <div className="text-slate-700">{grammarDisplay.summary}</div>
                      ) : null}
                      {grammarDisplay.detail ? (
                        <div className="text-slate-500">{grammarDisplay.detail}</div>
                      ) : null}
                    </div>
                  ) : (
                    <div className="flex items-start gap-2">
                      <span className={`mt-[2px] text-[11px] ${meta.bulletClass}`} aria-hidden="true">
                        →
                      </span>
                      <span>{note.text}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
