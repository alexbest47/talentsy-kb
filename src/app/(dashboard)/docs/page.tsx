'use client'

import { useState } from 'react'
import {
  Search,
  LayoutGrid,
  List,
  FileText,
  Filter,
  Badge,
  Clock,
} from 'lucide-react'
import clsx from 'clsx'

interface Document {
  id: string
  title: string
  section: string
  author: string
  date: string
  status: 'published' | 'draft' | 'archived'
  tags: string[]
  excerpt: string
}

const documents: Document[] = [
  {
    id: '1',
    title: 'Процесс адаптации новых сотрудников',
    section: 'Общее',
    author: 'Иван Петров',
    date: '2024-03-28',
    status: 'published',
    tags: ['HR', 'Процесс'],
    excerpt: 'Подробное описание всех этапов онбординга...',
  },
  {
    id: '2',
    title: 'Описание платных тарифов',
    section: 'Продукты',
    author: 'Мария Сидорова',
    date: '2024-03-27',
    status: 'published',
    tags: ['Продукты', 'Цены'],
    excerpt: 'Информация о всех доступных платных тарифах...',
  },
  {
    id: '3',
    title: 'Стратегия маркетинга 2024',
    section: 'Маркетинг',
    author: 'Алексей Иванов',
    date: '2024-03-26',
    status: 'published',
    tags: ['Стратегия', 'Маркетинг'],
    excerpt: 'Комплексный план маркетинговых инициатив...',
  },
  {
    id: '4',
    title: 'Правила корпоративной культуры',
    section: 'Общее',
    author: 'Александр Волков',
    date: '2024-03-25',
    status: 'published',
    tags: ['Культура', 'Правила'],
    excerpt: 'Основные принципы и ценности компании...',
  },
  {
    id: '5',
    title: 'CRM инструкция',
    section: 'Продажи',
    author: 'Дмитрий Петров',
    date: '2024-03-24',
    status: 'published',
    tags: ['CRM', 'Инструкция'],
    excerpt: 'Полное руководство по использованию CRM...',
  },
  {
    id: '6',
    title: 'Новая политика отпусков',
    section: 'HR',
    author: 'Виктория Смирнова',
    date: '2024-03-23',
    status: 'draft',
    tags: ['HR', 'Политика'],
    excerpt: 'Обновленная политика отпусков и выходных...',
  },
  {
    id: '7',
    title: 'Архитектура системы',
    section: 'Технология',
    author: 'Сергей Кузнецов',
    date: '2024-03-22',
    status: 'published',
    tags: ['Техника', 'Архитектура'],
    excerpt: 'Описание архитектуры нашей платформы...',
  },
  {
    id: '8',
    title: 'Дорожная карта продукта Q2',
    section: 'Продукт',
    author: 'Павел Сизов',
    date: '2024-03-21',
    status: 'published',
    tags: ['Продукт', 'Планы'],
    excerpt: 'План развития продукта на второй квартал...',
  },
]

function DocumentCard({
  doc,
  view,
}: {
  doc: Document
  view: 'grid' | 'list'
}) {
  const statusColors = {
    published: 'bg-green-100 text-green-800',
    draft: 'bg-yellow-100 text-yellow-800',
    archived: 'bg-gray-100 text-gray-800',
  }

  const statusLabels = {
    published: 'Опубликовано',
    draft: 'Черновик',
    archived: 'В архиве',
  }

  if (view === 'list') {
    return (
      <div className="p-4 bg-white border border-slate-200 rounded-lg hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-semibold text-slate-900 line-clamp-2">
              {doc.title}
            </h3>
            <p className="text-sm text-slate-600 mt-1 line-clamp-2">
              {doc.excerpt}
            </p>
          </div>
          <span
            className={clsx(
              'ml-4 px-2 py-1 rounded text-xs font-semibold whitespace-nowrap flex-shrink-0',
              statusColors[doc.status]
            )}
          >
            {statusLabels[doc.status]}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs text-slate-500 mt-3">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="px-2 py-1 bg-slate-100 rounded text-slate-700">
              {doc.section}
            </span>
            <span>{doc.author}</span>
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {doc.date}
            </span>
          </div>
          <div className="flex gap-1">
            {doc.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 bg-white border border-slate-200 rounded-lg hover:shadow-md transition-shadow flex flex-col">
      <div className="flex items-start justify-between mb-3">
        <FileText size={24} className="text-purple-600 flex-shrink-0" />
        <span
          className={clsx(
            'px-2 py-1 rounded text-xs font-semibold',
            statusColors[doc.status]
          )}
        >
          {statusLabels[doc.status]}
        </span>
      </div>
      <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2">
        {doc.title}
      </h3>
      <p className="text-sm text-slate-600 mb-4 flex-1 line-clamp-2">
        {doc.excerpt}
      </p>
      <div className="space-y-2 text-xs text-slate-600 border-t border-slate-200 pt-3">
        <p>
          <span className="font-medium">Раздел:</span> {doc.section}
        </p>
        <p>
          <span className="font-medium">Автор:</span> {doc.author}
        </p>
        <div className="flex gap-1 flex-wrap mt-2">
          {doc.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function DocsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSection, setSelectedSection] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const sections = ['all', ...new Set(documents.map((d) => d.section))]
  const statuses = ['all', 'published', 'draft', 'archived']

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSection =
      selectedSection === 'all' || doc.section === selectedSection
    const matchesStatus =
      selectedStatus === 'all' || doc.status === selectedStatus

    return matchesSearch && matchesSection && matchesStatus
  })

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Документы</h1>
        <p className="text-lg text-slate-600">
          Поиск и просмотр всех документов в базе знаний
        </p>
      </div>

      {/* Search and Controls */}
      <div className="mb-6 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Поиск документов..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Filters and View Toggle */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 flex gap-2 flex-wrap">
            {/* Section Filter */}
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">Все разделы</option>
              {sections.filter((s) => s !== 'all').map((section) => (
                <option key={section} value={section}>
                  {section}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">Все статусы</option>
              <option value="published">Опубликовано</option>
              <option value="draft">Черновик</option>
              <option value="archived">В архиве</option>
            </select>
          </div>

          {/* View Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={clsx(
                'p-2 rounded-lg border transition-colors',
                viewMode === 'grid'
                  ? 'bg-purple-600 text-white border-purple-600'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              )}
              title="Grid view"
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={clsx(
                'p-2 rounded-lg border transition-colors',
                viewMode === 'list'
                  ? 'bg-purple-600 text-white border-purple-600'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              )}
              title="List view"
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4 text-sm text-slate-600">
        Найдено документов: <span className="font-semibold">{filteredDocs.length}</span>
      </div>

      {/* Documents Grid/List */}
      {filteredDocs.length > 0 ? (
        <div
          className={clsx(
            'gap-4',
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              : 'space-y-4'
          )}
        >
          {filteredDocs.map((doc) => (
            <DocumentCard key={doc.id} doc={doc} view={viewMode} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <FileText size={48} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            Документы не найдены
          </h3>
          <p className="text-slate-600">
            Попробуйте изменить параметры поиска или фильтры
          </p>
        </div>
      )}

      {/* Create Document Button */}
      <div className="mt-12 p-6 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg text-center">
        <h3 className="text-xl font-bold text-slate-900 mb-2">
          Хотите добавить документ?
        </h3>
        <p className="text-slate-700 mb-4">
          Поделитесь своими знаниями с командой, создав новый документ в базе
          знаний
        </p>
        <button className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors">
          Создать документ
        </button>
      </div>
    </div>
  )
}
