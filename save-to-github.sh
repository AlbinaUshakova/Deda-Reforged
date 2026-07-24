#!/usr/bin/env bash
# Сохранить текущую версию в репозиторий GitHub.
# Запуск на Mac:  cd "Deda Reforged" && bash save-to-github.sh
set -e

cd "$(dirname "$0")"

# 1. убрать залипший lock (если остался)
rm -f .git/index.lock

# 2. проверки перед коммитом (по желанию — можно закомментировать)
npm run typecheck
npm run lint
npm test

# 3. закоммитить всё
git add -A
git commit -m "Add English course, shopping lessons, and app chrome refactor" \
  -m "- Full English (en_ru) course: episodes 1-8 + episodes_en.json
- Extra episodes for German, Spanish, Turkish and Georgian courses
- Shopping-themed lessons with object icons (cash, price tag, scale, basket, weight, numbers)
- Introduce AppChrome component and phraseIntents helper
- Remove obsolete FlashcardControls and imageMap
- Add lessonProgress tests; update existing test suites
- Refactor lessons/flashcards components and styles"

# 4. запушить
git push origin main

echo ""
echo "Готово: изменения запушены в origin/main."
