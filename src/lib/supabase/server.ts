import { type CookieOptions, createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from '@/lib/types/database'

// Серверные вызовы из Vercel ходят напрямую к Supabase (быстрее, нет лишнего хопа).
// Браузерные клиенты используют NEXT_PUBLIC_SUPABASE_URL (через прокси для пользователей из РФ).
const SUPABASE_URL =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!

// Фиксируем storageKey, чтобы при смене hostname (на прокси) куки auth-сессии
// сохранили прежнее имя и пользователи не разлогинились.
const SUPABASE_STORAGE_KEY = 'sb-lbpebpdmerhvbefrbgbv-auth-token'

export const createClient = async () => {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        storageKey: SUPABASE_STORAGE_KEY,
      },
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(
          cookiesToSet: { name: string; value: string; options?: CookieOptions }[]
        ) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Catching errors during cookie setting when in route handlers
          }
        },
      },
    }
  )
}
