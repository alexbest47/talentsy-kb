import { type CookieOptions, createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

/**
 * Маршрутизация ролей:
 * - /share/*, /login, /auth/* — публичные, доступны без входа (открываются кем угодно из интернета)
 * - Все остальные маршруты требуют залогиненного пользователя
 * - /admin/* — только для роли admin
 */

// Сервер-сайд: ходим к Supabase напрямую в обход прокси.
// Браузерные клиенты идут через прокси (NEXT_PUBLIC_SUPABASE_URL), чтобы пользователи из РФ
// могли открывать приложение без VPN. storageKey зафиксирован по оригинальному project ref —
// чтобы имя auth-cookie не изменилось после переключения браузерных клиентов на прокси.
const SUPABASE_URL =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_STORAGE_KEY = 'sb-lbpebpdmerhvbefrbgbv-auth-token'

const PUBLIC_PATHS = [
  '/login',
  '/auth',
  '/share',
  '/api/auth',
]

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  )
}

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl

  // Static & асеты пропускаем
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/public')
  ) {
    return NextResponse.next()
  }

  // Supabase PKCE code приходит как ?code=... Если Supabase укоротил redirect_to
  // до корня — перехватываем здесь и проксируем в /auth/callback, чтобы не потерять code.
  const pkceCode = searchParams.get('code')
  if (pkceCode && !pathname.startsWith('/auth/callback')) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/callback'
    // сохраняем текущий путь как next (если это не login/корень)
    const next =
      pathname === '/' || pathname === '/login'
        ? '/auth/set-password'
        : pathname
    url.searchParams.set('code', pkceCode)
    url.searchParams.set('next', next)
    return NextResponse.redirect(url)
  }

  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
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
        setAll(
          cookiesToSet: { name: string; value: string; options?: CookieOptions }[]
        ) {
          // 1. Сначала обновляем ВСЕ куки в request (для downstream обработчиков)
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value)
          })
          // 2. Создаём response ОДИН раз (а не в цикле!) —
          //    иначе каждая итерация перезаписывает response и
          //    Set-Cookie хедеры предыдущих кук теряются.
          //    Supabase хранит токен в нескольких chunked-куках
          //    (sb-xxx-auth-token.0, .1, …), все они должны попасть в ответ.
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          // 3. Устанавливаем ВСЕ Set-Cookie хедеры на ОДИН response
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options as CookieOptions)
          })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 1. Публичные маршруты — пропускаем без ограничений
  if (isPublicPath(pathname)) {
    return response
  }

  // 2. Нет сессии → редирект на /login
  if (!user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(url)
  }

  // 3. Смотрим роль пользователя
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const role = profile?.role ?? 'employee'

  // 4. /admin/* доступно для admin и head
  if (pathname.startsWith('/admin') && role !== 'admin' && role !== 'head') {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Всё, кроме статики:
     * - _next/static
     * - _next/image
     * - favicon.ico
     * - файлы public/
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
