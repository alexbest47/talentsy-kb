'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Search,
  Plus,
  Grid3x3,
  List,
  FileText,
  Clock,
  User,
  Lock,
  Unlock,
  Copy,
  Check,
  Link as LinkIcon,
} from 'lucide-react'
import clsx from 'clsx'

type DocAccess = 'internal' | 'external'

interface Document {
  id: string
  title: string
  excerpt: string
  category: string
  author: string
  updatedAt: string
  views: number
  access: DocAccess
  shareToken?: string
}

const documents: Document[] = [
  {
    id: 'doc1',
    title: 'Руководство по использованию платформы',
    excerpt: 'Полное руководство для новых пользователей по базовым функциям платформы',
    category: 'Инструкция',
    author: 'Наталья Федорова',
    updatedAt: '2026-03-20',
    views: 1234,
    access: 'external',
    shareToken: 'tk_doc1_abc123def456',
  },
  {
    id: 'doc2',
    title: 'Регламент работы отдела продаж',
    excerpt: 'Описание процессов, KPI и стандартов работы отдела продаж',
    category: 'Регламент',
    author: 'Дмитрий Орлов',
    updatedAt: '2026-03-18',
    views: 856,
    access: 'internal',
  },
  {
    id: 'doc3',
    title: 'Процесс адаптации новых сотрудников',
    excerpt: 'Пошаговый чеклист онбординга с описанием каждого этапа',
    category: 'Инструкция',
    author: 'Сергей Морозов',
    updatedAt: '2026-03-15',
    views: 567,
    access: 'external',
    shareToken: 'tk_doc3_xyz789ghi012',
  },
  {
    id: 'doc4',
    title: 'Политика информационной безопасности',
    excerpt: 'Правила обращения с конфиденциальными данными и доступом к системам',
    category: 'Регламент',
    author: 'Анна Волконская',
    updatedAt: '2026-03-12',
    views: 432,
    access: 'internal',
  },
  {
    id: 'doc5',
    title: 'Описание программы «Психолог-консультант»',
    excerpt: 'Подробное описание флагманской программы для страницы продукта',
    category: 'Описание продукта',
    author: 'Юрий Кравцов',
    updatedAt: '2026-03-10',
    views: 789,
    access: 'external',
    shareToken: 'tk_doc5_prod_psych01',
  },
  {
    id: 'doc6',
    title: 'Кейс выпускницы: Анна М.',
    excerpt: 'История успеха выпускницы программы семейной психологии',
    category: 'Кейс',
    author: 'Павел Иванов',
    updatedAt: '2026-03-08',
    views: 654,
    access: 'external',
    shareToken: 'tk_doc6_case_anna01',
  },
  {
    id: 'doc7',
    title: 'Целевая аудитория: Арт-терапия',
    excerpt: 'Описание ЦА для направления арт-терапии',
    category: 'Описание аудитории',
    author: 'Мария Смирнова',
    updatedAt: '2026-03-05',
    views: 321,
    access: 'internal',
  },
]

const categories = [
  'Все',
  'Инструкция',
  'Регламент',
  'Кейс',
  'Описание продукта',
  'Описание аудитории',
]

