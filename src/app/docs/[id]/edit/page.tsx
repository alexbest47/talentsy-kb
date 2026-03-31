'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Save, Lock, Unlock } from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import clsx from 'clsx'
import dynamic from 'next/dynamic'
import { createClient } from '@/lib/supabase/client'

const Editor = dynamic(() => import('@/components/editor/editor'), { ssr: false })

type DocAccess = 'internal' | 'external'

interface DocumentData {
  id: string
  title: string
  category: string
  access: DocAccess
  content: any
  share_token?: string
}

const categories = [
  'Инструкция',
  'Регламент',
  'Кейс',
  'Описание продукта',
  'Описание аудитории',
]

export default function EditDocPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string

  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Инструкция')
  const [access, setAccess] = useState<DocAccess>('internal')
  const [content, setContent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [shareToken, setShareToken] = useState<string | null>(null)

  useEffect(() => {
    fetchDocument()
  }, [id])

  const fetchDocument = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      if (data) {
        setTitle(data.title)
        setCategory(data.category)
        setAccess(data.access)
        setContent(data.content)
        setShareToken(data.share_token || null)
      }
    } catch (error) {
      console.error('Error fetching document:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!title.trim()) return

    setSaving(true)
    try {
      const supabase = createClient()

      const newShareToken = access === 'external' && !shareToken
        ? 'tk_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
        : shareToken

      const { error } = await supabase
        .from('documents')
        .update({
          title,
          content,
          category,
          access,
          share_token: newShareToken,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)

      if (error) throw error

      router.push(`/docs/${id}`)
    } catch (error) {
      console.error('Error updating document:', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <p className="text-slate-600">Загрузка документа...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <Link href={`/docs/${id}`}>
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Редактировать документ</h1>
      </div>

      <div className="space-y-5">
        {/* Title */}
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <label className="block text-sm font-semibold text-slate-900 mb-2">Название документа</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Введите название документа"
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
          />
        </div>

        {/* Category + Access */}
        <div className="grid grid-cols-2 gap-5">
          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <label className="block text-sm font-semibold text-slate-900 mb-2">Категория</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <label className="block text-sm font-semibold text-slate-900 mb-2">Доступ</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setAccess('internal')}
                className={clsx(
                  'flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium border transition-colors',
                  access === 'internal'
                    ? 'bg-slate-100 border-slate-400 text-slate-700'
                    : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                )}
              >
                <Lock size={14} />
                Внутренний
              </button>
              <button
                type="button"
                onClick={() => setAccess('external')}
                className={clsx(
                  'flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium border transition-colors',
                  access === 'external'
                    ? 'bg-green-50 border-green-400 text-green-700'
                    : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                )}
              >
                <Unlock size={14} />
                Внешний
              </button>
            </div>
          </div>
        </div>

        {/* Access info */}
        <div
          className={clsx(
            'p-3 rounded-lg text-xs border',
            access === 'external'
              ? 'bg-green-50 border-green-200 text-green-700'
              : 'bg-slate-50 border-slate-200 text-slate-600'
          )}
        >
          {access === 'external' ? (
            <p><strong>Внешний доступ:</strong> Документ доступен по ссылке любому пользователю в интернете (без редактирования).</p>
          ) : (
            <p><strong>Внутренний доступ:</strong> Документ доступен только сотрудникам компании внутри системы.</p>
          )}
        </div>

        {/* Rich Editor */}
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="px-5 pt-4 pb-2">
            <label className="block text-sm font-semibold text-slate-900">Содержание документа</label>
          </div>
          <div style={{ minHeight: 400 }}>
            <Editor content={content} onUpdate={(json) => setContent(json)} editable={true} />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={handleSave}
            disabled={!title.trim() || saving}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors"
          >
            <Save size={18} />
            {saving ? 'Сохранение...' : 'Сохранить изменения'}
          </button>
          <Link href={`/docs/${id}`}>
            <button className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium text-sm transition-colors">
              Отмена
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
