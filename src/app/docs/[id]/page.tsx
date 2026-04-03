'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Edit,
  Clock,
  User,
  Lock,
  Unlock,
  Copy,
  Check,
  Link as LinkIcon,
  Share2,
} from 'lucide-react'
import clsx from 'clsx'
import dynamic from 'next/dynamic'
import { createClient } from '@/lib/supabase/client'
import ShareDialog from '@/components/documents/share-dialog'

const Editor = dynamic(() => import('@/components/editor/editor'), { ssr: false })

type DocAccess = 'internal' | 'external'

interface DocumentData {
  id: string
  title: string
  category: string
  author: string
  updated_at: string
  access: DocAccess
  share_token?: string
  content: any
}

export default function DocPage() {
  const params = useParams()
  const id = params?.id as string
  const [doc, setDoc] = useState<DocumentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showShare, setShowShare] = useState(false)
  const [copied, setCopied] = useState(false)

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
      setDoc(data)
    } catch (error) {
      console.error('Error fetching document:', error)
    } finally {
      setLoading(false)
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

  if (!doc) {
    return (
      <div className="max-w-4xl mx-auto">
        <Link href="/docs" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-6">
          <ArrowLeft size={16} />
          Назад к документам
        </Link>
        <div className="text-center py-12">
          <p className="text-lg font-medium text-slate-700">Документ не найден</p>
        </div>
      </div>
    )
  }

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

  const handleToggleShare = async (enabled: boolean) => {
    if (!doc) return

    const newAccess = enabled ? 'external' : 'internal'
    const newToken = enabled
      ? doc.share_token || 'tk_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
      : doc.share_token

    // Optimistically update UI
    setDoc((prev) => prev ? { ...prev, access: newAccess, share_token: newToken } : null)

    // Persist to Supabase
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('documents')
        .update({
          access: newAccess,
          share_token: newToken,
          share_enabled: enabled,
        })
        .eq('id', doc.id)

      if (error) throw error
    } catch (error) {
      console.error('Error updating share settings:', error)
      // Revert on error
      setDoc((prev) => prev ? { ...prev, access: doc.access, share_token: doc.share_token } : null)
    }
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
          <span className="flex items-center gap-1.5"><Clock size={14} />{new Date(doc.updated_at).toLocaleDateString('ru-RU')}</span>
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
            shareToken={doc.share_token}
            shareEnabled={doc.access === 'external'}
            onToggleShare={handleToggleShare}
          />
        </div>
      )}
    </div>
  )
}
