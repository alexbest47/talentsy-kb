'use client'

import Link from 'next/link'
import {
  Target,
  Briefcase,
  ArrowRight,
  UserX,
  Network,
  Heart,
  TrendingUp,
} from 'lucide-react'

interface SectionCard {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  href: string
  color: string
}

const sections: SectionCard[] = [
  {
    id: 'structure',
    title: 'Оргструктура',
    description: 'Интерактивная организационная структура со всеми подразделениями и сотрудниками',
    icon: <Network size={32} />,
    href: '/company/structure',
    color: 'purple',
  },
  {
    id: 'vacancies',
    title: 'Открытые вакансии',
    description: '6 позиций ждут своих кандидатов — от COO до тимлидов',
    icon: <UserX size={32} />,
    href: '/company/vacancies',
    color: 'orange',
  },
  {
    id: 'mission',
    title: 'Миссия',
    description: 'Видение, миссия и чем занимается Talentsy',
    icon: <Target size={32} />,
    href: '/company/mission',
    color: 'blue',
  },
  {
    id: 'values',
    title: 'Принципы работы',
    description: 'Как мы работаем вместе — 4 принципа культуры Talentsy',
    icon: <Heart size={32} />,
    href: '/company/values',
    color: 'green',
  },
  {
    id: 'goals',
    title: 'Стратегические цели',
    description: 'Ключевые приоритеты и направления развития компании',
    icon: <TrendingUp size={32} />,
    href: '/company/goals',
    color: 'blue',
  },
  {
    id: 'positions',
    title: 'Должности и требования',
    description: 'Описание должностей, требования и ответственности',
    icon: <Briefcase size={32} />,
    href: '/company/positions',
    color: 'green',
  },
]

function SectionCard({ section }: { section: SectionCard }) {
  const colorClasses = {
    purple: 'hover:border-purple-300 group/card hover:bg-purple-50',
    blue: 'hover:border-blue-300 group/card hover:bg-blue-50',
    green: 'hover:border-green-300 group/card hover:bg-green-50',
    orange: 'hover:border-orange-300 group/card hover:bg-orange-50',
  }

  const iconColorClasses = {
    purple: 'text-purple-600 group-hover/card:scale-110',
    blue: 'text-blue-600 group-hover/card:scale-110',
    green: 'text-green-600 group-hover/card:scale-110',
    orange: 'text-orange-600 group-hover/card:scale-110',
  }

  const buttonColorClasses = {
    purple: 'bg-purple-600 hover:bg-purple-700',
    blue: 'bg-blue-600 hover:bg-blue-700',
    green: 'bg-green-600 hover:bg-green-700',
    orange: 'bg-orange-600 hover:bg-orange-700',
  }

  return (
    <Link href={section.href}>
      <div
        className={`relative p-6 bg-white border border-slate-200 rounded-lg transition-all duration-300 cursor-pointer h-full flex flex-col ${colorClasses[section.color as keyof typeof colorClasses]}`}
      >
        <div
          className={`mb-4 transition-all duration-300 ${iconColorClasses[section.color as keyof typeof iconColorClasses]}`}
        >
          {section.icon}
        </div>

        <h3 className="text-xl font-bold text-slate-900 mb-2">
          {section.title}
        </h3>

        <p className="text-slate-600 text-sm mb-4 flex-1">
          {section.description}
        </p>

        <button
          className={`mt-auto px-4 py-2 text-white rounded-lg font-medium text-sm transition-colors flex items-center gap-2 w-fit ${buttonColorClasses[section.color as keyof typeof buttonColorClasses]}`}
        >
          Перейти
          <ArrowRight size={16} />
        </button>
      </div>
    </Link>
  )
}

export default function CompanyPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">
          Информация о компании
        </h1>
        <p className="text-lg text-slate-600">
          Узнайте больше о структуре Talentsy, нашей миссии и процессах
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section) => (
          <SectionCard key={section.id} section={section} />
        ))}
      </div>

      {/* Additional Info Section */}
      <div className="mt-12 p-6 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
        <h2 className="text-2xl font-bold text-slate-900 mb-3">
          Добро пожаловать в Talentsy!
        </h2>
        <p className="text-slate-700 leading-relaxed">
          Talentsy - это инновационная платформа для управления талантами и развития
          персонала. Мы создали эту базу знаний, чтобы помочь всем сотрудникам быстро
          адаптироваться и найти всю необходимую информацию о компании, её продуктах
          и процессах. Если у вас есть вопросы, не стесняйтесь обращаться к вашему
          руководителю или отделу HR.
        </p>
      </div>
    </div>
  )
}
