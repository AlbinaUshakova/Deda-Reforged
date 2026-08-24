type InfoNoteKind = 'grammar' | 'speech' | 'mistake';
type InterfaceLanguage = 'ru' | 'en';

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

export function getInfoNoteMeta(kind: InfoNoteKind, interfaceLanguage: InterfaceLanguage = 'ru') {
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
      eyebrow: interfaceLanguage === 'en' ? 'How People Say It' : 'Как Говорят',
      title: interfaceLanguage === 'en' ? 'How it sounds in real life' : 'Как звучит в жизни',
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
    eyebrow: interfaceLanguage === 'en' ? 'Common Mistake' : 'Частая Ошибка',
    title: interfaceLanguage === 'en' ? 'What is easy to mix up' : 'Что легко перепутать',
    cardClass: 'border-rose-200/70 bg-rose-50/55 shadow-[0_4px_14px_rgba(136,19,55,0.06)] hover:border-rose-300/80 hover:bg-rose-50/75',
    iconClass: 'bg-rose-100/70 text-[11px] font-bold text-rose-700 shadow-[inset_0_0_0_1px_rgba(251,113,133,0.22)]',
    eyebrowClass: 'text-rose-700/60',
    chevronClass: 'text-rose-700/55',
    innerClass: 'border-rose-100/70 bg-white/58',
    bulletClass: 'text-rose-600',
  };
}

function translateInfoNoteText(text: string): string {
  const normalized = String(text || '').trim();
  const exactMap: Record<string, string> = {
    'В просьбе: “пожалуйста”.': 'Used when asking for something: “please”.',
    'В просьбе: «пожалуйста».': 'Used when asking for something: “please”.',
    'Чтобы обратиться к человеку или пройти.': 'Used to get someone’s attention or to pass by.',
    'Чтобы обратиться к человеку или привлечь внимание.': 'Used to address someone or get their attention.',
    'Чтобы обратиться или пройти.': 'Used to address someone or pass by.',
    'Если можно': 'if possible',
    'Простите': 'sorry',
    'Извините': 'excuse me',
    'Спасибо большое': 'thank you very much',
    'Благодарю': 'thank you',
    'Все в порядке': 'everything is okay',
    'Всё в порядке': 'everything is okay',
  };

  return exactMap[normalized] ?? normalized;
}

export function getGrammarDisplay(text: string, interfaceLanguage: InterfaceLanguage = 'ru') {
  const normalized = String(text || '').trim();
  const [rawLead, rawTail] = normalized.split('→').map(part => part.trim());
  const lead = rawLead || normalized;
  const tail = rawTail || '';

  const titleMap: Array<[RegExp, string, string]> = [
    [/^вежливо/i, 'Это вежливо', 'This is polite'],
    [/^неформально/i, 'Это неформально', 'This is informal'],
    [/^универсально/i, 'Можно использовать везде', 'You can use this anywhere'],
    [/^формально/i, 'Это формально', 'This is formal'],
    [/^разговорно/i, 'Это разговорно', 'This is conversational'],
    [/^мягкая просьба/i, 'Это мягкая просьба', 'This is a soft request'],
    [/^вежливая просьба/i, 'Это вежливая просьба', 'This is a polite request'],
    [/^базовый вопрос/i, 'Это базовый вопрос', 'This is a basic question'],
    [/^согласие/i, 'Когда соглашаемся', 'When we agree'],
    [/^ответ на/i, 'Когда отвечаем', 'When we respond'],
    [/^используем для роли/i, 'Когда говорим о себе', 'When we talk about ourselves'],
    [/^самый естественный вариант знакомства/i, 'Когда представляемся', 'When we introduce ourselves'],
    [/^дословно/i, 'Как это понимать', 'How to understand this'],
    [/^объект ставим вперед/i, 'Как строится фраза', 'How the phrase is built'],
    [/^в магазине \/ кафе/i, 'Где это говорить', 'Where to say this'],
    [/^часто используемая фраза/i, 'Полезная фраза', 'Useful phrase'],
    [/^полезно при обучении/i, 'Когда учим новые слова', 'When learning new words'],
    [/^более живо/i, 'Как звучать живее', 'How to sound more natural'],
    [/^полная форма/i, 'Когда объясняем честно', 'When we explain directly'],
    [/^усиливаем благодарность/i, 'Как усилить благодарность', 'How to strengthen thanks'],
    [/^самый частый вариант/i, 'Самый частый вариант', 'Most common option'],
    [/^артикль/i, 'Артикль перед словом', 'Article before the word'],
    [/^само число/i, 'Само число', 'The number itself'],
  ];

  const detailMap: Array<[RegExp, string, string]> = [
    [/^вежливо/i, 'с незнакомыми людьми', 'with people you do not know'],
    [/^неформально/i, 'с друзьями и близкими', 'with friends and family'],
    [/^универсально/i, 'почти в любой ситуации', 'in almost any situation'],
    [/^формально/i, 'в более официальной речи', 'in more formal speech'],
    [/^разговорно/i, 'в живой повседневной речи', 'in everyday speech'],
    [/^мягкая просьба/i, 'когда просим без давления', 'when asking gently'],
    [/^вежливая просьба/i, 'в магазине, кафе и сервисе', 'in shops, cafes, and service situations'],
    [/^базовый вопрос/i, 'когда нужно быстро спросить', 'when you need to ask quickly'],
    [/^согласие/i, 'чтобы ответить мягко и естественно', 'to answer softly and naturally'],
    [/^ответ на/i, 'после благодарности', 'after someone thanks you'],
    [/^используем для роли/i, 'когда говорим, кто мы', 'when we say who we are'],
    [/^самый естественный вариант знакомства/i, 'при знакомстве', 'when meeting someone'],
    [/^полезно при обучении/i, 'когда спрашиваем про слово', 'when asking about a word'],
    [/^в магазине \/ кафе/i, 'в сервисе и покупках', 'in service and shopping situations'],
    [/^часто используемая фраза/i, 'когда учим язык прямо в разговоре', 'when learning through conversation'],
    [/^артикль/i, 'когда рядом есть существительное', 'when a noun follows'],
    [/^само число/i, 'при счёте и в ответе «сколько?»', 'when counting or answering “how many?”'],
  ];

  const title =
    (interfaceLanguage === 'en'
      ? titleMap.find(([pattern]) => pattern.test(lead))?.[2]
      : titleMap.find(([pattern]) => pattern.test(lead))?.[1]) ??
    (interfaceLanguage === 'en' ? 'When to say this' : 'Когда это говорить');
  const summary =
    interfaceLanguage === 'en'
      ? translateInfoNoteText(tail || lead.replace(/^[^:]+:\s*/i, '').replace(/\.$/, ''))
      : (tail || lead.replace(/^[^:]+:\s*/i, '').replace(/\.$/, ''));
  const detail =
    (interfaceLanguage === 'en'
      ? detailMap.find(([pattern]) => pattern.test(lead))?.[2]
      : detailMap.find(([pattern]) => pattern.test(lead))?.[1]) ??
    '';
  const normalizedSummary = summary.replace(/[.]/g, '').trim().toLowerCase();
  const normalizedDetail = detail.replace(/[.]/g, '').trim().toLowerCase();
  const dedupedDetail =
    normalizedSummary && normalizedSummary === normalizedDetail ? '' : detail;

  return { title, summary, detail: dedupedDetail };
}
