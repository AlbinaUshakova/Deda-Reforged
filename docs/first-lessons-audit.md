# First Lessons Audit

Date: 2026-09-03

## Scope

This audit covers the first lesson (`ep1`) of all currently implemented courses in the repo:

- Georgian (`ka`)
- Serbian (`sr`)
- Turkish (`tr`)
- Spanish (`es`)
- German (`de`)
- English (`en`)
- French (`fr`)
- Italian (`it`)

## Overall finding

Most first lessons already introduce real words immediately and stay inside the lesson letter scope. The larger product gap is not lesson integrity, but product focus: several currently active courses do not support the new unfamiliar-script positioning.

## Lesson-by-lesson notes

### Georgian (`ka`)

- Strong fit with the new vision.
- The lesson introduces a small set of letters and immediately uses them in real words.
- This is the clearest current example of script-first learning.

### Serbian (`sr`)

- Technically fits the reading-first structure.
- It uses a non-Latin script, so it fits the broader script barrier problem better than the Latin courses.
- The first lesson leans heavily on pronouns and short function words, which is structurally useful but less vivid than object-based words.

### Turkish (`tr`)

- Lesson integrity is fine.
- Product fit is weak for the new direction because the script is Latin.
- It should stay out of the main flow.

### Spanish (`es`)

- Lesson integrity is fine.
- Product fit is weak for the new direction because the script is Latin.
- The lesson starts with readable real words, but it does not deliver the unfamiliar-script promise.

### German (`de`)

- Lesson integrity is fine.
- Product fit is weak for the new direction because the script is Latin.
- Some early cards emphasize grammar/function words, which is acceptable for reading practice but not aligned with the sharper new promise.

### English (`en`)

- Lesson integrity is fine.
- Product fit is weakest for the new direction.
- English in this repo uses a reading-through-letters approach, but it is not an unfamiliar-script product and likely needs a different phonics-based path if kept at all.

### French (`fr`)

- Lesson integrity is fine.
- Product fit is weak for the new direction because the script is Latin.
- The lesson includes real words early, but the product promise is less visible here.

### Italian (`it`)

- Lesson integrity is fine.
- Product fit is weak for the new direction because the script is Latin.
- The first lesson is clean and short, but it belongs outside the main flow under the new vision.

## Product implications

- Keep Georgian as the current primary active course.
- Keep Serbian as a secondary active course for now.
- Hide Turkish, Spanish, German, English, French, and Italian from the main flow.
- Treat the next major product step as a content and course implementation gap for Korean, Russian, Japanese, and Arabic.

## Verification status

- `npm run check:lesson-letters` should validate letter integrity across all current course files, not only Georgian.

## Core-course deep dive

### Georgian (`ka`) early path

#### `ep1`

- Strong opening lesson.
- It delivers the product promise quickly: a small letter set and readable real words from the first cards.
- The lesson already feels like “I can read something now,” which is the main thing to preserve.

Recommended action:

- Keep the lesson structure as is.
- Preserve `აი`, `ია`, `არა`, `რა`, and the short phrase combinations as the current benchmark for future courses.

#### `ep2`

- Still strong, but it starts mixing several learning jobs at once: identity phrases, family vocabulary, and numbers.
- `ეს`, `მე`, `ეს მე ვარ`, `მამა`, `ეს მამაა` are aligned with reading-first.
- The original version used `ორი`, `სამი`, `ორი რამე`, `მომე`, which made the lesson broader and less sharply focused.

Recommended action:

- Keep the reading-first core around `ეს`, `მე`, `მამა`.
- Keep numbers only where they still support simple readable combinations.
- Prefer a cleaner path: “new letters -> simple identity words -> visible concrete word -> short phrase”.

Status on 2026-09-03:

- Updated.
- The more abstract tail was reduced in favor of simpler readable combinations built from already familiar lesson material.

#### `ep2b`

- This is the first Georgian lesson that feels more abstract.
- `დედა`, `და`, `სად` are good readable anchors.
- `მინდა`, `უნდა`, `არ უნდა` introduce useful language, but they shift attention from decoding toward modal meaning quite early.
- `დრო`, `სუნი`, `დარი` are readable, but they feel like extra vocabulary rather than the strongest next reading win.

Recommended action:

- Keep `დედა`, `და`, `სად`, `სად არის`, `დედა სად არის`.
- Review whether `მინდა` / `უნდა` belong this early or should come after more concrete noun-based reading.
- Review the tail of the lesson and cut or postpone any cards that do not strengthen the feeling of “I can read more real words now.”

Status on 2026-09-03:

- Updated.
- The abstract tail (`დრო`, `სუნი`, `დარი`) was replaced with more concrete readable words and phrases (`დანა`, `აი დანა`, `სოდა`, `ეს სოდაა`).

### Serbian (`sr`) early path

#### `ep1`

- Structurally valid, but weaker as an opening lesson than Georgian.
- It uses only learned symbols and starts with real readable words.
- The main weakness is repetition quality: too many cards are recombinations of pronouns and negation.
- The lesson teaches decoding, but it gives less emotional reward because the user keeps reading variants of the same grammatical pattern.

