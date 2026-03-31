'use client'

import { useState } from 'react'
import {
  Users,
  Plus,
  MoreVertical,
  Mail,
  Shield,
  Building2,
  Toggle2,
  Search,
} from 'lucide-react'
import clsx from 'clsx'

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'manager' | 'user'
  department: string
  status: 'active' | 'inactive'
  joinedDate: string
  avatar: string
}

const users: User[] = [
  {
    id: '1',
    name: 'Иван Иванов',
    email: 'ivan.ivanov@talentsy.ru',
    role: 'admin',
    department: 'Администрирование',
    status: 'active',
    joinedDate: '2020-01-15',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ivan',
  },
  {
    id: '2',
    name: 'Мария Сидорова',
    email: 'maria.sidorova@talentsy.ru',
    role: 'manager',
    department: 'Маркетинг',
    status: 'active',
    joinedDate: '2021-03-20',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maria',
  },
  {
    id: '3',
    name: 'Алексей Петров',
    email: 'alexey.petrov@talentsy.ru',
    role: 'user',
    department: 'Продукт',
    status: 'active',
    joinedDate: '2022-06-10',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alexey',
  },
  {
    id: '4',
    name: 'Елена Волкова',
    email: 'elena.volkova@talentsy.ru',
    role: 'manager',
    department: 'Продажи',
    status: 'active',
    joinedDate: '2021-11-05',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=elena',
  },
  {
    id: '5',
    name: 'Виктор Кузнецов',
    email: 'viktor.kuznetsov@talentsy.ru',
    role: 'user',
    department: 'HR',
    status: 'active',
    joinedDate: '2023-02-14',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=viktor',
  },
  {
    id: '6',
    name: 'Анна Федорова',
    email: 'anna.fedorova@talentsy.ru',
    role: 'user',
    department: 'Маркетинг',
    status: 'inactive',
    joinedDate: '2023-08-20',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=anna',
  },
  {
    id: '7',
    name: 'Павел Романов',
    email: 'pavel.romanov@talentsy.ru',
    role: 'user',
    department: 'Продукт',
    status: 'active',
    joinedDate: '2023-01-10',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=pavel',
  },
  {
    id: '8',
    name: 'Юлия Соколова',
    email: 'yulia.sokolova@talentsy.ru',
    role: 'manager',
    department: 'Продукт',
    status: 'active',
    joinedDate: '2022-04-05',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=yulia',
  },
]

const roleLabels = {
  admin: 'Администратор',
  manager: 'Менеджер',
  user: 'Пользователь',
}

const roleColors = {
  admin: 'bg-red-100 text-red-800',
  manager: 'bg-blue-100 text-blue-800',
  user: 'bg-slate-100 text-slate-800',
}

function UserRow({
  user,
  onEditRole,
  onToggleStatus,
}: {
  user: User
  onEditRole: (user: User) => void
  onToggleStatus: (user: User) => void
}) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <tr className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="font-medium text-slate-900">{user.name}</p>
            <p className="text-sm text-slate-600">{user.email}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <span
          className={clsx(
            'px-3 py-1 rounded-full text-sm font-medium',
            roleColors[user.role]
          )}
        >
          {roleLabels[user.role]}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2 text-slate-600">
          <Building2 size={16} />
          <span>{user.department}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <span
          className={clsx(
            'px-3 py-1 rounded-full text-sm font-medium',
            user.status === 'active'
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          )}
        >
          {user.status === 'active' ? 'Активный' : 'Неактивный'}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-slate-600">{user.joinedDate}</td>
      <td className="px-6 py-4">
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <MoreVertical size={18} className="text-slate-600" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-10">
              <button
                onClick={() => {
                  onEditRole(user)
                  setMenuOpen(false)
                }}
                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
              >
                <Shield size={16} />
                Изменить роль
              </button>
              <button
                onClick={() => {
                  onToggleStatus(user)
                  setMenuOpen(false)
                }}
                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
              >
                <Toggle2 size={16} />
                {user.status === 'active'
                  ? 'Деактивировать'
                  : 'Активировать'}
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 flex items-center gap-2 border-t border-slate-200">
                <span>🗑️</span>
                Удалить
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  )
}

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRole, setSelectedRole] = useState('all')
  const [filteredUsers, setFilteredUsers] = useState(users)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    filterUsers(query, selectedRole)
  }

  const handleRoleFilter = (role: string) => {
    setSelectedRole(role)
    filterUsers(searchQuery, role)
  }

  const filterUsers = (search: string, role: string) => {
    let result = users

    if (search) {
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (role !== 'all') {
      result = result.filter((u) => u.role === role)
    }

    setFilteredUsers(result)
  }

  const handleEditRole = (user: User) => {
    console.log('Edit role for:', user)
  }

  const handleToggleStatus = (user: User) => {
    console.log('Toggle status for:', user)
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2 flex items-center gap-3">
            <Users size={36} className="text-purple-600" />
            Управление пользователями
          </h1>
          <p className="text-lg text-slate-600">
            Просмотр, редактирование и управление учетными записями пользователей
          </p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors">
          <Plus size={18} />
          Приригласить пользователя
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-4 flex-col sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Поиск по имени или email..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <select
          value={selectedRole}
          onChange={(e) => handleRoleFilter(e.target.value)}
          className="px-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="all">Все роли</option>
          <option value="admin">Администратор</option>
          <option value="manager">Менеджер</option>
          <option value="user">Пользователь</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                  Пользователь
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                  Роль
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                  Отдел
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                  Статус
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                  Дата присоединения
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  onEditRole={handleEditRole}
                  onToggleStatus={handleToggleStatus}
                />
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="p-8 text-center">
            <Users size={48} className="mx-auto text-slate-300 mb-3" />
            <p className="text-slate-600">Пользователи не найдены</p>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white border border-slate-200 rounded-lg">
          <p className="text-sm text-slate-600 mb-1">Всего пользователей</p>
          <p className="text-3xl font-bold text-purple-600">{users.length}</p>
        </div>
        <div className="p-4 bg-white border border-slate-200 rounded-lg">
          <p className="text-sm text-slate-600 mb-1">Активных</p>
          <p className="text-3xl font-bold text-green-600">
            {users.filter((u) => u.status === 'active').length}
          </p>
        </div>
        <div className="p-4 bg-white border border-slate-200 rounded-lg">
          <p className="text-sm text-slate-600 mb-1">Администраторов</p>
          <p className="text-3xl font-bold text-red-600">
            {users.filter((u) => u.role === 'admin').length}
          </p>
        </div>
      </div>
    </div>
  )
}
