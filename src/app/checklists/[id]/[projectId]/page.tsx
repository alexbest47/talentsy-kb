'use client'

import { useEffect, useState, use } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Circle,
  ClipboardCheck,
  Pencil,
  Plus,
  X,
  PartyPopper,
} from 'lucide-react'
import clsx from 'clsx'

interface Item {
  id: string
  title: string
  checked: boolean
  sort_order: number
  checked_at: string | null
}

interface ProjectData {
  id: string
  name: string
  status: string
  template_id: string
}

interface TemplateData {
  id: string
  name: string
}

export default function ProjectPage({
  params,
}: {
  params: Promise<{ id: string; projectId: string }>
}) {
  const { id, projectId } = use(params)
  const [project, setProject] = useState<ProjectData | null>(null)
  const [template, setTemplate] = useState<TemplateData | null>(null)
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [newItem, setNewItem] = useState('')
  const [editingName, setEditingName] = useState(false)
  const [projectName, setProjectName] = useState('')

  const supabase = createClient()

  const load = async () => {
    const { data: proj } = await supabase
      .from('checklist_projects')
      .select('*')
      .eq('id', projectId)
      .single()
    setProject(proj)
    if (proj) setProjectName(proj.name)

    const { data: tpl } = await supabase
      .from('checklist_templates')
      .select('id, name')
      .eq('id', id)
      .single()
    setTemplate(tpl)

    const { data: its } = await supabase
      .from('checklist_project_items')
      .select('*')
      .eq('project_id', projectId)
      .order('sort_order')
    setItems(its || [])

    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const toggleItem = async (item: Item) => {
    const newChecked = !item.checked
    await supabase
      .from('checklist_project_items')
      .update({
        checked: newChecked,
        checked_at: newChecked ? new Date().toISOString() : null,
      })
      .eq('id', item.id)

    // Check if all done
    const updatedItems = items.map((i) =>
      i.id === item.id ? { ...i, checked: newChecked } : i
    )
    setItems(updatedItems)

    const allDone = updatedItems.every((i) => i.checked)
    if (allDone && updatedItems.length > 0) {
      await supabase
        .from('checklist_projects')
        .update({ status: 'completed', updated_at: new Date().toISOString() })
        .eq('id', projectId)
      setProject((p) => p ? { ...p, status: 'completed' } : p)
    } else if (project?.status === 'completed') {
      await supabase
        .from('checklist_projects')
        .update({ status: 'active', updated_at: new Date().toISOString() })
        .eq('id', projectId)
      setProject((p) => p ? { ...p, status: 'active' } : p)
    }
  }

  const addItem = async () => {
    if (!newItem.trim()) return
    const maxOrder = items.length > 0 ? Math.max(...items.map((i) => i.sort_order)) : -1
    await supabase.from('checklist_project_items').insert({
      project_id: projectId,
      title: newItem.trim(),
      sort_order: maxOrder + 1,
      checked: false,
    })
    setNewItem('')
    load()
  }

  const saveProjectName = async () => {
    if (!projectName.trim()) return
    await supabase
      .from('checklist_projects')
      .update({ name: projectName.trim(), updated_at: new Date().toISOString() })
      .eq('id', projectId)
    setEditingName(false)
    load()
  }

  if (loading) return <div className="max-w-3xl mx-auto px-6 py-10 text-slate-400">Загрузка...</div>
  if (!project || !template) return <div className="max-w-3xl mx-auto px-6 py-10 text-slate-500">Проект не найден</div>

  const checked = items.filter((i) => i.checked).length
  const total = items.length
  const pct = total > 0 ? Math.round((checked / total) * 100) : 0
  const allDone = total > 0 && checked === total

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
        <Link href="/checklists" className="hover:text-purple-600">Чек-листы</Link>
        <span>/</span>
        <Link href={`/checklists/${id}`} className="hover:text-purple-600">{template.name}</Link>
        <span>/</span>
        <span className="text-slate-700 font-medium">{project.name}</span>
      </div>

      {/* Project title */}
      <div className="flex items-center gap-3 mb-2">
        <div className={clsx(
          'w-10 h-10 rounded-lg flex items-center justify-center',
          allDone ? 'bg-green-100' : 'bg-purple-100'
        )}>
          {allDone ? (
            <PartyPopper size={20} className="text-green-600" />
          ) : (
            <ClipboardCheck size={20} className="text-purple-600" />
          )}
        </div>

        {editingName ? (
          <div className="flex items-center gap-2 flex-1">
            <input
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="flex-1 text-2xl font-bold border border-slate-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') saveProjectName()
                if (e.key === 'Escape') setEditingName(false)
              }}
            />
            <button onClick={saveProjectName} className="p-1 text-green-600"><Check size={18} /></button>
            <button onClick={() => setEditingName(false)} className="p-1 text-slate-400"><X size={18} /></button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">{project.name}</h1>
            <button
              onClick={() => setEditingName(true)}
              className="p-1 text-slate-400 hover:text-purple-600 rounded"
            >
              <Pencil size={15} />
            </button>
          </div>
        )}
      </div>

      {/* Status badge */}
      <div className="ml-[52px] mb-6">
        <span
          className={clsx(
            'text-xs px-2 py-0.5 rounded-full font-medium',
            project.status === 'active' && 'bg-green-100 text-green-700',
            project.status === 'completed' && 'bg-blue-100 text-blue-700',
            project.status === 'archived' && 'bg-slate-100 text-slate-500'
          )}
        >
          {project.status === 'active' ? 'Активный' : project.status === 'completed' ? 'Завершён' : 'В архиве'}
        </span>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-500">Прогресс</span>
          <span className="text-sm font-medium text-slate-700">
            {checked} из {total} ({pct}%)
          </span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
          <div
            className={clsx(
              'h-full rounded-full transition-all duration-500',
              allDone ? 'bg-green-500' : 'bg-purple-500'
            )}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {allDone && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 text-center">
          <PartyPopper size={24} className="mx-auto text-green-600 mb-2" />
          <p className="text-green-800 font-medium">Все этапы выполнены!</p>
        </div>
      )}

      {/* Items */}
      <div className="space-y-2 mb-4">
        {items.map((item, idx) => (
          <div
            key={item.id}
            className={clsx(
              'flex items-start gap-3 p-3 rounded-lg border transition-colors group',
              item.checked
                ? 'bg-slate-50 border-slate-200'
                : 'bg-white border-slate-200 hover:border-purple-300'
            )}
          >
            <button
              onClick={() => toggleItem(item)}
              className={clsx(
                'mt-0.5 flex-shrink-0 transition-colors',
                item.checked ? 'text-green-500' : 'text-slate-300 hover:text-purple-500'
              )}
            >
              {item.checked ? <CheckCircle2 size={22} /> : <Circle size={22} />}
            </button>

            <span
              className={clsx(
                'flex-1 text-sm',
                item.checked ? 'text-slate-400 line-through' : 'text-slate-800'
              )}
            >
              {item.title}
            </span>
            {item.checked_at && (
              <span className="text-xs text-slate-400 mt-0.5 flex-shrink-0">
                {new Date(item.checked_at).toLocaleDateString('ru-RU')}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Add item */}
      <div className="flex items-center gap-2">
        <button className="flex-shrink-0 text-slate-300">
          <Plus size={22} />
        </button>
        <input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Добавить пункт..."
          className="flex-1 border-0 border-b border-slate-200 px-1 py-2 text-sm focus:outline-none focus:border-purple-500 bg-transparent"
          onKeyDown={(e) => e.key === 'Enter' && addItem()}
        />
        {newItem.trim() && (
          <button
            onClick={addItem}
            className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700"
          >
            Добавить
          </button>
        )}
      </div>
    </div>
  )
}
