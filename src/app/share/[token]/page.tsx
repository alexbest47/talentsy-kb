'use client'

import { useState, useEffect } from 'react'
import { Lock } from 'lucide-react'
import Editor from '@/components/editor/editor'
import Image from 'next/image'

interface SharedDocument {
  title: string
  section: string
  author: string
  date: string
  content: any
}

// Mock data - replace with actual document fetching by token
const mockDocument: SharedDocument = {
  title: 'Процесс адаптации новых сотрудников',
  section: 'Общее',
  author: 'Иван Петров',
  date: '2024-03-28',
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

export default function SharePage({
  params,
}: {
  params: { token: string }
}) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [document, setDocument] = useState<SharedDocument | null>(null)

  useEffect(() => {
    // Simulate fetching document by token
    const fetchDocument = async () => {
      try {
        // TODO: Call Supabase to fetch document by share token
        console.log('Fetching shared document with token:', params.token)
        await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate network delay
        setDocument(mockDocument)
        setIsLoading(false)
      } catch (err) {
        console.error('Error fetching document:', err)
        setError('Документ не найден или доступ запрещен')
        setIsLoading(false)
      }
    }

    fetchDocument()
  }, [params.token])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block p-4 bg-slate-700 rounded-full mb-4">
            <div className="w-8 h-8 border-4 border-purple-400 border-t-purple-600 rounded-full animate-spin"></div>
          </div>
          <p className="text-slate-300">Загрузка документа...</p>
        </div>
      </div>
    )
  }

  if (error || !document) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="inline-block p-4 bg-red-500/20 rounded-full mb-4">
            <Lock size={32} className="text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Доступ запрещен</h1>
          <p className="text-slate-400">
            {error || 'Не удалось загрузить документ. Проверьте ссылку и попробуйте снова.'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Top Bar */}
      <div className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur border-b border-slate-700/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <h1 className="text-lg font-bold text-white">Talentsy KB</h1>
            </div>
            <p className="text-sm text-slate-400">Общий документ</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">{document.title}</h2>
          <div className="flex items-center gap-6 text-sm text-slate-400">
            <div>
              <p className="text-slate-500 mb-0.5">Раздел</p>
              <p className="text-slate-200 font-medium">{document.section}</p>
            </div>
            <div>
              <p className="text-slate-500 mb-0.5">Автор</p>
              <p className="text-slate-200 font-medium">{document.author}</p>
            </div>
            <div>
              <p className="text-slate-500 mb-0.5">Дата</p>
              <p className="text-slate-200 font-medium">{document.date}</p>
            </div>
          </div>
        </div>

        {/* Document Content */}
        <div className="bg-white rounded-lg shadow-2xl overflow-hidden" style={{ minHeight: '600px' }}>
          <Editor content={document.content} editable={false} />
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-slate-400">
          <p className="mb-4">
            Этот документ поделен из&nbsp;
            <span className="text-purple-400 font-semibold">Talentsy KB</span>
          </p>
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Talentsy. Все права защищены.
          </p>
        </div>
      </div>
    </div>
  )
}
