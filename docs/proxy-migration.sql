-- =============================================================================
-- Миграция URL Supabase → прокси supabase.talentsy.ru
-- =============================================================================
-- Назначение: заменить в БД все ссылки вида
--   https://lbpebpdmerhvbefrbgbv.supabase.co/...
-- на
--   https://supabase.talentsy.ru/proxy/lbpebpdmerhvbefrbgbv/...
--
-- Нужно, чтобы картинки и документы, загруженные ДО переключения клиента на
-- прокси, продолжали открываться у пользователей из РФ.
--
-- Как запускать:
--   1) Сначала — блок PREVIEW (SELECT count(*)) — оценить масштаб.
--   2) Обязательно сделать бэкап / snapshot Supabase перед UPDATE.
--   3) Запустить блок UPDATE (каждая команда в транзакции).
--   4) Прогнать блок VERIFY для контроля.
--
-- Откат: см. блок ROLLBACK в самом низу файла.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- PREVIEW: сколько записей затронет миграция
-- -----------------------------------------------------------------------------
SELECT 'products.image_url' AS source, count(*) AS rows_to_update
FROM products
WHERE image_url LIKE '%lbpebpdmerhvbefrbgbv.supabase.co%'
UNION ALL
SELECT 'documents.content', count(*)
FROM documents
WHERE content::text LIKE '%lbpebpdmerhvbefrbgbv.supabase.co%'
UNION ALL
SELECT 'welcome_training.stages', count(*)
FROM welcome_training
WHERE stages::text LIKE '%lbpebpdmerhvbefrbgbv.supabase.co%'
UNION ALL
SELECT 'department_vision.content', count(*)
FROM department_vision
WHERE content::text LIKE '%lbpebpdmerhvbefrbgbv.supabase.co%'
UNION ALL
SELECT 'news.content', count(*)
FROM news
WHERE content::text LIKE '%lbpebpdmerhvbefrbgbv.supabase.co%'
UNION ALL
SELECT 'org_tree.data', count(*)
FROM org_tree
WHERE data::text LIKE '%lbpebpdmerhvbefrbgbv.supabase.co%';

-- -----------------------------------------------------------------------------
-- UPDATE: замена URL. Каждый блок — в отдельной транзакции.
-- Ставим where фильтр, чтобы не трогать лишние строки.
-- -----------------------------------------------------------------------------

-- 1. products.image_url — обычная text-колонка
BEGIN;
UPDATE products
SET image_url = REPLACE(
  image_url,
  'https://lbpebpdmerhvbefrbgbv.supabase.co',
  'https://supabase.talentsy.ru/proxy/lbpebpdmerhvbefrbgbv'
)
WHERE image_url LIKE '%lbpebpdmerhvbefrbgbv.supabase.co%';
COMMIT;

-- 2. documents.content — Tiptap JSONB (могут быть <img src="..."> внутри)
BEGIN;
UPDATE documents
SET content = REPLACE(
  content::text,
  'https://lbpebpdmerhvbefrbgbv.supabase.co',
  'https://supabase.talentsy.ru/proxy/lbpebpdmerhvbefrbgbv'
)::jsonb
WHERE content::text LIKE '%lbpebpdmerhvbefrbgbv.supabase.co%';
COMMIT;

-- 3. welcome_training.stages — JSONB со ссылками на Kinescope и документы
BEGIN;
UPDATE welcome_training
SET stages = REPLACE(
  stages::text,
  'https://lbpebpdmerhvbefrbgbv.supabase.co',
  'https://supabase.talentsy.ru/proxy/lbpebpdmerhvbefrbgbv'
)::jsonb
WHERE stages::text LIKE '%lbpebpdmerhvbefrbgbv.supabase.co%';
COMMIT;

-- 4. department_vision.content — Tiptap JSONB
BEGIN;
UPDATE department_vision
SET content = REPLACE(
  content::text,
  'https://lbpebpdmerhvbefrbgbv.supabase.co',
  'https://supabase.talentsy.ru/proxy/lbpebpdmerhvbefrbgbv'
)::jsonb
WHERE content::text LIKE '%lbpebpdmerhvbefrbgbv.supabase.co%';
COMMIT;

-- 5. news.content — JSONB
BEGIN;
UPDATE news
SET content = REPLACE(
  content::text,
  'https://lbpebpdmerhvbefrbgbv.supabase.co',
  'https://supabase.talentsy.ru/proxy/lbpebpdmerhvbefrbgbv'
)::jsonb
WHERE content::text LIKE '%lbpebpdmerhvbefrbgbv.supabase.co%';
COMMIT;

-- 6. org_tree.data — JSONB (обычно URLов нет, но на всякий случай)
BEGIN;
UPDATE org_tree
SET data = REPLACE(
  data::text,
  'https://lbpebpdmerhvbefrbgbv.supabase.co',
  'https://supabase.talentsy.ru/proxy/lbpebpdmerhvbefrbgbv'
)::jsonb
WHERE data::text LIKE '%lbpebpdmerhvbefrbgbv.supabase.co%';
COMMIT;

-- -----------------------------------------------------------------------------
-- VERIFY: после миграции должно быть 0 строк в каждой таблице
-- -----------------------------------------------------------------------------
SELECT 'products.image_url' AS source, count(*) AS rows_remaining
FROM products
WHERE image_url LIKE '%lbpebpdmerhvbefrbgbv.supabase.co%'
UNION ALL
SELECT 'documents.content', count(*)
FROM documents
WHERE content::text LIKE '%lbpebpdmerhvbefrbgbv.supabase.co%'
UNION ALL
SELECT 'welcome_training.stages', count(*)
FROM welcome_training
WHERE stages::text LIKE '%lbpebpdmerhvbefrbgbv.supabase.co%'
UNION ALL
SELECT 'department_vision.content', count(*)
FROM department_vision
WHERE content::text LIKE '%lbpebpdmerhvbefrbgbv.supabase.co%'
UNION ALL
SELECT 'news.content', count(*)
FROM news
WHERE content::text LIKE '%lbpebpdmerhvbefrbgbv.supabase.co%'
UNION ALL
SELECT 'org_tree.data', count(*)
FROM org_tree
WHERE data::text LIKE '%lbpebpdmerhvbefrbgbv.supabase.co%';

-- -----------------------------------------------------------------------------
-- ROLLBACK: откат (если что-то пошло не так)
-- -----------------------------------------------------------------------------
-- BEGIN;
-- UPDATE products SET image_url = REPLACE(image_url,
--   'https://supabase.talentsy.ru/proxy/lbpebpdmerhvbefrbgbv',
--   'https://lbpebpdmerhvbefrbgbv.supabase.co')
-- WHERE image_url LIKE '%supabase.talentsy.ru/proxy/lbpebpdmerhvbefrbgbv%';
-- COMMIT;
--
-- UPDATE documents SET content = REPLACE(content::text,
--   'https://supabase.talentsy.ru/proxy/lbpebpdmerhvbefrbgbv',
--   'https://lbpebpdmerhvbefrbgbv.supabase.co')::jsonb
-- WHERE content::text LIKE '%supabase.talentsy.ru/proxy/lbpebpdmerhvbefrbgbv%';
--
-- ... и так для остальных таблиц.
