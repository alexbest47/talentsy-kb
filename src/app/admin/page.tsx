'use client'

import Link from 'next/link'
import {
  Users,
  ArrowRight,
  Tag,
  Target,
  GraduationCap,
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
    id: 'welcome-training',
    title: 'Welcome тренинг',
    description: 'Редактирование этапов, описаний, материалов и видео',
    icon: <GraduationCap size={32} />,
    href: '/admin/welcome-training',
    stats: 'Программа адаптации новых сотрудников',
  },
  {
    id: 'users',
    title: 'Управление пользователями',
    description: 'Добавление, удаление и управление доступом пользователей',
    icon: <Users size={32} />,
    href: '/admin/users',
    stats: 'Роли, доступы и приглашения',
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

      {/* Admin Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminCards.map((card) => (
          <AdminCard key={card.id} card={card} />
        ))}
      </div>
    </div>
  )
}
