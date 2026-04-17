# Talentsy KB — База знаний компании

## Быстрый старт

### 1. Установка зависимостей
```bash
cd talentsy-kb
npm install
```

### 2. Переменные окружения
Файл `.env.local` уже создан с ключами Supabase. Проверьте:
```
# URL в браузере — идёт через прокси (для пользователей из РФ без VPN)
NEXT_PUBLIC_SUPABASE_URL=https://supabase.talentsy.ru/proxy/lbpebpdmerhvbefrbgbv

# URL на сервере (Route Handlers, middleware) — напрямую к Supabase
SUPABASE_URL=https://lbpebpdmerhvbefrbgbv.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Зачем две переменные?** Прокси `supabase.talentsy.ru` нужен только браузерам пользователей из РФ — Vercel (где работает сервер) к Supabase обращается напрямую, без лишнего хопа.

Если `SUPABASE_URL` не задан — код сфоллбэчится на `NEXT_PUBLIC_SUPABASE_URL` (всё продолжит работать, просто серверные запросы тоже пойдут через прокси).

### 3. Создание первого администратора
Откройте Supabase Dashboard → Authentication → Users → Add User:
- Email: ваш email
- Password: ваш пароль

Затем в SQL Editor выполните:
```sql
UPDATE profiles SET role = 'admin' WHERE email = 'ваш-email@example.com';
```

### 4. Запуск
```bash
npm run dev
```
Откройте http://localhost:3000

## Структура проекта

```
src/
├── app/
│   ├── (dashboard)/          # Все защищённые страницы
│   │   ├── admin/            # Администрирование
│   │   ├── company/          # Общая информация
│   │   ├── departments/      # Отделы
│   │   ├── docs/             # Документы + редактор
│   │   ├── news/             # Новости
│   │   └── products/         # Продукты
│   ├── auth/callback/        # OAuth callback
│   ├── login/                # Страница входа
│   └── share/[token]/        # Публичные документы
├── components/
│   ├── editor/               # Tiptap редактор
│   ├── documents/            # Компоненты документов
│   └── layout/               # Sidebar, Header
└── lib/
    ├── hooks/                # React хуки
    ├── supabase/             # Supabase клиенты
    ├── types/                # TypeScript типы
    └── utils/                # Утилиты
```

## Технологии
- **Next.js 16** (App Router)
- **React 19**
- **Supabase** (PostgreSQL, Auth, Storage, Realtime)
- **Tiptap** (блочный редактор документов)
- **Tailwind CSS v4**
- **TypeScript 5**
- **Zustand** (state management)

## База данных
Все таблицы уже созданы в Supabase (проект: Talentsy KB):
- profiles, departments, sections, documents, document_versions
- products, news, news_reads, section_permissions
- onboarding_videos, onboarding_progress, media
- workflow_templates, workflow_instances, workflow_steps

RLS-политики настроены для всех таблиц.

## Дальнейшая разработка с Claude Code

Откройте проект в VS Code и используйте Claude Code для итеративной разработки:

1. `npm install && npm run dev` — запустите проект
2. Подключайте реальные данные из Supabase вместо моков
3. Добавляйте новые страницы и компоненты
4. Настраивайте Storage бакеты для файлов
5. Добавляйте email-уведомления (Resend)
