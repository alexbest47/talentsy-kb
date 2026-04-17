# Миграция Supabase на прокси supabase.talentsy.ru

Документ описывает переключение браузерных обращений с
`https://lbpebpdmerhvbefrbgbv.supabase.co` на проксированный URL
`https://supabase.talentsy.ru/proxy/lbpebpdmerhvbefrbgbv`, чтобы
пользователи из РФ могли открывать приложение без VPN.

## Архитектура

- **Браузер** → `supabase.talentsy.ru/proxy/...` → Supabase (прокси нужен для юзеров из РФ).
- **Сервер (Vercel)** → `lbpebpdmerhvbefrbgbv.supabase.co` напрямую (Vercel не в РФ, лишний хоп не нужен).

Управляется двумя env-переменными:

| Переменная | Кто читает | Значение |
|------------|-----------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Браузер (запекается в бандл) | `https://supabase.talentsy.ru/proxy/lbpebpdmerhvbefrbgbv` |
| `SUPABASE_URL` | Сервер (Route Handlers, middleware) | `https://lbpebpdmerhvbefrbgbv.supabase.co` |

Серверный код использует `process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL` —
если `SUPABASE_URL` не задан, фоллбэчится на прокси (ничего не ломается).

## Сохранение активных сессий

`@supabase/ssr` по умолчанию вычисляет имя auth-cookie из hostname URL. При
смене hostname (на `supabase.talentsy.ru`) имя cookie изменилось бы →
все пользователи разлогинились бы.

Решение: во всех местах создания клиента жёстко задан `auth.storageKey`:

```ts
{ auth: { storageKey: 'sb-lbpebpdmerhvbefrbgbv-auth-token' } }
```

Это сохраняет прежнее имя cookie — активные сессии живут как раньше.

Файлы, где это добавлено:
- `src/lib/supabase/client.ts`
- `src/lib/supabase/server.ts`
- `src/lib/supabase/middleware.ts`
- `src/middleware.ts`
- `src/app/share/[token]/client.tsx`
- `src/app/onboarding/page.tsx`
- `src/app/meetings/[dept]/page.tsx`
- `src/app/admin/welcome-training/page.tsx`

## Чек-лист деплоя

### 1. Проверить прокси

Прокси `supabase.talentsy.ru/proxy/lbpebpdmerhvbefrbgbv` должен прозрачно
форвардить со всеми заголовками:

