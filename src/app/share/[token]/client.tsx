'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import { createBrowserClient } from '@supabase/ssr'
import { Lock } from 'lucide-react'

const Editor = dynamic(() => import('@/components/editor/editor'), { ssr: false })

interface SharedDocument {
  id: string
  title: string
  category: string
  author: string
  created_at: string
  content: any
}

export default function SharePageClient() {
  const params = useParams()
  const token = params.token as string

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [document, setDocument] = useState<SharedDocument | null>(null)

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Create Supabase browser client
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )

        // Fetch document by share token with external access
        const { data, error: fetchError } = await supabase
          .from('documents')
          .select('*')
          .eq('share_token', token)
          .eq('access', 'external')
          .single()

        if (fetchError) {
          console.error('Error fetching document:', fetchError)
          setError('Документ не найден или доступ запрещен')
          setDocument(null)
          setIsLoading(false)
          return
        }

        if (!data) {
          setError('Документ не найден или доступ запрещен')
          setDocument(null)
          setIsLoading(false)
          return
        }

        // Map database fields to component interface
        const sharedDoc: SharedDocument = {
          id: data.id,
          title: data.title,
          category: data.category || 'Без категории',
          author: data.author || 'Неизвестный автор',
          created_at: data.created_at,
          content: data.content,
        }

        setDocument(sharedDoc)
        setError(null)
        setIsLoading(false)
      } catch (err) {
        console.error('Error fetching document:', err)
        setError('Документ не найден или доступ запрещен')
        setDocument(null)
        setIsLoading(false)
      }
    }

    if (token) {
      fetchDocument()
    }
  }, [token])

  // Format date nicely
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    } catch {
      return dateString
    }
  }

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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">{document.title}</h2>
          <div className="flex items-center gap-6 text-sm text-slate-400">
            <div>
              <p className="text-slate-500 mb-0.5">Раздел</p>
              <p className="text-slate-200 font-medium">{document.category}</p>
            </div>
            <div>
              <p className="text-slate-500 mb-0.5">Автор</p>
              <p className="text-slate-200 font-medium">{document.author}</p>
            </div>
            <div>
              <p className="text-slate-500 mb-0.5">Дата</p>
              <p className="text-slate-200 font-medium">{formatDate(document.created_at)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-2xl overflow-hidden" style={{ minHeight: '600px' }}>
          <Editor content={document.content} editable={false} />
        </div>

        <div className="mt-12 text-center text-sm text-slate-400">
          <p className="mb-4">
            Этот документ предоставлен из&nbsp;
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
