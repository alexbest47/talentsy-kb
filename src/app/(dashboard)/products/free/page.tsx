'use client'

import { Star, Check, Zap } from 'lucide-react'

interface FreeProduct {
  id: string
  name: string
  tagline: string
  description: string
  rating: number
  reviews: number
  features: string[]
  limitations: string[]
}

const products: FreeProduct[] = [
  {
    id: '1',
    name: 'Job Posting Tool',
    tagline: 'Размещение вакансий',
    description: 'Простой инструмент для создания и размещения объявлений о вакансиях',
    rating: 4.4,
    reviews: 56,
    features: [
      'До 10 активных вакансий',
      'Базовые фильтры кандидатов',
      'Email-уведомления',
      'Простая аналитика',
    ],
    limitations: [
      'Без AI-ассистента',
      'Без интеграций',
      'Базовая поддержка',
    ],
  },
  {
    id: '2',
    name: 'Employee Directory',
    tagline: 'Справочник сотрудников',
    description: 'Децентрализованный справочник всех сотрудников компании',
    rating: 4.6,
    reviews: 78,
    features: [
      'Профили сотрудников',
      'Организационная структура',
      'Контакты и биографии',
      'Поиск по компании',
    ],
    limitations: [
      'Нет интеграции с HR-системой',
      'До 500 профилей',
      'Ограниченные права доступа',
    ],
  },
  {
    id: '3',
    name: 'Survey Builder',
    tagline: 'Конструктор опросов',
    description: 'Создавайте и распространяйте опросы для сбора отзывов сотрудников',
    rating: 4.3,
    reviews: 42,
    features: [
      'До 5 активных опросов',
      'Предустановленные шаблоны',
      'Базовая аналитика',
      'Экспорт результатов',
    ],
    limitations: [
      'Ограничение 100 ответов в месяц',
      'Без встроенной визуализации',
      'Базовые отчеты',
    ],
  },
  {
    id: '4',
    name: 'Learning Tracker',
    tagline: 'Отслеживание обучения',
    description: 'Простой инструмент для отслеживания обучения и развития сотрудников',
    rating: 4.5,
    reviews: 63,
    features: [
      'Отслеживание прогресса обучения',
      'Сертификаты',
      'Расписание курсов',
      'Напоминания',
    ],
    limitations: [
      'До 20 курсов',
      'Без видео-контента',
      'Ручное управление',
    ],
  },
  {
    id: '5',
    name: 'Team Wiki',
    tagline: 'Wiki команды',
    description: 'Совместная база знаний для документирования процессов и процедур',
    rating: 4.7,
    reviews: 91,
    features: [
      'Неограниченные страницы',
      'Совместное редактирование',
      'История версий',
      'Полнотекстовый поиск',
    ],
    limitations: [
      'Без расширенных прав доступа',
      'Нет интеграции с другими сервисами',
      'Базовый дизайн',
    ],
  },
  {
    id: '6',
    name: 'Feedback System',
    tagline: 'Система обратной связи',
    description: 'Инструмент для сбора и организации обратной связи от коллег',
    rating: 4.2,
    reviews: 48,
    features: [
      'Анонимная обратная связь',
      'Система похвалы',
      'Очереди отзывов',
      'Уведомления',
    ],
    limitations: [
      'До 100 отзывов в месяц',
      'Без расширенной аналитики',
      'Простой интерфейс',
    ],
  },
  {
    id: '7',
    name: 'Time Off Manager',
    tagline: 'Управление отпусками',
    description: 'Управляйте отпусками, больничными и прочими днями отдыха',
    rating: 4.4,
    reviews: 72,
    features: [
      'Запросы на отпуск',
      'Утверждение отпусков',
      'Календарь отпусков',
      'Уведомления',
    ],
    limitations: [
      'До 100 сотрудников',
      'Без интеграции с календарями',
      'Базовые отчеты',
    ],
  },
]

function ProductCard({ product }: { product: FreeProduct }) {
  return (
    <div className="p-6 bg-white border border-slate-200 rounded-lg hover:shadow-md transition-all hover:border-slate-300">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-slate-900 mb-1">
          {product.name}
        </h3>
        <p className="text-sm text-slate-600 mb-2">{product.tagline}</p>
        <p className="text-slate-700 text-sm">{product.description}</p>
      </div>

      {/* Free Badge */}
      <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
        <Zap size={14} />
        Бесплатно
      </div>

      {/* Rating */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={14}
              className={
                i < Math.floor(product.rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-slate-300'
              }
            />
          ))}
        </div>
        <span className="text-xs text-slate-600">
          {product.rating} ({product.reviews})
        </span>
      </div>

      {/* Features */}
      <div className="mb-4 pb-4 border-b border-slate-200">
        <h4 className="font-semibold text-slate-900 text-xs mb-2 uppercase text-slate-600">
          Включено:
        </h4>
        <ul className="space-y-1">
          {product.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2 text-xs text-slate-700">
              <Check size={14} className="text-green-600 flex-shrink-0 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Limitations */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 text-xs mb-2 uppercase text-slate-600">
          Ограничения:
        </h4>
        <ul className="space-y-1">
          {product.limitations.map((limitation, index) => (
            <li key={index} className="flex items-start gap-2 text-xs text-slate-600">
              <span className="text-slate-400 mt-0.5">−</span>
              <span>{limitation}</span>
            </li>
          ))}
        </ul>
      </div>

      <button className="w-full px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-900 rounded-lg font-medium transition-colors">
        Начать использовать
      </button>
    </div>
  )
}

export default function FreeProductsPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">
          Бесплатные продукты
        </h1>
        <p className="text-lg text-slate-600">
          Начните с бесплатных инструментов и расширяйте возможности по мере роста
        </p>
      </div>

      <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-sm text-green-900">
          <span className="font-semibold">Все бесплатные продукты</span> включены в
          стандартный пакет Talentsy. Нет платежей, скрытых комиссий или контрактных
          обязательств.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Info Section */}
      <div className="mt-12 p-8 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg">
        <h2 className="text-2xl font-bold text-slate-900 mb-3">
          Почему мы предлагаем бесплатные инструменты?
        </h2>
        <p className="text-slate-700 mb-4">
          Мы верим, что каждая организация, независимо от размера, должна иметь доступ
          к инструментам управления талантами. Наши бесплатные продукты помогают вам
          начать, а платные решения дают дополнительные мощности, когда вы готовы к
          масштабированию.
        </p>
        <p className="text-slate-700">
          Можете комбинировать бесплатные и платные продукты, чтобы создать идеальное
          решение для вашей организации.
        </p>
      </div>

      {/* Upgrade CTA */}
      <div className="mt-8 p-6 bg-slate-900 text-white rounded-lg text-center">
        <h3 className="text-xl font-bold mb-2">Нужна больше функций?</h3>
        <p className="text-slate-300 mb-4">
          Обновитесь до платных тарифов для получения продвинутых возможностей
        </p>
        <button className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors">
          Изучить платные продукты
        </button>
      </div>
    </div>
  )
}
