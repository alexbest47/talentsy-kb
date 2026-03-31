'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Lock, FileText, Video, ExternalLink } from 'lucide-react'

const Editor = dynamic(() => import('@/components/editor/editor'), { ssr: false })

interface SharedCase {
  title: string
  productName: string
  type: 'video' | 'document'
  videoUrl?: string
  content?: any
  author: string
  date: string
}

const mockCase: SharedCase = {
  title: 'Кейс: Успешный путь выпускницы Анны М.',
  productName: 'Профессия "Психолог-консультант"',
  type: 'document',
  content: {
    type: 'doc',
    content: [
      {
        type: 'heading',
        attrs: { level: 1 },
        content: [{ type: 'text', text: 'Кейс: Успешный путь выпускницы Анны М.' }],
      },
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Этот кейс демонстрирует пример содержимого, которое будет загружено из базы данных по share-токену. Здесь будет полноценный документ с форматированием, изображениями и ссылками.',
          },
        ],
      },
    ],
  },
  author: 'Команда Talentsy',
  date: '31.03.2026',
}

export default function ShareCasePageClient() {
  const params = useParams()
  const token = params.token as string

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [caseData, setCaseData] = useState<SharedCase | null>(null)

  useEffect(() => {
    const fetchCase = async () => {
      try {
        console.log('Fetching shared case with token:', token)
        await new Promise((resolve) => setTimeout(resolve, 500))
        setCaseData(mockCase)
        setIsLoading(false)
      } catch (err) {
        console.error('Error fetching case:', err)
        setError('Документ не найден или доступ запрещен')
        setIsLoading(false)
      }
    }

    fetchCase()
  }, [token])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block p-4 bg-slate-700 rounded-full mb-4">
            <div className="w-8 h-8 border-4 border-purple-400 border-t-purple-600 rounded-full animate-spin" />
          </div>
          <p className="text-slate-300">Загрузка документа...</p>
        </div>
      </div>
    )
  }

  if (error || !caseData) {
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
      <div className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur border-b border-slate-700/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <h1 className="text-lg font-bold text-white">Talentsy KB</h1>
            </div>
            <p className="text-sm text-slate-400">Кейс программы</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-medium border border-purple-500/30">
              {caseData.type === 'video' ? <Video size={12} /> : <FileText size={12} />}
              {caseData.type === 'video' ? 'Видео-кейс' : 'Документ-кейс'}
            </span>
          </div>

          <h2 className="text-3xl font-bold text-white mb-3">{caseData.title}</h2>

          <p className="text-purple-300 text-sm mb-4">
            Программа: <span className="font-medium text-purple-200">{caseData.productName}</span>
          </p>

          <div className="flex items-center gap-6 text-sm text-slate-400">
            <div>
              <p className="text-slate-500 mb-0.5">Автор</p>
              <p className="text-slate-200 font-medium">{caseData.author}</p>
            </div>
            <div>
              <p className="text-slate-500 mb-0.5">Дата</p>
              <p className="text-slate-200 font-medium">{caseData.date}</p>
            </div>
          </div>
        </div>

        {caseData.type === 'video' && caseData.videoUrl && (
          <div className="mb-8">
            <a
              href={caseData.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
            >
              <Video size={20} />
              Смотреть видео
              <ExternalLink size={16} />
            </a>
          </div>
        )}

        {caseData.type === 'document' && caseData.content && (
          <div className="bg-white rounded-lg shadow-2xl overflow-hidden" style={{ minHeight: '500px' }}>
            <Editor content={caseData.content} editable={false} />
          </div>
        )}

        <div className="mt-12 text-center text-sm text-slate-400">
          <p className="mb-4">
            Этот кейс предоставлен программой из&nbsp;
            <span className="text-purple-400 font-semibold">Talentsy</span>
          </p>
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Talentsy. Все права защищены.
          </p>
        </div>
      </div>
    </div>
  )
}
