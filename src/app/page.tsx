'use client'

import DashboardLayout from '@/components/layout/dashboard-layout'
import Link from 'next/link'
import { TrendingUp, Users, FileText, Newspaper, ArrowRight } from 'lucide-react'

interface StatCard {
  label: string
  value: string
  change: string
  icon: React.ReactNode
}

interface RecentItem {
  id: string
  title: string
  type: 'document' | 'news'
  author: string
  date: string
}

const stats: StatCard[] = [
  {
    label: 'Активные пользователи',
    value: '156',
    change: '+12% за месяц',
    icon: <Users size={24} />,
  },
  {
    label: 'Документы',
    value: '42',
    change: '+5 новых',
    icon: <FileText size={24} />,
  },
  {
    label: 'Статьи в блоге',
    value: '28',
    change: '+2 новых',
    icon: <Newspaper size={24} />,
  },
  {
    label: 'Рост платформы',
    value: '87%',
    change: '+15% от прошлого месяца',
    icon: <TrendingUp size={24} />,
  },
]

const recentItems: RecentItem[] = [
  {
    id: '1',
    title: 'Руководство по использованию платформы',
    type: 'document',
    author: 'Наталья Федорова',
    date: '2024-03-20',
  },
  {
    id: '2',
    title: 'Запуск нового модуля аналитики',
    type: 'news',
    author: 'Наталья Федорова',
    date: '2024-03-25',
  },
  {
    id: '3',
    title: 'API документация',
    type: 'document',
    author: 'Дмитрий Орлов',
    date: '2024-03-18',
  },
  {
    id: '4',
    title: 'Talentsy выигрывает награду "Лучший SaaS в 2024"',
    type: 'news',
    author: 'Виктор Петров',
    date: '2024-03-20',
  },
]

export default function Home() {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Добро пожаловать в Talentsy KB!
          </h1>
          <p className="text-lg text-slate-600">
            Центральная база знаний для управления талантами и развития персонала
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded-lg p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-purple-600">{stat.icon}</div>
                <span className="text-xs font-medium text-green-600">
                  {stat.change}
                </span>
              </div>
              <p className="text-slate-600 text-sm mb-2">{stat.label}</p>
              <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                Быстрые действия
              </h2>
              <div className="space-y-3">
                <Link href="/company">
                  <button className="w-full text-left px-4 py-3 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg font-medium transition-colors">
                    Информация о компании
                  </button>
                </Link>
                <Link href="/docs">
                  <button className="w-full text-left px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-medium transition-colors">
                    Просмотр документов
                  </button>
                </Link>
                <Link href="/news">
                  <button className="w-full text-left px-4 py-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg font-medium transition-colors">
                    Новости компании
                  </button>
                </Link>
                <Link href="/products">
                  <button className="w-full text-left px-4 py-3 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-lg font-medium transition-colors">
                    Наши продукты
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Content */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-900">
                  Недавно обновлено
                </h2>
                <Link href="/docs">
                  <button className="text-purple-600 hover:text-purple-700 font-medium text-sm flex items-center gap-1">
                    Все
                    <ArrowRight size={16} />
                  </button>
                </Link>
              </div>

              <div className="space-y-4">
                {recentItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-4 pb-4 border-b border-slate-200 last:border-0"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900 mb-1">
                        {item.title}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="px-2 py-1 bg-slate-100 rounded">
                          {item.type === 'document'
                            ? 'Документ'
                            : 'Новость'}
                        </span>
                        <span>{item.author}</span>
                        <span>{new Date(item.date).toLocaleDateString('ru-RU')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Featured Sections */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Узнайте о компании
            </h3>
            <p className="text-slate-600 text-sm mb-4">
              Ознакомьтесь со структурой, миссией и ценностями Talentsy
            </p>
            <Link href="/company">
              <button className="text-purple-600 hover:text-purple-700 font-medium text-sm">
                Подробнее →
              </button>
            </Link>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Исследуйте продукты
            </h3>
            <p className="text-slate-600 text-sm mb-4">
              Ознакомьтесь со всеми продуктами и услугами Talentsy
            </p>
            <Link href="/products">
              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                Подробнее →
              </button>
            </Link>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Свяжитесь с отделами
            </h3>
            <p className="text-slate-600 text-sm mb-4">
              Найдите информацию о различных отделах и их функциях
            </p>
            <Link href="/departments/marketing">
              <button className="text-green-600 hover:text-green-700 font-medium text-sm">
                Подробнее →
              </button>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
