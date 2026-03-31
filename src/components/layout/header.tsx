'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Search,
  Bell,
  ChevronRight,
  Home,
} from 'lucide-react'
import clsx from 'clsx'

const BREADCRUMB_MAP: Record<string, string> = {
  '/': 'Главная',
  '/company': 'Компания',
  '/company/mission': 'Миссия',
  '/company/positions': 'Должности',
  '/company/onboarding': 'Онбординг',
  '/products': 'Продукты',
  '/products/paid': 'Платные продукты',
  '/products/free': 'Бесплатные продукты',
  '/departments': 'Отделы',
  '/departments/marketing': 'Маркетинг',
  '/departments/sales': 'Продажи',
  '/departments/product': 'Продукт',
  '/docs': 'Документы',
  '/news': 'Новости',
  '/admin': 'Администрирование',
  '/admin/users': 'Управление пользователями',
}

function generateBreadcrumbs(pathname: string) {
  const segments = pathname.split('/').filter(Boolean)
  const breadcrumbs: { label: string; href: string }[] = [
    { label: 'Главная', href: '/' },
  ]

  let currentPath = ''
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`
    const label = BREADCRUMB_MAP[currentPath] || segment
    breadcrumbs.push({ label, href: currentPath })
  })

  return breadcrumbs
}

export default function Header() {
  const pathname = usePathname()
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const breadcrumbs = generateBreadcrumbs(pathname)
  const unreadCount = 3 // Mock data

  return (
    <header className="sticky top-0 bg-white border-b border-slate-200 z-20">
      <div className="flex items-center justify-between h-16 px-6 gap-4">
        {/* Breadcrumbs */}
        <nav className="hidden sm:flex items-center gap-2 flex-1 min-w-0">
          {breadcrumbs.map((breadcrumb, index) => (
            <div key={breadcrumb.href} className="flex items-center gap-2 min-w-0">
              {index === 0 && (
                <Link
                  href={breadcrumb.href}
                  className="text-slate-600 hover:text-slate-900 transition-colors flex-shrink-0"
                  title={breadcrumb.label}
                >
                  <Home size={18} />
                </Link>
              )}
              {index > 0 && (
                <>
                  <ChevronRight size={16} className="text-slate-400 flex-shrink-0" />
                  <Link
                    href={breadcrumb.href}
                    className="text-sm text-slate-600 hover:text-slate-900 transition-colors truncate"
                    title={breadcrumb.label}
                  >
                    {breadcrumb.label}
                  </Link>
                </>
              )}
            </div>
          ))}
        </nav>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-sm">
          <div className="relative w-full">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Поиск по базе знаний..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotificationOpen(!notificationOpen)}
              className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-purple-600 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {notificationOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-xl border border-slate-200 z-50">
                <div className="p-4 border-b border-slate-200">
                  <h3 className="font-semibold text-slate-900">Уведомления</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <div className="p-4 space-y-3">
                    <div className="p-3 bg-blue-50 rounded border border-blue-200">
                      <p className="text-sm font-medium text-slate-900">Новый документ опубликован</p>
                      <p className="text-xs text-slate-600 mt-1">2 минуты назад</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded border border-blue-200">
                      <p className="text-sm font-medium text-slate-900">Вам назначена задача</p>
                      <p className="text-xs text-slate-600 mt-1">1 час назад</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded border border-blue-200">
                      <p className="text-sm font-medium text-slate-900">Изменены условия отпуска</p>
                      <p className="text-xs text-slate-600 mt-1">3 часа назад</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 border-t border-slate-200">
                  <button className="w-full text-center text-sm text-purple-600 hover:text-purple-700 font-medium py-2">
                    Все уведомления
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Avatar */}
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=user"
            alt="User"
            className="w-9 h-9 rounded-full bg-slate-200"
          />
        </div>
      </div>
    </header>
  )
}
