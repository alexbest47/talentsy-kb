'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Edit, Share2, Trash2, Clock, User, Tag } from 'lucide-react'
import Editor from '@/components/editor/editor'
import ShareDialog from '@/components/documents/share-dialog'
import clsx from 'clsx'

interface DocumentData {
  id: string
  title: string
  section: string
  author: string
  date: string
  status: 'published' | 'draft' | 'archived'
  tags: string[]
  content: any
  excerpt: string
}

// Mock data - replace with actual data fetching
const mockDocument: DocumentData = {
  id: '1',
  title: 'Процесс адаптации новых сотрудников',
  section: 'Общее',
  author: 'Иван Петров',
  date: '2024-03-28',
  status: 'published',
  tags: ['HR', 'Процесс'],
  excerpt: 'Подробное описание всех этапов онбординга...',
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
      {
        type: 'heading',
        attrs: { level: 2 },
        content: [{ type: 'text', text: 'Первый день' }],
      },
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'В первый день новый сотрудник должен пройти следующие процедуры:',
          },
        ],
      },
      {
        type: 'bulletList',
        content: [
          {
            type: 'listItem',
            content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Получить доступ в офис' }] }],
          },
          {
            type: 'listItem',
            content: [
              { type: 'paragraph', content: [{ type: 'text', text: 'Получить рабочее место и оборудование' }] },
            ],
          },
          {
            type: 'listItem',
            content: [
              { type: 'paragraph', content: [{ type: 'text', text: 'Встретиться с менеджером и командой' }] },
            ],
          },
        ],
      },
      {
        type: 'heading',
        attrs: { level: 2 },
        content: [{ type: 'text', text: 'Первая неделя' }],
      },
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'На первой неделе работник проходит более детальное ознакомление с компанией и процессами.',
          },
        ],
      },
    ],
  },
}

interface ShareDialogState {
  isOpen: boolean
  shareEnabled: boolean
  shareToken: string | null
}

export default function DocumentPage({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter()
  const [shareDialog, setShareDialog] = useState<ShareDialogState>({
    isOpen: false,
    shareEnabled: false,
    shareToken: null,
  })

  const statusColors = {
    published: 'bg-green-100 text-green-800',
    draft: 'bg-yellow-100 text-yellow-800',
    archived: 'bg-gray-100 text-gray-800',
  }

  const statusLabels = {
    published: 'Опубликовано',
    draft: 'Черновик',
    archived: 'В архиве',
  }

  const document = mockDocument // TODO: Fetch document by params.id

  const handleShare = (enabled: boolean) => {
    setShareDialog({
      isOpen: false,
      shareEnabled: enabled,
      shareToken: enabled ? `token_${document.id}_${Date.now()}` : null,
    })
    console.log('Share toggled:', { enabled, token: shareDialog.shareToken })
    // TODO: Call Supabase to update document sharing settings
  }

  const handleDelete = () => {
    if (confirm('Вы уверены, что хотите удалить этот документ? Это действие невозможно отменить.')) {
      console.log('Deleting document:', document.id)
      // TODO: Call Supabase to delete document
      alert('Документ удалён')
      router.push('/docs')
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start gap-4 flex-1">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0 mt-1"
          >
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-slate-900">{document.title}</h1>
              <span
                className={clsx(
                  'px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap',
                  statusColors[document.status]
                )}
              >
                {statusLabels[document.status]}
              </span>
            </div>
            <p className="text-slate-600">{document.excerpt}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={() => router.push(`/docs/${document.id}/edit`)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-lg font-medium transition-colors"
          >
            <Edit size={18} />
            Редактировать
          </button>
          <button
            onClick={() => setShareDialog({ ...shareDialog, isOpen: true })}
            className="flex items-center gap-2 px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg font-medium transition-colors"
          >
            <Share2 size={18} />
            Поделиться
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-medium transition-colors"
          >
            <Trash2 size={18} />
            Удалить
          </button>
        </div>
      </div>

      {/* Metadata */}
      <div className="grid grid-cols-3 gap-4 mb-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
        <div>
          <p className="text-xs font-semibold text-slate-600 uppercase mb-1">Раздел</p>
          <p className="text-sm font-medium text-slate-900">{document.section}</p>
        </div>
        <div>
          <div className="flex items-center gap-1 text-xs font-semibold text-slate-600 uppercase mb-1">
            <User size={12} />
            Автор
          </div>
          <p className="text-sm font-medium text-slate-900">{document.author}</p>
        </div>
        <div>
          <div className="flex items-center gap-1 text-xs font-semibold text-slate-600 uppercase mb-1">
            <Clock size={12} />
            Дата
          </div>
          <p className="text-sm font-medium text-slate-900">{document.date}</p>
        </div>
      </div>

      {/* Tags */}
      {document.tags.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Tag size={18} className="text-slate-600" />
            <p className="text-sm font-semibold text-slate-900">Теги</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {document.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden flex flex-col" style={{ minHeight: '500px' }}>
        <Editor content={document.content} editable={false} />
      </div>

      {/* Share Dialog */}
      {shareDialog.isOpen && (
        <ShareDialog
          documentId={document.id}
          shareToken={shareDialog.shareToken}
          shareEnabled={shareDialog.shareEnabled}
          onToggleShare={handleShare}
        />
      )}
    </div>
  )
}
