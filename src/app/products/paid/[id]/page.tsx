'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import {
  ArrowLeft,
  ExternalLink,
  Plus,
  GraduationCap,
  Heart,
  Award,
  Globe,
  Target,
  BookOpen,
  FileText,
  ChevronDown,
  ChevronRight,
  Trash2,
  Edit3,
  Eye,
  X,
  Copy,
  Check,
  Lock,
  Unlock,
  Link as LinkIcon,
  Save,
  Pencil,
  FolderOpen,
} from 'lucide-react'
import clsx from 'clsx'
import { createClient } from '@/lib/supabase/client'

const Editor = dynamic(() => import('@/components/editor/editor'), { ssr: false })

type ProductTag = 'для_профессии' | 'для_себя' | 'повышение_квалификации'
type DocAccess = 'internal' | 'external'

interface DocItem {
  id: string
  title: string
  content: any
  category: string
  access: 'internal' | 'external'
  share_token: string | null
  product_id: string | null
  author: string
  created_at: string
  updated_at: string
}

interface ProductDetail {
  id: string
  name: string
  tags: ProductTag[]
  category: string
  siteUrl: string
}

const TAG_CONFIG: Record<ProductTag, { label: string; color: string; icon: React.ReactNode }> = {
  для_профессии: {
    label: 'Для профессии',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: <GraduationCap size={12} />,
  },
  для_себя: {
    label: 'Для себя',
    color: 'bg-green-100 text-green-700 border-green-200',
    icon: <Heart size={12} />,
  },
  повышение_квалификации: {
    label: 'Повышение квалификации',
    color: 'bg-purple-100 text-purple-700 border-purple-200',
    icon: <Award size={12} />,
  },
}

