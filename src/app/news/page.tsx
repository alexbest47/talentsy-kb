'use client'

import Link from 'next/link'
import { Plus, Heart, MessageCircle, Share2, Calendar, User, Loader } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface NewsItem {
  id: string
  title: string
  excerpt: string | null
  content: string | null
  author: string
  category: string
  published_at: string
}

const categoryColors: Record<string, string> = {
  'Продукт': 'purple',
  'Документ': 'blue',
  'Компания': 'green',
  'Система': 'slate',
}

function NewsCard({ news }: { news: NewsItem }) {
  const categoryColor = categoryColors[news.category] || 'slate'

  const bgColor: Record<string, string> = {
    purple: 'bg-purple-50 text-purple-700',
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-green-50 text-green-700',
    slate: 'bg-slate-50 text-slate-700',
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${bgColor[categoryColor]}`}>
            {news.category}
          </span>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Calendar size={14} />
            {new Date(news.published_at).toLocaleDateString('ru-RU')}
          </div>
        </div>

        <h3 className="text-xl font-bold text-slate-900 mb-2">{news.title}</h3>
        <p className="text-slate-600 text-sm mb-4">{news.excerpt || news.content || ''}</p>

        <div className="flex items-center gap-4 pt-4 border-t border-slate-200">
          <div className="flex items-center gap-1 text-xs text-slate-600">
            <User size={14} />
            {news.author}
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-600 cursor-pointer hover:text-red-600">
            <Heart size={14} />
            0
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-600 cursor-pointer hover:text-blue-600">
            <MessageCircle size={14} />
            0
          </div>
          <button className="ml-auto p-1 hover:bg-slate-100 rounded transition-colors">
            <Share2 size={14} className="text-slate-600" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchNews() {
      try {
        setLoading(true)
        const supabase = createClient()

        const { data, error: fetchError } = await supabase
          .from('news')
          .select('*')
          .order('published_at', { ascending: false })

        if (fetchError) {
          setError(fetchError.message)
          return
        }

        setNews(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch news')
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [])

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Новости</h1>
          <p className="text-lg text-slate-600">
            Последние обновления и новости о Talentsy
          </p>
        </div>
        <Link href="/news/new">
          <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
            <Plus size={20} />
            Новая новость
          </button>
        </Link>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader size={32} className="text-purple-600 animate-spin" />
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6">
          <p className="font-medium">Ошибка при загрузке новостей</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && news.length === 0 && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-12 text-center">
          <p className="text-slate-600 mb-2">Новостей пока нет</p>
          <p className="text-slate-500 text-sm mb-6">
            Создайте первую новость, нажав кнопку "Новая новость" выше
          </p>
          <Link href="/news/new">
            <button className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              <Plus size={20} />
              Создать новость
            </button>
          </Link>
        </div>
      )}

      {/* News Feed */}
      {!loading && news.length > 0 && (
        <div className="space-y-6">
          {news.map((item) => (
            <NewsCard key={item.id} news={item} />
          ))}
        </div>
      )}
    </div>
  )
}
