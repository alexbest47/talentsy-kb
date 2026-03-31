'use client'

import { Zap, Check } from 'lucide-react'

interface FreeProduct {
  id: string
  name: string
  rating: number
  category: string
  description: string
  features: string[]
}

const freeProducts: FreeProduct[] = [
  {
    id: 'free1',
    name: 'CV Parser',
    rating: 4.5,
    category: 'Recruitment',
    description: 'Автоматический парсинг резюме и извлечение данных',
    features: [
      'Парсинг резюме',
      'Извлечение ключевых данных',
      'Поддержка множества форматов',
      'Базовая валидация',
    ],
  },
  {
    id: 'free2',
    name: 'Salary Calculator',
    rating: 4.3,
    category: 'HR Tools',
    description: 'Калькулятор заработной платы и бенчмарк',
    features: [
      'Расчет зарплаты',
      'Market insights',
      'Сравнение данных',
      'Экспорт отчетов',
    ],
  },
  {
    id: 'free3',
    name: 'Team Assessment',
    rating: 4.6,
    category: 'Assessment',
    description: 'Оценка компетенций команды и потребностей в развитии',
    features: [
      'Skill assessment',
      'Competency mapping',
      'Development plans',
      'Team reports',
    ],
  },
  {
    id: 'free4',
    name: 'Interview Guide',
    rating: 4.4,
    category: 'Resources',
    description: 'Шаблоны и рекомендации для проведения интервью',
    features: [
      'Interview templates',
      'Best practices',
      'Question library',
      'Scoring guides',
    ],
  },
  {
    id: 'free5',
    name: 'HR Compliance Checker',
    rating: 4.7,
    category: 'Compliance',
    description: 'Проверка соответствия HR процессов законодательству',
    features: [
      'Compliance checks',
      'Policy templates',
      'Legal updates',
      'Risk assessment',
    ],
  },
]

function FreeProductCard({ product }: { product: FreeProduct }) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">{product.name}</h3>
            <p className="text-sm text-slate-600 mt-1">{product.category}</p>
          </div>
          <div className="flex items-center gap-1 ml-4">
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1">
              <Zap size={12} />
              Бесплатно
            </span>
          </div>
        </div>

        <p className="text-slate-600 text-sm mb-6">{product.description}</p>

        <div className="mb-6">
          <p className="text-2xl font-bold text-slate-900">Бесплатно</p>
          <p className="text-xs text-slate-500">без ограничений</p>
        </div>

        <ul className="space-y-2 mb-6">
          {product.features.map((feature, idx) => (
            <li key={idx} className="flex items-center gap-2 text-sm text-slate-600">
              <Check size={16} className="text-green-600 flex-shrink-0" />
              {feature}
            </li>
          ))}
        </ul>

        <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium text-sm transition-colors">
          Начать использовать
        </button>
      </div>
    </div>
  )
}

export default function FreeProductsPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Бесплатные продукты</h1>
        <p className="text-lg text-slate-600">
          Полезные инструменты, доступные без ограничений
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {freeProducts.map((product) => (
          <FreeProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
        <h2 className="text-xl font-bold text-slate-900 mb-2">
          Хотите большего функционала?
        </h2>
        <p className="text-slate-700 mb-4">
          Наши бесплатные инструменты - это отличное начало. Если вам нужны более
          продвинутые функции, рассмотрите наши премиум решения с полной интеграцией.
        </p>
        <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
          Изучить премиум версию
        </button>
      </div>
    </div>
  )
}
