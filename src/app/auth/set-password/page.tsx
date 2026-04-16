'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

function describeOtpError(code: string, description: string): string {
  if (code === 'otp_expired' || description.toLowerCase().includes('expired')) {
    return 'Срок действия ссылки истёк. Запросите новое письмо — каждая новая ссылка делает предыдущие недействительными, поэтому используйте самое свежее письмо из почты.'
  }
  if (code === 'access_denied') {
    return 'Ссылка уже использована или отозвана. Запросите новое письмо для восстановления пароля.'
  }
  return description || 'Ссылка недействительна. Запросите новое письмо для восстановления пароля.'
}

export default function SetPasswordPage() {
  const router = useRouter()
  const supabase = createClient()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [ready, setReady] = useState(false)
  const [linkInvalid, setLinkInvalid] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const init = async () => {
      // 0. Если сессия уже есть (например, после /auth/callback) — сразу готово.
      const existing = await supabase.auth.getSession()
      if (existing.data.session) {
        setReady(true)
        setChecking(false)
        // почистим URL от возможных code/hash
        const url0 = new URL(window.location.href)
        window.history.replaceState({}, '', url0.pathname)
        return
      }

      const url = new URL(window.location.href)

      // Обработка ошибок в hash: #error=access_denied&error_code=otp_expired&error_description=...
      if (window.location.hash.includes('error')) {
        const hash = new URLSearchParams(window.location.hash.slice(1))
        const errCode = hash.get('error_code') || hash.get('error') || ''
        const errDesc = hash.get('error_description') || ''
        setLinkInvalid(true)
        setError(describeOtpError(errCode, decodeURIComponent(errDesc.replace(/\+/g, ' '))))
        window.history.replaceState({}, '', url.pathname)
        setChecking(false)
        return
      }

      // PKCE flow: ?code=...  (fallback если сюда пришли напрямую, минуя /auth/callback)
      const code = url.searchParams.get('code')
      if (code) {
        try {
          await supabase.auth.exchangeCodeForSession(code)
        } catch (e: any) {
          setLinkInvalid(true)
          setError(
            e?.message ||
              'Не удалось активировать ссылку. Откройте письмо в том же браузере, в котором запрашивали восстановление, или запросите новую ссылку.'
          )
        }
        window.history.replaceState({}, '', url.pathname)
      } else if (window.location.hash.includes('access_token')) {
        // Implicit flow (часто для инвайтов): #access_token=...&refresh_token=...
        const hash = new URLSearchParams(window.location.hash.slice(1))
        const access_token = hash.get('access_token') || ''
        const refresh_token = hash.get('refresh_token') || ''
        if (access_token && refresh_token) {
          try {
            await supabase.auth.setSession({ access_token, refresh_token })
          } catch (e: any) {
            setLinkInvalid(true)
            setError(e?.message || 'Не удалось активировать ссылку')
          }
        }
        window.history.replaceState({}, '', url.pathname)
      } else {
        // Ни кода, ни токена, ни ошибки — похоже, страницу открыли напрямую.
        setLinkInvalid(true)
      }
      const { data } = await supabase.auth.getSession()
      setReady(!!data.session)
      setChecking(false)
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

        {checking ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="inline-block w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4" />
            <p className="text-sm text-slate-600">Проверяем ссылку...</p>
          </div>
        ) : linkInvalid ? (
          <div className="bg-white rounded-lg shadow-lg p-8 space-y-5">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h2 className="text-sm font-semibold text-red-800 mb-1">
                Ссылка недействительна
              </h2>
              <p className="text-sm text-red-700">
                {error || 'Ссылка для восстановления пароля больше не работает. Запросите новое письмо.'}
              </p>
            </div>
            <Link
              href="/login"
              className="block w-full text-center bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 rounded-lg transition"
            >
              Запросить новую ссылку
            </Link>
            <p className="text-xs text-slate-500 text-center">
              Совет: каждое новое письмо делает предыдущие ссылки недействительными.
              Открывайте самое свежее письмо из почты.
            </p>
          </div>
        ) : (
          <form
            onSubmit={submit}
            className="bg-white rounded-lg shadow-lg p-8 space-y-5"
          >
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
              disabled={busy}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white font-medium py-2.5 rounded-lg transition"
            >
              {busy ? 'Сохраняем...' : 'Сохранить пароль'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