Recommended action:

- Keep the lesson technically short and simple.
- Reduce repetitive combinations such as `они и она`, `не они`, `не оно` if they do not add much reading value.
- Aim for a more satisfying mix of readable units, even if the first lesson must stay limited by the available letters.

Status on 2026-09-03:

- Updated.
- Several repetitive pronoun permutations were reduced and replaced with more memorable readable names (`Ана`, `Нина`, `Нена`).

#### `ep2`

- Strong improvement over `ep1`.
- The lesson introduces concrete, imageable words like `рука`, `уста`, `сок`, `нос`, `лист`, `стена`.
- It feels more like reading actual language and less like permuting grammar pieces.

Recommended action:

- Keep this lesson as one of the Serbian benchmarks.
- Consider whether a few of these more vivid object words should arrive emotionally earlier in the overall path, even if not literally moved into `ep1`.

#### `ep3`

- Also strong.
- `мама`, `тата`, `дан`, `вода`, `вино`, `брат` give the learner more concrete reading wins.
- The lesson balances short readable phrases with memorable nouns much better than `ep1`.

Recommended action:

- Keep this lesson direction.
- Use it as the reference for what Serbian should feel like after the narrower opening constraints of lesson 1.

## Recommended next content edits

1. Do not rewrite Georgian `ep1`; treat it as the current gold standard.
2. Keep Georgian `ep2`, `ep2b`, and Serbian `ep1` under observation in manual testing after the 2026-09-03 edits.
3. Keep Serbian `ep2` and `ep3` mostly stable unless user testing shows overload.
4. After any content edits, rerun `npm run check:lesson-letters`.

## Full active-track audit

### Georgian (`ka`) full path

#### Strong lessons

- `ep1` is still the cleanest benchmark in the repo.
- `ep3` is strong: `კარი`, `სკოლა`, `გემი`, `გოგო`, `კინო`, `კალამი` give clear, concrete reading wins.
- `ep5` is also strong: `პური`, `ქუდი`, `ქალაქი`, `ხე`, `ქათამი`, `პარკი` feel concrete and easy to visualize.
- `ep8` is now strong end-to-end: `წყალი`, `ღვინო`, `ჭიქა`, `წიგნი`, `წვენი`, `ხაჭაპური მინდა`, `მწვადი მინდა` keep the lesson concrete and rewarding.
- `ep9` now lands better than before: greeting and price language stays, but the tail reinforces readable objects and simple phrases instead of drifting into a loose vocabulary list.

#### Lessons to watch

- `ep2` is improved after the 2026-09-03 trim and now reads more like a short decoding step than a numbers-heavy pattern drill.
- `ep2b` is improved after the 2026-09-03 trim and now anchors `მინდა` / `უნდა` with clearer object and family references.
- `ep4` is improved after the 2026-09-03 trim and now stays more concrete, though it still covers a slightly wider spread than the very best lessons.
- `ep6` is improved after the 2026-09-03 trim and now stays much closer to concrete noun-and-phrase reinforcement.
- `ep7` is improved after the 2026-09-03 trim and now ends on cleaner object-based practice.

#### Georgian summary

- The Georgian path is the strongest active course overall.
- Its main issue is not broken sequencing, but occasional breadth in a few lessons rather than a structural content problem.
- The 2026-09-03 pass materially improved the early, middle, and late lessons without changing the overall structure.
- The Georgian active track now feels consistent enough to treat as the reference course for the rest of the repo.

### Serbian (`sr`) full path

#### Strong lessons

- `ep2` and `ep3` are already much stronger than `ep1` and should be treated as reference points for tone.
- `ep4` is strong and concrete: `град`, `здраво`, `хлеб`, `храна`, `хотел`, `гора`, `знак`.
- `ep5` is one of the best Serbian lessons: `цена`, `цвет`, `црква`, `школа`, `чај`, `чаша`, `човек` create vivid reading wins.
- `ep6` is also strong: `живот`, `жена`, `нож`, `кафа`, `филм`, `флаша`, `шеф`.
- `ep8` is useful and readable despite the harder letters: `ђак`, `кућа`, `ноћ`, `џеп`, `џем`, `џемпер`.

#### Lessons to watch

- `ep1` is improved after the 2026-09-03 edit and now feels more readable thanks to names and simple combinations, though the opening lesson is still naturally constrained by the limited first-letter set.
- `ep7` is improved after the 2026-09-03 edit and now leans more on concrete noun phrases than abstract pronoun tails.

#### Serbian summary

- The Serbian path improves significantly after the opening lesson.
- It is structurally solid across the whole track.
- The 2026-09-03 pass materially improved the two weakest lessons without changing the structure.
- The Serbian active track now feels consistent enough to treat as production-ready, even if the Georgian path remains the cleaner benchmark.

## Recommended next manual review

1. Play through the full Georgian path in the UI and confirm that lesson endings now feel as clean as the openings.
2. Play through the full Serbian path in the UI and confirm that `ep1` and `ep7` now feel less grammatical and more rewarding.
3. Use the Georgian path as the tone benchmark for future edits in the other active courses.
