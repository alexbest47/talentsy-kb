'use client'

import Link from 'next/link'
import { Plus, Heart, MessageCircle, Share2, Calendar, User } from 'lucide-react'

interface NewsItem {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  publishedAt: string
  image?: string
  likes: number
  comments: number
  category: string
}

const newsItems: NewsItem[] = [
  {
    id: 'news1',
    title: 'Запуск нового модуля аналитики',
    excerpt: 'Мы с гордостью представляем обновленный модуль аналитики с улучшенной визуализацией данных',
    content: 'Новый модуль аналитики включает в себя расширенные возможности визуализации, новые метрики и интеграцию с популярными инструментами BI.',
    author: 'Наталья Федорова',
    publishedAt: '2024-03-25',
    likes: 156,
    comments: 23,
    category: 'Product',
  },
  {
    id: 'news2',
    title: 'Talentsy выигрывает награду "Лучший SaaS в 2024"',
    excerpt: 'Наша платформа признана лучшим решением для управления талантами в регионе',
    content: 'На ежегодной конференции технологических компаний Talentsy получила престижную награду за инновации и качество обслуживания.',
    author: 'Виктор Петров',
    publishedAt: '2024-03-20',
    likes: 342,
    comments: 67,
    category: 'Awards',
  },
  {
    id: 'news3',
    title: 'Открытие нового офиса в Москве',
    excerpt: 'Мы расширяем нашу команду и открываем новый региональный офис',
    content: 'Новый офис в Москве позволит нам лучше обслуживать наших клиентов в регионе и привлечь новые таланты.',
    author: 'Иван Иванов',
    publishedAt: '2024-03-15',
    likes: 198,
    comments: 45,
    category: 'Company',
  },
  {
    id: 'news4',
    title: 'Серия вебинаров по лучшим практикам',
    excerpt: 'Присоединяйтесь к нашей серии вебинаров и узнайте, как максимально использовать возможности платформы',
    content: 'Каждую неделю мы проводим бесплатные вебинары с экспертами по управлению талантами и HR операциям.',
    author: 'Анна Волконская',
    publishedAt: '2024-03-10',
    likes: 87,
    comments: 12,
    category: 'Learning',
  },
  {
    id: 'news5',
    title: 'Обновление безопасности и соответствие GDPR',
    excerpt: 'Мы укрепили меры безопасности и полностью соответствуем требованиям GDPR',
    content: 'Все данные пользователей теперь защищены с использованием современных стандартов шифрования и мы полностью соответствуем требованиям GDPR.',
    author: 'Павел Иванов',
    publishedAt: '2024-03-05',
    likes: 125,
    comments: 28,
    category: 'Security',
  },
  {
    id: 'news6',
    title: 'Партнерство с ведущими компаниями в индустрии',
    excerpt: 'Talentsy заключила стратегические партнерства с глобальными лидерами рынка',
    content: 'Наши новые партнерства позволяют нам предоставлять интеграцию с лучшими инструментами и расширять экосистему для наших пользователей.',
    author: 'Сергей Морозов',
    publishedAt: '2024-03-01',
    likes: 203,
    comments: 34,
    category: 'Partnership',
  },
]

const categoryColors = {
  Product: 'purple',
  Awards: 'yellow',
  Company: 'blue',
  Learning: 'green',
  Security: 'red',
  Partnership: 'indigo',
}

function NewsCard({ news }: { news: NewsItem }) {
  const categoryColor = categoryColors[news.category as keyof typeof categoryColors] || 'purple'

  const bgColor = {
    purple: 'bg-purple-50 text-purple-700',
    yellow: 'bg-yellow-50 text-yellow-700',
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-green-50 text-green-700',
    red: 'bg-red-50 text-red-700',
    indigo: 'bg-indigo-50 text-indigo-700',
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${bgColor[categoryColor as keyof typeof bgColor]}`}>
            {news.category}
          </span>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Calendar size={14} />
            {new Date(news.publishedAt).toLocaleDateString('ru-RU')}
          </div>
        </div>

        <h3 className="text-xl font-bold text-slate-900 mb-2">{news.title}</h3>
        <p className="text-slate-600 text-sm mb-4">{news.excerpt}</p>

        <div className="flex items-center gap-4 pt-4 border-t border-slate-200">
          <div className="flex items-center gap-1 text-xs text-slate-600">
            <User size={14} />
            {news.author}
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-600 cursor-pointer hover:text-red-600">
            <Heart size={14} />
            {news.likes}
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-600 cursor-pointer hover:text-blue-600">
            <MessageCircle size={14} />
            {news.comments}
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

      {/* News Feed */}
      <div className="space-y-6">
        {newsItems.map((news) => (
          <NewsCard key={news.id} news={news} />
        ))}
      </div>

      {/* Load More */}
      <div className="mt-12 text-center">
        <button className="px-8 py-3 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg font-medium transition-colors">
          Загрузить еще новости
        </button>
      </div>
    </div>
  )
}
