'use client'

import Link from 'next/link'
import { Package, Zap } from 'lucide-react'

interface StatCard {
  id: string
  title: string
  value: number
  icon: React.ReactNode
  href: string
  color: string
}

const stats: StatCard[] = [
  {
    id: 'paid',
    title: 'Платные продукты',
    value: 8,
    icon: <Package size={32} />,
    href: '/products/paid',
    color: 'purple',
  },
  {
    id: 'free',
    title: 'Бесплатные продукты',
    value: 5,
    icon: <Zap size={32} />,
    href: '/products/free',
    color: 'blue',
  },
]

function StatCard({ stat }: { stat: StatCard }) {
  const colorClasses = {
    purple: 'bg-purple-50 border-purple-200 hover:shadow-purple-100/50',
    blue: 'bg-blue-50 border-blue-200 hover:shadow-blue-100/50',
  }

  const textColorClasses = {
    purple: 'text-purple-600',
    blue: 'text-blue-600',
  }

  return (
    <Link href={stat.href}>
      <div
        className={`bg-white border ${colorClasses[stat.color as keyof typeof colorClasses]} rounded-lg p-8 hover:shadow-xl transition-all duration-300 cursor-pointer`}
      >
        <div className={`${textColorClasses[stat.color as keyof typeof textColorClasses]} mb-4`}>
          {stat.icon}
        </div>
        <p className="text-slate-600 text-sm font-medium mb-2">{stat.title}</p>
        <p className="text-4xl font-bold text-slate-900">{stat.value}</p>
      </div>
    </Link>
  )
}

export default function ProductsPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Продукты Talentsy</h1>
        <p className="text-lg text-slate-600">
          Обзор всех продуктов и услуг, которые мы предоставляем
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {stats.map((stat) => (
          <StatCard key={stat.id} stat={stat} />
        ))}
      </div>

      {/* Product Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-slate-200 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">О наших продуктах</h2>
          <p className="text-slate-700 mb-4">
            Talentsy предоставляет полный спектр решений для управления талантами и развития
            персонала. Наши продукты разработаны для удовлетворения потребностей компаний любого размера.
          </p>
          <p className="text-slate-700">
            От небольших стартапов до крупных корпораций, мы помогаем организациям находить,
            развивать и удерживать лучшие таланты.
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-8">
          <h3 className="text-xl font-bold text-slate-900 mb-4">Статистика</h3>
          <ul className="space-y-3">
            <li className="flex items-center gap-3 text-slate-700">
              <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
              Более 50,000 активных пользователей
            </li>
            <li className="flex items-center gap-3 text-slate-700">
              <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
              Обслуживаем 500+ компаний
            </li>
            <li className="flex items-center gap-3 text-slate-700">
              <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
              99.9% uptime гарантия
            </li>
            <li className="flex items-center gap-3 text-slate-700">
              <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
              24/7 поддержка на русском языке
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
