'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

// Legacy URL — перенаправляем в новую админку тренингов.
// Если welcome-запись существует, ведём сразу в её редактор; иначе — в общий список.
export default function AdminWelcomeTrainingLegacyRedirect() {
  const router = useRouter()

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
      .select('id')
      .eq('slug', 'welcome')
      .maybeSingle()
      .then(({ data }: any) => {
        if (data?.id) {
          router.replace(`/admin/trainings/${data.id}`)
        } else {
          router.replace('/admin/trainings')
        }
      })
  }, [router])

  return (
    <div className="max-w-4xl mx-auto p-8 text-slate-500">
      Перенаправление в раздел «Тренинги»...
    </div>
  )
}
