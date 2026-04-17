'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { FileText, ArrowLeft } from 'lucide-react'

interface StageDoc {
  id: string
  title: string
}
interface Stage {
  id: string
  title: string
  description: string
  duration?: string
  videoUrl?: string
  docs?: StageDoc[]
}
interface Training {
  title: string
  description: string
  stages: Stage[]
}

function kinescopeEmbed(url: string): string | null {
  if (!url) return null
  const m = url.match(/kinescope\.io\/(?:embed\/)?([A-Za-z0-9]+)/)
  if (m) return `https://kinescope.io/embed/${m[1]}`
  return url
}

export default function TrainingPage() {
  const params = useParams<{ slug: string }>()
  const slug = params?.slug
  const [data, setData] = useState<Training | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: { storageKey: 'sb-lbpebpdmerhvbefrbgbv-auth-token' },
      }
    )
    supabase
      .from('trainings')
      .select('title, description, stages')
      .eq('slug', slug)
      .maybeSingle()
      .then(({ data }: any) => {
        if (data) {
          setData({
            title: data.title || 'Тренинг',
            description: data.description || '',
            stages: Array.isArray(data.stages) ? data.stages : [],
          })
        } else {
          setNotFound(true)
        }
        setLoading(false)
      })
  }, [slug])

  if (loading) {
    return <div className="max-w-4xl mx-auto p-8 text-slate-500">Загрузка...</div>
  }

  if (notFound || !data) {
    return (
      <div className="max-w-4xl mx-auto">
        <Link
          href="/trainings"
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-4"
        >
          <ArrowLeft size={14} />
          Обучение и тренинги
        </Link>
        <div className="bg-white border border-slate-200 rounded-lg p-8 text-center text-slate-500">
          Тренинг не найден.
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        href="/trainings"
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-4"
      >
        <ArrowLeft size={14} />
        Обучение и тренинги
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">{data.title}</h1>
        {data.description && (
          <p className="text-slate-600">{data.description}</p>
        )}
      </div>

      {data.stages.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-lg p-8 text-center text-slate-500">
          Этапы пока не добавлены.
        </div>
      )}

      <div className="space-y-6">
        {data.stages.map((stage, idx) => {
          const embed = stage.videoUrl ? kinescopeEmbed(stage.videoUrl) : null
          return (
            <div
              key={stage.id}
              className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-purple-100 text-purple-700 text-sm font-bold">
                      {idx + 1}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900">{stage.title}</h3>
                  </div>
                  {stage.duration && (
                    <span className="text-xs text-slate-400">{stage.duration}</span>
                  )}
                </div>
              </div>

              {stage.description && (
                <p className="text-slate-600 text-sm whitespace-pre-wrap mb-4">
                  {stage.description}
                </p>
              )}

              {embed && (
                <div className="mb-4 rounded-lg overflow-hidden border border-slate-200 bg-black aspect-video">
                  <iframe
                    src={embed}
                    allow="autoplay; fullscreen; picture-in-picture; encrypted-media; gyroscope; accelerometer; clipboard-write;"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              )}

              {stage.docs && stage.docs.length > 0 && (
                <div className="pt-3 border-t border-slate-100">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                    Материалы
                  </p>
                  <div className="space-y-1.5">
                    {stage.docs.map((d) => (
                      <Link
                        key={d.id}
                        href={`/docs/${d.id}`}
                        className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-800"
                      >
                        <FileText size={14} />
                        {d.title}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
