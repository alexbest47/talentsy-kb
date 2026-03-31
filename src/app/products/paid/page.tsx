'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Filter, ExternalLink, Tag, GraduationCap, Heart, Award } from 'lucide-react'
import clsx from 'clsx'

type ProductTag = 'для_профессии' | 'для_себя' | 'повышение_квалификации'

interface Product {
  id: string
  name: string
  tags: ProductTag[]
  category: string
  updatedAt: string
  siteUrl: string
  shortDescription: string
}

const TAG_CONFIG: Record<ProductTag, { label: string; color: string; icon: React.ReactNode }> = {
  для_профессии: {
    label: 'Для профессии',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: <GraduationCap size={12} />,
  },
  для_себя: {
    label: 'Для себя',
    color: 'bg-green-100 text-green-700 border-green-200',
    icon: <Heart size={12} />,
  },
  повышение_квалификации: {
    label: 'Повышение квалификации',
    color: 'bg-purple-100 text-purple-700 border-purple-200',
    icon: <Award size={12} />,
  },
}

const products: Product[] = [
  {
    id: 'stylist-imagemaker',
    name: 'Стилист-имиджмейкер',
    tags: ['для_себя', 'для_профессии'],
    category: 'Стиль и имидж',
    updatedAt: '27.03.2026',
    siteUrl: 'https://talentsy.ru/stilist-imidzhmejker',
    shortDescription: 'Комплексная программа обучения профессии стилиста-имиджмейкера с практикой на реальных клиентах',
  },
  {
    id: 'decorator-interior',
    name: 'Профессия "Декоратор интерьера"',
    tags: ['для_себя', 'для_профессии'],
    category: 'Дизайн',
    updatedAt: '27.03.2026',
    siteUrl: 'https://talentsy.ru/dekorator-interera',
    shortDescription: 'Обучение профессии декоратора интерьера — от основ композиции до работы с заказчиками',
  },
  {
    id: 'spec-family-psychology',
    name: 'Специализация «Семейная психология»',
    tags: ['повышение_квалификации'],
    category: 'Психология',
    updatedAt: '24.03.2026',
    siteUrl: 'https://talentsy.ru/spec-semejnaya-psihologiya',
    shortDescription: 'Углублённая специализация для практикующих психологов в области семейного консультирования',
  },
  {
    id: 'family-psychologist',
    name: 'Профессия "Семейный психолог-консультант"',
    tags: ['для_профессии'],
    category: 'Психология',
    updatedAt: '24.03.2026',
    siteUrl: 'https://talentsy.ru/semejnyj-psiholog',
    shortDescription: 'Полная программа подготовки семейного психолога-консультанта с нуля до первых клиентов',
  },
  {
    id: 'art-therapy-from-scratch',
    name: 'Арт-терапия с нуля',
    tags: ['для_себя', 'для_профессии'],
    category: 'Арт-терапия',
    updatedAt: '24.03.2026',
    siteUrl: 'https://talentsy.ru/art-terapiya-s-nulya',
    shortDescription: 'Вводный курс по арт-терапии для начинающих — техники, методы и практические упражнения',
  },
  {
    id: 'spec-art-therapy',
    name: 'Специализация "Арт-терапия"',
    tags: ['повышение_квалификации'],
    category: 'Арт-терапия',
    updatedAt: '24.03.2026',
    siteUrl: 'https://talentsy.ru/spec-art-terapiya',
    shortDescription: 'Программа повышения квалификации для специалистов, желающих освоить методы арт-терапии',
  },
  {
    id: 'art-therapist',
    name: 'Профессия "Арт-терапевт"',
    tags: ['для_профессии'],
    category: 'Арт-терапия',
    updatedAt: '24.03.2026',
    siteUrl: 'https://talentsy.ru/art-terapevt',
    shortDescription: 'Комплексная подготовка арт-терапевта — от теоретических основ до самостоятельной практики',
  },
  {
    id: 'child-psychology-parents',
    name: 'Детская психология: курс для родителей и всех интересующихся',
    tags: ['для_себя'],
    category: 'Психология',
    updatedAt: '23.03.2026',
    siteUrl: 'https://talentsy.ru/detskaya-psihologiya-dlya-roditelej',
    shortDescription: 'Практический курс для родителей о возрастном развитии, воспитании и поддержке ребёнка',
  },
  {
    id: 'spec-child-psychology',
    name: 'Специализация "Детская психология"',
    tags: ['повышение_квалификации'],
    category: 'Психология',
    updatedAt: '23.03.2026',
    siteUrl: 'https://talentsy.ru/spec-detskaya-psihologiya',
    shortDescription: 'Специализация для практикующих психологов в области детской и подростковой психологии',
  },
  {
    id: 'sexual-relations-course',
    name: 'Практическая психология сексуальных отношений',
    tags: ['для_себя'],
    category: 'Психология',
    updatedAt: '23.03.2026',
    siteUrl: 'https://talentsy.ru/psihologiya-seksualnyh-otnoshenij',
    shortDescription: 'Курс для личного развития в области психологии сексуальных и партнёрских отношений',
  },
  {
    id: 'spec-sexual-relations',
    name: 'Специализация «Консультант в сфере сексуальных отношений»',
    tags: ['повышение_квалификации'],
    category: 'Психология',
    updatedAt: '23.03.2026',
    siteUrl: 'https://talentsy.ru/spec-konsultant-seksualnyh-otnoshenij',
    shortDescription: 'Повышение квалификации для психологов в области консультирования по сексуальным отношениям',
  },
  {
    id: 'sexual-relations-consultant',
    name: 'Профессия «Консультант в сфере сексуальных отношений»',
    tags: ['для_профессии'],
    category: 'Психология',
    updatedAt: '23.03.2026',
    siteUrl: 'https://talentsy.ru/konsultant-seksualnyh-otnoshenij',
    shortDescription: 'Полная программа подготовки консультанта в сфере сексуальных и интимных отношений',
  },
  {
    id: 'spec-gestalt',
    name: 'Специализация "Гештальт-терапия"',
    tags: ['повышение_квалификации'],
    category: 'Психология',
    updatedAt: '23.03.2026',
    siteUrl: 'https://talentsy.ru/spec-geshtalt-terapiya',
    shortDescription: 'Углублённая специализация в гештальт-подходе для практикующих психологов',
  },
  {
    id: 'gestalt-therapist',
    name: 'Профессия "Гештальт-терапевт"',
    tags: ['для_профессии'],
    category: 'Психология',
    updatedAt: '23.03.2026',
    siteUrl: 'https://talentsy.ru/geshtalt-terapevt',
    shortDescription: 'Обучение профессии гештальт-терапевта — теория, практика, супервизия',
  },
  {
    id: 'spec-cbt',
    name: 'Специализация "Когнитивно-поведенческая терапия"',
    tags: ['повышение_квалификации'],
    category: 'Психология',
    updatedAt: '23.03.2026',
    siteUrl: 'https://talentsy.ru/spec-kpt',
    shortDescription: 'Специализация в КПТ — доказательном подходе к работе с тревогой, депрессией и другими расстройствами',
  },
  {
    id: 'cbt-therapist',
    name: 'Профессия "КПТ-терапевт"',
    tags: ['для_профессии'],
    category: 'Психология',
    updatedAt: '23.03.2026',
    siteUrl: 'https://talentsy.ru/kpt-terapevt',
    shortDescription: 'Полная подготовка КПТ-терапевта с практикой и супервизией',
  },
  {
    id: 'psychologist-consultant',
    name: 'Профессия "Психолог-консультант"',
    tags: ['для_профессии', 'для_себя'],
    category: 'Психология',
    updatedAt: '17.03.2026',
    siteUrl: 'https://talentsy.ru/psiholog-konsultant',
    shortDescription: 'Флагманская программа подготовки психолога-консультанта — от основ психологии до ведения частной практики',
  },
  {
    id: 'child-psychologist',
    name: 'Профессия "Детский Психолог-Консультант"',
    tags: ['для_профессии'],
    category: 'Психология',
    updatedAt: '11.03.2026',
    siteUrl: 'https://talentsy.ru/detskij-psiholog',
    shortDescription: 'Программа подготовки детского психолога-консультанта с фокусом на возрастное развитие и семейную работу',
  },
]

