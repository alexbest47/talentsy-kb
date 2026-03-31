'use client'

import { useState } from 'react'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

const categories = ['Product', 'Awards', 'Company', 'Learning', 'Security', 'Partnership', 'Other']

export default function NewNewsPage() {
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'Product',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Creating news:', formData)
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <Link href="/news">
          <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
        </Link>
        <h1 className="text-4xl font-bold text-slate-900">
          Создать новую новость
        </h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Заголовок
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Введите заголовок новости"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        {/* Excerpt */}
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Краткое описание
          </label>
          <textarea
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            placeholder="Введите краткое описание"
            rows={3}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            required
          />
        </div>

        {/* Category */}
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Категория
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Content */}
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Содержание новости
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder="Введите полное содержание новости..."
            rows={15}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            required
          />
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            type="submit"
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <Save size={20} />
            Опубликовать новость
          </button>
          <Link href="/news">
            <button
              type="button"
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
            >
              Отмена
            </button>
          </Link>
        </div>
      </form>
    </div>
  )
}
