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
  status: 'draft' | 'published'
  version: number
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

// Mock data - replace with actual document fetching
const mockDocument = {
  id: '1',
  title: 'Процесс адаптации новых сотрудников',
  section: 'Общее',
  tags: 'HR, Процесс',
  status: 'published' as const,
  version: 2,
  content: {
    type: 'doc',
    content: [
      {
        type: 'heading',
        attrs: { level: 1 },
        content: [{ type: 'text', text: 'Процесс адаптации новых сотрудников' }],
      },
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Подробное описание всех этапов онбординга и интеграции новых членов команды в компанию.',
          },
        ],
      },
    ],
  },
}

export default function EditDocumentPage({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter()
  const [formData, setFormData] = useState<DocumentFormData>({
    title: mockDocument.title,
    section: mockDocument.section,
    tags: mockDocument.tags,
    content: mockDocument.content,
    status: mockDocument.status,
    version: mockDocument.version,
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

  const handleSave = async () => {
    if (!formData.title.trim()) {
      alert('Пожалуйста, введите название документа')
      return
    }

    setIsSaving(true)
    try {
      const documentData = {
        id: params.id,
        title: formData.title,
        section: formData.section,
        tags: formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
        content: formData.content,
        status: formData.status,
        updatedAt: new Date().toISOString(),
      }

      console.log('Updating document:', documentData)
      // TODO: Call Supabase to update document
      alert('Документ обновлён!')
      router.push(`/docs/${params.id}`)
    } catch (error) {
      console.error('Error saving document:', error)
      alert('Ошибка при сохранении документа')
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
        id: params.id,
        title: formData.title,
        section: formData.section,
        tags: formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
        content: formData.content,
        status: 'published' as const,
        updatedAt: new Date().toISOString(),
      }

      console.log('Publishing document:', documentData)
      // TODO: Call Supabase to update document
      alert('Документ опубликован!')
      router.push(`/docs/${params.id}`)
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
            <h1 className="text-3xl font-bold text-slate-900">Редактировать документ</h1>
            <p className="text-slate-600 mt-1">Версия {formData.version}</p>
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

        {/* Status Badge */}
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
          <p className="text-sm text-slate-600">
            <span className="font-semibold">Статус:</span>{' '}
            <span className={clsx(
              'px-2 py-0.5 rounded text-xs font-semibold',
              formData.status === 'published'
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            )}>
              {formData.status === 'published' ? 'Опубликовано' : 'Черновик'}
            </span>
          </p>
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
          onClick={handleSave}
          disabled={isSaving}
          className={clsx(
            'flex items-center gap-2 px-6 py-2 border border-slate-300 rounded-lg font-medium transition-colors',
            isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-50'
          )}
        >
          <Save size={18} />
          Сохранить
        </button>
        {formData.status === 'draft' && (
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
        )}
      </div>
    </div>
  )
}
