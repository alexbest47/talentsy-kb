import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Server-side admin client (uses service role key)
function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY не задан в .env.local — добавьте его (Supabase Dashboard → Settings → API → service_role key)'
    )
  }
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  'http://localhost:3000'

// GET /api/admin/users — list all users
export async function GET() {
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
      role: (u.user_metadata as any)?.role || 'user',
      created_at: u.created_at,
      last_sign_in_at: u.last_sign_in_at,
      confirmed: !!u.email_confirmed_at || !!u.confirmed_at,
    }))
    return NextResponse.json({ users })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

// POST /api/admin/users — invite single or bulk
// body: { emails: string[], role?: string, full_name?: string }
export async function POST(req: NextRequest) {
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
    const role: string = body.role || 'user'
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

// DELETE /api/admin/users?id=... — delete user
export async function DELETE(req: NextRequest) {
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
