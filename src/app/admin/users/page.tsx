'use client'

import { useState } from 'react'
import { Plus, Search, ChevronUp, ChevronDown, MoreVertical, Trash2, Edit } from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'manager' | 'user'
  status: 'active' | 'inactive'
  joinedAt: string
  lastActive: string
}

const users: User[] = [
  {
    id: 'user1',
    name: 'Иван Иванов',
    email: 'ivan.ivanov@talentsy.ru',
    role: 'admin',
    status: 'active',
    joinedAt: '2023-01-15',
    lastActive: '2024-03-25 14:30',
  },
  {
    id: 'user2',
    name: 'Наталья Федорова',
    email: 'natalia.fedorova@talentsy.ru',
    role: 'admin',
    status: 'active',
    joinedAt: '2023-02-20',
    lastActive: '2024-03-25 13:45',
  },
  {
    id: 'user3',
    name: 'Виктор Петров',
    email: 'viktor.petrov@talentsy.ru',
    role: 'manager',
    status: 'active',
    joinedAt: '2023-03-10',
    lastActive: '2024-03-24 16:20',
  },
  {
    id: 'user4',
    name: 'Анна Волконская',
    email: 'anna.volkonskaya@talentsy.ru',
    role: 'user',
    status: 'active',
    joinedAt: '2023-04-05',
    lastActive: '2024-03-25 09:15',
  },
  {
    id: 'user5',
    name: 'Сергей Морозов',
    email: 'sergey.morozov@talentsy.ru',
    role: 'manager',
    status: 'active',
    joinedAt: '2023-05-12',
    lastActive: '2024-03-23 11:00',
  },
  {
    id: 'user6',
    name: 'Павел Иванов',
    email: 'pavel.ivanov@talentsy.ru',
    role: 'user',
    status: 'inactive',
    joinedAt: '2023-06-08',
    lastActive: '2024-02-15 10:30',
  },
]

const roleColors = {
  admin: { bg: 'bg-red-100', text: 'text-red-700' },
  manager: { bg: 'bg-blue-100', text: 'text-blue-700' },
  user: { bg: 'bg-gray-100', text: 'text-gray-700' },
}

const roleLabels = {
  admin: 'Администратор',
  manager: 'Менеджер',
  user: 'Пользователь',
}

const statusColors = {
  active: { bg: 'bg-green-100', text: 'text-green-700', label: 'Активен' },
  inactive: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Неактивен' },
}

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let aVal = a[sortBy as keyof User]
    let bVal = b[sortBy as keyof User]

    if (typeof aVal === 'string') {
      return sortOrder === 'asc'
        ? aVal.localeCompare(bVal as string)
        : (bVal as string).localeCompare(aVal)
    }

    return 0
  })

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Управление пользователями
          </h1>
          <p className="text-lg text-slate-600">
            {users.length} всего пользователей, {users.filter((u) => u.status === 'active').length} активных
          </p>
        </div>
        <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
          <Plus size={20} />
          Добавить пользователя
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Поиск по имени или email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-lg placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => toggleSort('name')}
                  className="flex items-center gap-2 font-semibold text-slate-900 hover:text-purple-600"
                >
                  Пользователь
                  {sortBy === 'name' && (
                    sortOrder === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                  )}
                </button>
              </th>
              <th className="px-6 py-4 text-left font-semibold text-slate-900">Email</th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => toggleSort('role')}
                  className="flex items-center gap-2 font-semibold text-slate-900 hover:text-purple-600"
                >
                  Роль
                  {sortBy === 'role' && (
                    sortOrder === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                  )}
                </button>
              </th>
              <th className="px-6 py-4 text-left font-semibold text-slate-900">Статус</th>
              <th className="px-6 py-4 text-left font-semibold text-slate-900">Присоединился</th>
              <th className="px-6 py-4 text-left font-semibold text-slate-900">Последняя активность</th>
              <th className="px-6 py-4 text-center font-semibold text-slate-900">Действия</th>
            </tr>
          </thead>
          <tbody>
            {sortedUsers.map((user, idx) => (
              <tr
                key={user.id}
                className="border-t border-slate-200 hover:bg-slate-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                      alt={user.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <p className="font-medium text-slate-900">{user.name}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-600 text-sm">{user.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${roleColors[user.role].bg} ${roleColors[user.role].text}`}>
                    {roleLabels[user.role]}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[user.status].bg} ${statusColors[user.status].text}`}>
                    {statusColors[user.status].label}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-600 text-sm">
                  {new Date(user.joinedAt).toLocaleDateString('ru-RU')}
                </td>
                <td className="px-6 py-4 text-slate-600 text-sm">
                  {user.lastActive}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button className="p-2 hover:bg-slate-200 rounded transition-colors">
                      <Edit size={16} className="text-slate-600" />
                    </button>
                    <button className="p-2 hover:bg-red-100 rounded transition-colors">
                      <Trash2 size={16} className="text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-slate-600">
          Показано {sortedUsers.length} из {users.length} пользователей
        </p>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg font-medium transition-colors">
            Предыдущая
          </button>
          <button className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg font-medium transition-colors">
            Следующая
          </button>
        </div>
      </div>
    </div>
  )
}
