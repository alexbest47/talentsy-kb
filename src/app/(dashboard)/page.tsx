'use client'

import Link from 'next/link'
import {
  FileText,
  Newspaper,
  Package,
  Users,
  BookOpen,
  Play,
  Download,
  Star,
  ArrowRight,
} from 'lucide-react'
import clsx from 'clsx'

interface StatCard {
  label: string
  value: number
  icon: React.ReactNode
  href: string
  color: string
}

interface Document {
  id: string
  title: string
  section: string
  author: string
  date: string
  excerpt: string
}

interface NewsItem {
  id: string
  title: string
  preview: string
  author: string
  date: string
  image?: string
}

interface OnboardingModule {
  id: string
  title: string
  duration: number
  completed: boolean
  progress: number
}

const statCards: StatCard[] = [
  {
    label: 'Документов',
    value: 142,
    icon: <FileText size={24} />,
    href: '/docs',
    color: 'purple',
  },
  {
    label: 'Новостей',
    value: 28,
    icon: <Newspaper size={24} />,
    href: '/news',
    color: 'blue',
  },
  {
    label: 'Продуктов',
    value: 12,
    icon: <Package size={24} />,
    href: '/products',
    color: 'green',
  },
  {
    label: 'Сотрудников',
    value: 45,
    icon: <Users size={24} />,
    href: '/departments',
    color: 'orange',
  },
]

const recentDocuments: Document[] = [
  {
    id: '1',
    title: 'Процесс адаптации новых сотрудников',
    section: 'Общее',
    author: 'Иван Петров',
    date: '2024-03-28',
    excerpt: 'Подробное описание всех этапов онбординга для новых сотрудников компании...',
  },
  {
    id: '2',
    title: 'Описание платных тарифов продукта',
    section: 'Продукты',
    author: 'Мария Сидорова',
    date: '2024-03-27',
    excerpt: 'Информация о всех доступных платных тарифах с описанием функций и цен...',
  },
  {
    id: '3',
    title: 'Стратегия маркетинга на 2024 год',
    section: 'Отделы',
    author: 'Алексей Попов',
    date: '2024-03-26',
    excerpt: 'Комплексный план маркетинговых инициатив на текущий год...',
  },
  {
    id: '4',
    title: 'Правила корпоративной культуры',
    section: 'Общее',
    author: 'Александр Иванов',
    date: '2024-03-25',
    excerpt: 'Основные принципы и ценности компании, их применение в работе...',
  },
]

const newsItems: NewsItem[] = [
  {
    id: '1',
    title: 'Обновление платформы: новые возможности аналитики',
    preview: 'Мы рады представить новую версию платформы с улучшенной аналитикой...',
    author: 'Команда Продукта',
    date: '2024-03-29',
  },
  {
    id: '2',
    title: 'Поздравляем с юбилеем компании!',
    preview: 'Сегодня мы отмечаем 5 лет работы и благодарим всех сотрудников...',
    author: 'Генеральный директор',
    date: '2024-03-28',
  },
  {
    id: '3',
    title: 'Результаты опроса сотрудников опубликованы',
    preview: 'Спасибо всем, кто участвовал в опросе удовлетворенности. Результаты...',
    author: 'HR Отдел',
    date: '2024-03-27',
  },
]

const onboardingModules: OnboardingModule[] = [
  {
    id: '1',
    title: 'Введение в компанию',
    duration: 30,
    completed: true,
    progress: 100,
  },
  {
    id: '2',
    title: 'Обзор продуктов',
    duration: 45,
    completed: true,
    progress: 100,
  },
  {
    id: '3',
    title: 'Технические инструменты',
    duration: 60,
    completed: false,
    progress: 65,
  },
  {
    id: '4',
    title: 'Процессы и процедуры',
    duration: 50,
    completed: false,
    progress: 0,
  },
]

