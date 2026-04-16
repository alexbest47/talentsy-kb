'use client'

import { useEffect, useState } from 'react'
import { Plus, Search, Trash2, X, Users as UsersIcon, Mail, Upload } from 'lucide-react'

interface User {
  id: string
  email: string
  full_name: string
  role: string
  created_at: string
  last_sign_in_at: string | null
  confirmed: boolean
}

const ROLE_LABELS: Record<string, string> = {
  admin: 'Администратор',
  head: 'Руководитель',
  employee: 'Сотрудник',
}

const ROLE_COLORS: Record<string, string> = {
  admin: 'bg-red-100 text-red-700',
  head: 'bg-amber-100 text-amber-700',
  employee: 'bg-blue-100 text-blue-700',
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [singleOpen, setSingleOpen] = useState(false)
  const [bulkOpen, setBulkOpen] = useState(false)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const r = await fetch('/api/admin/users')
      const j = await r.json()
      if (!r.ok) throw new Error(j.error || 'Ошибка загрузки')
      setUsers(j.users || [])
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const removeUser = async (id: string, email: string) => {
    if (!confirm(`Удалить пользователя ${email}?`)) return
    const r = await fetch(`/api/admin/users?id=${id}`, { method: 'DELETE' })
    const j = await r.json()
    if (!r.ok) {
      alert(j.error)
      return
    }
    setUsers((u) => u.filter((x) => x.id !== id))
  }

  const filtered = users.filter(
    (u) =>
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.full_name || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Управление пользователями
          </h1>
          <p className="text-slate-600">
            {users.length} всего пользователей
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setBulkOpen(true)}
            className="flex items-center gap-2 bg-white border border-slate-200 hover:border-purple-300 text-slate-700 px-4 py-2.5 rounded-lg font-medium transition-colors"
          >
            <Upload size={16} />
            Массовая загрузка
          </button>
          <button
            onClick={() => setSingleOpen(true)}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors"
          >
            <Plus size={16} />
            Добавить пользователя
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mb-6 relative">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск по имени или email..."
          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        {loading ? (
          <p className="p-8 text-center text-slate-500">Загрузка...</p>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <UsersIcon size={32} className="mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500 text-sm">
              Пользователей пока нет. Нажмите «Добавить пользователя».
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                  Пользователь
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                  Роль
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                  Статус
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                  Создан
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                  Последний вход
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-t border-slate-200 hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm text-slate-900 font-medium">
                    {u.full_name || '—'}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{u.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${ROLE_COLORS[u.role] || ROLE_COLORS.user}`}
                    >
                      {ROLE_LABELS[u.role] || u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {u.confirmed ? (
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        Активен
                      </span>
                    ) : (
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                        Приглашение отправлено
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500">
                    {new Date(u.created_at).toLocaleDateString('ru-RU')}
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500">
                    {u.last_sign_in_at
                      ? new Date(u.last_sign_in_at).toLocaleString('ru-RU')
                      : '—'}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => removeUser(u.id, u.email)}
                      className="p-2 hover:bg-red-50 rounded-lg text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {singleOpen && (
        <SingleInviteModal
          onClose={() => setSingleOpen(false)}
          onDone={load}
        />
      )}
      {bulkOpen && (
        <BulkInviteModal onClose={() => setBulkOpen(false)} onDone={load} />
      )}
    </div>
  )
}

function SingleInviteModal({
  onClose,
  onDone,
}: {
  onClose: () => void
  onDone: () => void
}) {
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState('employee')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')

  const submit = async () => {
    setBusy(true)
    setMsg('')
    const r = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, full_name: fullName, role }),
    })
    const j = await r.json()
    setBusy(false)
    if (!r.ok) {
      setMsg(j.error || 'Ошибка')
      return
    }
    const result = j.results?.[0]
    if (result?.ok) {
      onDone()
      onClose()
    } else {
      setMsg(result?.error || 'Ошибка')
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-bold text-slate-900">Пригласить пользователя</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@talentsy.ru"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
              Имя (необязательно)
            </label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Иван Иванов"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
              Роль
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            >
              <option value="employee">Сотрудник</option>
              <option value="head">Руководитель</option>
              <option value="admin">Администратор</option>
            </select>
          </div>
          <p className="text-xs text-slate-500 flex items-start gap-2">
            <Mail size={14} className="mt-0.5 flex-shrink-0" />
            На указанный email будет отправлено приглашение со ссылкой для установки пароля.
          </p>
          {msg && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded p-2">
              {msg}
            </p>
          )}
        </div>
        <div className="p-4 border-t flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            Отмена
          </button>
          <button
            onClick={submit}
            disabled={busy || !email}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50"
          >
            {busy ? 'Отправляем...' : 'Отправить приглашение'}
          </button>
        </div>
      </div>
    </div>
  )
}

function BulkInviteModal({
  onClose,
  onDone,
}: {
  onClose: () => void
  onDone: () => void
}) {
  const [text, setText] = useState('')
  const [role, setRole] = useState('employee')
  const [busy, setBusy] = useState(false)
  const [results, setResults] = useState<
    { email: string; ok: boolean; error?: string }[] | null
  >(null)

  const submit = async () => {
    const emails = text
      .split(/[\s,;]+/)
      .map((s) => s.trim())
      .filter(Boolean)
    if (emails.length === 0) return
    setBusy(true)
    setResults(null)
    const r = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ emails, role }),
    })
    const j = await r.json()
    setBusy(false)
    if (!r.ok) {
      setResults([{ email: '—', ok: false, error: j.error }])
      return
    }
    setResults(j.results || [])
    onDone()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-xl">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-bold text-slate-900">Массовая загрузка</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
              Email-адреса (по одному в строке или через запятую)
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={8}
              placeholder={'user1@talentsy.ru\nuser2@talentsy.ru\nuser3@talentsy.ru'}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
              Роль для всех
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            >
              <option value="employee">Сотрудник</option>
              <option value="head">Руководитель</option>
              <option value="admin">Администратор</option>
            </select>
          </div>
          <p className="text-xs text-slate-500 flex items-start gap-2">
            <Mail size={14} className="mt-0.5 flex-shrink-0" />
            Каждому адресу будет отправлено приглашение со ссылкой для установки пароля.
          </p>
          {results && (
            <div className="border border-slate-200 rounded-lg max-h-48 overflow-y-auto">
              {results.map((r, i) => (
                <div
                  key={i}
                  className={`px-3 py-2 text-xs flex items-center justify-between border-b border-slate-100 last:border-0 ${
                    r.ok ? 'text-green-700' : 'text-red-700 bg-red-50'
                  }`}
                >
                  <span>{r.email}</span>
                  <span>{r.ok ? '✓ отправлено' : `✗ ${r.error}`}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="p-4 border-t flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            Закрыть
          </button>
          <button
            onClick={submit}
            disabled={busy || !text.trim()}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50"
          >
            {busy ? 'Отправляем...' : 'Отправить приглашения'}
          </button>
        </div>
      </div>
    </div>
  )
}
