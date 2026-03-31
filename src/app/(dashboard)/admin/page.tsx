'use client'

import Link from 'next/link'
import {
  Users,
  Building2,
  Lock,
  Settings,
  ArrowRight,
  BarChart3,
  Shield,
} from 'lucide-react'

interface AdminCard {
  icon: React.ReactNode
  title: string
  description: string
  href: string
  color: string
  stats?: string
}

const adminSections: AdminCard[] = [
  {
    icon: <Users size={32} />,
    title: 'Управление пользователями',
    description: 'Добавляйте, удаляйте и управляйте доступом пользователей',
    href: '/admin/users',
    color: 'purple',
    stats: '45 активных пользователей',
  },
  {
    icon: <Building2 size={32} />,
    title: 'Отделы',
    description: 'Управляйте структурой отделов и назначениями',
    href: '/admin/departments',
    color: 'blue',
    stats: '5 отделов',
  },
  {
    icon: <Lock size={32} />,
    title: 'Права доступа',
    description: 'Установите права доступа и разрешения',
    href: '/admin/permissions',
    color: 'red',
    stats: '12 ролей',
  },
  {
    icon: <Settings size={32} />,
    title: 'Системные настройки',
    description: 'Общие параметры и конфигурация системы',
    href: '/admin/settings',
    color: 'orange',
  },
  {
    icon: <BarChart3 size={32} />,
    title: 'Аналитика и отчёты',
    description: 'Просматривайте статистику и отчёты по использованию',
    href: '/admin/analytics',
    color: 'green',
  },
  {
    icon: <Shield size={32} />,
    title: 'Безопасность',
    description: 'Управляйте безопасностью и аудитом',
    href: '/admin/security',
    color: 'indigo',
  },
]

function AdminCard({ section }: { section: AdminCard }) {
  const colorClasses = {
    purple: 'from-purple-50 to-purple-100 border-purple-200 hover:border-purple-300',
    blue: 'from-blue-50 to-blue-100 border-blue-200 hover:border-blue-300',
    red: 'from-red-50 to-red-100 border-red-200 hover:border-red-300',
    orange: 'from-orange-50 to-orange-100 border-orange-200 hover:border-orange-300',
    green: 'from-green-50 to-green-100 border-green-200 hover:border-green-300',
    indigo: 'from-indigo-50 to-indigo-100 border-indigo-200 hover:border-indigo-300',
  }

  const iconColorClasses = {
    purple: 'text-purple-600',
    blue: 'text-blue-600',
    red: 'text-red-600',
    orange: 'text-orange-600',
    green: 'text-green-600',
    indigo: 'text-indigo-600',
  }

  return (
    <Link href={section.href}>
      <div
        className={`relative p-6 bg-gradient-to-br ${colorClasses[section.color as keyof typeof colorClasses]} border-2 rounded-lg transition-all hover:shadow-lg hover:scale-105 cursor-pointer h-full flex flex-col`}
      >
        <div
          className={`mb-4 ${iconColorClasses[section.color as keyof typeof iconColorClasses]}`}
        >
          {section.icon}
        </div>

        <h3 className="text-xl font-bold text-slate-900 mb-2">
          {section.title}
        </h3>

        <p className="text-slate-700 text-sm flex-1 mb-4">
          {section.description}
        </p>

        {section.stats && (
          <p className="text-sm font-semibold text-slate-600 mb-4">
            {section.stats}
          </p>
        )}

        <button className="flex items-center gap-2 text-slate-900 font-medium hover:gap-3 transition-all">
          Открыть
          <ArrowRight size={16} />
        </button>
      </div>
    </Link>
  )
}

export default function AdminPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2 flex items-center gap-3">
          <Shield size={40} className="text-purple-600" />
          Администрирование
        </h1>
        <p className="text-lg text-slate-600">
          Управление пользователями, правами доступа и системными параметрами
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-4 bg-white border border-slate-200 rounded-lg">
          <p className="text-sm text-slate-600 mb-1">Активных пользователей</p>
          <p className="text-3xl font-bold text-purple-600">45</p>
        </div>
        <div className="p-4 bg-white border border-slate-200 rounded-lg">
          <p className="text-sm text-slate-600 mb-1">Отделов</p>
          <p className="text-3xl font-bold text-blue-600">5</p>
        </div>
        <div className="p-4 bg-white border border-slate-200 rounded-lg">
          <p className="text-sm text-slate-600 mb-1">Ролей</p>
          <p className="text-3xl font-bold text-indigo-600">12</p>
        </div>
        <div className="p-4 bg-white border border-slate-200 rounded-lg">
          <p className="text-sm text-slate-600 mb-1">Онлайн</p>
          <p className="text-3xl font-bold text-green-600">23</p>
        </div>
      </div>

      {/* Admin Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {adminSections.map((section) => (
          <AdminCard key={section.href} section={section} />
        ))}
      </div>

      {/* Recent Activity */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">
          Последние действия
        </h2>
        <div className="space-y-3">
          <div className="p-4 bg-white border border-slate-200 rounded-lg flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-900">
                Новый пользователь добавлен
              </p>
              <p className="text-sm text-slate-600">
                Михаил Смирнов добавлен в отдел Продукта
              </p>
            </div>
            <span className="text-xs text-slate-500">2 часа назад</span>
          </div>
          <div className="p-4 bg-white border border-slate-200 rounded-lg flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-900">Изменены права доступа</p>
              <p className="text-sm text-slate-600">
                Иван Петров переведен в роль Team Lead
              </p>
            </div>
            <span className="text-xs text-slate-500">5 часов назад</span>
          </div>
          <div className="p-4 bg-white border border-slate-200 rounded-lg flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-900">
                Пользователь деактивирован
              </p>
              <p className="text-sm text-slate-600">
                Сергей Кузнецов деактивирован в системе
              </p>
            </div>
            <span className="text-xs text-slate-500">1 день назад</span>
          </div>
        </div>
      </section>

      {/* System Health */}
      <section className="p-6 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">
          Состояние системы
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-slate-600 mb-2">Доступность</p>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="font-semibold text-slate-900">99.99%</span>
            </div>
          </div>
          <div>
            <p className="text-sm text-slate-600 mb-2">Задержка</p>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="font-semibold text-slate-900">42ms</span>
            </div>
          </div>
          <div>
            <p className="text-sm text-slate-600 mb-2">Использование БД</p>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="font-semibold text-slate-900">65%</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
