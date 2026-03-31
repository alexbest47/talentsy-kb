'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
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
  Video,
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
} from 'lucide-react'
import clsx from 'clsx'
import Editor from '@/components/editor/editor'

type ProductTag = 'для_профессии' | 'для_себя' | 'повышение_квалификации'
type DocAccess = 'internal' | 'external'

interface DocItem {
  id: string
  title: string
  type: 'video' | 'document'
  access: DocAccess
  videoUrl?: string
  content?: any
  shareToken?: string
  description: string
  date: string
  author: string
  category: string // e.g. 'Описание продукта', 'Описание аудитории', 'Кейс'
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
}

// ========== HELPERS ==========

function generateId() {
  return 'doc_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now()
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
  const shareUrl = doc.access === 'external' && doc.shareToken
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/share/${doc.shareToken}`
    : null

  const handleCopy = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <div className={clsx(
          'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
          doc.type === 'video' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
        )}>
          {doc.type === 'video' ? <Video size={20} /> : <FileText size={20} />}
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
          {doc.description && (
            <p className="text-xs text-slate-500 line-clamp-1">{doc.description}</p>
          )}
          <div className="flex items-center gap-3 mt-2">
            <span className="text-xs text-slate-400">{doc.date}</span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-400">{doc.author}</span>
            <span className={clsx(
              'text-xs font-medium px-2 py-0.5 rounded',
              doc.type === 'video' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
            )}>
              {doc.type === 'video' ? 'Видео' : 'Документ'}
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
  onSave,
  onClose,
}: {
  initialDoc?: DocItem | null
  defaultCategory: string
  onSave: (data: DocItem) => void
  onClose: () => void
}) {
  const isNew = !initialDoc
  const [title, setTitle] = useState(initialDoc?.title || '')
  const [description, setDescription] = useState(initialDoc?.description || '')
  const [type, setType] = useState<'video' | 'document'>(initialDoc?.type || 'document')
  const [access, setAccess] = useState<DocAccess>(initialDoc?.access || 'internal')
  const [videoUrl, setVideoUrl] = useState(initialDoc?.videoUrl || '')
  const [content, setContent] = useState<any>(initialDoc?.content || null)

  const handleSave = () => {
    if (!title.trim()) return
    const now = new Date()
    const dateStr = `${String(now.getDate()).padStart(2, '0')}.${String(now.getMonth() + 1).padStart(2, '0')}.${now.getFullYear()}`

    const docData: DocItem = {
      id: initialDoc?.id || generateId(),
      title: title.trim(),
      description: description.trim(),
      type,
      access,
      videoUrl: type === 'video' ? videoUrl : undefined,
      content: type === 'document' ? content : undefined,
      shareToken: access === 'external' ? (initialDoc?.shareToken || generateShareToken()) : undefined,
      date: initialDoc?.date || dateStr,
      author: initialDoc?.author || 'Администратор',
      category: defaultCategory,
    }
    onSave(docData)
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto py-8">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">
            {isNew ? 'Новый документ' : 'Редактировать документ'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"><X size={20} /></button>
        </div>

        <div className="px-6 py-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Название *</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Название документа..." className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Краткое описание</label>
            <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Краткое описание для списка документов..." className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Формат</label>
              <div className="flex gap-2">
                <button onClick={() => setType('document')} className={clsx('flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition-colors', type === 'document' ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300')}>
                  <FileText size={16} /> Документ
                </button>
                <button onClick={() => setType('video')} className={clsx('flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition-colors', type === 'video' ? 'bg-red-50 border-red-300 text-red-700' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300')}>
                  <Video size={16} /> Видео
                </button>
              </div>
            </div>

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

          {type === 'video' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Ссылка на видео</label>
              <input type="url" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://youtube.com/watch?v=..." className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400" />
            </div>
          )}

          {type === 'document' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Содержание</label>
              <div className="border border-slate-200 rounded-lg overflow-hidden" style={{ minHeight: 350 }}>
                <Editor content={content} onUpdate={(json) => setContent(json)} editable={true} />
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-xl">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors">Отмена</button>
          <button onClick={handleSave} disabled={!title.trim()} className="inline-flex items-center gap-2 px-5 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 text-white rounded-lg text-sm font-medium transition-colors">
            <Save size={16} />
            {isNew ? 'Создать' : 'Сохранить'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ========== DOC VIEWER MODAL ==========

function DocViewerModal({ doc, onClose }: { doc: DocItem; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto py-8">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className={clsx('w-8 h-8 rounded-lg flex items-center justify-center', doc.type === 'video' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600')}>
              {doc.type === 'video' ? <Video size={16} /> : <FileText size={16} />}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">{doc.title}</h2>
              <p className="text-xs text-slate-500">{doc.date} • {doc.author}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"><X size={20} /></button>
        </div>
        <div className="px-6 py-4">
          {doc.type === 'video' && doc.videoUrl && (
            <a href={doc.videoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors">
              <Video size={16} /> Смотреть видео <ExternalLink size={14} />
            </a>
          )}
          {doc.type === 'document' && doc.content && (
            <div className="border border-slate-200 rounded-lg overflow-hidden" style={{ minHeight: 300 }}>
              <Editor content={doc.content} editable={false} />
            </div>
          )}
          {doc.type === 'document' && !doc.content && (
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
          <p className="text-slate-400 text-sm mb-3">Документы ещё не добавлены</p>
          <button
            onClick={onAdd}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 hover:border-purple-400 text-slate-700 rounded-lg text-sm font-medium transition-colors"
          >
            <Plus size={16} />
            Добавить документ
          </button>
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
  const [editorOpen, setEditorOpen] = useState(false)
  const [editorCategory, setEditorCategory] = useState('Описание продукта')
  const [editingDoc, setEditingDoc] = useState<DocItem | null>(null)
  const [viewingDoc, setViewingDoc] = useState<DocItem | null>(null)

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

  const handleSave = (data: DocItem) => {
    setDocs((prev) => {
      const exists = prev.find((d) => d.id === data.id)
      if (exists) return prev.map((d) => (d.id === data.id ? data : d))
      return [...prev, data]
    })
    setEditorOpen(false)
    setEditingDoc(null)
  }

  const handleDelete = (id: string) => {
    if (confirm('Удалить этот документ?')) {
      setDocs((prev) => prev.filter((d) => d.id !== id))
    }
  }

  const handleToggleAccess = (d: DocItem) => {
    setDocs((prev) =>
      prev.map((item) => {
        if (item.id !== d.id) return item
        const newAccess: DocAccess = item.access === 'external' ? 'internal' : 'external'
        return { ...item, access: newAccess, shareToken: newAccess === 'external' ? (item.shareToken || generateShareToken()) : undefined }
      })
    )
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
        <div className="flex flex-wrap gap-2 mb-3">
          {product.tags.map((tag) => (<TagBadge key={tag} tag={tag} />))}
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">{product.category}</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-4">{product.name}</h1>
        <a href={product.siteUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors">
          <Globe size={16} /> Страница программы на сайте <ExternalLink size={14} />
        </a>
      </div>

      {/* Описание продукта */}
      <DocumentSection
        title="Описание продукта"
        icon={<BookOpen size={18} />}
        iconBg="bg-purple-100"
        iconColor="text-purple-600"
        category="Описание продукта"
        docs={docs}
        onAdd={() => handleAdd('Описание продукта')}
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

      {/* Info footer */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
        <p className="text-xs text-slate-500">
          Все документы сохраняются в общую базу документов системы и отображаются на странице программы.
          Документы с внешним доступом получают уникальную ссылку для просмотра. Внутренние документы
          доступны только сотрудникам.
        </p>
      </div>

      {/* Modals */}
      {editorOpen && (
        <DocEditorModal
          initialDoc={editingDoc}
          defaultCategory={editorCategory}
          onSave={handleSave}
          onClose={() => { setEditorOpen(false); setEditingDoc(null) }}
        />
      )}
      {viewingDoc && (
        <DocViewerModal doc={viewingDoc} onClose={() => setViewingDoc(null)} />
      )}
    </div>
  )
}
