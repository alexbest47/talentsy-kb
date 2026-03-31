'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Send } from 'lucide-react'
import Editor from '@/components/editor/editor'
import clsx from 'clsx'

interface DocumentFormData {
  title: string
  section: string
  tags: string
  content: any
}

const sections = [
  'Общее',
  'Продукты',
  'Маркетинг',
  'Продажи',
  'HR',
  'Технология',
  'Продукт',
  'Другое',
]

export default function NewDocumentPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<DocumentFormData>({
    title: '',
    section: 'Общее',
    tags: '',
    content: null,
  })
  const [isSaving, setIsSaving] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleEditorUpdate = (json: any) => {
    setFormData((prev) => ({
      ...prev,
      content: json,
    }))
  }

  const handleSaveDraft = async () => {
    if (!formData.title.trim()) {
      alert('Пожалуйста, введите название документа')
      return
    }

    setIsSaving(true)
    try {
      const documentData = {
        title: formData.title,
        section: formData.section,
        tags: formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
        content: formData.content,
        status: 'draft',
        createdAt: new Date().toISOString(),
      }

      console.log('Saving draft:', documentData)
      // TODO: Call Supabase to insert document
      alert('Черновик сохранён!')
      router.push('/docs')
    } catch (error) {
      console.error('Error saving draft:', error)
      alert('Ошибка при сохранении черновика')
    } finally {
      setIsSaving(false)
    }
  }

  const handlePublish = async () => {
    if (!formData.title.trim()) {
      alert('Пожалуйста, введите название документа')
      return
    }

    setIsSaving(true)
    try {
      const documentData = {
        title: formData.title,
        section: formData.section,
        tags: formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
        content: formData.content,
        status: 'published',
        createdAt: new Date().toISOString(),
      }

      console.log('Publishing document:', documentData)
      // TODO: Call Supabase to insert document
      alert('Документ опубликован!')
      router.push('/docs')
    } catch (error) {
      console.error('Error publishing document:', error)
      alert('Ошибка при публикации документа')
    } finally {
      setIsSaving(false)
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
            <h1 className="text-3xl font-bold text-slate-900">Новый документ</h1>
            <p className="text-slate-600 mt-1">Создайте и опубликуйте новый документ в базе знаний</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 mb-6 space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Название документа *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Введите название документа..."
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Section and Tags Row */}
        <div className="grid grid-cols-2 gap-6">
          {/* Section */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Раздел *
            </label>
            <select
              name="section"
              value={formData.section}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {sections.map((section) => (
                <option key={section} value={section}>
                  {section}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Теги (через запятую)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              placeholder="HR, Процесс, Важное..."
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
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
          onClick={handleSaveDraft}
          disabled={isSaving}
          className={clsx(
            'flex items-center gap-2 px-6 py-2 border border-slate-300 rounded-lg font-medium transition-colors',
            isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-50'
          )}
        >
          <Save size={18} />
          Сохранить черновик
        </button>
        <button
          onClick={handlePublish}
          disabled={isSaving}
          className={clsx(
            'flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg font-medium transition-colors',
            isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-700'
          )}
        >
          <Send size={18} />
          Опубликовать
        </button>
      </div>
    </div>
  )
}