const productDetails: Record<string, ProductDetail> = {
  'stylist-imagemaker': { id: 'stylist-imagemaker', name: 'Стилист-имиджмейкер', tags: ['для_себя', 'для_профессии'], category: 'Стиль и имидж', siteUrl: 'https://talentsy.ru/stilist-imidzhmejker' },
  'decorator-interior': { id: 'decorator-interior', name: 'Профессия "Декоратор интерьера"', tags: ['для_себя', 'для_профессии'], category: 'Дизайн', siteUrl: 'https://talentsy.ru/dekorator-interera' },
  'spec-family-psychology': { id: 'spec-family-psychology', name: 'Специализация «Семейная психология»', tags: ['повышение_квалификации'], category: 'Психология', siteUrl: 'https://talentsy.ru/spec-semejnaya-psihologiya' },
  'family-psychologist': { id: 'family-psychologist', name: 'Профессия "Семейный психолог-консультант"', tags: ['для_профессии'], category: 'Психология', siteUrl: 'https://talentsy.ru/semejnyj-psiholog' },
  'art-therapy-from-scratch': { id: 'art-therapy-from-scratch', name: 'Арт-терапия с нуля', tags: ['для_себя', 'для_профессии'], category: 'Арт-терапия', siteUrl: 'https://talentsy.ru/art-terapiya-s-nulya' },
  'spec-art-therapy': { id: 'spec-art-therapy', name: 'Специализация "Арт-терапия"', tags: ['повышение_квалификации'], category: 'Арт-терапия', siteUrl: 'https://talentsy.ru/spec-art-terapiya' },
  'art-therapist': { id: 'art-therapist', name: 'Профессия "Арт-терапевт"', tags: ['для_профессии'], category: 'Арт-терапия', siteUrl: 'https://talentsy.ru/art-terapevt' },
  'child-psychology-parents': { id: 'child-psychology-parents', name: 'Детская психология: курс для родителей и всех интересующихся', tags: ['для_себя'], category: 'Психология', siteUrl: 'https://talentsy.ru/detskaya-psihologiya-dlya-roditelej' },
  'spec-child-psychology': { id: 'spec-child-psychology', name: 'Специализация "Детская психология"', tags: ['повышение_квалификации'], category: 'Психология', siteUrl: 'https://talentsy.ru/spec-detskaya-psihologiya' },
  'sexual-relations-course': { id: 'sexual-relations-course', name: 'Практическая психология сексуальных отношений', tags: ['для_себя'], category: 'Психология', siteUrl: 'https://talentsy.ru/psihologiya-seksualnyh-otnoshenij' },
  'spec-sexual-relations': { id: 'spec-sexual-relations', name: 'Специализация «Консультант в сфере сексуальных отношений»', tags: ['повышение_квалификации'], category: 'Психология', siteUrl: 'https://talentsy.ru/spec-konsultant-seksualnyh-otnoshenij' },
  'sexual-relations-consultant': { id: 'sexual-relations-consultant', name: 'Профессия «Консультант в сфере сексуальных отношений»', tags: ['для_профессии'], category: 'Психология', siteUrl: 'https://talentsy.ru/konsultant-seksualnyh-otnoshenij' },
  'spec-gestalt': { id: 'spec-gestalt', name: 'Специализация "Гештальт-терапия"', tags: ['повышение_квалификации'], category: 'Психология', siteUrl: 'https://talentsy.ru/spec-geshtalt-terapiya' },
  'gestalt-therapist': { id: 'gestalt-therapist', name: 'Профессия "Гештальт-терапевт"', tags: ['для_профессии'], category: 'Психология', siteUrl: 'https://talentsy.ru/geshtalt-terapevt' },
  'spec-cbt': { id: 'spec-cbt', name: 'Специализация "Когнитивно-поведенческая терапия"', tags: ['повышение_квалификации'], category: 'Психология', siteUrl: 'https://talentsy.ru/spec-kpt' },
  'cbt-therapist': { id: 'cbt-therapist', name: 'Профессия "КПТ-терапевт"', tags: ['для_профессии'], category: 'Психология', siteUrl: 'https://talentsy.ru/kpt-terapevt' },
  'psychologist-consultant': { id: 'psychologist-consultant', name: 'Профессия "Психолог-консультант"', tags: ['для_профессии', 'для_себя'], category: 'Психология', siteUrl: 'https://talentsy.ru/psiholog-konsultant' },
  'child-psychologist': { id: 'child-psychologist', name: 'Профессия "Детский Психолог-Консультант"', tags: ['для_профессии'], category: 'Психология', siteUrl: 'https://talentsy.ru/detskij-psiholog' },
  'coaching': { id: 'coaching', name: 'Коучинг', tags: ['для_профессии', 'для_себя'], category: 'Психология', siteUrl: 'https://talentsy.ru/kouching' },
  'crisis-counseling': { id: 'crisis-counseling', name: 'Кризисное консультирование', tags: ['повышение_квалификации'], category: 'Психология', siteUrl: 'https://talentsy.ru/krizisnoe-konsultirovanie' },
  'orkt': { id: 'orkt', name: 'ОРКТ', tags: ['повышение_квалификации'], category: 'Психология', siteUrl: 'https://talentsy.ru/orkt' },
  'personal-therapy': { id: 'personal-therapy', name: 'Обучающая личная терапия', tags: ['повышение_квалификации'], category: 'Психология', siteUrl: 'https://talentsy.ru/obuchayushchaya-lichnaya-terapiya' },
  'pdzhk': { id: 'pdzhk', name: 'ПДЖК', tags: ['повышение_квалификации'], category: 'Психология', siteUrl: 'https://talentsy.ru/pdzhk' },
  'fashion-designer': { id: 'fashion-designer', name: 'Профессия "Дизайнер одежды"', tags: ['для_профессии'], category: 'Дизайн', siteUrl: 'https://talentsy.ru/dizajner-odezhdy' },
  'nutritionist': { id: 'nutritionist', name: 'Профессия "Интегративный нутрициолог"', tags: ['для_профессии'], category: 'Здоровье', siteUrl: 'https://talentsy.ru/nutriciolog' },
  'supervision': { id: 'supervision', name: 'Супервизия', tags: ['повышение_квалификации'], category: 'Психология', siteUrl: 'https://talentsy.ru/superviziya' },
}

// ========== HELPERS ==========

function generateId() {
  return crypto.randomUUID()
}

