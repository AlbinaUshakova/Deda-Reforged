type InfoNoteKind = 'grammar' | 'speech' | 'mistake';

export function splitDialogLines(text: string): string[] {
  return String(text || '')
    .split('\n')
    .map(s => s.trim())
    .filter(Boolean);
}

export function insertSoftHyphens(text: string, chunkSize: number) {
  const trimmed = String(text || '').trim();
  if (!trimmed || /\s/.test(trimmed) || trimmed.length <= chunkSize + 2) {
    return trimmed;
  }

  const chars = Array.from(trimmed);
  const parts: string[] = [];

  for (let i = 0; i < chars.length; i += chunkSize) {
    parts.push(chars.slice(i, i + chunkSize).join(''));
  }

  return parts.join('\u00AD');
}

export function getMobileTextSizeClass(text: string, kind: 'ge' | 'ru') {
  const trimmed = String(text || '').trim();
  const length = Array.from(trimmed).length;
  const words = trimmed.split(/\s+/).filter(Boolean);
  const maxWordLength = words.reduce(
    (max, word) => Math.max(max, Array.from(word).length),
    0,
  );

  if (kind === 'ge') {
    if (words.length >= 2 && words.length <= 3 && maxWordLength <= 8) {
      return 'max-[640px]:text-[clamp(22px,7.4vw,34px)]';
    }
    if (length >= 34) return 'max-[640px]:text-[clamp(12px,4.1vw,18px)]';
    if (length >= 28) return 'max-[640px]:text-[clamp(14px,4.8vw,22px)]';
    if (length >= 20) return 'max-[640px]:text-[clamp(17px,5.5vw,26px)]';
    if (length >= 14) return 'max-[640px]:text-[clamp(16px,5.1vw,24px)]';
    if (length >= 10) return 'max-[640px]:text-[clamp(15px,4.8vw,22px)]';
    return 'max-[640px]:text-[clamp(22px,7.4vw,34px)]';
  }

  if (length >= 34) return 'max-[640px]:text-[clamp(13px,4.4vw,20px)]';
  if (length >= 24) return 'max-[640px]:text-[clamp(16px,5.1vw,24px)]';
  if (length >= 16) return 'max-[640px]:text-[clamp(19px,6.1vw,28px)]';
  return 'max-[640px]:text-[clamp(20px,6.6vw,30px)]';
}

export function getInfoNoteMeta(kind: InfoNoteKind) {
  if (kind === 'grammar') {
    return {
      icon: 'i',
      eyebrow: '',
      title: '',
      cardClass: 'border-amber-200/70 bg-amber-50/55 shadow-[0_4px_14px_rgba(120,53,15,0.06)] hover:border-amber-300/80 hover:bg-amber-50/75',
      iconClass: 'bg-amber-100/70 text-[11px] font-bold text-amber-700 shadow-[inset_0_0_0_1px_rgba(251,191,36,0.22)]',
      eyebrowClass: 'text-amber-700/60',
      chevronClass: 'text-amber-700/55',
      innerClass: 'border-amber-100/70 bg-white/58',
      bulletClass: 'text-amber-600',
    };
  }

  if (kind === 'speech') {
    return {
      icon: '“',
      eyebrow: 'Как Говорят',
      title: 'Как звучит в жизни',
      cardClass: 'border-sky-200/70 bg-sky-50/55 shadow-[0_4px_14px_rgba(12,74,110,0.06)] hover:border-sky-300/80 hover:bg-sky-50/75',
      iconClass: 'bg-sky-100/70 text-[14px] font-bold text-sky-700 shadow-[inset_0_0_0_1px_rgba(56,189,248,0.22)]',
      eyebrowClass: 'text-sky-700/60',
      chevronClass: 'text-sky-700/55',
      innerClass: 'border-sky-100/70 bg-white/58',
      bulletClass: 'text-sky-600',
    };
  }

  return {
    icon: '!',
    eyebrow: 'Частая Ошибка',
    title: 'Что легко перепутать',
    cardClass: 'border-rose-200/70 bg-rose-50/55 shadow-[0_4px_14px_rgba(136,19,55,0.06)] hover:border-rose-300/80 hover:bg-rose-50/75',
    iconClass: 'bg-rose-100/70 text-[11px] font-bold text-rose-700 shadow-[inset_0_0_0_1px_rgba(251,113,133,0.22)]',
    eyebrowClass: 'text-rose-700/60',
    chevronClass: 'text-rose-700/55',
    innerClass: 'border-rose-100/70 bg-white/58',
    bulletClass: 'text-rose-600',
  };
}

