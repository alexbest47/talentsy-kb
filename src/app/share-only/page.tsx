'use client'

import Link from 'next/link'
import { Lock, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function ShareOnlyPage() {
  const logout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
        <div className="w-14 h-14 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <Lock size={24} className="text-slate-500" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Доступ ограничен
        </h1>
        <p className="text-slate-600 text-sm mb-6">
          Ваша учётная запись имеет доступ только к публичным ссылкам вида{' '}
          <code className="text-purple-600">/share/...</code>.
          Полный интерфейс базы знаний недоступен.
        </p>
        <p className="text-slate-500 text-xs mb-8">
          Если вам нужен расширенный доступ, обратитесь к администратору
          платформы.
        </p>
        <div className="flex flex-col gap-2">
          <Link
            href="/"
            className="text-sm text-purple-600 hover:text-purple-700 font-medium"
          >
            Повторить попытку
          </Link>
          <button
            onClick={logout}
            className="inline-flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-slate-700 mt-2"
          >
            <LogOut size={14} />
            Выйти
          </button>
        </div>
      </div>
    </div>
  )
}
