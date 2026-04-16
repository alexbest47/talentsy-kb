import { type CookieOptions, createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'
import { Database } from '@/lib/types/database'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
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