export function getGrammarDisplay(text: string) {
  const normalized = String(text || '').trim();
  const [rawLead, rawTail] = normalized.split('→').map(part => part.trim());
  const lead = rawLead || normalized;
  const tail = rawTail || '';

  const titleMap: Array<[RegExp, string]> = [
    [/^вежливо/i, 'Это вежливо'],
    [/^неформально/i, 'Это неформально'],
    [/^универсально/i, 'Можно использовать везде'],
    [/^формально/i, 'Это формально'],
    [/^разговорно/i, 'Это разговорно'],
    [/^мягкая просьба/i, 'Это мягкая просьба'],
    [/^вежливая просьба/i, 'Это вежливая просьба'],
    [/^базовый вопрос/i, 'Это базовый вопрос'],
    [/^согласие/i, 'Когда соглашаемся'],
    [/^ответ на/i, 'Когда отвечаем'],
    [/^используем для роли/i, 'Когда говорим о себе'],
    [/^самый естественный вариант знакомства/i, 'Когда представляемся'],
    [/^дословно/i, 'Как это понимать'],
    [/^объект ставим вперед/i, 'Как строится фраза'],
    [/^в магазине \/ кафе/i, 'Где это говорить'],
    [/^часто используемая фраза/i, 'Полезная фраза'],
    [/^полезно при обучении/i, 'Когда учим новые слова'],
    [/^более живо/i, 'Как звучать живее'],
    [/^полная форма/i, 'Когда объясняем честно'],
    [/^усиливаем благодарность/i, 'Как усилить благодарность'],
    [/^самый частый вариант/i, 'Самый частый вариант'],
    [/^артикль/i, 'Артикль перед словом'],
    [/^само число/i, 'Само число'],
  ];

  const detailMap: Array<[RegExp, string]> = [
    [/^вежливо/i, 'с незнакомыми людьми'],
    [/^неформально/i, 'с друзьями и близкими'],
    [/^универсально/i, 'почти в любой ситуации'],
    [/^формально/i, 'в более официальной речи'],
    [/^разговорно/i, 'в живой повседневной речи'],
    [/^мягкая просьба/i, 'когда просим без давления'],
    [/^вежливая просьба/i, 'в магазине, кафе и сервисе'],
    [/^базовый вопрос/i, 'когда нужно быстро спросить'],
    [/^согласие/i, 'чтобы ответить мягко и естественно'],
    [/^ответ на/i, 'после благодарности'],
    [/^используем для роли/i, 'когда говорим, кто мы'],
    [/^самый естественный вариант знакомства/i, 'при знакомстве'],
    [/^полезно при обучении/i, 'когда спрашиваем про слово'],
    [/^в магазине \/ кафе/i, 'в сервисе и покупках'],
    [/^часто используемая фраза/i, 'когда учим язык прямо в разговоре'],
    [/^артикль/i, 'когда рядом есть существительное'],
    [/^само число/i, 'при счёте и в ответе «сколько?»'],
  ];

  const title =
    titleMap.find(([pattern]) => pattern.test(lead))?.[1] ??
    'Когда это говорить';
  const summary =
    tail || lead.replace(/^[^:]+:\s*/i, '').replace(/\.$/, '');
  const detail =
    detailMap.find(([pattern]) => pattern.test(lead))?.[1] ??
    '';
  const normalizedSummary = summary.replace(/[.]/g, '').trim().toLowerCase();
  const normalizedDetail = detail.replace(/[.]/g, '').trim().toLowerCase();
  const dedupedDetail =
    normalizedSummary && normalizedSummary === normalizedDetail ? '' : detail;

  return { title, summary, detail: dedupedDetail };
}
