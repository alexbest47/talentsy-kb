import { type CookieOptions, createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'
import { Database } from '@/lib/types/database'

// Сервер-сайд: ходим к Supabase напрямую (SUPABASE_URL), в обход прокси.
// storageKey привязан к оригинальному project ref — чтобы auth-cookie не теряли имя
// после переключения браузерных клиентов на прокси.
const SUPABASE_URL =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_STORAGE_KEY = 'sb-lbpebpdmerhvbefrbgbv-auth-token'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient<Database>(
    SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        storageKey: SUPABASE_STORAGE_KEY,
      },
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
          // 1. Сначала ставим ВСЕ куки в request (для SSR)
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value)
          })
          // 2. Создаём response ОДИН раз (не внутри forEach!)
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          // 3. Ставим ВСЕ куки в response (для браузера)
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options as CookieOptions)
          })
        },
      },
    }
  )

  // Refresh auth token
  await supabase.auth.getSession()

  return response
}
