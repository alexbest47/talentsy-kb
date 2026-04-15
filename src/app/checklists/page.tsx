'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import {
  Plus,
  ClipboardCheck,
  Pencil,
  Trash2,
  FolderOpen,
  ChevronRight,
} from 'lucide-react'
import clsx from 'clsx'

interface Template {
  id: string
  name: string
  description: string
  created_at: string
  step_count: number
  project_count: number
  active_projects: number
}

export default function ChecklistsPage() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null)

  const supabase = createClient()

  const load = async () => {
    // Get templates
    const { data: tpls } = await supabase
      .from('checklist_templates')
      .select('*')
      .order('created_at', { ascending: false })

    if (!tpls) { setLoading(false); return }

    // Enrich with counts
    const enriched: Template[] = []
    for (const t of tpls) {
      const { count: stepCount } = await supabase
        .from('checklist_template_steps')
        .select('*', { count: 'exact', head: true })
        .eq('template_id', t.id)

      const { data: projects } = await supabase
        .from('checklist_projects')
        .select('id, status')
        .eq('template_id', t.id)

      enriched.push({
        ...t,
        step_count: stepCount || 0,
        project_count: projects?.length || 0,
        active_projects: projects?.filter((p) => p.status === 'active').length || 0,
      })
    }

    setTemplates(enriched)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const deleteTemplate = async (id: string) => {
    if (!confirm('Удалить шаблон и все его проекты?')) return
    await supabase.from('checklist_templates').delete().eq('id', id)
    load()
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Чек-листы</h1>
          <p className="text-slate-500 mt-1">
            Шаблоны процессов и проекты на их основе
          </p>
        </div>
        <button
          onClick={() => { setEditingTemplate(null); setShowCreate(true) }}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus size={18} />
          Новый шаблон
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-400">Загрузка...</div>
      ) : templates.length === 0 ? (
        <div className="text-center py-20">
          <ClipboardCheck size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500 text-lg">Пока нет шаблонов</p>
          <p className="text-slate-400 mt-1">
            Создайте первый шаблон чек-листа, например &laquo;Вывод нового
            сотрудника&raquo;
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {templates.map((t) => (
            <div
              key={t.id}
              className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <Link
                  href={`/checklists/${t.id}`}
                  className="flex-1 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <ClipboardCheck size={20} className="text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 group-hover:text-purple-600 transition-colors">
                        {t.name}
                      </h3>
                      {t.description && (
                        <p className="text-slate-500 text-sm mt-0.5">
                          {t.description}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>

                <div className="flex items-center gap-1 ml-4">
                  <button
                    onClick={() => { setEditingTemplate(t); setShowCreate(true) }}
                    className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg"
                    title="Редактировать"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => deleteTemplate(t.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    title="Удалить"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-6 mt-4 text-sm text-slate-500">
                <span>{t.step_count} {stepsLabel(t.step_count)}</span>
                <span>{t.project_count} {projectsLabel(t.project_count)}</span>
                {t.active_projects > 0 && (
                  <span className="text-green-600 font-medium">
                    {t.active_projects} активн.
                  </span>
                )}
              </div>

              <Link
                href={`/checklists/${t.id}`}
                className="inline-flex items-center gap-1 mt-3 text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                Открыть <ChevronRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      )}

      {showCreate && (
        <CreateTemplateModal
          existing={editingTemplate}
          onClose={() => setShowCreate(false)}
          onSaved={load}
        />
      )}
    </div>
  )
}

function stepsLabel(n: number) {
  if (n === 1) return 'этап'
  if (n >= 2 && n <= 4) return 'этапа'
  return 'этапов'
}
function projectsLabel(n: number) {
  if (n === 1) return 'проект'
  if (n >= 2 && n <= 4) return 'проекта'
  return 'проектов'
}

function CreateTemplateModal({
  existing,
  onClose,
  onSaved,
}: {
  existing: Template | null
  onClose: () => void
  onSaved: () => void
}) {
  const isEdit = !!existing
  const [name, setName] = useState(existing?.name || '')
  const [description, setDescription] = useState(existing?.description || '')
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  const submit = async () => {
    if (!name.trim()) return
    setSaving(true)
    if (isEdit && existing) {
      await supabase
        .from('checklist_templates')
        .update({ name: name.trim(), description: description.trim(), updated_at: new Date().toISOString() })
        .eq('id', existing.id)
    } else {
      await supabase
        .from('checklist_templates')
        .insert({ name: name.trim(), description: description.trim() })
    }
    setSaving(false)
    onSaved()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-slate-900 mb-4">
          {isEdit ? 'Редактировать шаблон' : 'Новый шаблон'}
        </h2>

        <label className="block text-sm font-medium text-slate-700 mb-1">
          Название
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Вывод нового сотрудника"
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 mb-3"
          autoFocus
        />

        <label className="block text-sm font-medium text-slate-700 mb-1">
          Описание
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Необязательное описание"
          rows={3}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4 resize-none"
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            Отмена
          </button>
          <button
            onClick={submit}
            disabled={!name.trim() || saving}
            className="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {saving ? 'Сохраняем...' : isEdit ? 'Сохранить' : 'Создать'}
          </button>
        </div>
      </div>
    </div>
  )
}