- `/rest/v1/*` — PostgREST
- `/auth/v1/*` — GoTrue
- `/storage/v1/*` — Storage
- `/realtime/v1/websocket` — WebSocket (wss://)
- `/functions/v1/*` — Edge Functions

CORS для `https://workplace.talentsy.ru`:
- `Access-Control-Allow-Origin: https://workplace.talentsy.ru` (или wildcard)
- `Access-Control-Allow-Credentials: true`
- `Access-Control-Allow-Headers: apikey, authorization, x-client-info, content-type, prefer, range, x-supabase-api-version`
- `Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS`
- `OPTIONS` preflight без авторизации, с тем же набором заголовков

Проверка вручную:

```bash
# REST
curl -H "apikey: $ANON" \
  "https://supabase.talentsy.ru/proxy/lbpebpdmerhvbefrbgbv/rest/v1/products?select=slug&limit=1"

# Storage
curl -I \
  "https://supabase.talentsy.ru/proxy/lbpebpdmerhvbefrbgbv/storage/v1/object/public/product-images/test.png"

# Auth
curl -H "apikey: $ANON" \
  "https://supabase.talentsy.ru/proxy/lbpebpdmerhvbefrbgbv/auth/v1/settings"
```

### 2. Vercel env-переменные

В `prj_4RZFVNVNN0cnvuwPR36RAu0xI2KR` → Settings → Environment Variables
для каждого окружения (Production, Preview, Development):

- `NEXT_PUBLIC_SUPABASE_URL` = `https://supabase.talentsy.ru/proxy/lbpebpdmerhvbefrbgbv` (изменить)
- `SUPABASE_URL` = `https://lbpebpdmerhvbefrbgbv.supabase.co` (добавить)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — без изменений
- `SUPABASE_SERVICE_ROLE_KEY` — без изменений
- `NEXT_PUBLIC_SITE_URL` — без изменений

⚠️ `NEXT_PUBLIC_*` запекаются в бандл при `next build`. После правки env:
**Vercel → Deployments → ⋮ → Redeploy (без кэша)**.

### 3. Правки в коде (уже сделаны)

Все правки из этой миграции в репо — в соответствующем PR/коммите:
- Добавлена переменная `SUPABASE_URL` в серверных файлах.
- Зафиксирован `storageKey` во всех клиентах.
- Обновлён `.env.local`.
- Обновлены `README.md` и `project_context.md`.

### 4. SQL-миграция БД

Старые записи в БД содержат URL вида `https://lbpebpdmerhvbefrbgbv.supabase.co/...`
(картинки продуктов, картинки внутри документов, этапы Welcome-тренинга и т.д.).
В РФ эти ссылки не открываются, нужно заменить их на проксированные.

Скрипт: `docs/proxy-migration.sql`. Порядок:

1. Снять Supabase snapshot / pg_dump.
2. Запустить блок PREVIEW — убедиться, что масштаб адекватный.
3. Запустить блок UPDATE (каждая таблица — своя транзакция).
4. Запустить блок VERIFY — должны быть нули.

Таблицы, которые миграция затрагивает:
- `products.image_url`
- `documents.content` (Tiptap JSONB)
- `welcome_training.stages` (JSONB)
- `department_vision.content` (Tiptap JSONB)
- `news.content` (JSONB)
- `org_tree.data` (JSONB)

### 5. Supabase Dashboard → Authentication

- **Site URL** = `https://workplace.talentsy.ru` (проверить)
- **Redirect URLs** = `https://workplace.talentsy.ru/**`, `http://localhost:3000/**`

**Email templates** (Invite, Confirm signup, Magic link, Reset password) —
по умолчанию `{{ .ConfirmationURL }}` ссылается на
`https://lbpebpdmerhvbefrbgbv.supabase.co/auth/v1/verify?...`. В РФ не откроется.

Варианты:
- **(рекомендуется)** Кастомизировать шаблоны: вместо `{{ .ConfirmationURL }}`
  формировать ссылку через наш домен, например
  `https://workplace.talentsy.ru/auth/verify?token_hash={{ .TokenHash }}&type={{ .Type }}&next=/auth/set-password`.
  Добавить страничку `/auth/verify`, которая вызывает `supabase.auth.verifyOtp(...)` —
  браузер пойдёт через прокси.
- Альтернатива: если прокси управляется нами и есть возможность настроить
  GoTrue — прописать `GOTRUE_API_EXTERNAL_URL = https://supabase.talentsy.ru/proxy/lbpebpdmerhvbefrbgbv`.

### 6. План выкатки

1. Создать PR с правками.
2. На Preview-деплое (автоматически создаётся Vercel'ом) выставить env-переменные
   и открыть ссылку из РФ без VPN (или проверить через симуляцию — DevTools →
   Network → убедиться, что все запросы идут на `supabase.talentsy.ru`).
3. Пройти smoke-тест:
   - Логин → логаут → логин.
   - Открыть `/news`, `/docs/[id]`, `/departments/[slug]`, `/meetings/[dept]`,
     `/products/paid/[id]`, `/products/free/webinars/[id]`, `/company/goals`.
   - Загрузить картинку в `/products/free/[subcategory]` → проверить, что в БД
     пишется URL с `supabase.talentsy.ru`.
   - Открыть публичный share-линк `/share/[token]`.
   - Пригласить нового пользователя из `/admin/users`, дойти до
     `/auth/set-password` (проверить, что письмо открывается без VPN — см. п. 5).
4. Прогнать SQL-миграцию.
5. Промоутить Preview → Production.
6. Мониторить Supabase Logs и Vercel Runtime Logs первые сутки:
   401/403/CORS-ошибки = проблемы с прокси.

### 7. План отката

Если что-то пошло не так:

1. В Vercel env вернуть `NEXT_PUBLIC_SUPABASE_URL` на
   `https://lbpebpdmerhvbefrbgbv.supabase.co`. Redeploy.
2. При необходимости — запустить SQL rollback из `docs/proxy-migration.sql`
   (заменить `supabase.talentsy.ru/proxy/...` обратно на `lbpebpdmerhvbefrbgbv.supabase.co`).

`storageKey` остаётся зафиксированным — сессии продолжат жить при любом
направлении отката.

## Что проверено в коде

Поиск по всему `src/` на предмет строк `lbpebpdmerhvbefrbgbv` и `supabase.co`
должен возвращать пусто — все ссылки приходят из env-переменных:

```bash
grep -rn "lbpebpdmerhvbefrbgbv\|supabase\.co" src/
# Не должно быть результатов
```

## FAQ

**Вопрос**: почему `getPublicUrl()` из Storage автоматически вернёт проксированный URL?
**Ответ**: `supabase.storage.from(...).getPublicUrl(path)` строит URL из
`supabaseUrl`, который мы передаём в `createClient`. В браузере это
`NEXT_PUBLIC_SUPABASE_URL` (прокси) → значит, все новые загрузки сразу пишут в БД
проксированный URL. Код менять не нужно.

**Вопрос**: что с JWT-токенами? Они подписаны Supabase с `iss:
lbpebpdmerhvbefrbgbv.supabase.co/auth/v1`.
**Ответ**: это нормально — GoTrue валидирует собственные токены независимо от
того, через какой URL клиент обращается. Issuer в JWT не влияет на работу.

**Вопрос**: Realtime (wss) работает через прокси?
**Ответ**: должен — nginx/Cloudflare/любой современный прокси умеет проксировать
WebSocket. Если Realtime в приложении не используется (сейчас не видно явных
подписок) — не критично.
