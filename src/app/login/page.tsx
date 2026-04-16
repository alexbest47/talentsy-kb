'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [loading, setLoading] = useState(false)
  const [resetMode, setResetMode] = useState(false)
  const router = useRouter()

  const handleReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setInfo('')
    if (!email) {
      setError('Введите email')
      return
    }
    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent('/auth/set-password')}`,
      })
      if (error) setError(error.message)
      else setInfo('Письмо со ссылкой для сброса пароля отправлено на ' + email)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
        return
      }

      router.push('/')
    } catch (err) {
      setError('Произошла непредвиденная ошибка')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const switchMode = () => {
    setError('')
    setInfo('')
    setResetMode(!resetMode)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-white px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block px-4 py-2 bg-purple-100 rounded-lg mb-4">
            <span className="text-2xl font-bold text-purple-700">Talentsy</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">WorkPlace</h1>
          <p className="text-gray-600">
            {resetMode
              ? 'Введите email для сброса пароля'
              : 'Войдите в свой аккаунт'}
          </p>
        </div>

        {resetMode ? (
          /* ── Форма восстановления пароля ── */
          <form onSubmit={handleReset} className="bg-white rounded-lg shadow-lg p-8 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            )}
            {info && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-700 font-medium">{info}</p>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="reset-email" className="block text-sm font-medium text-gray-900">
                Email
              </label>
              <input
                id="reset-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@talentsy.ru"
                required
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-medium py-2 rounded-lg transition duration-200 disabled:cursor-not-allowed"
            >
              {loading ? 'Отправляем...' : 'Отправить ссылку'}
            </button>

            <button
              type="button"
              onClick={switchMode}
              disabled={loading}
              className="w-full text-sm text-purple-600 hover:text-purple-700 font-medium"
            >
              Назад к входу
            </button>
          </form>
        ) : (
          /* ── Форма входа ── */
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            )}
            {info && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-700 font-medium">{info}</p>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@talentsy.ru"
                required
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                Пароль
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-medium py-2 rounded-lg transition duration-200 disabled:cursor-not-allowed"
            >
              {loading ? 'Входим...' : 'Войти'}
            </button>

            <button
              type="button"
              onClick={switchMode}
              disabled={loading}
              className="w-full text-sm text-purple-600 hover:text-purple-700 font-medium"
            >
              Забыли пароль?
            </button>
          </form>
        )}

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-6">
          Talentsy WorkPlace &middot; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  )
}
