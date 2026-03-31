import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  // TODO: включить авторизацию после создания первого пользователя
  // Пока пропускаем все запросы без проверки auth
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}
