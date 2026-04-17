'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'
import { GraduationCap, ArrowRight } from 'lucide-react'

interface Training {
  id: string
  slug: string
  title: string
  description: string
  stages: unknown[]
  is_published: boolean
  sort_order: number
}

export default function TrainingsHubPage() {
  const [items, setItems] = useState<Training[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: { storageKey: 'sb-lbpebpdmerhvbefrbgbv-auth-token' },
      }
    )
    supabase
      .from('trainings')
      .select('id, slug, title, description, stages, is_published, sort_order')
      .eq('is_published', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true })
      .then(({ data }: any) => {
        setItems((data as Training[]) || [])
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <div className="max-w-5xl mx-auto p-8 text-slate-500">Загрузка...</div>
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Обучение и тренинги
        </h1>
        <p className="text-slate-600">
          Программы адаптации, обучения и повышения квалификации сотрудников Talentsy.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg p-8 text-center text-slate-500">
          Тренингов пока нет. Добавьте их в разделе Администрирование.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((t) => {
            const stageCount = Array.isArray(t.stages) ? t.stages.length : 0
            return (
              <Link
                key={t.id}
                href={`/trainings/${t.slug}`}
                className="group bg-white border border-slate-200 rounded-lg p-6 hover:shadow-md hover:border-purple-200 transition-all flex flex-col"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0">
                    <GraduationCap size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-slate-900 truncate">
                      {t.title}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {stageCount} {stageCount === 1 ? 'этап' : stageCount >= 2 && stageCount <= 4 ? 'этапа' : 'этапов'}
                    </p>
                  </div>
                </div>

                {t.description && (
                  <p className="text-slate-600 text-sm flex-1 mb-4 line-clamp-3">
                    {t.description}
                  </p>
                )}

                <div className="flex items-center gap-2 text-purple-600 font-medium text-sm mt-auto group-hover:gap-3 transition-all">
                  Перейти
                  <ArrowRight size={16} />
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
