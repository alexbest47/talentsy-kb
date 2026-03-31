'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Plus, X, ExternalLink, Loader } from 'lucide-react'
import clsx from 'clsx'
import { createClient } from '@/lib/supabase/client'

interface DbTag {
  id: string
  name: string
  color: string
}

interface DbProduct {
  slug: string
  name: string
  category: string
  description: string
  site_url: string
  product_type: string
  status: string
  created_at: string
  updated_at: string
}

interface DbProductTag {
  id: string
  product_slug: string
  tag_id: string
}

interface ProductWithTags extends DbProduct {
  tags: DbTag[]
}

const transliterateToSlug = (text: string): string => {
  const translitMap: { [key: string]: string } = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
    'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
    'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
    'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '',
    'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
  }

  return text
    .toLowerCase()
    .split('')
    .map(char => translitMap[char] || char)
    .join('')
    .replace(/[^\w-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function TagBadge({ tag }: { tag: DbTag }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full font-medium text-white"
      style={{ backgroundColor: tag.color }}
    >
      {tag.name}
    </span>
  )
}

function CategoryBadge({ category }: { category: string }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full font-medium bg-slate-100 text-slate-600">
      {category}
    </span>
  )
}

function ProductCard({ product }: { product: ProductWithTags }) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-lg hover:border-purple-300 transition-all duration-200 h-full flex flex-col">
      <div className="p-5 flex flex-col flex-1">
        <div className="flex flex-wrap gap-1.5 mb-3">
          {product.tags.length > 0 ? (
            product.tags.map((tag) => (
              <TagBadge key={tag.id} tag={tag} />
            ))
          ) : (
            <CategoryBadge category={product.category} />
          )}
        </div>

        <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">
          {product.name}
        </h3>

        <p className="text-sm text-slate-500 mb-3 flex-1 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100 gap-2">
          <span className="text-xs text-slate-400 truncate">
            Обновлено {new Date(product.updated_at).toLocaleDateString('ru-RU')}
          </span>
          <div className="flex items-center gap-2 ml-auto">
            <Link href={`/products/free/${product.slug}/edit`}>
              <button className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors">
                Редактировать
              </button>
            </Link>
            <Link href={`/products/free/${product.slug}`}>
              <button className="text-xs font-medium text-purple-600 hover:text-purple-800 flex items-center gap-1 transition-colors">
                Подробнее
                <ExternalLink size={12} />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

interface CreateFormData {
  name: string
  category: string
  siteUrl: string
  description: string
  productType: 'paid' | 'free'
}

function CreateProductModal({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}) {
  const [formData, setFormData] = useState<CreateFormData>({
    name: '',
    category: '',
    siteUrl: '',
    description: '',
    productType: 'free',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      if (!formData.name.trim()) {
        setError('Название программы обязательно')
        setIsLoading(false)
        return
      }

      const slug = transliterateToSlug(formData.name)
      const supabase = createClient()

      const { error: insertError } = await supabase.from('products').insert([
        {
          slug,
          name: formData.name,
          category: formData.category,
          description: formData.description,
          site_url: formData.siteUrl,
          product_type: formData.productType,
          status: 'active',
        },
      ])

      if (insertError) {
        setError(insertError.message)
        setIsLoading(false)
        return
      }

      setFormData({
        name: '',
        category: '',
        siteUrl: '',
        description: '',
        productType: 'free',
      })
      onSuccess()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">Добавить программу</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Название программы*
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Введите название"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Категория
            </label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="Например: Психология"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              URL сайта программы
            </label>
            <input
              type="url"
              value={formData.siteUrl}
              onChange={(e) => setFormData({ ...formData, siteUrl: e.target.value })}
              placeholder="https://..."
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Описание программы
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Введите описание программы"
              rows={4}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Тип программы
            </label>
            <select
              value={formData.productType}
              onChange={(e) => setFormData({ ...formData, productType: e.target.value as 'paid' | 'free' })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
            >
              <option value="paid">Платная</option>
              <option value="free">Бесплатная</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Отменить
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors disabled:bg-slate-400 flex items-center justify-center gap-2"
            >
              {isLoading && <Loader size={16} className="animate-spin" />}
              Создать
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function FreeProductsPage() {
  const [products, setProducts] = useState<ProductWithTags[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeTagId, setActiveTagId] = useState<string | null>(null)
  const [tags, setTags] = useState<DbTag[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setIsLoading(true)
      const supabase = createClient()

      // Fetch tags
      const { data: tagsData, error: tagsError } = await supabase.from('tags').select('*')
      if (tagsError) throw tagsError
      setTags(tagsData || [])

      // Fetch products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('product_type', 'free')
        .order('updated_at', { ascending: false })
      if (productsError) throw productsError

      // Fetch product-tag relationships
      const { data: productTagsData, error: productTagsError } = await supabase
        .from('product_tags')
        .select('*')
      if (productTagsError) throw productTagsError

      // Join data
      const productsWithTags: ProductWithTags[] = (productsData || []).map((product) => {
        const assignedTags = (productTagsData || [])
          .filter((pt) => pt.product_slug === product.slug)
          .map((pt) => (tagsData || []).find((t) => t.id === pt.tag_id))
          .filter((t) => t !== undefined) as DbTag[]

        return {
          ...product,
          tags: assignedTags,
        }
      })

      setProducts(productsWithTags)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filtered = products.filter((p) => {
    const matchesSearch =
      search === '' ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())

    const matchesTag =
      activeTagId === null || p.tags.some((tag) => tag.id === activeTagId)

    return matchesSearch && matchesTag
  })

  const tagCounts = tags.map((tag) => ({
    tag,
    count: products.filter((p) => p.tags.some((t) => t.id === tag.id)).length,
  }))

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader size={40} className="animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-slate-600">Загрузка программ...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Бесплатные продукты</h1>
          <p className="text-slate-600">
            Бесплатные образовательные продукты и инструменты Talentsy — {products.length} программ в области психологии, арт-терапии, стиля и дизайна
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors whitespace-nowrap"
        >
          <Plus size={18} />
          Добавить программу
        </button>
      </div>

      {/* Summary cards */}
      {tagCounts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {tagCounts.map(({ tag, count }) => (
            <button
              key={tag.id}
              onClick={() => setActiveTagId(activeTagId === tag.id ? null : tag.id)}
              className={clsx(
                'p-4 rounded-lg border text-left transition-all',
                activeTagId === tag.id
                  ? 'border-purple-400 bg-purple-50 ring-2 ring-purple-200'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: tag.color }}
                />
                <span className="text-sm font-medium text-slate-700">{tag.name}</span>
              </div>
              <p className="text-2xl font-bold text-slate-900">{count}</p>
            </button>
          ))}
        </div>
      )}

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Поиск по названию, категории или описанию..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setActiveTagId(null)}
            className={clsx(
              'px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
              activeTagId === null
                ? 'bg-purple-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            )}
          >
            Все ({products.length})
          </button>
          {tags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => setActiveTagId(activeTagId === tag.id ? null : tag.id)}
              className={clsx(
                'px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
                activeTagId === tag.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              )}
            >
              {tag.name}
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
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-400 text-lg">Программы не найдены</p>
          <p className="text-slate-400 text-sm mt-1">Попробуйте изменить параметры поиска</p>
        </div>
      )}

      <CreateProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadData}
      />
    </div>
  )
}
