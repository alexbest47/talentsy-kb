'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Edit,
  Clock,
  User,
  Eye,
  Lock,
  Unlock,
  Copy,
  Check,
  Link as LinkIcon,
  Share2,
} from 'lucide-react'
import clsx from 'clsx'
import Editor from '@/components/editor/editor'
import ShareDialog from '@/components/documents/share-dialog'

type DocAccess = 'internal' | 'external'

interface DocumentData {
  id: string
  title: string
  category: string
  author: string
  updatedAt: string
  views: number
  access: DocAccess
  shareToken?: string
  content: any // Tiptap JSON
}

const mockDocument: DocumentData = {
  id: '1',
  title: 'Руководство по использованию платформы',
  category: 'Инструкция',
  author: 'Наталья Федорова',
  updatedAt: '2026-03-20',
  views: 1234,
  access: 'external',
  shareToken: 'tk_doc1_abc123def456',
  content: {
    type: 'doc',
    content: [
      {
        type: 'heading',
        attrs: { level: 1 },
        content: [{ type: 'text', text: 'Руководство по использованию платформы Talentsy' }],
      },
      {
        type: 'heading',
        attrs: { level: 2 },
        content: [{ type: 'text', text: 'Введение' }],
      },
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Talentsy — это инновационная платформа для управления талантами и развития персонала. Это руководство поможет вам быстро начать работу с основными функциями.',
          },
        ],
      },
      {
        type: 'heading',
        attrs: { level: 2 },
        content: [{ type: 'text', text: 'Основные разделы' }],
      },
      {
        type: 'bulletList',
        content: [
          {
            type: 'listItem',
            content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Управление кандидатами — отслеживайте весь процесс рекрутинга' }] }],
          },
          {
            type: 'listItem',
            content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Управление производительностью — устанавливайте цели и собирайте обратную связь' }] }],
          },
          {
            type: 'listItem',
            content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Развитие и обучение — создавайте планы обучения' }] }],
          },
        ],
      },
      {
        type: 'heading',
        attrs: { level: 2 },
        content: [{ type: 'text', text: 'Быстрый старт' }],
      },
      {
        type: 'orderedList',
        content: [
          {
            type: 'listItem',
            content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Войдите в систему с вашей учетной записью' }] }],
          },
          {
            type: 'listItem',
            content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Выберите необходимый модуль из боковой панели' }] }],
          },
          {
            type: 'listItem',
            content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Следуйте подсказкам в интерфейсе' }] }],
          },
        ],
      },
    ],
  },
}

export default function DocPage() {
  const params = useParams()
  const id = params?.id as string
  const [doc, setDoc] = useState(mockDocument)
  const [showShare, setShowShare] = useState(false)
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

  const handleToggleShare = (enabled: boolean) => {
    setDoc((prev) => ({
      ...prev,
      access: enabled ? 'external' : 'internal',
      shareToken: enabled
        ? prev.shareToken || 'tk_' + Math.random().toString(36).substring(2, 15)
        : prev.shareToken,
    }))
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back link */}
      <Link href="/docs" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-6">
        <ArrowLeft size={16} />
        Назад к документам
      </Link>

      {/* Document header */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2.5 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
            {doc.category}
          </span>
          <span
            className={clsx(
              'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
              doc.access === 'external'
                ? 'bg-green-100 text-green-700'
                : 'bg-slate-100 text-slate-500'
            )}
          >
            {doc.access === 'external' ? <Unlock size={10} /> : <Lock size={10} />}
            {doc.access === 'external' ? 'Внешний доступ' : 'Внутренний'}
          </span>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-4">{doc.title}</h1>

        {/* Meta */}
        <div className="flex flex-wrap gap-5 text-sm text-slate-500 mb-5">
          <span className="flex items-center gap-1.5"><User size={14} />{doc.author}</span>
          <span className="flex items-center gap-1.5"><Clock size={14} />{new Date(doc.updatedAt).toLocaleDateString('ru-RU')}</span>
          <span className="flex items-center gap-1.5"><Eye size={14} />{doc.views} просмотров</span>
        </div>

        {/* External link */}
        {shareUrl && (
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg mb-5">
            <LinkIcon size={14} className="text-green-600 flex-shrink-0" />
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 text-xs text-green-700 bg-transparent border-none outline-none font-mono truncate"
            />
            <button
              onClick={handleCopy}
              className={clsx(
                'flex-shrink-0 px-3 py-1.5 rounded text-xs font-medium transition-colors',
                copied ? 'bg-green-200 text-green-800' : 'bg-green-100 hover:bg-green-200 text-green-700'
              )}
            >
              {copied ? <><Check size={12} /> Скопировано</> : <><Copy size={12} /> Копировать</>}
            </button>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Link href={`/docs/${doc.id}/edit`}>
            <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              <Edit size={15} />
              Редактировать
            </button>
          </Link>
          <button
            onClick={() => setShowShare(true)}
            className="flex items-center gap-2 border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Share2 size={15} />
            Доступ
          </button>
        </div>
      </div>

      {/* Content rendered via Tiptap (read-only) */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden" style={{ minHeight: 400 }}>
        <Editor content={doc.content} editable={false} />
      </div>

      {/* Share dialog */}
      {showShare && (
        <div onClick={() => setShowShare(false)}>
          <ShareDialog
            documentId={doc.id}
            shareToken={doc.shareToken}
            shareEnabled={doc.access === 'external'}
            onToggleShare={handleToggleShare}
          />
        </div>
      )}
    </div>
  )
}
