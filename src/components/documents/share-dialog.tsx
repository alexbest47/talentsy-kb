'use client'

import { useState } from 'react'
import { Copy, Check, Lock, Unlock } from 'lucide-react'
import clsx from 'clsx'

interface ShareDialogProps {
  documentId: string
  shareToken?: string | null
  shareEnabled?: boolean
  onToggleShare: (enabled: boolean) => void
}

export default function ShareDialog({
  documentId,
  shareToken,
  shareEnabled = false,
  onToggleShare,
}: ShareDialogProps) {
  const [copied, setCopied] = useState(false)

  const shareUrl = shareToken
    ? `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/share/${shareToken}`
    : null

  const handleCopyLink = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleToggleShare = () => {
    onToggleShare(!shareEnabled)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        <div className="flex items-center gap-2 mb-6">
          {shareEnabled ? (
            <Unlock className="text-purple-600" size={24} />
          ) : (
            <Lock className="text-slate-600" size={24} />
          )}
          <h2 className="text-xl font-bold text-slate-900">Доступ к документу</h2>
        </div>

        {/* Share Toggle */}
        <div className="mb-6 p-4 bg-slate-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-900 mb-1">Включить общий доступ</p>
              <p className="text-sm text-slate-600">
                Сделайте документ доступным по специальной ссылке
              </p>
            </div>
            <button
              onClick={handleToggleShare}
              className={clsx(
                'relative w-12 h-6 rounded-full transition-colors',
                shareEnabled ? 'bg-purple-600' : 'bg-slate-300'
              )}
            >
              <div
                className={clsx(
                  'absolute top-1 w-4 h-4 bg-white rounded-full transition-transform',
                  shareEnabled ? 'right-1' : 'left-1'
                )}
              />
            </button>
          </div>
        </div>

        {/* Share Link */}
        {shareEnabled && shareUrl ? (
          <div className="mb-6">
            <p className="text-sm font-semibold text-slate-900 mb-2">Ссылка для общего доступа</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 font-mono"
              />
              <button
                onClick={handleCopyLink}
                className={clsx(
                  'px-3 py-2 rounded-lg transition-colors flex items-center gap-2',
                  copied
                    ? 'bg-green-100 text-green-700'
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                )}
              >
                {copied ? (
                  <>
                    <Check size={16} />
                    <span className="text-xs font-medium">Скопировано</span>
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    <span className="text-xs font-medium">Копировать</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : null}

        {/* Info Text */}
        <div
          className={clsx(
            'p-3 rounded-lg text-sm',
            shareEnabled
              ? 'bg-purple-50 text-purple-900 border border-purple-200'
              : 'bg-slate-50 text-slate-700 border border-slate-200'
          )}
        >
          {shareEnabled ? (
            <p>
              <strong>Документ доступен публично</strong>. Любой, у кого есть ссылка, может просматривать
              содержимое (но не редактировать).
            </p>
          ) : (
            <p>
              <strong>Документ приватный</strong>. Его могут просматривать только члены команды.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
