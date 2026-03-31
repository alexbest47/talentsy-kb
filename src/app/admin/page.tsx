'use client'

import Link from 'next/link'
import {
  Users,
  Settings,
  BarChart3,
  Shield,
  Database,
  ArrowRight,
  Tag,
  Target,
} from 'lucide-react'

interface AdminCard {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  href: string
  stats?: string
}

const adminCards: AdminCard[] = [
  {
    id: 'tags',
    title: 'Управление тегами',
    description: 'Создание и удаление тегов для программ и документов',
    icon: <Tag size={32} />,
    href: '/admin/tags',
    stats: 'Теги для категоризации контента',
  },
  {
    id: 'goals',
    title: 'Управление целями',
    description: 'Установка квартальных целей для отделов и ролей',
    icon: <Target size={32} />,
    href: '/admin/goals',
    stats: 'Квартальные OKR и KPI',
  },
  {
    id: 'users',
    title: 'Управление пользователями',
    description: 'Добавление, удаление и управление доступом пользователей',
    icon: <Users size={32} />,
    href: '/admin/users',
    stats: '156 активных пользователей',
  },
  {
    id: 'settings',
    title: 'Параметры системы',
    description: 'Настройка общих параметров и конфигурации платформы',
    icon: <Settings size={32} />,
    href: '#',
    stats: 'Версия 4.2.0',
  },
  {
    id: 'analytics',
    title: 'Аналитика и отчеты',
    description: 'Просмотр статистики использования и аналитику платформы',
    icon: <BarChart3 size={32} />,
    href: '#',
    stats: '12.5K операций в день',
  },
  {
    id: 'security',
    title: 'Безопасность и аудит',
    description: 'Управление безопасностью и просмотр логов действий',
    icon: <Shield size={32} />,
    href: '#',
    stats: '99.9% uptime',
  },
  {
    id: 'database',
    title: 'Управление данными',
    description: 'Резервное копирование, восстановление и очистка данных',
    icon: <Database size={32} />,
    href: '#',
    stats: '2.3 GB используется',
  },
  {
    id: 'logs',
    title: 'Логи и мониторинг',
    description: 'Просмотр системных логов и мониторинг производительности',
    icon: <Settings size={32} />,
    href: '#',
    stats: 'Последнее обновление: 2 мин назад',
  },
]

function AdminCard({ card }: { card: AdminCard }) {
  return (
    <Link href={card.href}>
      <div className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-lg hover:border-purple-200 transition-all cursor-pointer h-full flex flex-col">
        <div className="text-purple-600 mb-4">{card.icon}</div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">
          {card.title}
        </h3>
        <p className="text-slate-600 text-sm mb-4 flex-1">
          {card.description}
        </p>
        {card.stats && (
          <p className="text-xs text-slate-500 mb-4 pt-4 border-t border-slate-200">
            {card.stats}
          </p>
        )}
        <div className="flex items-center gap-2 text-purple-600 font-medium text-sm mt-auto">
          Перейти
          <ArrowRight size={16} />
        </div>
      </div>
    </Link>
  )
}

export default function AdminPage() {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">
          Администрирование
        </h1>
        <p className="text-lg text-slate-600">
          Управление платформой и системными параметрами
        </p>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <p className="text-sm text-slate-600 mb-2">Статус системы</p>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-600 rounded-full"></div>
            <p className="text-lg font-bold text-slate-900">Все системы работают</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <p className="text-sm text-slate-600 mb-2">Активные пользователи</p>
          <p className="text-3xl font-bold text-slate-900">156</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <p className="text-sm text-slate-600 mb-2">Среднее время отклика</p>
          <p className="text-3xl font-bold text-slate-900">124 мс</p>
        </div>
      </div>

      {/* Admin Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminCards.map((card) => (
          <AdminCard key={card.id} card={card} />
        ))}
      </div>

      {/* Recent Activity */}
      <div className="mt-12 bg-white border border-slate-200 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          Последние действия администратора
        </h2>
        <div className="space-y-4">
          {[
            { action: 'Добавлен новый пользователь', user: 'Иван Иванов', time: '5 мин назад' },
            { action: 'Изменены параметры безопасности', user: 'Наталья Федорова', time: '1 час назад' },
            { action: 'Создана резервная копия', user: 'System', time: '2 часа назад' },
            { action: 'Обновлены разрешения роли', user: 'Виктор Петров', time: '3 часа назад' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-3 border-b border-slate-200 last:border-0"
            >
              <div>
                <p className="text-sm font-medium text-slate-900">{item.action}</p>
                <p className="text-xs text-slate-500">{item.user}</p>
              </div>
              <span className="text-xs text-slate-500">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
