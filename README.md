# Deda Reforged

Учебная игра для изучения грузинского чтения через карточки, аудио и мини-игры.

## This Copy

Этот каталог используется как отдельная копия для доработок, чтобы не ломать активный проект.

Основные правила:
- правки делаются только здесь;
- перед крупными изменениями фиксируется состояние в git;
- выкладка идёт в отдельный Vercel project или preview deployment;
- production-домен активного проекта не используется для этой копии.

## Commands

- `npm run dev` - локальная разработка
- `npm run build` - production build
- `npm run lint` - ESLint
- `npm run typecheck` - TypeScript check
- `npm run check` - полный базовый прогон проверок

## Environment

Шаблон переменных находится в `.env.example`.

Если этой копии не нужен доступ к тем же сервисам, что и у активного проекта, лучше использовать отдельные ключи и отдельный Vercel project.

## Workflow

Подробный безопасный процесс описан в [DEVELOPMENT_COPY.md](/Users/albina/Projects/active/Deda%20Reforged/DEVELOPMENT_COPY.md).
