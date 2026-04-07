'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  AlertCircle,
  ArrowUpCircle,
  Clock,
  MinusCircle,
  Users,
  Briefcase,
  FileText,
  ChevronDown,
  ExternalLink,
  Plus,
  Search,
  X,
  Link2,
  Unlink,
  UserPlus,
  Trash2,
} from 'lucide-react'
import clsx from 'clsx'
import { createClient } from '@/lib/supabase/client'

/* ─── Types ─── */
type Priority = 'critical' | 'high' | 'medium' | 'low'

interface Person {
  id: string
  name: string
  position: string
  isVacancy?: boolean
  halfRate?: boolean
  onLeave?: boolean
  priority?: string
  vacancyDocId?: string
  children?: Person[]
}

interface VacancyInfo {
  id: string
  position: string
  department: string
  reportsTo: string
  priority: Priority
  teamSize: number
  subordinates: string[]
  vacancyDocId: string | null
  vacancyDocTitle: string | null
}

interface DocOption {
  id: string
  title: string
  category: string | null
  updated_at: string | null
}

interface FlatPerson {
  id: string
  position: string
  name: string
  depth: number
}

/* ─── Constants ─── */
const ORG_TREE_ID = '00000000-0000-0000-0000-000000000001'

const priorityConfig: Record<Priority, { label: string; bg: string; text: string; border: string; icon: React.ReactNode; dot: string }> = {
  critical: { label: 'Критический', bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', icon: <AlertCircle size={14} />, dot: 'bg-red-500' },
  high: { label: 'Высокий', bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200', icon: <ArrowUpCircle size={14} />, dot: 'bg-orange-500' },
  medium: { label: 'Средний', bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200', icon: <Clock size={14} />, dot: 'bg-blue-500' },
  low: { label: 'Низкий', bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200', icon: <MinusCircle size={14} />, dot: 'bg-slate-400' },
}

const priorityOrder: Priority[] = ['critical', 'high', 'medium', 'low']
const prioWeight: Record<Priority, number> = { critical: 0, high: 1, medium: 2, low: 3 }

/* ─── Tree Helpers ─── */
function deepClone(node: Person): Person {
  return JSON.parse(JSON.stringify(node))
}

function updateNodeInTree(tree: Person, nodeId: string, updates: Partial<Person>): Person {
  const clone = deepClone(tree)
  function walk(n: Person): boolean {
    if (n.id === nodeId) { Object.assign(n, updates); return true }
    if (n.children) { for (const ch of n.children) if (walk(ch)) return true }
    return false
  }
  walk(clone)
  return clone
}

function insertNodeInTree(tree: Person, parentId: string, node: Person): Person {
  const clone = deepClone(tree)
  function walk(n: Person): boolean {
    if (n.id === parentId) { if (!n.children) n.children = []; n.children.push(node); return true }
    if (n.children) { for (const ch of n.children) if (walk(ch)) return true }
    return false
  }
  walk(clone)
  return clone
}

function removeNodeFromTree(tree: Person, nodeId: string): Person {
  const clone = deepClone(tree)
  function walk(parent: Person): boolean {
    if (!parent.children) return false
    const idx = parent.children.findIndex((c) => c.id === nodeId)
    if (idx !== -1) {
      const removed = parent.children[idx]
      // Reparent children to this parent
      const children = removed.children || []
      parent.children.splice(idx, 1, ...children)
      return true
    }
    for (const ch of parent.children) if (walk(ch)) return true
    return false
  }
  walk(clone)
  return clone
}

function getDepartment(ancestors: Person[]): string {
  for (let i = 1; i < ancestors.length; i++) {
    const pos = ancestors[i].position.toLowerCase()
    if (pos.includes('продаж')) return 'Продажи'
    if (pos.includes('маркет')) return 'Маркетинг'
    if (pos.includes('техн')) return 'Технология'
    if (pos.includes('продукт')) return 'Продукт'
    if (pos.includes('hr')) return 'HR'
    if (pos.includes('финанс')) return 'Финансы'
    if (pos.includes('админ')) return 'Администрация'
    if (pos.includes('коммерч') || pos.includes('cco')) return 'Коммерция'
    if (pos.includes('операцион') || pos.includes('coo')) return 'Операции'
  }
  return 'Руководство'
}

function extractVacancies(tree: Person): VacancyInfo[] {
  const results: VacancyInfo[] = []
  function walk(node: Person, parent: Person | null, ancestors: Person[]) {
    const currentAncestors = [...ancestors, node]
    if (node.isVacancy) {
      results.push({
        id: node.id,
        position: node.position,
        department: getDepartment(currentAncestors),
        reportsTo: parent?.position || '',
        priority: (node.priority as Priority) || 'medium',
        teamSize: node.children?.length || 0,
        subordinates: (node.children || []).map((c) => c.position),
        vacancyDocId: node.vacancyDocId || null,
        vacancyDocTitle: null,
      })
    }
    if (node.children) {
      for (const child of node.children) walk(child, node, currentAncestors)
    }
  }
  walk(tree, null, [])
  results.sort((a, b) => prioWeight[a.priority] - prioWeight[b.priority])
  return results
}

function flattenTree(node: Person, depth = 0): FlatPerson[] {
  const result: FlatPerson[] = [{ id: node.id, position: node.position, name: node.name || (node.isVacancy ? '(вакансия)' : ''), depth }]
  if (node.children) {
    for (const child of node.children) result.push(...flattenTree(child, depth + 1))
  }
  return result
}

/* ─── One-time migration from positions table ─── */
async function migrateFromPositions(tree: Person, supabase: any): Promise<Person | null> {
  let hasMissing = false
  function check(n: Person) {
    if (n.isVacancy && !n.priority) hasMissing = true
    n.children?.forEach(check)
  }
  check(tree)
  if (!hasMissing) return null

  const { data: positions } = await supabase
    .from('positions')
    .select('title, priority, vacancy_doc_id')
    .eq('is_vacancy', true)

  if (!positions || positions.length === 0) {
    // No positions data, just set defaults
    const updated = deepClone(tree)
    let changed = false
    function setDefaults(n: Person) {
      if (n.isVacancy && !n.priority) { n.priority = 'medium'; changed = true }
      n.children?.forEach(setDefaults)
    }
    setDefaults(updated)
    if (changed) {
      await supabase.from('org_tree').update({ data: updated as any, updated_at: new Date().toISOString() }).eq('id', ORG_TREE_ID)
      return updated
    }
    return null
  }

  const updated = deepClone(tree)
  let changed = false
  function migrate(n: Person) {
    if (n.isVacancy && !n.priority) {
      const match = positions.find(
        (p: any) =>
          p.title === n.position ||
          n.position.toLowerCase().includes(p.title.toLowerCase()) ||
          p.title.toLowerCase().includes(n.position.toLowerCase())
      )
      if (match) {
        n.priority = match.priority || 'medium'
        if (match.vacancy_doc_id) n.vacancyDocId = match.vacancy_doc_id
      } else {
        n.priority = 'medium'
      }
      changed = true
    }
    n.children?.forEach(migrate)
  }
  migrate(updated)

  if (changed) {
    await supabase.from('org_tree').update({ data: updated as any, updated_at: new Date().toISOString() }).eq('id', ORG_TREE_ID)
    return updated
  }
  return null
}

/* ─── Document Picker Modal ─── */
function DocPickerModal({
  vacancy,
  onClose,
  onSelect,
  onUnlink,
}: {
  vacancy: VacancyInfo
  onClose: () => void
  onSelect: (docId: string, docTitle: string) => void
  onUnlink: () => void
}) {
  const router = useRouter()
  const [docs, setDocs] = useState<DocOption[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('documents')
          .select('id, title, category, updated_at')
          .eq('category', 'Вакансия')
          .order('updated_at', { ascending: false })
        if (error) throw error
        setDocs(data || [])
      } catch (err) {
        console.error('Error fetching documents:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchDocs()
    setTimeout(() => searchRef.current?.focus(), 100)
  }, [])

  const filtered = search.trim() ? docs.filter((d) => d.title.toLowerCase().includes(search.toLowerCase())) : docs

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <div>
            <h3 className="text-base font-bold text-slate-900">Документ для вакансии</h3>
            <p className="text-xs text-slate-500 mt-0.5">{vacancy.position}</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
            <X size={18} className="text-slate-400" />
          </button>
        </div>

        <div className="px-5 py-3 border-b border-slate-100 flex gap-2">
          <button
            onClick={() => {
              router.push(`/docs/new?title=${encodeURIComponent('Вакансия: ' + vacancy.position)}&category=${encodeURIComponent('Вакансия')}`)
            }}
            className="flex items-center gap-1.5 px-3 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus size={15} />
            Создать новый документ
          </button>
          {vacancy.vacancyDocId && (
            <button
              onClick={() => { onUnlink(); onClose() }}
              className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 text-sm text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Unlink size={14} />
              Отвязать
            </button>
          )}
        </div>

        <div className="px-5 py-3 border-b border-slate-100">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск по документам..."
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-2">
          {loading ? (
            <div className="text-center py-8 text-sm text-slate-500">Загрузка документов...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-8 text-sm text-slate-500">{search ? 'Документы не найдены' : 'Нет документов категории «Вакансия»'}</div>
          ) : (
            <div className="space-y-0.5">
              {filtered.map((doc) => {
                const isLinked = doc.id === vacancy.vacancyDocId
                return (
                  <button
                    key={doc.id}
                    onClick={() => { onSelect(doc.id, doc.title); onClose() }}
                    className={clsx(
                      'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors',
                      isLinked ? 'bg-purple-50 border border-purple-200' : 'hover:bg-slate-50'
                    )}
                  >
                    <FileText size={16} className={isLinked ? 'text-purple-600 flex-shrink-0' : 'text-slate-400 flex-shrink-0'} />
                    <div className="min-w-0 flex-1">
                      <p className={clsx('text-sm truncate', isLinked ? 'font-medium text-purple-700' : 'text-slate-700')}>{doc.title}</p>
                    </div>
                    {isLinked && (
                      <span className="flex items-center gap-1 text-xs text-purple-600 flex-shrink-0">
                        <Link2 size={12} />
                        Привязан
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ─── Create Vacancy Modal ─── */
function CreateVacancyModal({
  people,
  onClose,
  onCreate,
}: {
  people: FlatPerson[]
  onClose: () => void
  onCreate: (position: string, parentId: string, priority: Priority) => void
}) {
  const [position, setPosition] = useState('')
  const [parentId, setParentId] = useState(people[0]?.id || '')
  const [priority, setPriority] = useState<Priority>('high')
  const [parentSearch, setParentSearch] = useState('')
  const [showParentDropdown, setShowParentDropdown] = useState(false)

  const filtered = parentSearch
    ? people.filter(
        (p) =>
          p.position.toLowerCase().includes(parentSearch.toLowerCase()) ||
          p.name.toLowerCase().includes(parentSearch.toLowerCase())
      )
    : people

  const selectedParent = people.find((p) => p.id === parentId)

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <h3 className="text-base font-bold text-slate-900">Создать вакансию</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
            <X size={18} className="text-slate-400" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Position name */}
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1.5 block">Название должности</label>
            <input
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="Например: Senior Developer"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              autoFocus
            />
          </div>

          {/* Parent selector */}
          <div className="relative">
            <label className="text-sm font-medium text-slate-700 mb-1.5 block">Руководитель (кому подчиняется)</label>
            <button
              type="button"
              onClick={() => setShowParentDropdown(!showParentDropdown)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-left flex items-center justify-between hover:bg-slate-50 transition-colors"
            >
              <span className="truncate">
                {selectedParent
                  ? `${selectedParent.position}${selectedParent.name && selectedParent.name !== '(вакансия)' ? ` — ${selectedParent.name}` : ''}`
                  : 'Выберите руководителя...'}
              </span>
              <ChevronDown size={14} className="text-slate-400 flex-shrink-0 ml-2" />
            </button>
            {showParentDropdown && (
              <div className="absolute z-20 top-full mt-1 left-0 right-0 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                <div className="p-2 border-b border-slate-100">
                  <input
                    value={parentSearch}
                    onChange={(e) => setParentSearch(e.target.value)}
                    placeholder="Поиск..."
                    className="w-full px-2 py-1.5 border border-slate-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
                {filtered.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => { setParentId(p.id); setShowParentDropdown(false); setParentSearch('') }}
                    className={clsx(
                      'w-full px-3 py-2 text-sm text-left hover:bg-slate-50 transition-colors',
                      p.id === parentId && 'bg-purple-50 font-medium'
                    )}
                  >
                    <span style={{ paddingLeft: p.depth * 16 }} className="block truncate">
                      {p.position}
                      {p.name && p.name !== '(вакансия)' && <span className="text-slate-400 ml-1">— {p.name}</span>}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Priority */}
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1.5 block">Приоритет</label>
            <div className="grid grid-cols-4 gap-2">
              {priorityOrder.map((p) => {
                const cfg = priorityConfig[p]
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={clsx(
                      'py-2 rounded-lg text-xs font-medium border transition-all text-center',
                      priority === p ? `${cfg.bg} ${cfg.text} ${cfg.border}` : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                    )}
                  >
                    {cfg.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <div className="px-5 py-4 border-t border-slate-200 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            Отмена
          </button>
          <button
            onClick={() => {
              if (position.trim() && parentId) {
                onCreate(position.trim(), parentId, priority)
                onClose()
              }
            }}
            disabled={!position.trim() || !parentId}
            className="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Создать
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── Main Page ─── */
export default function VacanciesPage() {
  const [orgTree, setOrgTree] = useState<Person | null>(null)
  const [vacancies, setVacancies] = useState<VacancyInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savingPriority, setSavingPriority] = useState<string | null>(null)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [docPickerFor, setDocPickerFor] = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)

  /* ─── Load data ─── */
  const loadDocTitles = useCallback(async (vacList: VacancyInfo[]) => {
    const docIds = vacList.map((v) => v.vacancyDocId).filter(Boolean) as string[]
    if (docIds.length === 0) return
    const supabase = createClient()
    const { data: docs } = await supabase.from('documents').select('id, title').in('id', docIds)
    if (docs) {
      const titleMap = Object.fromEntries(docs.map((d) => [d.id, d.title]))
      vacList.forEach((v) => {
        if (v.vacancyDocId) v.vacancyDocTitle = titleMap[v.vacancyDocId] || null
      })
    }
  }, [])

  useEffect(() => {
    const load = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase.from('org_tree').select('data').eq('id', ORG_TREE_ID).single()
        if (error) throw error

        let tree = data.data as Person

        // One-time migration from positions table
        const migrated = await migrateFromPositions(tree, supabase)
        if (migrated) tree = migrated

        setOrgTree(tree)

        const vacList = extractVacancies(tree)
        await loadDocTitles(vacList)
        setVacancies(vacList)
      } catch (err) {
        console.error('Error loading vacancies:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [loadDocTitles])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = () => setOpenDropdown(null)
    if (openDropdown) {
      document.addEventListener('click', handleClick)
      return () => document.removeEventListener('click', handleClick)
    }
  }, [openDropdown])

  /* ─── Save tree ─── */
  const saveTree = useCallback(async (tree: Person) => {
    setSaving(true)
    try {
      const supabase = createClient()
      await supabase.from('org_tree').update({ data: tree as any, updated_at: new Date().toISOString() }).eq('id', ORG_TREE_ID)
    } catch (err) {
      console.error('Error saving:', err)
    } finally {
      setSaving(false)
    }
  }, [])

  const refreshVacancies = useCallback(
    async (tree: Person) => {
      const vacList = extractVacancies(tree)
      await loadDocTitles(vacList)
      setVacancies(vacList)
    },
    [loadDocTitles]
  )

  /* ─── Handlers ─── */
  const handlePriorityChange = async (vacancyId: string, newPriority: Priority) => {
    setOpenDropdown(null)
    if (!orgTree) return
    const vac = vacancies.find((v) => v.id === vacancyId)
    if (vac?.priority === newPriority) return

    setSavingPriority(vacancyId)
    const newTree = updateNodeInTree(orgTree, vacancyId, { priority: newPriority })
    setOrgTree(newTree)
    await saveTree(newTree)
    await refreshVacancies(newTree)
    setSavingPriority(null)
  }

  const handleDocSelect = async (vacancyId: string, docId: string, docTitle: string) => {
    if (!orgTree) return
    const newTree = updateNodeInTree(orgTree, vacancyId, { vacancyDocId: docId })
    setOrgTree(newTree)
    await saveTree(newTree)
    setVacancies((prev) => prev.map((v) => (v.id === vacancyId ? { ...v, vacancyDocId: docId, vacancyDocTitle: docTitle } : v)))
  }

  const handleDocUnlink = async (vacancyId: string) => {
    if (!orgTree) return
    // Remove vacancyDocId from node
    const clone = deepClone(orgTree)
    function walk(n: Person): boolean {
      if (n.id === vacancyId) { delete (n as any).vacancyDocId; return true }
      if (n.children) { for (const ch of n.children) if (walk(ch)) return true }
      return false
    }
    walk(clone)
    setOrgTree(clone)
    await saveTree(clone)
    setVacancies((prev) => prev.map((v) => (v.id === vacancyId ? { ...v, vacancyDocId: null, vacancyDocTitle: null } : v)))
  }

  const handleCreateVacancy = async (position: string, parentId: string, priority: Priority) => {
    if (!orgTree) return
    const newPerson: Person = {
      id: 'v_' + Math.random().toString(36).substring(2, 10),
      name: '',
      position,
      isVacancy: true,
      priority,
    }
    const newTree = insertNodeInTree(orgTree, parentId, newPerson)
    setOrgTree(newTree)
    await saveTree(newTree)
    await refreshVacancies(newTree)
  }

  const handleDeleteVacancy = async (vacancyId: string) => {
    if (!orgTree) return
    const vac = vacancies.find((v) => v.id === vacancyId)
    const msg = vac && vac.teamSize > 0
      ? `Удалить вакансию «${vac.position}»? ${vac.teamSize} подчинённых будут перемещены к вышестоящему руководителю.`
      : `Удалить вакансию «${vac?.position || ''}»?`
    if (!confirm(msg)) return

    const newTree = removeNodeFromTree(orgTree, vacancyId)
    setOrgTree(newTree)
    await saveTree(newTree)
    await refreshVacancies(newTree)
  }

  /* ─── Render ─── */
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="text-center py-12"><p className="text-slate-600">Загрузка вакансий...</p></div>
      </div>
    )
  }

  const criticalCount = vacancies.filter((v) => v.priority === 'critical').length
  const highCount = vacancies.filter((v) => v.priority === 'high').length
  const mediumCount = vacancies.filter((v) => v.priority === 'medium').length
  const lowCount = vacancies.filter((v) => v.priority === 'low').length
  const pickerVacancy = docPickerFor ? vacancies.find((v) => v.id === docPickerFor) : null
  const flatPeople = orgTree ? flattenTree(orgTree) : []

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <Link href="/company/structure" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-4">
          <ArrowLeft size={16} />
          Назад к оргструктуре
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Открытые вакансии</h1>
            <p className="text-slate-600">Позиции, которые требуют заполнения для полноценной работы компании</p>
          </div>
          <div className="flex items-center gap-3">
            {saving && <span className="text-xs text-purple-600 animate-pulse">Сохранение...</span>}
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
            >
              <UserPlus size={16} />
              Создать вакансию
            </button>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <div className="bg-white border border-slate-200 rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-slate-900">{vacancies.length}</p>
          <p className="text-xs text-slate-500 mt-1">Всего вакансий</p>
        </div>
        {criticalCount > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-red-600">{criticalCount}</p>
            <p className="text-xs text-red-600 mt-1">Критический</p>
          </div>
        )}
        {highCount > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-orange-600">{highCount}</p>
            <p className="text-xs text-orange-600 mt-1">Высокий</p>
          </div>
        )}
        {(mediumCount > 0 || lowCount > 0) && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-blue-600">{mediumCount + lowCount}</p>
            <p className="text-xs text-blue-600 mt-1">Средний / Низкий</p>
          </div>
        )}
      </div>

      {/* Vacancy Cards */}
      {vacancies.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-lg">
          <Users size={48} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-bold text-slate-900 mb-2">Нет открытых вакансий</h3>
          <p className="text-sm text-slate-500 mb-4">Создайте вакансию или отметьте роль как вакансию в оргструктуре</p>
          <button onClick={() => setShowCreateModal(true)} className="px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors">
            <Plus size={14} className="inline mr-1" />
            Создать вакансию
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {vacancies.map((vacancy) => {
            const prio = priorityConfig[vacancy.priority]
            const isDropdownOpen = openDropdown === vacancy.id
            const isSaving = savingPriority === vacancy.id

            return (
              <div
                key={vacancy.id}
                className={clsx('bg-white border rounded-lg p-5 hover:shadow-md transition-shadow', prio.border)}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-bold text-slate-900">{vacancy.position}</h3>
                    <div className="flex flex-wrap items-center gap-3 mt-1.5 text-sm text-slate-500">
                      <span className="flex items-center gap-1"><Briefcase size={14} />{vacancy.department}</span>
                      <span className="flex items-center gap-1">
                        <Users size={14} />
                        {vacancy.teamSize > 0 ? `${vacancy.teamSize} чел. в команде` : 'Формирование команды'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Delete button */}
                    <button
                      onClick={() => handleDeleteVacancy(vacancy.id)}
                      className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Удалить вакансию"
                    >
                      <Trash2 size={15} />
                    </button>

                    {/* Priority Dropdown */}
                    <div className="relative">
                      <button
                        onClick={(e) => { e.stopPropagation(); setOpenDropdown(isDropdownOpen ? null : vacancy.id) }}
                        disabled={isSaving}
                        className={clsx(
                          'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all',
                          prio.bg, prio.text, isSaving && 'opacity-50'
                        )}
                      >
                        {prio.icon}
                        {prio.label}
                        <ChevronDown size={12} className={clsx('transition-transform', isDropdownOpen && 'rotate-180')} />
                      </button>
                      {isDropdownOpen && (
                        <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-10 py-1 min-w-[160px]">
                          {priorityOrder.map((p) => {
                            const cfg = priorityConfig[p]
                            return (
                              <button
                                key={p}
                                onClick={(e) => { e.stopPropagation(); handlePriorityChange(vacancy.id, p) }}
                                className={clsx(
                                  'w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50 transition-colors text-left',
                                  vacancy.priority === p && 'bg-slate-50 font-medium'
                                )}
                              >
                                <span className={clsx('w-2 h-2 rounded-full flex-shrink-0', cfg.dot)} />
                                <span className={cfg.text}>{cfg.label}</span>
                                {vacancy.priority === p && <span className="ml-auto text-purple-600 text-xs">&#10003;</span>}
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Document link */}
                <div className="mb-3 flex items-center gap-2">
                  {vacancy.vacancyDocId ? (
                    <>
                      <Link
                        href={`/docs/${vacancy.vacancyDocId}`}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors group"
                      >
                        <FileText size={16} className="text-purple-600" />
                        <span className="text-sm font-medium text-purple-700">{vacancy.vacancyDocTitle || 'Описание вакансии'}</span>
                        <ExternalLink size={13} className="text-purple-400 group-hover:text-purple-600 transition-colors" />
                      </Link>
                      <button
                        onClick={() => setDocPickerFor(vacancy.id)}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Сменить документ"
                      >
                        <Link2 size={15} />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setDocPickerFor(vacancy.id)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 border-dashed rounded-lg hover:bg-slate-100 transition-colors group"
                    >
                      <FileText size={16} className="text-slate-400" />
                      <span className="text-sm text-slate-500 group-hover:text-slate-700">+ Добавить описание вакансии</span>
                    </button>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <p className="text-xs text-slate-400">
                    Подчинение: <span className="text-slate-600">{vacancy.reportsTo || 'CEO'}</span>
                  </p>
                  {vacancy.subordinates.length > 0 && (
                    <p className="text-xs text-slate-400">
                      В подчинении: <span className="text-slate-600">{vacancy.subordinates.join(', ')}</span>
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Contact HR */}
      <div className="mt-10 p-6 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Знаете подходящего кандидата?</h2>
        <p className="text-slate-600 text-sm mb-4">Свяжитесь с HR-отделом для рекомендации кандидата. Мы ценим внутренние рекомендации!</p>
        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-slate-200">
            <Users size={16} className="text-purple-600" />
            <span className="text-slate-700">Немченко Денис Игоревич — HR директор</span>
          </div>
        </div>
      </div>

      {/* Modals */}
      {pickerVacancy && (
        <DocPickerModal
          vacancy={pickerVacancy}
          onClose={() => setDocPickerFor(null)}
          onSelect={(docId, docTitle) => handleDocSelect(pickerVacancy.id, docId, docTitle)}
          onUnlink={() => handleDocUnlink(pickerVacancy.id)}
        />
      )}

      {showCreateModal && orgTree && (
        <CreateVacancyModal
          people={flatPeople}
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateVacancy}
        />
      )}
    </div>
  )
}
