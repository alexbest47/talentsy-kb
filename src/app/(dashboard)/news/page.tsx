'use client'

import { Newspaper, Plus, MessageCircle, Share2, Clock } from 'lucide-react'

interface NewsItem {
  id: string
  title: string
  preview: string
  author: string
  date: string
  category: string
  readTime: number
  image?: string
  unread?: boolean
}

const newsItems: NewsItem[] = [
  {
    id: '1',
    title: 'Обновление платформы: новые возможности аналитики',
    preview:
      'Мы рады представить новую версию платформы с улучшенной аналитикой и полностью переработанным интерфейсом для анализа данных...',
    author: 'Команда Продукта',
    date: '2024-03-29',
    category: 'Обновления',
    readTime: 5,
    unread: true,
  },
  {
    id: '2',
    title: 'Поздравляем с юбилеем компании!',
    preview:
      'Сегодня мы отмечаем 5 лет работы и благодарим всех сотрудников за вклад в развитие компании. Спецальное спасибо нашим первым сотрудникам...',
    author: 'Генеральный директор',
    date: '2024-03-28',
    category: 'Компания',
    readTime: 3,
    unread: true,
  },
  {
    id: '3',
    title: 'Результаты опроса сотрудников опубликованы',
    preview:
      'Спасибо всем, кто участвовал в опросе удовлетворенности. Мы проанализировали результаты и готовим план действий по улучшению...',
    author: 'HR Отдел',
    date: '2024-03-27',
    category: 'HR',
    readTime: 4,
    unread: true,
  },
  {
    id: '4',
    title: 'Новый офис в Санкт-Петербурге открыт',
    preview:
      'С гордостью объявляем об открытии нашего второго офиса в Санкт-Петербурге. Присоединяйтесь к растущей команде на северо-западе России...',
    author: 'Отдел расширения',
    date: '2024-03-26',
    category: 'Компания',
    readTime: 6,
  },
  {
    id: '5',
    title: 'Волонтёрская инициатива: помощь местным сообществам',
    preview:
      'Наша компания запускает программу волонтёрства для поддержки местных сообществ. Каждый сотрудник может внести свой вклад...',
    author: 'Отдел социальной ответственности',
    date: '2024-03-25',
    category: 'Инициативы',
    readTime: 5,
  },
  {
    id: '6',
    title: 'Наша команда выиграла награду "Лучший работодатель"',
    preview:
      'Мы рады сообщить, что Talentsy был признан одним из лучших работодателей в России по версии международной организации...',
    author: 'Отдел PR',
    date: '2024-03-24',
    category: 'Достижения',
    readTime: 4,
  },
  {
    id: '7',
    title: 'Запуск программы менторства для молодых специалистов',
    preview:
      'Мы запускаем новую программу менторства, которая будет объединять опытных специалистов с молодыми талантами для взаимного развития...',
    author: 'HR Отдел',
    date: '2024-03-23',
    category: 'HR',
    readTime: 3,
  },
  {
    id: '8',
    title: 'Финальные итоги конкурса идей 2024',
    preview:
      'Объявляем победителей конкурса инновационных идей. Девять проектов были выбраны для финансирования и развития в следующем квартале...',
    author: 'Команда Инноваций',
    date: '2024-03-22',
    category: 'Инициативы',
    readTime: 5,
  },
]

function NewsCard({ item }: { item: NewsItem }) {
  return (
    <article className="p-6 bg-white border border-slate-200 rounded-lg hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded">
              {item.category}
            </span>
            {item.unread && (
              <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
            )}
          </div>
          <h2 className="text-xl font-bold text-slate-900 line-clamp-2">
            {item.title}
          </h2>
        </div>
      </div>

      <p className="text-slate-600 mb-4 line-clamp-3">{item.preview}</p>

      <div className="flex items-center justify-between text-sm text-slate-500 mb-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <span className="font-medium text-slate-700">{item.author}</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock size={14} />
            {item.date}
          </span>
          <span>•</span>
          <span>{item.readTime} мин. чтения</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 text-slate-600 hover:text-purple-600 transition-colors text-sm">
          <MessageCircle size={16} />
          <span>Комментировать</span>
        </button>
        <button className="flex items-center gap-2 text-slate-600 hover:text-purple-600 transition-colors text-sm">
          <Share2 size={16} />
          <span>Поделиться</span>
        </button>
      </div>
    </article>
  )
}

export default function NewsPage() {
  const unreadCount = newsItems.filter((item) => item.unread).length

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2 flex items-center gap-3">
            <Newspaper size={36} className="text-purple-600" />
            Новости компании
          </h1>
          <p className="text-lg text-slate-600">
            Будьте в курсе последних событий и обновлений в Talentsy
          </p>
          {unreadCount > 0 && (
            <p className="text-sm text-purple-600 font-semibold mt-2">
              {unreadCount} непрочитанных новостей
            </p>
          )}
        </div>
        <button className="hidden sm:flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors">
          <Plus size={18} />
          Создать новость
        </button>
      </div>

      {/* News Grid */}
      <div className="space-y-4 mb-12">
        {newsItems.map((item) => (
          <NewsCard key={item.id} item={item} />
        ))}
      </div>

      {/* Load More */}
      <div className="text-center mb-12">
        <button className="px-6 py-2 border border-purple-600 text-purple-600 hover:bg-purple-50 rounded-lg font-medium transition-colors">
          Загрузить ещё новости
        </button>
      </div>

      {/* Mobile Create Button */}
      <div className="sm:hidden fixed bottom-6 right-6">
        <button className="flex items-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg transition-colors">
          <Plus size={24} />
        </button>
      </div>

      {/* Subscribe Section */}
      <div className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
        <h2 className="text-2xl font-bold text-slate-900 mb-3">
          Не пропустите важные новости
        </h2>
        <p className="text-slate-700 mb-4">
          Подпишитесь на уведомления, чтобы получать новости в реальном времени
        </p>
        <div className="flex gap-3">
          <input
            type="email"
            placeholder="Ваш email"
            className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors">
            Подписаться
          </button>
        </div>
      </div>
    </div>
  )
}
