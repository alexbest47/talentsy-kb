'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { ArrowLeft, ChevronDown, ChevronRight, User, UserX, BarChart3, Edit2, Check, X } from 'lucide-react'
import clsx from 'clsx'
import { createClient } from '@/lib/supabase/client'

const ORG_TREE_ID = '00000000-0000-0000-0000-000000000001'

/* ─── Types ─── */
interface Person {
  id: string
  name: string
  position: string
  isVacancy?: boolean
  halfRate?: boolean
  onLeave?: boolean
  priority?: string
  vacancyDocId?: string
  keyResult?: string
  responsibilities?: string[]
  metrics?: string[]
  extra?: string
  children?: Person[]
}

interface PositionInfo {
  id: string
  position: string
  holder: string
  isVacancy: boolean
  level: number
  department: string
  reportsTo: string
  subordinates: string[]
  keyResult: string
  responsibilities: string[]
  metrics: string[]
  extra: string
}

/* ─── Helpers ─── */
function deepClone(node: Person): Person {
  return JSON.parse(JSON.stringify(node))
}

function updateNodeInTree(tree: Person, nodeId: string, updates: Partial<Person>): Person {
  const clone = deepClone(tree)
  function walk(n: Person): boolean {
    if (n.id === nodeId) { Object.assign(n, updates); return true }
    if (n.children) { for (const c of n.children) if (walk(c)) return true }
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

function extractPositions(tree: Person): PositionInfo[] {
  const results: PositionInfo[] = []

  function walk(node: Person, parent: Person | null, ancestors: Person[]) {
    const currentAncestors = [...ancestors, node]
    const depth = ancestors.length

    const hasChildren = (node.children?.length || 0) > 0
    const hasData = !!(node.keyResult || (node.responsibilities && node.responsibilities.length > 0) || (node.metrics && node.metrics.length > 0))

    if (depth >= 1 && (hasChildren || hasData)) {
      results.push({
        id: node.id,
        position: node.position,
        holder: node.name || '',
        isVacancy: !!node.isVacancy,
        level: depth,
        department: getDepartment(currentAncestors),
        reportsTo: parent?.position || 'CEO',
        subordinates: (node.children || []).map((c) => c.position),
        keyResult: node.keyResult || '',
        responsibilities: node.responsibilities || [],
        metrics: node.metrics || [],
        extra: node.extra || '',
      })
    }

    if (node.children) for (const c of node.children) walk(c, node, currentAncestors)
  }

  walk(tree, null, [])
  return results
}

/* ─── One-time migration from positions table ─── */
async function migrateFromPositions(tree: Person, supabase: any): Promise<Person | null> {
  const { data: positions } = await supabase
    .from('positions')
    .select('title, key_result, responsibilities, metrics, extra')

  if (!positions || positions.length === 0) return null

  const updated = deepClone(tree)
  let changed = false

  function migrate(n: Person) {
    const hasData = !!(n.keyResult || (n.responsibilities && n.responsibilities.length > 0))
    if (!hasData) {
      const match = positions.find(
        (p: any) =>
          p.title === n.position ||
          n.position.toLowerCase().includes((p.title || '').toLowerCase()) ||
          (p.title || '').toLowerCase().includes(n.position.toLowerCase())
      )
      if (match && (match.key_result || (match.responsibilities && match.responsibilities.length))) {
        if (match.key_result) n.keyResult = match.key_result
        if (match.responsibilities && match.responsibilities.length) n.responsibilities = match.responsibilities
        if (match.metrics && match.metrics.length) n.metrics = match.metrics
        if (match.extra) n.extra = match.extra
        changed = true
      }
    }
    n.children?.forEach(migrate)
  }
  migrate(updated)

  if (changed) {
    await supabase
      .from('org_tree')
      .update({ data: updated as any, updated_at: new Date().toISOString() })
      .eq('id', ORG_TREE_ID)
    return updated
  }
  return null
}

/* ─── Position Card ─── */
function PositionCard({
  pos,
  onUpdate,
}: {
  pos: PositionInfo
  onUpdate: (id: string, updates: Partial<Person>) => Promise<void>
}) {
  const [expanded, setExpanded] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const [saving, setSaving] = useState(false)

  const handleEditStart = (field: string) => {
    setEditing(field)
    if (field === 'responsibilities') setEditValue(pos.responsibilities.join('\n'))
    else if (field === 'metrics') setEditValue(pos.metrics.join('\n'))
    else if (field === 'keyResult') setEditValue(pos.keyResult)
    else if (field === 'extra') setEditValue(pos.extra)
  }

  const handleCancel = () => {
    setEditing(null)
    setEditValue('')
  }

  const handleSave = async (field: string) => {
    setSaving(true)
    try {
      const updates: Partial<Person> = {}
      if (field === 'responsibilities') {
        updates.responsibilities = editValue.split('\n').map((s) => s.trim()).filter(Boolean)
        pos.responsibilities = updates.responsibilities
      } else if (field === 'metrics') {
        updates.metrics = editValue.split('\n').map((s) => s.trim()).filter(Boolean)
        pos.metrics = updates.metrics
      } else if (field === 'keyResult') {
        updates.keyResult = editValue
        pos.keyResult = editValue
      } else if (field === 'extra') {
        updates.extra = editValue
        pos.extra = editValue
      }
      await onUpdate(pos.id, updates)
      setEditing(null)
      setEditValue('')
    } catch (err) {
      console.error('Error saving:', err)
      alert('Ошибка при сохранении')
    } finally {
      setSaving(false)
    }
  }

  const levelColors: Record<number, string> = {
    1: 'bg-purple-100 text-purple-700',
    2: 'bg-blue-100 text-blue-700',
    3: 'bg-green-100 text-green-700',
  }
  const levelLabel = `CEO-${pos.level}`
  const levelClass = levelColors[pos.level] || 'bg-slate-100 text-slate-600'

  const renderEditor = (field: string, rows: number) => (
    <div className="space-y-2">
      <textarea
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={rows}
        placeholder={field === 'responsibilities' || field === 'metrics' ? 'По одному пункту на строку' : ''}
      />
      <div className="flex gap-2">
        <button onClick={handleCancel} disabled={saving} className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-slate-700 border border-slate-300 rounded hover:bg-slate-50">
          <X size={12} />
          Отмена
        </button>
        <button onClick={() => handleSave(field)} disabled={saving} className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700">
          <Check size={12} />
          Сохранить
        </button>
      </div>
    </div>
  )

  return (
    <div className={clsx('border rounded-lg overflow-hidden transition-shadow', pos.isVacancy ? 'border-orange-200' : 'border-slate-200', expanded && 'shadow-md')}>
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className={clsx('w-full flex items-center gap-4 p-5 text-left transition-colors', pos.isVacancy ? 'bg-orange-50 hover:bg-orange-100/70' : 'bg-white hover:bg-slate-50')}
      >
        <div className={clsx('w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0', pos.isVacancy ? 'bg-orange-200 text-orange-700' : 'bg-purple-100 text-purple-600')}>
          {pos.isVacancy ? <UserX size={20} /> : <User size={20} />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-slate-900">{pos.position}</h3>
            <span className={clsx('text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider', levelClass)}>
              {levelLabel}
            </span>
            {pos.department && pos.department !== 'Руководство' && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">{pos.department}</span>
            )}
          </div>
          <p className={clsx('text-sm mt-0.5', pos.isVacancy ? 'text-orange-600 font-medium' : 'text-slate-500')}>
            {pos.isVacancy ? 'ВАКАНСИЯ' : pos.holder}
          </p>
        </div>
        {expanded ? <ChevronDown size={20} className="text-slate-400 flex-shrink-0" /> : <ChevronRight size={20} className="text-slate-400 flex-shrink-0" />}
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="border-t border-slate-200 bg-white">
          {/* Key result */}
          <div className="p-5 bg-gradient-to-r from-purple-50 to-blue-50 border-b border-slate-100">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-2">Ключевой результат</p>
            {editing === 'keyResult' ? (
              renderEditor('keyResult', 3)
            ) : (
              <div>
                <p className="text-slate-800 font-semibold leading-relaxed mb-2">{pos.keyResult || <span className="text-slate-400 italic font-normal">Не задан</span>}</p>
                <button onClick={() => handleEditStart('keyResult')} className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700">
                  <Edit2 size={12} />
                  Редактировать
                </button>
              </div>
            )}
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 border-b border-slate-100">
            <div className="p-4 border-r border-slate-100">
              <p className="text-xs text-slate-400 mb-1">Подчиняется</p>
              <p className="text-sm font-medium text-slate-800">{pos.reportsTo}</p>
            </div>
            <div className="p-4">
              <p className="text-xs text-slate-400 mb-1">В подчинении</p>
              <div className="flex flex-wrap gap-1">
                {pos.subordinates.length === 0 ? (
                  <span className="text-xs text-slate-400 italic">Нет подчинённых</span>
                ) : (
                  pos.subordinates.map((s, i) => (
                    <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{s}</span>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Responsibilities */}
          <div className="p-5 border-b border-slate-100">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-3">Зоны ответственности</p>
            {editing === 'responsibilities' ? (
              renderEditor('responsibilities', 6)
            ) : (
              <div className="space-y-2">
                {pos.responsibilities.length === 0 ? (
                  <p className="text-sm text-slate-400 italic">Не заданы</p>
                ) : (
                  pos.responsibilities.map((item, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                      <p className="text-sm text-slate-700 leading-relaxed">{item}</p>
                    </div>
                  ))
                )}
                <button onClick={() => handleEditStart('responsibilities')} className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 mt-2">
                  <Edit2 size={12} />
                  Редактировать
                </button>
              </div>
            )}
          </div>

          {/* Metrics */}
          <div className="p-5 border-b border-slate-100">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 size={14} className="text-slate-400" />
              <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Ключевые метрики</p>
            </div>
            {editing === 'metrics' ? (
              renderEditor('metrics', 6)
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {pos.metrics.length === 0 ? (
                  <p className="text-sm text-slate-400 italic col-span-full">Не заданы</p>
                ) : (
                  pos.metrics.map((m, i) => (
                    <div key={i} className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0" />
                      <p className="text-sm text-slate-700">{m}</p>
                    </div>
                  ))
                )}
                <button onClick={() => handleEditStart('metrics')} className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 mt-2 col-span-full">
                  <Edit2 size={12} />
                  Редактировать
                </button>
              </div>
            )}
          </div>

          {/* Extra */}
          <div className="px-5 pb-5 pt-4">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-2">Дополнительная информация</p>
            {editing === 'extra' ? (
              renderEditor('extra', 3)
            ) : (
              <div>
                {pos.extra ? (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-2">
                    <p className="text-sm text-slate-700">{pos.extra}</p>
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 italic mb-2">Нет</p>
                )}
                <button onClick={() => handleEditStart('extra')} className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700">
                  <Edit2 size={12} />
                  Редактировать
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── Main Page ─── */
export default function PositionsPage() {
  const [orgTree, setOrgTree] = useState<Person | null>(null)
  const [positions, setPositions] = useState<PositionInfo[]>([])
  const [loading, setLoading] = useState(true)

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
        setPositions(extractPositions(tree))
      } catch (err) {
        console.error('Error loading positions:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleUpdateNode = useCallback(
    async (nodeId: string, updates: Partial<Person>) => {
      if (!orgTree) return
      const newTree = updateNodeInTree(orgTree, nodeId, updates)
      setOrgTree(newTree)
      const supabase = createClient()
      await supabase
        .from('org_tree')
        .update({ data: newTree as any, updated_at: new Date().toISOString() })
        .eq('id', ORG_TREE_ID)
      setPositions(extractPositions(newTree))
    },
    [orgTree]
  )

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12"><p className="text-slate-600">Загрузка должностей...</p></div>
      </div>
    )
  }

  // Group positions strictly by level
  const ceo1 = positions.filter((p) => p.level === 1)
  const ceo2 = positions.filter((p) => p.level === 2)
  const ceo3 = positions.filter((p) => p.level === 3)
  const ceo4plus = positions.filter((p) => p.level >= 4)

  // Group CEO-3 by department
  const byDept: Record<string, PositionInfo[]> = {}
  for (const p of ceo3) {
    if (!byDept[p.department]) byDept[p.department] = []
    byDept[p.department].push(p)
  }
  const deptOrder = Object.keys(byDept).sort()

  // Group CEO-4+ by exact level
  const byLevel: Record<number, PositionInfo[]> = {}
  for (const p of ceo4plus) {
    if (!byLevel[p.level]) byLevel[p.level] = []
    byLevel[p.level].push(p)
  }
  const deeperLevels = Object.keys(byLevel).map(Number).sort((a, b) => a - b)

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/company" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-6">
        <ArrowLeft size={16} />
        Назад к разделу компании
      </Link>

      <h1 className="text-3xl font-bold text-slate-900 mb-2">Описание должностей</h1>
      <p className="text-slate-600 mb-2">
        Ключевые результаты, зоны ответственности и метрики руководителей
      </p>
      <p className="text-xs text-slate-400 mb-8">
        Данные синхронизированы с организационной структурой. Чтобы изменить название или ФИО, отредактируйте оргструктуру.
      </p>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-8">
        <div className="flex items-center gap-2">
          <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider bg-purple-100 text-purple-700">CEO-1</span>
          <span className="text-xs text-slate-500">Прямое подчинение CEO</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider bg-blue-100 text-blue-700">CEO-2</span>
          <span className="text-xs text-slate-500">2-й уровень</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider bg-green-100 text-green-700">CEO-3</span>
          <span className="text-xs text-slate-500">Руководители подразделений</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-orange-200 border border-orange-300" />
          <span className="text-xs text-slate-500">Вакансия</span>
        </div>
      </div>

      {/* CEO-1 */}
      {ceo1.length > 0 && (
        <div className="mb-10">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-purple-600 text-white rounded-lg flex items-center justify-center text-xs font-bold">C1</span>
            Уровень CEO-1 — прямое подчинение CEO
          </h2>
          <div className="space-y-3">
            {ceo1.map((pos) => <PositionCard key={pos.id} pos={pos} onUpdate={handleUpdateNode} />)}
          </div>
        </div>
      )}

      {/* CEO-2 */}
      {ceo2.length > 0 && (
        <div className="mb-10">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center text-xs font-bold">C2</span>
            Уровень CEO-2 — 2-й уровень руководства
          </h2>
          <div className="space-y-3">
            {ceo2.map((pos) => <PositionCard key={pos.id} pos={pos} onUpdate={handleUpdateNode} />)}
          </div>
        </div>
      )}

      {/* CEO-3 */}
      {ceo3.length > 0 && (
        <div className="mb-10">
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 bg-green-600 text-white rounded-lg flex items-center justify-center text-xs font-bold">C3</span>
            Уровень CEO-3 — руководители подразделений
          </h2>
          {deptOrder.map((dept) => (
            <div key={dept} className="mb-6">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3 pl-1">{dept}</h3>
              <div className="space-y-3">
                {byDept[dept].map((pos) => <PositionCard key={pos.id} pos={pos} onUpdate={handleUpdateNode} />)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CEO-4+ */}
      {deeperLevels.map((lvl) => (
        <div key={lvl} className="mb-10">
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 bg-slate-600 text-white rounded-lg flex items-center justify-center text-xs font-bold">C{lvl}</span>
            Уровень CEO-{lvl}
          </h2>
          <div className="space-y-3">
            {byLevel[lvl].map((pos) => <PositionCard key={pos.id} pos={pos} onUpdate={handleUpdateNode} />)}
          </div>
        </div>
      ))}

      {positions.length === 0 && (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-lg">
          <p className="text-slate-600">Нет должностей для отображения</p>
          <p className="text-xs text-slate-400 mt-2">Добавьте сотрудников в оргструктуру</p>
        </div>
      )}
    </div>
  )
}
