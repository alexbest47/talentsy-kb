'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function SetPasswordPage() {
  const router = useRouter()
  const supabase = createClient()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const init = async () => {
      // PKCE flow: ?code=...
      const url = new URL(window.location.href)
      const code = url.searchParams.get('code')
      if (code) {
        try {
          await supabase.auth.exchangeCodeForSession(code)
        } catch (e: any) {
          setError(e?.message || 'Не удалось активировать ссылку приглашения')
        }
        // clean URL
        window.history.replaceState({}, '', url.pathname)
      } else if (window.location.hash.includes('access_token')) {
        const hash = new URLSearchParams(window.location.hash.slice(1))
        const access_token = hash.get('access_token') || ''
        const refresh_token = hash.get('refresh_token') || ''
        if (access_token && refresh_token) {
          try {
            await supabase.auth.setSession({ access_token, refresh_token })
          } catch (e: any) {
            setError(e?.message || 'Не удалось активировать ссылку')
          }
        }
        window.history.replaceState({}, '', url.pathname)
      }
      const { data } = await supabase.auth.getSession()
      setReady(!!data.session)
    }
    init()
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) setReady(true)
    })
    return () => sub.subscription.unsubscribe()
  }, [supabase])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password.length < 8) {
      setError('Пароль должен быть не короче 8 символов')
      return
    }
    if (password !== confirm) {
      setError('Пароли не совпадают')
      return
    }
    setBusy(true)
    const { error } = await supabase.auth.updateUser({ password, data: { password_set: true } })
    setBusy(false)
    if (error) {
      setError(error.message)
      return
    }
    router.push('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-white px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-block px-4 py-2 bg-purple-100 rounded-lg mb-4">
            <span className="text-2xl font-bold text-purple-700">Talentsy</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Установите пароль
          </h1>
          <p className="text-slate-600 text-sm">
            Придумайте пароль для входа в Talentsy WorkPlace
          </p>
        </div>

        <form
          onSubmit={submit}
          className="bg-white rounded-lg shadow-lg p-8 space-y-5"
        >
          {!ready && (
            <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded p-3">
              Проверка ссылки... Если эта страница открыта не из письма-приглашения,
              запросите новое приглашение у администратора.
            </p>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-1">
              Новый пароль
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-1">
              Подтвердите пароль
            </label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              minLength={8}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={busy || !ready}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white font-medium py-2.5 rounded-lg transition"
          >
            {busy ? 'Сохраняем...' : 'Сохранить пароль'}
          </button>
        </form>
      </div>
    </div>
  )
}