export default function DocsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Все')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [accessFilter, setAccessFilter] = useState<'all' | 'internal' | 'external'>('all')

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'Все' || doc.category === selectedCategory
    const matchesAccess =
      accessFilter === 'all' ||
      doc.access === accessFilter
    return matchesSearch && matchesCategory && matchesAccess
  })

  const internalCount = documents.filter((d) => d.access === 'internal').length
  const externalCount = documents.filter((d) => d.access === 'external').length

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Документы</h1>
          <p className="text-slate-600">
            База всех документов системы — инструкции, регламенты, кейсы, описания продуктов
          </p>
        </div>
        <Link href="/docs/new">
          <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors">
            <Plus size={18} />
            Новый документ
          </button>
        </Link>
      </div>

      {/* Access summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <button
          onClick={() => setAccessFilter('all')}
          className={clsx(
            'p-4 rounded-lg border text-left transition-all',
            accessFilter === 'all'
              ? 'border-purple-400 bg-purple-50 ring-2 ring-purple-200'
              : 'border-slate-200 bg-white hover:border-slate-300'
          )}
        >
          <div className="flex items-center gap-2 mb-1">
            <FileText size={14} className="text-slate-500" />
            <span className="text-sm font-medium text-slate-700">Все документы</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">{documents.length}</p>
        </button>
        <button
          onClick={() => setAccessFilter('internal')}
          className={clsx(
            'p-4 rounded-lg border text-left transition-all',
            accessFilter === 'internal'
              ? 'border-purple-400 bg-purple-50 ring-2 ring-purple-200'
              : 'border-slate-200 bg-white hover:border-slate-300'
          )}
        >
          <div className="flex items-center gap-2 mb-1">
            <Lock size={14} className="text-slate-500" />
            <span className="text-sm font-medium text-slate-700">Внутренние</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">{internalCount}</p>
        </button>
        <button
          onClick={() => setAccessFilter('external')}
          className={clsx(
            'p-4 rounded-lg border text-left transition-all',
            accessFilter === 'external'
              ? 'border-purple-400 bg-purple-50 ring-2 ring-purple-200'
              : 'border-slate-200 bg-white hover:border-slate-300'
          )}
        >
          <div className="flex items-center gap-2 mb-1">
            <Unlock size={14} className="text-green-600" />
            <span className="text-sm font-medium text-slate-700">Внешние</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">{externalCount}</p>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 mb-6">
        <div className="mb-4">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Поиск документов..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={clsx(
                  'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                  selectedCategory === category
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                )}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 ml-4">
            <button
              onClick={() => setViewMode('grid')}
              className={clsx(
                'p-2 rounded-lg transition-colors',
                viewMode === 'grid' ? 'bg-purple-100 text-purple-600' : 'text-slate-600 hover:bg-slate-100'
              )}
            >
              <Grid3x3 size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={clsx(
                'p-2 rounded-lg transition-colors',
                viewMode === 'list' ? 'bg-purple-100 text-purple-600' : 'text-slate-600 hover:bg-slate-100'
              )}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      <p className="text-sm text-slate-500 mb-4">
        {filteredDocs.length === documents.length
          ? `Все документы (${documents.length})`
          : `Найдено ${filteredDocs.length} из ${documents.length}`}
      </p>

      {/* Grid view */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDocs.map((doc) => (
            <Link key={doc.id} href={`/docs/${doc.id}`}>
              <div className="bg-white border border-slate-200 rounded-lg p-5 hover:shadow-lg hover:border-purple-300 transition-all h-full cursor-pointer flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-[10px] font-medium">
                    {doc.category}
                  </span>
                  <span
                    className={clsx(
                      'inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium',
                      doc.access === 'external'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-slate-100 text-slate-500'
                    )}
                  >
                    {doc.access === 'external' ? <Unlock size={9} /> : <Lock size={9} />}
                    {doc.access === 'external' ? 'Внешний' : 'Внутренний'}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2 line-clamp-2">{doc.title}</h3>
                <p className="text-slate-500 text-sm mb-4 line-clamp-2 flex-1">{doc.excerpt}</p>
                <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-1">
                    <User size={12} />
                    {doc.author}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    {new Date(doc.updatedAt).toLocaleDateString('ru-RU')}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredDocs.map((doc) => (
            <Link key={doc.id} href={`/docs/${doc.id}`}>
              <div className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md hover:border-purple-300 transition-all cursor-pointer">
                <div className="flex items-start gap-3">
                  <FileText size={20} className="text-purple-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="text-sm font-bold text-slate-900">{doc.title}</h3>
                      <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-[10px] font-medium">
                        {doc.category}
                      </span>
                      <span
                        className={clsx(
                          'inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium',
                          doc.access === 'external'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-slate-100 text-slate-500'
                        )}
                      >
                        {doc.access === 'external' ? <Unlock size={9} /> : <Lock size={9} />}
                        {doc.access === 'external' ? 'Внешний' : 'Внутренний'}
                      </span>
                    </div>
                    <p className="text-slate-500 text-xs mb-2 line-clamp-1">{doc.excerpt}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <span className="flex items-center gap-1"><User size={11} />{doc.author}</span>
                      <span className="flex items-center gap-1"><Clock size={11} />{new Date(doc.updatedAt).toLocaleDateString('ru-RU')}</span>
                      <span>{doc.views} просмотров</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {filteredDocs.length === 0 && (
        <div className="text-center py-12">
          <FileText size={40} className="mx-auto text-slate-300 mb-3" />
          <p className="text-lg font-medium text-slate-700 mb-1">Документы не найдены</p>
          <p className="text-slate-500 text-sm">Попробуйте изменить параметры поиска или фильтры</p>
        </div>
      )}
    </div>
  )
}