const ALL_TAGS: ProductTag[] = ['для_профессии', 'для_себя', 'повышение_квалификации']

function TagBadge({ tag, small }: { tag: ProductTag; small?: boolean }) {
  const config = TAG_CONFIG[tag]
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 border rounded-full font-medium',
        config.color,
        small ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
      )}
    >
      {config.icon}
      {config.label}
    </span>
  )
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/paid/${product.id}`}>
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-lg hover:border-purple-300 transition-all duration-200 cursor-pointer h-full flex flex-col">
        <div className="p-5 flex flex-col flex-1">
          <div className="flex flex-wrap gap-1.5 mb-3">
            {product.tags.map((tag) => (
              <TagBadge key={tag} tag={tag} small />
            ))}
          </div>

          <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">
            {product.name}
          </h3>

          <p className="text-sm text-slate-500 mb-3 flex-1 line-clamp-2">
            {product.shortDescription}
          </p>

          <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100">
            <span className="text-xs text-slate-400">
              Обновлено {product.updatedAt}
            </span>
            <span className="text-xs font-medium text-purple-600 flex items-center gap-1">
              Подробнее
              <ExternalLink size={12} />
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function PaidProductsPage() {
  const [search, setSearch] = useState('')
  const [activeTag, setActiveTag] = useState<ProductTag | null>(null)

  const filtered = products.filter((p) => {
    const matchesSearch =
      search === '' ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
    const matchesTag = activeTag === null || p.tags.includes(activeTag)
    return matchesSearch && matchesTag
  })

  const tagCounts = ALL_TAGS.map((tag) => ({
    tag,
    count: products.filter((p) => p.tags.includes(tag)).length,
  }))

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Платные программы</h1>
        <p className="text-slate-600">
          Образовательные программы Talentsy — {products.length} курсов в области психологии, арт-терапии, стиля и дизайна
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {tagCounts.map(({ tag, count }) => {
          const config = TAG_CONFIG[tag]
          return (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={clsx(
                'p-4 rounded-lg border text-left transition-all',
                activeTag === tag
                  ? 'border-purple-400 bg-purple-50 ring-2 ring-purple-200'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                {config.icon}
                <span className="text-sm font-medium text-slate-700">{config.label}</span>
              </div>
              <p className="text-2xl font-bold text-slate-900">{count}</p>
            </button>
          )
        })}
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Поиск по названию или категории..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setActiveTag(null)}
            className={clsx(
              'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              activeTag === null
                ? 'bg-purple-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            )}
          >
            Все ({products.length})
          </button>
          {ALL_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={clsx(
                'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                activeTag === tag
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              )}
            >
              {TAG_CONFIG[tag].label}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-slate-500 mb-4">
        {filtered.length === products.length
          ? `Показаны все ${products.length} программ`
          : `Найдено ${filtered.length} из ${products.length} программ`}
      </p>

      {/* Product grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-400 text-lg">Программы не найдены</p>
          <p className="text-slate-400 text-sm mt-1">Попробуйте изменить параметры поиска</p>
        </div>
      )}
    </div>
  )
}
