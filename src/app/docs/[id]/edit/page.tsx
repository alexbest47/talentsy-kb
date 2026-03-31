'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { ArrowLeft, Save, Lock, Unlock } from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import clsx from 'clsx'
import dynamic from 'next/dynamic'
import { createClient } from '@/lib/supabase/client'

const Editor = dynamic(() => import('@/components/editor/editor'), { ssr: false })

type DocAccess = 'internal' | 'external'

const categories = [
  'Инструкция',
  'Регламент',
  'Кейс',
  'Описание программы',
  'Описание аудитории',
]

// Tiny component that shows save status without re-rendering the whole page
function SaveStatusBadge({ statusRef }: { statusRef: React.RefObject<string> }) {
  const [display, setDisplay] = useState<string>('')

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplay(statusRef.current || '')
    }, 300)
    return () => clearInterval(interval)
  }, [statusRef])

  if (!display) return null

  return (
    <span className={clsx(
      'text-xs font-medium px-2 py-0.5 rounded transition-opacity',
      display === 'saving' && 'bg-yellow-100 text-yellow-600',
      display === 'saved' && 'bg-green-100 text-green-600',
    )}>
      {display === 'saving' ? 'Сохранение...' : 'Сохранено'}
    </span>
  )
}

export default function EditDocPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string

  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Инструкция')
  const [access, setAccess] = useState<DocAccess>('internal')
  const [content, setContent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [shareToken, setShareToken] = useState<string | null>(null)

  // All refs for auto-save — no state changes during background save
  const titleRef = useRef(title)
  const contentRef = useRef(content)
  const categoryRef = useRef(category)
  const accessRef = useRef(access)
  const shareTokenRef = useRef(shareToken)
  const dirtyRef = useRef(false)
  const savingRef = useRef(false)
  const initialLoadRef = useRef(true)
  const saveStatusRef = useRef<string>('')

  titleRef.current = title
  contentRef.current = content
  categoryRef.current = category
  accessRef.current = access
  shareTokenRef.current = shareToken

  // Mark dirty on changes (skip initial load)
  useEffect(() => {
    if (initialLoadRef.current) return
    dirtyRef.current = true
  }, [title, content, category, access])

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
      setTimeout(() => { initialLoadRef.current = false }, 500)
    }
  }

  // Background save — uses only refs, no setState calls that would re-render page
  const backgroundSave = useCallback(async () => {
    if (savingRef.current) return
    if (!titleRef.current.trim()) return

    savingRef.current = true
    saveStatusRef.current = 'saving'

    try {
      const supabase = createClient()

      const newShareToken = accessRef.current === 'external' && !shareTokenRef.current
        ? 'tk_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
        : accessRef.current === 'internal' ? null : shareTokenRef.current

      await supabase
        .from('documents')
        .update({
          title: titleRef.current,
          content: contentRef.current,
          category: categoryRef.current,
          access: accessRef.current,
          share_token: newShareToken,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)

      dirtyRef.current = false
      saveStatusRef.current = 'saved'
      setTimeout(() => { saveStatusRef.current = '' }, 2000)
    } catch (error) {
      console.error('Auto-save error:', error)
      saveStatusRef.current = ''
    } finally {
      savingRef.current = false
    }
  }, [id])

  // Auto-save every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (dirtyRef.current && titleRef.current.trim()) {
        backgroundSave()
      }
    }, 3000)
    return () => clearInterval(interval)
  }, [backgroundSave])

  // Manual save + redirect
  const handleSaveAndClose = async () => {
    if (!titleRef.current.trim()) return
    await backgroundSave()
    router.push(`/docs/${id}`)
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
        <SaveStatusBadge statusRef={saveStatusRef} />
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
            onClick={handleSaveAndClose}
            disabled={!title.trim()}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors"
          >
            <Save size={18} />
            Сохранить и выйти
          </button>
          <Link href={`/docs/${id}`}>
            <button className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium text-sm transition-colors">
              Назад
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
