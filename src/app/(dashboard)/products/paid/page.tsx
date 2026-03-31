'use client'

import { Star, Check, ArrowRight } from 'lucide-react'

interface PaidProduct {
  id: string
  name: string
  tagline: string
  description: string
  price: string
  rating: number
  reviews: number
  features: string[]
  highlighted: boolean
}

const products: PaidProduct[] = [
  {
    id: '1',
    name: 'Talent Acquisition Pro',
    tagline: 'Продвинутый рекрутмент',
    description: 'Полнофункциональная платформа для поиска, отбора и найма талантов',
    price: 'от $299/мес',
    rating: 4.8,
    reviews: 127,
    features: [
      'AI-powered поиск кандидатов',
      'Автоматизация процесса отбора',
      'Видео-интервью',
      'Интеграция с LinkedIn',
      'Аналитика воронки найма',
    ],
    highlighted: true,
  },
  {
    id: '2',
    name: 'Performance Management Suite',
    tagline: 'Управление производительностью',
    description: 'Инструменты для оценки, развития и управления производительностью сотрудников',
    price: 'от $199/мес',
    rating: 4.6,
    reviews: 89,
    features: [
      'OKR-управление',
      '360-градусная обратная связь',
      'Персональные планы развития',
      'Система целей и KPI',
      'Отчеты по производительности',
    ],
    highlighted: false,
  },
  {
    id: '3',
    name: 'Learning & Development Hub',
    tagline: 'Обучение и развитие',
    description: 'Платформа для создания и управления обучающими программами',
    price: 'от $249/мес',
    rating: 4.7,
    reviews: 105,
    features: [
      'LMS с курсами',
      'Микрообучение',
      'Интерактивные модули',
      'Отслеживание прогресса',
      'Сертификация',
    ],
    highlighted: false,
  },
  {
    id: '4',
    name: 'Compensation Analytics',
    tagline: 'Анализ компенсаций',
    description: 'Инструменты для оптимизации зарплатных структур и анализа рынка',
    price: 'от $349/мес',
    rating: 4.5,
    reviews: 67,
    features: [
      'Анализ рыночных ставок',
      'Справедливость заработной платы',
      'Планирование вознаграждений',
      'Бенчмарк данные',
      'Калькулятор зарплаты',
    ],
    highlighted: false,
  },
  {
    id: '5',
    name: 'Employee Experience Platform',
    tagline: 'Опыт сотрудников',
    description: 'Создайте привлекательное место для работы с помощью опросов и аналитики',
    price: 'от $229/мес',
    rating: 4.9,
    reviews: 143,
    features: [
      'Опросы удовлетворенности',
      'Анализ климата в компании',
      'Pulse-исследования',
      'Вовлеченность сотрудников',
      'Рекомендации по улучшению',
    ],
    highlighted: true,
  },
]

function ProductCard({ product }: { product: PaidProduct }) {
  return (
    <div
      className={`relative p-6 border-2 rounded-lg transition-all ${
        product.highlighted
          ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-white shadow-lg ring-2 ring-purple-100'
          : 'border-slate-200 bg-white hover:border-slate-300'
      }`}
    >
      {product.highlighted && (
        <div className="absolute -top-3 right-4 px-3 py-1 bg-purple-600 text-white text-xs font-bold rounded-full">
          Популярный
        </div>
      )}

      <div className="mb-4">
        <h3 className="text-xl font-bold text-slate-900 mb-1">
          {product.name}
        </h3>
        <p className="text-sm text-slate-600 mb-3">{product.tagline}</p>
        <p className="text-slate-700 text-sm mb-4">{product.description}</p>
      </div>

      {/* Price */}
      <div className="mb-4 p-3 bg-slate-50 rounded-lg">
        <p className="text-sm text-slate-600">Стартовая цена</p>
        <p className="text-2xl font-bold text-purple-600">{product.price}</p>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={16}
              className={
                i < Math.floor(product.rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-slate-300'
              }
            />
          ))}
        </div>
        <span className="text-sm text-slate-600">
          {product.rating} ({product.reviews} отзывов)
        </span>
      </div>

      {/* Features */}
      <div className="mb-6">
        <h4 className="font-semibold text-slate-900 text-sm mb-3">Основные возможности:</h4>
        <ul className="space-y-2">
          {product.features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2 text-sm text-slate-700">
              <Check size={16} className="text-green-600 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <button
        className={`w-full px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
          product.highlighted
            ? 'bg-purple-600 hover:bg-purple-700 text-white'
            : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
        }`}
      >
        Узнать больше
        <ArrowRight size={16} />
      </button>
    </div>
  )
}

export default function PaidProductsPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">
          Платные продукты
        </h1>
        <p className="text-lg text-slate-600">
          Комплексные решения для управления талантами и развития персонала
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* CTA Section */}
      <div className="p-8 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg text-center">
        <h2 className="text-3xl font-bold mb-3">Готовы начать?</h2>
        <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
          Выберите подходящий пакет и начните трансформировать управление талантами
          в вашей организации. Первый месяц со скидкой 20%.
        </p>
        <div className="flex gap-4 justify-center">
          <button className="px-8 py-3 bg-white hover:bg-slate-100 text-purple-600 rounded-lg font-semibold transition-colors">
            Запросить демо
          </button>
          <button className="px-8 py-3 border-2 border-white hover:bg-purple-800 text-white rounded-lg font-semibold transition-colors">
            Начать бесплатно
          </button>
        </div>
      </div>
    </div>
  )
}
