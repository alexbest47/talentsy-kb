'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Send, Mail } from 'lucide-react'
import Editor from '@/components/editor/editor'
import clsx from 'clsx'

interface NewsFormData {
  title: string
  category: string
  targetDepartments: string[]
  content: any
  sendEmail: boolean
}

const categories = [
  'Объявление',
  'Обновление продукта',
  'Новое внедрение',
  'Важная информация',
  'Событие',
  'Праздник',
  'Другое',
]

const departments = [
  'HR',
  'Маркетинг',
  'Продажи',
  'Разработка',
  'Дизайн',
  'Финансы',
  'Операции',
  'Весь офис',
]

export default function NewNewsPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<NewsFormData>({
    title: '',
    category: 'Объявление',
    targetDepartments: ['Весь офис'],
    content: null,
    sendEmail: false,
  })
  const [isPublishing, setIsPublishing] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleDepartmentToggle = (department: string) => {
    setFormData((prev) => ({
      ...prev,
      targetDepartments: prev.targetDepartments.includes(department)
        ? prev.targetDepartments.filter((d) => d !== department)
        : [...prev.targetDepartments, department],
    }))
  }

  const handleEditorUpdate = (json: any) => {
    setFormData((prev) => ({
      ...prev,
      content: json,
    }))
  }

  const handlePublish = async () => {
    if (!formData.title.trim()) {
      alert('Пожалуйста, введите название новости')
      return
    }

    if (formData.targetDepartments.length === 0) {
      alert('Пожалуйста, выберите хотя бы один отдел')
      return
    }

    setIsPublishing(true)
    try {
      const newsData = {
        title: formData.title,
        category: formData.category,
        targetDepartments: formData.targetDepartments,
        content: formData.content,
        sendEmail: formData.sendEmail,
        publishedAt: new Date().toISOString(),
      }

      console.log('Publishing news:', newsData)
      // TODO: Call Supabase to insert news
      // If sendEmail is true, also trigger email sending
      alert('Новость опубликована!')
      router.push('/news')
    } catch (error) {
      console.error('Error publishing news:', error)
      alert('Ошибка при публикации новости')
    } finally {
      setIsPublishing(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Новая новость</h1>
            <p className="text-slate-600 mt-1">Создайте и опубликуйте новость для команды</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 mb-6 space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Название новости *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Введите название новости..."
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Категория *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Target Departments */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-3">
            Целевые отделы *
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {departments.map((department) => (
              <button
                key={department}
                onClick={() => handleDepartmentToggle(department)}
                className={clsx(
                  'px-4 py-2 rounded-lg border font-medium transition-colors text-sm',
                  formData.targetDepartments.includes(department)
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'bg-white text-slate-900 border-slate-200 hover:border-purple-300'
                )}
              >
                {department}
              </button>
            ))}
          </div>
        </div>

        {/* Send Email Checkbox */}
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.sendEmail}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  sendEmail: e.target.checked,
                }))
              }
              className="w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
            />
            <div>
              <p className="font-semibold text-slate-900 flex items-center gap-2">
                <Mail size={16} />
                Отправить по электронной почте
              </p>
              <p className="text-sm text-slate-600 mt-1">
                Уведомить сотрудников об этой новости по электронной почте
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Editor */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden mb-6 flex flex-col" style={{ height: '500px' }}>
        <Editor content={formData.content} onUpdate={handleEditorUpdate} editable={true} />
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-end">
        <button
          onClick={() => router.back()}
          className="px-6 py-2 border border-slate-200 rounded-lg text-slate-900 font-medium hover:bg-slate-50 transition-colors"
        >
          Отмена
        </button>
        <button
          onClick={handlePublish}
          disabled={isPublishing}
          className={clsx(
            'flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg font-medium transition-colors',
            isPublishing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-700'
          )}
        >
          <Send size={18} />
          Опубликовать
        </button>
      </div>
    </div>
  )
}
