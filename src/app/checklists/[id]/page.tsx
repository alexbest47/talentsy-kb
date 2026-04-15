'use client'

import { useEffect, useState, use } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import {
  Plus,
  Trash2,
  Pencil,
  GripVertical,
  ArrowLeft,
  Check,
  X,
  FolderOpen,
  ClipboardCheck,
  ChevronRight,
  Archive,
  Play,
} from 'lucide-react'
import clsx from 'clsx'

interface Step {
  id: string
  title: string
  sort_order: number
}

interface Project {
  id: string
  name: string
  status: 'active' | 'completed' | 'archived'
  created_at: string
  progress: number
  total: number
}

interface Template {
  id: string
  name: string
  description: string
}

export default function TemplatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [template, setTemplate] = useState<Template | null>(null)
  const [steps, setSteps] = useState<Step[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [newStep, setNewStep] = useState('')
  const [editingStep, setEditingStep] = useState<string | null>(null)
  const [editStepTitle, setEditStepTitle] = useState('')
  const [showNewProject, setShowNewProject] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')
  const [tab, setTab] = useState<'steps' | 'projects'>('projects')

  const supabase = createClient()

  const load = async () => {
    const { data: tpl } = await supabase
      .from('checklist_templates')
      .select('*')
      .eq('id', id)
      .single()
    setTemplate(tpl)

    const { data: s } = await supabase
      .from('checklist_template_steps')
      .select('*')
      .eq('template_id', id)
      .order('sort_order')
    setSteps(s || [])

    const { data: projs } = await supabase
      .from('checklist_projects')
      .select('*')
      .eq('template_id', id)
      .order('created_at', { ascending: false })

    if (projs) {
      const enriched: Project[] = []
      for (const p of projs) {
        const { data: items } = await supabase
          .from('checklist_project_items')
          .select('checked')
          .eq('project_id', p.id)
        const total = items?.length || 0
        const progress = items?.filter((i) => i.checked).length || 0
        enriched.push({ ...p, progress, total })
      }
      setProjects(enriched)
    }

    setLoading(false)
  }

  useEffect(() => { load() }, [])

  // Steps management
  const addStep = async () => {
    if (!newStep.trim()) return
    const maxOrder = steps.length > 0 ? Math.max(...steps.map((s) => s.sort_order)) : -1
    await supabase.from('checklist_template_steps').insert({
      template_id: id,
      title: newStep.trim(),
      sort_order: maxOrder + 1,
    })
    setNewStep('')
    load()
  }

  const updateStep = async (stepId: string) => {
    if (!editStepTitle.trim()) return
    await supabase
      .from('checklist_template_steps')
      .update({ title: editStepTitle.trim() })
      .eq('id', stepId)
    setEditingStep(null)
    load()
  }

  const deleteStep = async (stepId: string) => {
    await supabase.from('checklist_template_steps').delete().eq('id', stepId)
    load()
  }

  const moveStep = async (stepId: string, dir: -1 | 1) => {
    const idx = steps.findIndex((s) => s.id === stepId)
    const swapIdx = idx + dir
    if (swapIdx < 0 || swapIdx >= steps.length) return
    const a = steps[idx]
    const b = steps[swapIdx]
    await supabase.from('checklist_template_steps').update({ sort_order: b.sort_order }).eq('id', a.id)
    await supabase.from('checklist_template_steps').update({ sort_order: a.sort_order }).eq('id', b.id)
    load()
  }

  // Project management
  const createProject = async () => {
    if (!newProjectName.trim()) return
    const { data: proj } = await supabase
      .from('checklist_projects')
      .insert({ template_id: id, name: newProjectName.trim() })
      .select()
      .single()

    if (proj && steps.length > 0) {
      const items = steps.map((s) => ({
        project_id: proj.id,
        step_id: s.id,
        title: s.title,
        sort_order: s.sort_order,
        checked: false,
      }))
      await supabase.from('checklist_project_items').insert(items)
    }

    setNewProjectName('')
    setShowNewProject(false)
    load()
  }

  const deleteProject = async (pid: string) => {
    if (!confirm('Удалить проект?')) return
    await supabase.from('checklist_projects').delete().eq('id', pid)
    load()
  }

  const archiveProject = async (pid: string) => {
    await supabase
      .from('checklist_projects')
      .update({ status: 'archived', updated_at: new Date().toISOString() })
      .eq('id', pid)
    load()
  }

  if (loading) return <div className="max-w-5xl mx-auto px-6 py-10 text-slate-400">Загрузка...</div>
  if (!template) return <div className="max-w-5xl mx-auto px-6 py-10 text-slate-500">Шаблон не найден</div>

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* Header */}
      <Link
        href="/checklists"
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-purple-600 mb-4"
      >
        <ArrowLeft size={14} /> Все чек-листы
      </Link>

      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
          <ClipboardCheck size={20} className="text-purple-600" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900">{template.name}</h1>
      </div>
      {template.description && (
        <p className="text-slate-500 mb-6 ml-[52px]">{template.description}</p>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-slate-200">
        <button
          onClick={() => setTab('projects')}
          className={clsx(
            'px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px',
            tab === 'projects'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          )}
        >
          Проекты ({projects.length})
        </button>
        <button
          onClick={() => setTab('steps')}
          className={clsx(
            'px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px',
            tab === 'steps'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          )}
        >
          Этапы шаблона ({steps.length})
        </button>
      </div>

      {/* Steps tab */}
      {tab === 'steps' && (
        <div>
          <p className="text-sm text-slate-500 mb-4">
            Определите этапы, которые будут копироваться в каждый новый проект
          </p>

          <div className="space-y-2 mb-4">
            {steps.map((step, idx) => (
              <div
                key={step.id}
                className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 group"
              >
                <span className="text-slate-400 text-sm font-mono w-6 text-center">
                  {idx + 1}
                </span>

                {editingStep === step.id ? (
                  <div className="flex-1 flex items-center gap-2">
                    <input
                      value={editStepTitle}
                      onChange={(e) => setEditStepTitle(e.target.value)}
                      className="flex-1 border border-slate-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') updateStep(step.id)
                        if (e.key === 'Escape') setEditingStep(null)
                      }}
                    />
                    <button onClick={() => updateStep(step.id)} className="p-1 text-green-600 hover:bg-green-50 rounded">
                      <Check size={14} />
                    </button>
                    <button onClick={() => setEditingStep(null)} className="p-1 text-slate-400 hover:bg-slate-100 rounded">
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="flex-1 text-sm text-slate-800">{step.title}</span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {idx > 0 && (
                        <button
                          onClick={() => moveStep(step.id, -1)}
                          className="p-1 text-slate-400 hover:text-purple-600 rounded text-xs"
                          title="Вверх"
                        >
                          ▲
                        </button>
                      )}
                      {idx < steps.length - 1 && (
                        <button
                          onClick={() => moveStep(step.id, 1)}
                          className="p-1 text-slate-400 hover:text-purple-600 rounded text-xs"
                          title="Вниз"
                        >
                          ▼
                        </button>
                      )}
                      <button
                        onClick={() => { setEditingStep(step.id); setEditStepTitle(step.title) }}
                        className="p-1 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => deleteStep(step.id)}
                        className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Add step */}
          <div className="flex items-center gap-2">
            <input
              value={newStep}
              onChange={(e) => setNewStep(e.target.value)}
              placeholder="Новый этап..."
              className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              onKeyDown={(e) => e.key === 'Enter' && addStep()}
            />
            <button
              onClick={addStep}
              disabled={!newStep.trim()}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 disabled:opacity-50"
            >
              Добавить
            </button>
          </div>
        </div>
      )}

      {/* Projects tab */}
      {tab === 'projects' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-slate-500">
              Каждый проект — это конкретный экземпляр чек-листа
            </p>
            <button
              onClick={() => setShowNewProject(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700"
            >
              <Plus size={16} /> Новый проект
            </button>
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-16">
              <FolderOpen size={40} className="mx-auto text-slate-300 mb-3" />
              <p className="text-slate-500">Пока нет проектов</p>
              {steps.length === 0 && (
                <p className="text-slate-400 text-sm mt-1">
                  Сначала добавьте этапы в шаблон
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {projects.map((p) => {
                const pct = p.total > 0 ? Math.round((p.progress / p.total) * 100) : 0
                return (
                  <div
                    key={p.id}
                    className={clsx(
                      'bg-white border rounded-xl p-4 hover:shadow-md transition-shadow',
                      p.status === 'archived' ? 'border-slate-200 opacity-60' : 'border-slate-200'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <Link
                        href={`/checklists/${id}/${p.id}`}
                        className="flex-1 group"
                      >
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-slate-900 group-hover:text-purple-600 transition-colors">
                            {p.name}
                          </h3>
                          <span
                            className={clsx(
                              'text-xs px-2 py-0.5 rounded-full font-medium',
                              p.status === 'active' && 'bg-green-100 text-green-700',
                              p.status === 'completed' && 'bg-blue-100 text-blue-700',
                              p.status === 'archived' && 'bg-slate-100 text-slate-500'
                            )}
                          >
                            {p.status === 'active' ? 'Активный' : p.status === 'completed' ? 'Завершён' : 'В архиве'}
                          </span>
                        </div>
                      </Link>
                      <div className="flex items-center gap-1">
                        {p.status === 'active' && (
                          <button
                            onClick={() => archiveProject(p.id)}
                            className="p-1.5 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg"
                            title="Архивировать"
                          >
                            <Archive size={15} />
                          </button>
                        )}
                        <button
                          onClick={() => deleteProject(p.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                          title="Удалить"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className={clsx(
                            'h-full rounded-full transition-all',
                            pct === 100 ? 'bg-green-500' : 'bg-purple-500'
                          )}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-500 font-medium w-20 text-right">
                        {p.progress}/{p.total} ({pct}%)
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-slate-400">
                        {new Date(p.created_at).toLocaleDateString('ru-RU')}
                      </span>
                      <Link
                        href={`/checklists/${id}/${p.id}`}
                        className="text-xs text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
                      >
                        Открыть <ChevronRight size={12} />
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* New project modal */}
          {showNewProject && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setShowNewProject(false)}>
              <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-xl font-bold text-slate-900 mb-4">Новый проект</h2>
                <label className="block text-sm font-medium text-slate-700 mb-1">Название</label>
                <input
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="Вывод Иванова Ивана"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && createProject()}
                />
                <div className="flex justify-end gap-2">
                  <button onClick={() => setShowNewProject(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">
                    Отмена
                  </button>
                  <button
                    onClick={createProject}
                    disabled={!newProjectName.trim()}
                    className="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                  >
                    Создать
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
