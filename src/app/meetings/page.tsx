'use client'

import Link from 'next/link'
import { CalendarClock } from 'lucide-react'

const DEPARTMENTS = [
  { slug: 'dreamteam', name: 'DreamTeam' },
  { slug: 'sales', name: 'Продажи' },
  { slug: 'marketing', name: 'Маркетинг' },
  { slug: 'product', name: 'Продукт' },
  { slug: 'tech', name: 'Технический' },
  { slug: 'finance', name: 'Финансы' },
  { slug: 'admin', name: 'Администрация' },
  { slug: 'hr', name: 'HR' },
]

export default function MeetingsIndex() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Планерки</h1>
        <p className="text-slate-600">
          Записи встреч и реестр принятых решений по подразделениям
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {DEPARTMENTS.map((d) => (
          <Link
            key={d.slug}
            href={`/meetings/${d.slug}`}
            className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-lg hover:border-purple-200 transition-all"
          >
            <div className="text-purple-600 mb-3">
              <CalendarClock size={28} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">{d.name}</h3>
          </Link>
        ))}
      </div>
    </div>
  )
}