function StatCard({ card }: { card: StatCard }) {
  const colorClasses = {
    purple: 'bg-purple-50 border-purple-200 text-purple-900',
    blue: 'bg-blue-50 border-blue-200 text-blue-900',
    green: 'bg-green-50 border-green-200 text-green-900',
    orange: 'bg-orange-50 border-orange-200 text-orange-900',
  }

  const iconColorClasses = {
    purple: 'text-purple-600',
    blue: 'text-blue-600',
    green: 'text-green-600',
    orange: 'text-orange-600',
  }

  return (
    <Link
      href={card.href}
      className={clsx(
        'flex flex-col justify-between p-6 rounded-lg border transition-all hover:shadow-lg hover:scale-105',
        colorClasses[card.color as keyof typeof colorClasses]
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-sm font-medium opacity-75">{card.label}</h3>
        <div className={iconColorClasses[card.color as keyof typeof iconColorClasses]}>
          {card.icon}
        </div>
      </div>
      <div className="text-3xl font-bold">{card.value}</div>
    </Link>
  )
}

function DocumentCard({ doc }: { doc: Document }) {
  return (
    <div className="p-4 bg-white border border-slate-200 rounded-lg hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-slate-900 line-clamp-2">{doc.title}</h3>
        <BookOpen size={18} className="text-slate-400 flex-shrink-0 ml-2" />
      </div>
      <p className="text-sm text-slate-600 mb-3 line-clamp-2">{doc.excerpt}</p>
      <div className="flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-3">
          <span className="px-2 py-1 bg-slate-100 rounded text-slate-700">
            {doc.section}
          </span>
          <span>{doc.author}</span>
        </div>
        <span>{doc.date}</span>
      </div>
    </div>
  )
}

function NewsCard({ item }: { item: NewsItem }) {
  return (
    <div className="p-4 bg-white border border-slate-200 rounded-lg hover:shadow-md transition-shadow">
      <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2">
        {item.title}
      </h3>
      <p className="text-sm text-slate-600 mb-4 line-clamp-3">
        {item.preview}
      </p>
      <div className="flex items-center justify-between text-xs text-slate-500">
        <div>
          <p className="font-medium text-slate-700">{item.author}</p>
          <p>{item.date}</p>
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const totalOnboarding = onboardingModules.length
  const completedOnboarding = onboardingModules.filter((m) => m.completed).length
  const overallProgress = Math.round(
    (onboardingModules.reduce((acc, m) => acc + m.progress, 0) /
      (totalOnboarding * 100)) *
      100
  )

  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome Message */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">
          Добро пожаловать в базу знаний Talentsy
        </h1>
        <p className="text-lg text-slate-600">
          Найдите всю необходимую информацию о компании, продуктах и процессах
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <StatCard key={card.label} card={card} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Documents & News */}
        <div className="lg:col-span-2 space-y-8">
          {/* Recent Documents */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-slate-900">
                Последние документы
              </h2>
              <Link
                href="/docs"
                className="text-purple-600 hover:text-purple-700 font-medium text-sm flex items-center gap-1"
              >
                Все документы
                <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid gap-4">
              {recentDocuments.map((doc) => (
                <DocumentCard key={doc.id} doc={doc} />
              ))}
            </div>
          </section>

          {/* Latest News */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-slate-900">
                Последние новости
              </h2>
              <Link
                href="/news"
                className="text-purple-600 hover:text-purple-700 font-medium text-sm flex items-center gap-1"
              >
                Все новости
                <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid gap-4">
              {newsItems.map((item) => (
                <NewsCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        </div>

        {/* Right Column - Onboarding */}
        <div>
          <section className="bg-white rounded-lg border border-slate-200 p-6 sticky top-24">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen size={20} className="text-purple-600" />
              <h2 className="text-xl font-bold text-slate-900">
                Адаптация нового сотрудника
              </h2>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-slate-700">
                  Общий прогресс
                </p>
                <p className="text-sm font-bold text-purple-600">
                  {overallProgress}%
                </p>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-purple-600 h-full transition-all duration-300"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
              <p className="text-xs text-slate-500 mt-2">
                {completedOnboarding} из {totalOnboarding} модулей завершено
              </p>
            </div>

            {/* Modules List */}
            <div className="space-y-3">
              {onboardingModules.map((module) => (
                <div key={module.id} className="p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-slate-900">
                        {module.title}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {module.duration} минут
                      </p>
                    </div>
                    {module.completed && (
                      <Star
                        size={16}
                        className="text-green-600 fill-green-600 flex-shrink-0"
                      />
                    )}
                  </div>
                  {!module.completed && (
                    <div className="flex items-center justify-between">
                      <div className="flex-1 bg-slate-200 rounded-full h-1 mr-2">
                        <div
                          className="bg-purple-600 h-full rounded-full transition-all duration-300"
                          style={{ width: `${module.progress}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-slate-600">
                        {module.progress}%
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <Link
              href="/company/onboarding"
              className="w-full mt-6 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
            >
              <Play size={16} />
              Продолжить обучение
            </Link>
          </section>
        </div>
      </div>
    </div>
  )
}
