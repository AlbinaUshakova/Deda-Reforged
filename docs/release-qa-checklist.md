# Deda release QA checklist

Use this checklist before every public release. Mark an item complete only after checking the release candidate, not an older local build.

## 1. Automated checks

- [ ] `npm run typecheck` passes.
- [ ] `npm run lint -- --quiet` passes.
- [ ] `npm test` passes.
- [ ] `npm run check:lesson-letters` passes.
- [ ] `npm run build` passes.

## 2. Landing

- [ ] The page loads without an error overlay or console error.
- [ ] The interface language can be changed between English and Russian.
- [ ] Georgian and Serbian can be selected; hidden courses stay outside the main flow.
- [ ] Serbian script selection appears only on the landing page and persists after selection.
- [ ] The main CTA opens Lessons, where the correct recommended lesson is shown first.
- [ ] Footer links open Help, Privacy, and Support the project.
- [ ] Support the project opens the PayPal page with a customer-entered amount.

## 3. Lessons

- [ ] The recommended lesson and its action match saved progress.
- [ ] Lesson cards show the correct letters, card counts, and state.
- [ ] The next lesson opens at 5 practice points; later lessons remain locked.
- [ ] Lesson numbering and status icons are not duplicated.
- [ ] Saved words and review counts match the visible decks.
- [ ] Review includes only cards from opened lessons.
- [ ] Extra practice sections open the correct decks.

## 4. Study

- [ ] The first card and its main action are visible without unnecessary scrolling.
- [ ] Previous and Next work at both ends of the deck.
- [ ] Card flipping, audio, hints, and favorites work.
- [ ] Adding or removing a favorite updates the saved deck after navigation or reload.
- [ ] Transliteration is visible by default only in the configured early lessons.
- [ ] Stronger lessons and special decks keep transliteration hidden by default.
- [ ] Progress copy is short, accurate, and does not promise a nonexistent next lesson.
- [ ] Home and Practice navigation open the expected screens.

## 5. Play

- [ ] Correct answers are accepted by the button and Enter key.
- [ ] Incorrect answers keep the field usable and show clear feedback.
- [ ] The board is not cleared unexpectedly after answer feedback.
- [ ] Awarded pieces can be placed and points update correctly.
- [ ] The lesson unlock message appears only when useful moves remain.
- [ ] Game-over and success messages remain visible above the cat and board.
- [ ] The cat sits on the board boundary without covering feedback or controls.
- [ ] Header actions appear once and match the Study screen.

## 6. Support modes

- [ ] Empty favorites show an intentional empty state, never `Episode not found`.
- [ ] Non-empty favorites show the exact visible card count.
- [ ] Review is locked before the first lesson threshold and grows by opened lesson.
- [ ] Favorites, review, and phrase decks do not inherit lesson unlock behavior.
- [ ] Special decks explain their purpose in one short sentence.

## 7. Mobile

Check at 320 px, 375 px, and 430 px widths.

- [ ] The header stays on one line without overlap.
- [ ] Deda returns to the landing page; the alphabet and menu remain reachable.
- [ ] Lesson title and action buttons do not wrap unexpectedly.
- [ ] Study keeps the word and flip action visible first.
- [ ] Play keeps the prompt, input, and game board visually dominant.
- [ ] Back, Next, progress, and support controls do not cover core content.
- [ ] There is no horizontal page overflow.

## 8. English

- [ ] Landing, Lessons, Study, Play, Help, Privacy, and Support use English UI copy.
- [ ] Lesson words have correct English meanings and natural answer variants.
- [ ] Georgian and Serbian labels do not fall back to Russian.
- [ ] Long English labels fit mobile controls without clipping.

## 9. Persistence and release smoke test

- [ ] Course, script, interface language, favorites, and progress survive reload.
- [ ] Direct links to Landing, Lessons, Study, Play, Help, Privacy, and Support load.
- [ ] The public production URL uses HTTPS.
- [ ] The production environment contains `NEXT_PUBLIC_DONATION_URL`.
- [ ] One low-value real PayPal payment is completed and recorded correctly.

## Release result

- Date:
- Build or commit:
- Desktop checked:
- Mobile checked:
- Languages checked:
- Blocking issues:
- Non-blocking issues:
- Release decision: Go / No-go
