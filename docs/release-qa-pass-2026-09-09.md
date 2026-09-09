# Release QA pass - 2026-09-09

## Result

The release is published and passes the automated checks and production route smoke tests.

## Passed

- TypeScript typecheck.
- ESLint.
- All 100 automated tests.
- Lesson letter integrity across current courses.
- Optimized production build.
- Landing, Lessons, Study, Play, Favorites, Review, Help, Privacy, and Support routes load without browser errors.
- English UI smoke test across the main routes.
- No horizontal overflow at 320 px, 375 px, 430 px, or 1440 px on the checked core screens.
- PayPal support link accepts a customer-entered amount.

## Fixed during this pass

- Removed artificial standalone names from Serbian lesson 1 and kept a focused eight-card starter deck.
- Removed the flashcard effect dependency warning that could leave hint state stale after changing cards.

## Pending after deployment

- Complete one low-value real PayPal payment.

## Release decision

Local QA: Go.

Public release: Go.

Production target: https://dedareforged.vercel.app/