function generateShareToken() {
  return 'tk_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

function TagBadge({ tag }: { tag: ProductTag }) {
  const config = TAG_CONFIG[tag]
  return (
    <span className={clsx('inline-flex items-center gap-1.5 border rounded-full font-medium px-3 py-1 text-xs', config.color)}>
      {config.icon}
      {config.label}
    </span>
  )
}

// ========== DOC CARD ==========

function DocCard({
  doc,
  onEdit,
  onDelete,
  onToggleAccess,
  onView,
}: {
  doc: DocItem
  onEdit: () => void
  onDelete: () => void
  onToggleAccess: () => void
  onView: () => void
}) {
  const [copied, setCopied] = useState(false)
  const shareUrl = doc.access === 'external' && doc.share_token
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/share/${doc.share_token}`
    : null

  const handleCopy = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr)
      return `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`
    } catch {
      return dateStr
    }
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-blue-100 text-blue-600">
          <FileText size={20} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-semibold text-slate-900 truncate">{doc.title}</h4>
            <span className={clsx(
              'flex-shrink-0 inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded',
              doc.access === 'external' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
            )}>
              {doc.access === 'external' ? <><Unlock size={9} /> Внешний</> : <><Lock size={9} /> Внутренний</>}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-xs text-slate-400">{formatDate(doc.created_at)}</span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-400">{doc.author}</span>
            <span className="text-xs font-medium px-2 py-0.5 rounded bg-blue-50 text-blue-600">
              Документ
            </span>
          </div>

          {shareUrl && (
            <div className="flex items-center gap-2 mt-2 p-2 bg-green-50 rounded-md">
              <LinkIcon size={12} className="text-green-600 flex-shrink-0" />
              <input type="text" value={shareUrl} readOnly className="flex-1 text-xs text-green-700 bg-transparent border-none outline-none font-mono truncate" />
              <button onClick={handleCopy} className={clsx('flex-shrink-0 px-2 py-1 rounded text-xs font-medium transition-colors', copied ? 'bg-green-200 text-green-800' : 'bg-green-100 hover:bg-green-200 text-green-700')}>
                {copied ? <Check size={12} /> : <Copy size={12} />}
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1 flex-shrink-0">
          <button onClick={onView} title="Просмотр" className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"><Eye size={15} /></button>
          <button onClick={onEdit} title="Редактировать" className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors"><Edit3 size={15} /></button>
          <button onClick={onToggleAccess} title={doc.access === 'external' ? 'Сделать внутренним' : 'Сделать внешним'} className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-green-600 transition-colors">
            {doc.access === 'external' ? <Unlock size={15} /> : <Lock size={15} />}
          </button>
          <button onClick={onDelete} title="Удалить" className="p-1.5 rounded hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"><Trash2 size={15} /></button>
        </div>
      </div>
    </div>
  )
}

// ========== DOC EDITOR MODAL ==========

function DocEditorModal({
  initialDoc,
  defaultCategory,
  productId,
  onClose,
}: {
  initialDoc?: DocItem | null
  defaultCategory: string
  productId: string
  onClose: (savedDoc?: DocItem) => void
}) {
  const isNew = !initialDoc
  const [title, setTitle] = useState(initialDoc?.title || '')
  const [access, setAccess] = useState<DocAccess>(initialDoc?.access || 'internal')
  const [content, setContent] = useState<any>(initialDoc?.content || null)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [saveError, setSaveError] = useState('')

  // Refs for auto-save (avoid closures capturing stale state)
  const titleRef = useRef(title)
  const contentRef = useRef(content)
  const accessRef = useRef(access)
  const docIdRef = useRef<string | null>(initialDoc?.id || null)
  const shareTokenRef = useRef<string | null>(initialDoc?.share_token || null)
  const dirtyRef = useRef(false)
  const savingRef = useRef(false)
  const saveStatusTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  titleRef.current = title
  contentRef.current = content
  accessRef.current = access

  // Mark dirty on any content/title/access change (skip initial render)
  const isFirstRender = useRef(true)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    dirtyRef.current = true
  }, [title, content, access])

  // Direct Supabase save — no parent involvement, no re-renders
  const saveToSupabase = useCallback(async () => {
    if (savingRef.current) return
    if (!titleRef.current.trim()) return

    savingRef.current = true
    setSaveStatus('saving')
    setSaveError('')

    try {
      const supabase = createClient()
      const currentAccess = accessRef.current

      // Generate share token if needed
      if (currentAccess === 'external' && !shareTokenRef.current) {
        shareTokenRef.current = generateShareToken()
      }
      if (currentAccess === 'internal') {
        shareTokenRef.current = null
      }

      if (docIdRef.current) {
        // UPDATE existing
        const { error: updateError } = await supabase
          .from('documents')
          .update({
            title: titleRef.current.trim(),
            content: contentRef.current,
            category: defaultCategory,
            access: currentAccess,
            share_token: shareTokenRef.current,
            product_id: productId,
            updated_at: new Date().toISOString(),
          })
          .eq('id', docIdRef.current)

        if (updateError) {
          console.error('Update error:', updateError)
          setSaveStatus('error')
          setSaveError(updateError.message)
          return
        }
      } else {
        // INSERT new — let Supabase generate UUID
        const { data: inserted, error: insertError } = await supabase
          .from('documents')
          .insert({
            title: titleRef.current.trim(),
            content: contentRef.current,
            category: defaultCategory,
            access: currentAccess,
            share_token: shareTokenRef.current,
            product_id: productId,
            author: 'Администратор',
          })
          .select()
          .single()

        if (insertError) {
          console.error('Insert error:', insertError)
          setSaveStatus('error')
          setSaveError(insertError.message)
          return
        }

        if (inserted) {
          docIdRef.current = inserted.id
        }
      }

      dirtyRef.current = false
      setSaveStatus('saved')

      // Clear "saved" badge after 2 seconds
      if (saveStatusTimeoutRef.current) clearTimeout(saveStatusTimeoutRef.current)
      saveStatusTimeoutRef.current = setTimeout(() => setSaveStatus('idle'), 2000)
    } catch (err) {
      console.error('Auto-save error:', err)
      setSaveStatus('error')
      setSaveError(err instanceof Error ? err.message : 'Неизвестная ошибка')
    } finally {
      savingRef.current = false
    }
  }, [defaultCategory, productId])

  // Auto-save every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (dirtyRef.current && titleRef.current.trim()) {
        saveToSupabase()
      }
    }, 3000)
    return () => clearInterval(interval)
  }, [saveToSupabase])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveStatusTimeoutRef.current) clearTimeout(saveStatusTimeoutRef.current)
    }
  }, [])

  // On close: save final state if dirty, then tell parent to refresh
  const handleClose = async () => {
    if (dirtyRef.current && titleRef.current.trim()) {
      await saveToSupabase()
    }
    // Build the final doc data so parent can update its list
    if (docIdRef.current) {
      onClose({
        id: docIdRef.current,
        title: titleRef.current.trim(),
        content: contentRef.current,
        category: defaultCategory,
        access: accessRef.current,
        share_token: shareTokenRef.current,
        product_id: productId,
        author: initialDoc?.author || 'Администратор',
        created_at: initialDoc?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
    } else {
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto py-8">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-slate-900">
              {isNew && !docIdRef.current ? 'Новый документ' : 'Редактировать документ'}
            </h2>
            {saveStatus === 'saving' && (
              <span className="text-xs font-medium px-2 py-0.5 rounded bg-yellow-100 text-yellow-600">
                Сохранение...
              </span>
            )}
            {saveStatus === 'saved' && (
              <span className="text-xs font-medium px-2 py-0.5 rounded bg-green-100 text-green-600">
                Сохранено
              </span>
            )}
            {saveStatus === 'error' && (
              <span className="text-xs font-medium px-2 py-0.5 rounded bg-red-100 text-red-600" title={saveError}>
                Ошибка сохранения
              </span>
            )}
          </div>
          <button onClick={handleClose} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"><X size={20} /></button>
        </div>

        <div className="px-6 py-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Название *</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Название документа..." className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400" />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Доступ</label>
              <div className="flex gap-2">
                <button onClick={() => setAccess('internal')} className={clsx('flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition-colors', access === 'internal' ? 'bg-slate-100 border-slate-300 text-slate-700' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300')}>
                  <Lock size={14} /> Внутренний
                </button>
                <button onClick={() => setAccess('external')} className={clsx('flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition-colors', access === 'external' ? 'bg-green-50 border-green-300 text-green-700' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300')}>
                  <Unlock size={14} /> Внешний
                </button>
              </div>
            </div>
          </div>

          <div className={clsx('p-3 rounded-lg text-xs border', access === 'external' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-slate-50 border-slate-200 text-slate-600')}>
            {access === 'external' ? (
              <p><strong>Внешний доступ:</strong> Уникальная ссылка для просмотра любым пользователем в интернете (без редактирования).</p>
            ) : (
              <p><strong>Внутренний доступ:</strong> Документ доступен только сотрудникам компании.</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Содержание</label>
            <div className="border border-slate-200 rounded-lg overflow-hidden" style={{ minHeight: 350 }}>
              <Editor content={content} onUpdate={(json) => setContent(json)} editable={true} />
            </div>
          </div>
        </div>

        {saveError && (
          <div className="mx-6 mb-0 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600">
            Ошибка: {saveError}
          </div>
        )}

        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-xl">
          <button
            onClick={() => saveToSupabase()}
            disabled={saveStatus === 'saving' || !title.trim()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Save size={16} />
            {saveStatus === 'saving' ? 'Сохранение...' : 'Сохранить'}
          </button>
          <button onClick={handleClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors">Закрыть</button>
        </div>
      </div>
    </div>
  )
}

// ========== DOC VIEWER MODAL ==========

function DocViewerModal({ doc, onClose }: { doc: DocItem; onClose: () => void }) {
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr)
      return `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`
    } catch {
      return dateStr
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto py-8">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-100 text-blue-600">
              <FileText size={16} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">{doc.title}</h2>
              <p className="text-xs text-slate-500">{formatDate(doc.created_at)} • {doc.author}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"><X size={20} /></button>
        </div>
        <div className="px-6 py-4">
          {doc.content && (
            <div className="border border-slate-200 rounded-lg overflow-hidden" style={{ minHeight: 300 }}>
              <Editor content={doc.content} editable={false} />
            </div>
          )}
          {!doc.content && (
            <div className="text-center py-12 text-slate-400"><FileText size={32} className="mx-auto mb-2" /><p>Содержание пусто</p></div>
          )}
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-xl">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors">Закрыть</button>
        </div>
      </div>
    </div>
  )
}

// ========== DOCUMENT SECTION (reusable for each section type) ==========

function DocumentSection({
  title,
  icon,
  iconBg,
  iconColor,
  category,
  docs,
  onAdd,
  onEdit,
  onDelete,
  onToggleAccess,
  onView,
}: {
  title: string
  icon: React.ReactNode
  iconBg: string
  iconColor: string
  category: string
  docs: DocItem[]
  onAdd: () => void
  onEdit: (d: DocItem) => void
  onDelete: (id: string) => void
  onToggleAccess: (d: DocItem) => void
  onView: (d: DocItem) => void
}) {
  const sectionDocs = docs.filter((d) => d.category === category)

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={clsx('w-8 h-8 rounded-lg flex items-center justify-center', iconBg, iconColor)}>
            {icon}
          </div>
          <h2 className="text-xl font-bold text-slate-900">{title}</h2>
          <span className="text-sm text-slate-400">({sectionDocs.length})</span>
        </div>
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-medium transition-colors"
        >
          <Plus size={14} />
          Добавить документ
        </button>
      </div>

      {sectionDocs.length > 0 ? (
        <div className="space-y-3">
          {sectionDocs.map((d) => (
            <DocCard
              key={d.id}
              doc={d}
              onEdit={() => onEdit(d)}
              onDelete={() => onDelete(d.id)}
              onToggleAccess={() => onToggleAccess(d)}
              onView={() => onView(d)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-slate-50 border border-dashed border-slate-300 rounded-lg p-6 text-center">
          <p className="text-slate-400 text-sm">Документы ещё не добавлены</p>
        </div>
      )}
    </section>
  )
}

// ========== MAIN PAGE ==========

export default function ProductDetailPage() {
  const params = useParams()
  const productId = params.id as string
  const product = productDetails[productId]

  const [docs, setDocs] = useState<DocItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editorOpen, setEditorOpen] = useState(false)
  const [editorCategory, setEditorCategory] = useState('Описание программы')
  const [editingDoc, setEditingDoc] = useState<DocItem | null>(null)
  const [viewingDoc, setViewingDoc] = useState<DocItem | null>(null)
  const [editingProduct, setEditingProduct] = useState(false)
  const [editName, setEditName] = useState(product?.name || '')
  const [editCategory, setEditCategory] = useState(product?.category || '')
  const [editSiteUrl, setEditSiteUrl] = useState(product?.siteUrl || '')
  const [editDescription, setEditDescription] = useState('')
  const [savingProduct, setSavingProduct] = useState(false)

  // Fetch product description from Supabase
  useEffect(() => {
    const fetchProductInfo = async () => {
      const supabase = createClient()
      const { data } = await supabase.from('products').select('description').eq('slug', productId).single()
      if (data?.description) setEditDescription(data.description)
    }
    if (productId) fetchProductInfo()
  }, [productId])

  const handleSaveProduct = async () => {
    setSavingProduct(true)
    try {
      const supabase = createClient()
      await supabase.from('products').update({
        name: editName,
        category: editCategory,
        site_url: editSiteUrl,
        description: editDescription,
        updated_at: new Date().toISOString(),
      }).eq('slug', productId)
      setEditingProduct(false)
    } catch (err) {
      console.error('Error saving product:', err)
    } finally {
      setSavingProduct(false)
    }
  }

  // Fetch documents from Supabase
  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('documents')
          .select('*')
          .eq('product_id', productId)

        if (error) {
          console.error('Error fetching documents:', error)
          setDocs([])
        } else {
          setDocs(data || [])
        }
      } catch (err) {
        console.error('Error fetching documents:', err)
        setDocs([])
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      fetchDocs()
    }
  }, [productId])

  const handleAdd = (category: string) => {
    setEditorCategory(category)
    setEditingDoc(null)
    setEditorOpen(true)
  }

  const handleEdit = (d: DocItem) => {
    setEditorCategory(d.category)
    setEditingDoc(d)
    setEditorOpen(true)
  }

  // Called when the editor modal closes — refresh local docs list
  const handleEditorClose = (savedDoc?: DocItem) => {
    if (savedDoc) {
      setDocs((prev) => {
        const exists = prev.some((d) => d.id === savedDoc.id)
        if (exists) {
          return prev.map((d) => (d.id === savedDoc.id ? savedDoc : d))
        } else {
          return [...prev, savedDoc]
        }
      })
    }
    setEditorOpen(false)
    setEditingDoc(null)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Удалить этот документ?')) {
      try {
        const supabase = createClient()
        const { error } = await supabase
          .from('documents')
          .delete()
          .eq('id', id)

        if (error) {
          console.error('Error deleting document:', error)
          return
        }

        // Update local state
        setDocs((prev) => prev.filter((d) => d.id !== id))
      } catch (err) {
        console.error('Error deleting document:', err)
      }
    }
  }

  const handleToggleAccess = async (d: DocItem) => {
    const newAccess: DocAccess = d.access === 'external' ? 'internal' : 'external'
    const newShareToken = newAccess === 'external' ? (d.share_token || generateShareToken()) : null

    const updatedDoc: DocItem = {
      ...d,
      access: newAccess,
      share_token: newShareToken,
      updated_at: new Date().toISOString(),
    }

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('documents')
        .update({
          access: newAccess,
          share_token: newShareToken,
          updated_at: new Date().toISOString(),
        })
        .eq('id', d.id)

      if (error) {
        console.error('Error updating document access:', error)
        return
      }

      // Update local state
      setDocs((prev) =>
        prev.map((item) => (item.id === d.id ? updatedDoc : item))
      )
    } catch (err) {
      console.error('Error updating document access:', err)
    }
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <p className="text-slate-400 text-lg mb-4">Продукт не найден</p>
        <Link href="/products/paid" className="text-purple-600 hover:text-purple-700 font-medium text-sm">← Вернуться к списку программ</Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/products/paid" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-6">
        <ArrowLeft size={16} /> Назад к платным программам
      </Link>

      {/* Header */}
      <div className="mb-8">
        {editingProduct ? (
          <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold text-slate-900">Редактировать программу</h2>
              <button onClick={() => setEditingProduct(false)} className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                <X size={18} />
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Название программы</label>
              <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Категория</label>
                <input type="text" value={editCategory} onChange={(e) => setEditCategory(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Ссылка на сайт</label>
                <input type="text" value={editSiteUrl} onChange={(e) => setEditSiteUrl(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Описание программы</label>
              <textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} rows={4} placeholder="Краткое описание программы..." className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400 resize-none" />
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button onClick={handleSaveProduct} disabled={savingProduct || !editName.trim()} className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 text-white rounded-lg text-sm font-medium transition-colors">
                <Save size={16} />
                {savingProduct ? 'Сохранение...' : 'Сохранить'}
              </button>
              <button onClick={() => setEditingProduct(false)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors">
                Отмена
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-2 mb-3">
              {product.tags.map((tag) => (<TagBadge key={tag} tag={tag} />))}
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">{product.category}</span>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-slate-900">{editName || product.name}</h1>
              <button onClick={() => setEditingProduct(true)} title="Редактировать программу" className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-purple-600 transition-colors">
                <Pencil size={18} />
              </button>
            </div>
            {editDescription && (
              <p className="text-slate-600 text-sm mb-4">{editDescription}</p>
            )}
            <a href={editSiteUrl || product.siteUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors">
              <Globe size={16} /> Страница программы на сайте <ExternalLink size={14} />
            </a>
          </>
        )}
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400">Загрузка документов...</div>
      ) : (
        <>
          {/* Описание программы */}
          <DocumentSection
            title="Описание программы"
            icon={<BookOpen size={18} />}
            iconBg="bg-purple-100"
            iconColor="text-purple-600"
            category="Описание программы"
            docs={docs}
            onAdd={() => handleAdd('Описание программы')}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleAccess={handleToggleAccess}
            onView={(d) => setViewingDoc(d)}
          />

          {/* Описание аудитории */}
          <DocumentSection
            title="Описание аудитории"
            icon={<Target size={18} />}
            iconBg="bg-blue-100"
            iconColor="text-blue-600"
            category="Описание аудитории"
            docs={docs}
            onAdd={() => handleAdd('Описание аудитории')}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleAccess={handleToggleAccess}
            onView={(d) => setViewingDoc(d)}
          />

          {/* Кейсы */}
          <DocumentSection
            title="Кейсы по программе"
            icon={<FileText size={18} />}
            iconBg="bg-amber-100"
            iconColor="text-amber-600"
            category="Кейс"
            docs={docs}
            onAdd={() => handleAdd('Кейс')}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleAccess={handleToggleAccess}
            onView={(d) => setViewingDoc(d)}
          />

          {/* Прочие документы */}
          <DocumentSection
            title="Прочие документы"
            icon={<FolderOpen size={18} />}
            iconBg="bg-slate-100"
            iconColor="text-slate-600"
            category="Прочее"
            docs={docs}
            onAdd={() => handleAdd('Прочее')}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleAccess={handleToggleAccess}
            onView={(d) => setViewingDoc(d)}
          />

          {/* Info footer */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <p className="text-xs text-slate-500">
              Все документы сохраняются в общую базу документов системы и отображаются на странице программы.
              Документы с внешним доступом получают уникальную ссылку для просмотра. Внутренние документы
              доступны только сотрудникам.
            </p>
          </div>
        </>
      )}

      {/* Modals */}
      {editorOpen && (
        <DocEditorModal
          initialDoc={editingDoc}
          defaultCategory={editorCategory}
          productId={productId}
          onClose={handleEditorClose}
        />
      )}
      {viewingDoc && (
        <DocViewerModal doc={viewingDoc} onClose={() => setViewingDoc(null)} />
      )}
    </div>
  )
}
