import { type CookieOptions, createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

/**
 * Маршрутизация ролей:
 * - /share/*, /login, /auth/* — публичные, доступны без входа
 * - Все остальные маршруты требуют залогиненного пользователя
 * - /admin/* — только для роли admin
 * - Роль guest имеет доступ ТОЛЬКО к /share/* (всё остальное → редирект на /share-only)
 */

const PUBLIC_PATHS = [
  '/login',
  '/auth',
  '/share',
  '/api/auth',
  '/share-only',
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
    // сохраняем текущий путь как next (если это не login/share-only)
    const next =
      pathname === '/' || pathname === '/login' || pathname === '/share-only'
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
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(
          cookiesToSet: { name: string; value: string; options?: CookieOptions }[]
        ) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response = NextResponse.next({
              request: { headers: request.headers },
            })
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

  // 4. Гость имеет доступ только к /share/* (и public paths, но они уже выше пропущены).
  //    Любой другой путь → редирект на /share-only (информационная страница).
  if (role === 'guest') {
    const url = request.nextUrl.clone()
    url.pathname = '/share-only'
    return NextResponse.redirect(url)
  }

  // 5. /admin/* только для admin
  if (pathname.startsWith('/admin') && role !== 'admin') {
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
