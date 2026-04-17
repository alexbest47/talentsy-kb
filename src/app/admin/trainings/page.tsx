'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  GripVertical,
  GraduationCap,
  ExternalLink,
} from 'lucide-react'

interface Training {
  id: string
  slug: string
  title: string
  description: string
  stages: unknown[]
  sort_order: number
  is_published: boolean
  updated_at: string
}

function getSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: { storageKey: 'sb-lbpebpdmerhvbefrbgbv-auth-token' },
    }
  )
}

/* Транслитерация кириллицы → slug */
function slugify(input: string): string {
  const map: Record<string, string> = {
    а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh',
    з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o',
    п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'c',
    ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
  }
  return input
    .toLowerCase()
    .trim()
    .split('')
    .map((ch) => (map[ch] !== undefined ? map[ch] : ch))
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'training'
}

function CreateTrainingModal({
  existingSlugs,
  onClose,
  onCreated,
}: {
  existingSlugs: string[]
  onClose: () => void
  onCreated: (id: string) => void
}) {
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [slugEdited, setSlugEdited] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleTitle = (v: string) => {
    setTitle(v)
    if (!slugEdited) setSlug(slugify(v))
  }

  const submit = async () => {
    setError(null)
    const cleanSlug = slugify(slug || title)
    if (!title.trim()) {
      setError('Укажите название')
      return
    }
    if (!cleanSlug) {
      setError('Некорректный slug')
      return
    }
    if (existingSlugs.includes(cleanSlug)) {
      setError(`Slug "${cleanSlug}" уже используется`)
      return
    }
    setSaving(true)
    const supabase = getSupabase()
    const { data, error: err } = await supabase
      .from('trainings')
      .insert({
        slug: cleanSlug,
        title: title.trim(),
        description: '',
        stages: [],
        sort_order: existingSlugs.length,
        is_published: false,
      })
      .select('id')
      .single()
    setSaving(false)
    if (err) {
      setError(err.message)
      return
    }
    if ((data as any)?.id) onCreated((data as any).id)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-5 border-b">
          <h3 className="font-bold text-slate-900">Новый тренинг</h3>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
              Название
            </label>
            <input
              value={title}
              onChange={(e) => handleTitle(e.target.value)}
              autoFocus
              placeholder="Например: Тренинг по продажам"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
              Slug (URL)
            </label>
            <input
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value)
                setSlugEdited(true)
              }}
              placeholder="sales-training"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono"
            />
            <p className="text-xs text-slate-400 mt-1">
              Будет доступен по /trainings/{slugify(slug || title) || '...'}
            </p>
          </div>
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
              {error}
            </div>
          )}
        </div>
        <div className="p-5 border-t flex justify-end gap-2">
          <button
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900"
          >
            Отмена
          </button>
          <button
            onClick={submit}
            disabled={saving}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50"
          >
            {saving ? 'Создаём...' : 'Создать'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminTrainingsPage() {
  const router = useRouter()
  const [items, setItems] = useState<Training[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)

  const load = async () => {
    const supabase = getSupabase()
    const { data } = await supabase
      .from('trainings')
      .select('id, slug, title, description, stages, sort_order, is_published, updated_at')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true })
    setItems((data as Training[]) || [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const togglePublished = async (t: Training) => {
    const supabase = getSupabase()
    await supabase
      .from('trainings')
      .update({ is_published: !t.is_published })
      .eq('id', t.id)
    load()
  }

  const remove = async (t: Training) => {
    if (
      !confirm(
        `Удалить тренинг «${t.title}»?\n\nЭто действие нельзя отменить.`
      )
    )
      return
    const supabase = getSupabase()
    await supabase.from('trainings').delete().eq('id', t.id)
    load()
  }

  const move = async (idx: number, dir: -1 | 1) => {
    const j = idx + dir
    if (j < 0 || j >= items.length) return
    const a = items[idx]
    const b = items[j]
    const supabase = getSupabase()
    // Меняем sort_order местами
    await supabase.from('trainings').update({ sort_order: b.sort_order }).eq('id', a.id)
    await supabase.from('trainings').update({ sort_order: a.sort_order }).eq('id', b.id)
    // Если sort_order'ы одинаковые — увеличим у второго, чтобы порядок изменился
    if (a.sort_order === b.sort_order) {
      await supabase
        .from('trainings')
        .update({ sort_order: a.sort_order + (dir === 1 ? 1 : -1) })
        .eq('id', a.id)
    }
    load()
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-2"
        >
          <ArrowLeft size={14} />
          Администрирование
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Тренинги</h1>
            <p className="text-slate-600 text-sm mt-1">
              Управление обучающими программами для сотрудников
            </p>
          </div>
          <button
            onClick={() => setCreating(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700"
          >
            <Plus size={16} />
            Добавить тренинг
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-slate-500">Загрузка...</div>
      ) : items.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-lg p-10 text-center text-slate-500">
          Тренингов пока нет. Нажмите «Добавить тренинг», чтобы создать первый.
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 text-left w-10"></th>
                <th className="px-4 py-3 text-left">Название</th>
                <th className="px-4 py-3 text-left">Slug</th>
                <th className="px-4 py-3 text-center">Этапы</th>
                <th className="px-4 py-3 text-center">Статус</th>
                <th className="px-4 py-3 text-right w-40">Действия</th>
              </tr>
            </thead>
            <tbody>
              {items.map((t, idx) => {
                const stageCount = Array.isArray(t.stages) ? t.stages.length : 0
                return (
                  <tr
                    key={t.id}
                    className="border-t border-slate-100 hover:bg-slate-50/50"
                  >
                    <td className="px-4 py-3">
                      <div className="flex flex-col items-center gap-0.5 text-slate-400">
                        <button
                          onClick={() => move(idx, -1)}
                          disabled={idx === 0}
                          className="hover:text-slate-700 disabled:opacity-30"
                          title="Переместить вверх"
                        >
                          ▲
                        </button>
                        <button
                          onClick={() => move(idx, 1)}
                          disabled={idx === items.length - 1}
                          className="hover:text-slate-700 disabled:opacity-30"
                          title="Переместить вниз"
                        >
                          ▼
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <GraduationCap size={16} className="text-purple-500" />
                        <Link
                          href={`/admin/trainings/${t.id}`}
                          className="font-medium text-slate-900 hover:text-purple-600"
                        >
                          {t.title || '(без названия)'}
                        </Link>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">
                      {t.slug}
                    </td>
                    <td className="px-4 py-3 text-center text-slate-600">
                      {stageCount}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => togglePublished(t)}
                        className={
                          t.is_published
                            ? 'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                            : 'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'
                        }
                      >
                        {t.is_published ? (
                          <>
                            <Eye size={12} /> Опубликован
                          </>
                        ) : (
                          <>
                            <EyeOff size={12} /> Черновик
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/trainings/${t.slug}`}
                          target="_blank"
                          title="Открыть на сайте"
                          className="p-1.5 text-slate-400 hover:text-slate-700 rounded"
                        >
                          <ExternalLink size={15} />
                        </Link>
                        <Link
                          href={`/admin/trainings/${t.id}`}
                          title="Редактировать"
                          className="p-1.5 text-slate-400 hover:text-purple-600 rounded"
                        >
                          <Pencil size={15} />
                        </Link>
                        <button
                          onClick={() => remove(t)}
                          title="Удалить"
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {creating && (
        <CreateTrainingModal
          existingSlugs={items.map((t) => t.slug)}
          onClose={() => setCreating(false)}
          onCreated={(id) => {
            setCreating(false)
            router.push(`/admin/trainings/${id}`)
          }}
        />
      )}
    </div>
  )
}
