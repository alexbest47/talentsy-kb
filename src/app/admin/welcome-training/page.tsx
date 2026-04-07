'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'
import {
  Plus,
  Trash2,
  GripVertical,
  Save,
  ArrowLeft,
  FileText,
  X,
  Search,
  Video,
} from 'lucide-react'

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
interface WelcomeTraining {
  title: string
  description: string
  stages: Stage[]
}

const uid = () => Math.random().toString(36).slice(2, 10)

function getSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

function DocPickerModal({
  onClose,
  onPick,
}: {
  onClose: () => void
  onPick: (doc: StageDoc) => void
}) {
  const [docs, setDocs] = useState<StageDoc[]>([])
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = getSupabase()
    supabase
      .from('documents')
      .select('id,title')
      .order('created_at', { ascending: false })
      .limit(200)
      .then(({ data }: any) => {
        setDocs((data as StageDoc[]) || [])
        setLoading(false)
      })
  }, [])

  const filtered = useMemo(
    () =>
      docs.filter((d) => d.title.toLowerCase().includes(q.toLowerCase())),
    [docs, q]
  )

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-lg max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-bold text-slate-900">Выберите документ</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>
        <div className="p-4 border-b">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Поиск..."
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <p className="p-4 text-center text-slate-500 text-sm">Загрузка...</p>
          ) : filtered.length === 0 ? (
            <p className="p-4 text-center text-slate-500 text-sm">Ничего не найдено</p>
          ) : (
            filtered.map((d) => (
              <button
                key={d.id}
                onClick={() => {
                  onPick(d)
                  onClose()
                }}
                className="w-full text-left px-4 py-3 hover:bg-slate-50 border-b border-slate-100 flex items-center gap-2"
              >
                <FileText size={16} className="text-slate-400" />
                <span className="text-sm text-slate-700">{d.title}</span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default function WelcomeTrainingAdminPage() {
  const [data, setData] = useState<WelcomeTraining>({
    title: 'Welcome тренинг',
    description: '',
    stages: [],
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savedAt, setSavedAt] = useState<string | null>(null)
  const [pickerForStage, setPickerForStage] = useState<string | null>(null)

  useEffect(() => {
    const supabase = getSupabase()
    supabase
      .from('welcome_training')
      .select('*')
      .eq('id', 'main')
      .single()
      .then(({ data }: any) => {
        if (data) {
          setData({
            title: data.title || 'Welcome тренинг',
            description: data.description || '',
            stages: Array.isArray(data.stages) ? data.stages : [],
          })
        }
        setLoading(false)
      })
  }, [])

  const save = async () => {
    setSaving(true)
    const supabase = getSupabase()
    await supabase
      .from('welcome_training')
      .update({
        title: data.title,
        description: data.description,
        stages: data.stages,
        updated_at: new Date().toISOString(),
      })
      .eq('id', 'main')
    setSaving(false)
    setSavedAt(new Date().toLocaleTimeString('ru-RU'))
  }

  const updateStage = (id: string, patch: Partial<Stage>) => {
    setData((d) => ({
      ...d,
      stages: d.stages.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    }))
  }

  const addStage = () => {
    setData((d) => ({
      ...d,
      stages: [
        ...d.stages,
        { id: uid(), title: 'Новый этап', description: '', docs: [] },
      ],
    }))
  }

  const removeStage = (id: string) => {
    if (!confirm('Удалить этап?')) return
    setData((d) => ({ ...d, stages: d.stages.filter((s) => s.id !== id) }))
  }

  const moveStage = (idx: number, dir: -1 | 1) => {
    setData((d) => {
      const arr = [...d.stages]
      const j = idx + dir
      if (j < 0 || j >= arr.length) return d
      ;[arr[idx], arr[j]] = [arr[j], arr[idx]]
      return { ...d, stages: arr }
    })
  }

  const addDoc = (stageId: string, doc: StageDoc) => {
    setData((d) => ({
      ...d,
      stages: d.stages.map((s) =>
        s.id === stageId
          ? {
              ...s,
              docs: [...(s.docs || []).filter((x) => x.id !== doc.id), doc],
            }
          : s
      ),
    }))
  }

  const removeDoc = (stageId: string, docId: string) => {
    setData((d) => ({
      ...d,
      stages: d.stages.map((s) =>
        s.id === stageId
          ? { ...s, docs: (s.docs || []).filter((x) => x.id !== docId) }
          : s
      ),
    }))
  }

  if (loading) {
    return <div className="max-w-4xl mx-auto p-8 text-slate-500">Загрузка...</div>
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-2"
        >
          <ArrowLeft size={14} />
          Администрирование
        </Link>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-900">
            Редактор Welcome тренинга
          </h1>
          <div className="flex items-center gap-3">
            {savedAt && (
              <span className="text-xs text-slate-500">Сохранено {savedAt}</span>
            )}
            <button
              onClick={save}
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50"
            >
              <Save size={16} />
              {saving ? 'Сохраняем...' : 'Сохранить'}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-6 mb-6 space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
            Название раздела
          </label>
          <input
            value={data.title}
            onChange={(e) => setData({ ...data, title: e.target.value })}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-base font-semibold"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
            Краткое описание
          </label>
          <textarea
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
          />
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-bold text-slate-900">Этапы</h2>
        <button
          onClick={addStage}
          className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800"
        >
          <Plus size={16} />
          Добавить этап
        </button>
      </div>

      <div className="space-y-4">
        {data.stages.map((stage, idx) => (
          <div
            key={stage.id}
            className="bg-white border border-slate-200 rounded-lg p-5"
          >
            <div className="flex items-start gap-2 mb-3">
              <div className="flex flex-col items-center pt-2">
                <button
                  onClick={() => moveStage(idx, -1)}
                  className="text-slate-400 hover:text-slate-700 text-xs"
                >
                  ▲
                </button>
                <span className="text-xs text-slate-400 font-bold">{idx + 1}</span>
                <button
                  onClick={() => moveStage(idx, 1)}
                  className="text-slate-400 hover:text-slate-700 text-xs"
                >
                  ▼
                </button>
              </div>
              <div className="flex-1 space-y-3">
                <input
                  value={stage.title}
                  onChange={(e) => updateStage(stage.id, { title: e.target.value })}
                  placeholder="Название этапа"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg font-semibold"
                />
                <input
                  value={stage.duration || ''}
                  onChange={(e) => updateStage(stage.id, { duration: e.target.value })}
                  placeholder="Продолжительность (например, 30 минут)"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
                <textarea
                  value={stage.description}
                  onChange={(e) =>
                    updateStage(stage.id, { description: e.target.value })
                  }
                  rows={3}
                  placeholder="Описание этапа..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Video size={12} /> Kinescope видео (URL или embed)
                  </label>
                  <input
                    value={stage.videoUrl || ''}
                    onChange={(e) =>
                      updateStage(stage.id, { videoUrl: e.target.value })
                    }
                    placeholder="https://kinescope.io/..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Документы
                    </label>
                    <button
                      onClick={() => setPickerForStage(stage.id)}
                      className="text-xs text-purple-600 hover:text-purple-800 font-medium"
                    >
                      + Добавить документ
                    </button>
                  </div>
                  <div className="space-y-1">
                    {(stage.docs || []).map((d) => (
                      <div
                        key={d.id}
                        className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded text-sm"
                      >
                        <div className="flex items-center gap-2 text-slate-700">
                          <FileText size={14} className="text-slate-400" />
                          {d.title}
                        </div>
                        <button
                          onClick={() => removeDoc(stage.id, d.id)}
                          className="text-slate-400 hover:text-red-600"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                    {(!stage.docs || stage.docs.length === 0) && (
                      <p className="text-xs text-slate-400 italic">
                        Документы не добавлены
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => removeStage(stage.id)}
                className="text-slate-400 hover:text-red-600 p-1"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        {data.stages.length === 0 && (
          <div className="bg-white border border-dashed border-slate-300 rounded-lg p-8 text-center text-slate-500 text-sm">
            Этапы пока не добавлены. Нажмите «Добавить этап».
          </div>
        )}
      </div>

      {pickerForStage && (
        <DocPickerModal
          onClose={() => setPickerForStage(null)}
          onPick={(doc) => addDoc(pickerForStage, doc)}
        />
      )}
    </div>
  )
}
