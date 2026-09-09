import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

type EpisodeCard = {
  ge_text?: string;
};

type Episode = {
  id: string;
  title: string;
  letters?: string[];
  cards?: EpisodeCard[];
};

type EpisodeListItem = {
  id: string;
  title: string;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const contentDir = path.resolve(__dirname, '../public/content');

const COURSE_IDS = ['ka', 'sr', 'tr', 'es', 'de', 'en', 'fr', 'it'] as const;

function getLocale(courseId: typeof COURSE_IDS[number]) {
  return courseId;
}

function getEpisodesListFilename(courseId: typeof COURSE_IDS[number]) {
  return courseId === 'ka' ? 'episodes.json' : `episodes_${courseId}.json`;
}

function getEpisodeFilename(courseId: typeof COURSE_IDS[number], episodeId: string) {
  return `${courseId}_ru_${episodeId}.json`;
}

function readJsonFile<T>(filename: string): T {
  const fullPath = path.join(contentDir, filename);
  return JSON.parse(readFileSync(fullPath, 'utf8')) as T;
}

function getLetterVariants(letter: string, locale: string) {
  const lower = letter.toLocaleLowerCase(locale);
  const upper = letter.toLocaleUpperCase(locale);
  return [...new Set([letter, lower, upper])];
}

function buildAlphabetSet(episodes: Episode[], locale: string) {
  const letters = episodes.flatMap((episode) =>
    Array.isArray(episode.letters)
      ? episode.letters.flatMap((letter) => getLetterVariants(letter, locale))
      : [],
  );
  return new Set(letters);
}

function collectLettersFromText(text: string, alphabetSet: Set<string>) {
  return [...text].filter((ch) => alphabetSet.has(ch));
}

let hasErrors = false;

for (const courseId of [...COURSE_IDS].sort((a, b) => a.localeCompare(b))) {
  const locale = getLocale(courseId);
  const seen = new Set<string>();
  const episodeList = readJsonFile<EpisodeListItem[]>(getEpisodesListFilename(courseId));
  const episodeIds = episodeList
    .map((episode) => episode.id)
    .filter((id) => /^ep\d+[a-z]*$/i.test(id));
  const episodes = episodeIds.map((episodeId) => readJsonFile<Episode>(getEpisodeFilename(courseId, episodeId)));
  const alphabetSet = buildAlphabetSet(episodes, locale);

  for (const episode of episodes) {
    const lessonLetters = Array.isArray(episode.letters) ? episode.letters : [];
    const allowed = new Set(seen);
    const issues: Array<{ index: number; text: string; missing: string[] }> = [];

    for (const letter of lessonLetters) {
      getLetterVariants(letter, locale).forEach((variant) => allowed.add(variant));
    }

    for (const [index, card] of (episode.cards ?? []).entries()) {
      const text = typeof card.ge_text === 'string' ? card.ge_text : '';
      const missing = [
        ...new Set(collectLettersFromText(text, alphabetSet).filter((ch) => !allowed.has(ch))),
      ];

      if (missing.length > 0) {
        issues.push({
          index: index + 1,
          text,
          missing,
        });
      }
    }

    if (issues.length > 0) {
      hasErrors = true;
      console.log(`${courseId}: ${episode.title} (${episode.id})`);
      for (const issue of issues) {
        console.log(`  ${issue.index}. missing [${issue.missing.join(', ')}] in "${issue.text}"`);
      }
    }

    for (const letter of lessonLetters) {
      getLetterVariants(letter, locale).forEach((variant) => seen.add(variant));
    }
  }
}

if (!hasErrors) {
  console.log('All lesson cards use only letters from the current lesson or earlier lessons across all current courses.');
}

process.exitCode = hasErrors ? 1 : 0;
