import { NextRequest, NextResponse } from 'next/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { createClient as createServerClient } from '@/lib/supabase/server'

// Server-side admin client (uses service role key)
function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY не задан в .env.local — добавьте его (Supabase Dashboard → Settings → API → service_role key)'
    )
  }
  return createAdminClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

// Guard: only authenticated admins can call this endpoint.
// Returns null on success, or a NextResponse (401/403) on failure.
async function requireAdmin(): Promise<NextResponse | null> {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json(
      { error: 'Не авторизовано' },
      { status: 401 }
    )
  }
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  if (error || !profile || profile.role !== 'admin') {
    return NextResponse.json(
      { error: 'Доступ запрещён: требуется роль администратора' },
      { status: 403 }
    )
  }
  return null
}

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  'http://localhost:3000'

const VALID_ROLES = new Set(['admin', 'head', 'employee'])

// GET /api/admin/users — list all users (admin only)
export async function GET() {
  const forbidden = await requireAdmin()
  if (forbidden) return forbidden
  try {
    const admin = getAdminClient()
    const { data, error } = await admin.auth.admin.listUsers({
      page: 1,
      perPage: 200,
    })
    if (error) throw error
    const users = (data?.users || []).map((u) => ({
      id: u.id,
      email: u.email,
      full_name: (u.user_metadata as any)?.full_name || '',
      role: (u.user_metadata as any)?.role || 'employee',
      created_at: u.created_at,
      last_sign_in_at: u.last_sign_in_at,
      confirmed: !!u.email_confirmed_at || !!u.confirmed_at,
    }))
    return NextResponse.json({ users })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

// POST /api/admin/users — invite single or bulk (admin only)
// body: { emails: string[], role?: string, full_name?: string }
export async function POST(req: NextRequest) {
  const forbidden = await requireAdmin()
  if (forbidden) return forbidden
  try {
    const body = await req.json()
    const emails: string[] = Array.isArray(body.emails)
      ? body.emails
      : body.email
        ? [body.email]
        : []
    if (emails.length === 0) {
      return NextResponse.json(
        { error: 'Не указан email' },
        { status: 400 }
      )
    }
    const rawRole: string = body.role || 'employee'
    const role = VALID_ROLES.has(rawRole) ? rawRole : 'employee'
    const full_name: string | undefined = body.full_name

    const admin = getAdminClient()
    const results: { email: string; ok: boolean; error?: string }[] = []

    for (const rawEmail of emails) {
      const email = String(rawEmail).trim().toLowerCase()
      if (!email || !email.includes('@')) {
        results.push({ email, ok: false, error: 'Некорректный email' })
        continue
      }
      const { error } = await admin.auth.admin.inviteUserByEmail(email, {
        data: { role, full_name: full_name || '' },
        redirectTo: `${SITE_URL}/auth/set-password`,
      })
      if (error) {
        results.push({ email, ok: false, error: error.message })
      } else {
        results.push({ email, ok: true })
      }
    }

    return NextResponse.json({ results })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

// DELETE /api/admin/users?id=... — delete user (admin only)
export async function DELETE(req: NextRequest) {
  const forbidden = await requireAdmin()
  if (forbidden) return forbidden
  try {
    const id = req.nextUrl.searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Не указан id' }, { status: 400 })
    }
    const admin = getAdminClient()
    const { error } = await admin.auth.admin.deleteUser(id)
    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
