'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import {
  Target,
  Plus,
  Trash2,
  Edit3,
  X,
  Save,
  Copy,
  User,
  Briefcase,
  Search,
} from 'lucide-react'
import clsx from 'clsx'

/* ─── types ─── */
interface Position {
  id: string
  title: string
  holder: string | null
  is_vacancy: boolean
  department: string | null
}

interface Goal {
  id: string
  quarter: string
  department: string
  role: string | null
  text: string
  metric: string | null
  status: string
  sort_order: number
  position_id: string | null
}

/* ─── page ─── */
export default function GoalsPage() {
  const supabase = createClient()

  const [positions, setPositions] = useState<Position[]>([])
  const [goals, setGoals] = useState<Goal[]>([])
  const [quarters, setQuarters] = useState<string[]>([])
  const [selectedQuarter, setSelectedQuarter] = useState('')
  const [selectedPositionId, setSelectedPositionId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // new quarter
  const [showNewQuarter, setShowNewQuarter] = useState(false)
  const [newQuarterVal, setNewQuarterVal] = useState('')

  // add goal
  const [addingText, setAddingText] = useState('')
  const [addingMetric, setAddingMetric] = useState('')

  // edit goal
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [editMetric, setEditMetric] = useState('')

  // copy goal
  const [copyingGoal, setCopyingGoal] = useState<Goal | null>(null)

  /* ─── load ─── */
  const load = async () => {
    // positions from org structure
    const { data: posData } = await supabase
      .from('positions')
      .select('id, title, holder, is_vacancy, department')
      .order('department', { ascending: true })
      .order('title', { ascending: true })

    setPositions((posData as Position[]) || [])

    // all goals
    const { data: goalsData } = await supabase
      .from('goals')
      .select('*')
      .order('sort_order', { ascending: true })

    const g = (goalsData as Goal[]) || []
    setGoals(g)

    const uq = Array.from(new Set(g.map((x) => x.quarter))).sort().reverse()
    setQuarters(uq)
    if (!selectedQuarter && uq.length > 0) setSelectedQuarter(uq[0])

    setLoading(false)
  }

  useEffect(() => { load() }, [])

  /* ─── derived ─── */
  // Group positions by department for the left panel
  const posByDept = positions.reduce((acc, p) => {
    const dept = p.department || 'Руководство'
    if (!acc[dept]) acc[dept] = []
    acc[dept].push(p)
    return acc
  }, {} as Record<string, Position[]>)

  const deptOrder = ['Руководство', 'Продажи', 'Маркетинг', 'Продукт', 'Технический', 'Финансы', 'Администрация', 'HR']
  const sortedDepts = Object.keys(posByDept).sort(
    (a, b) => (deptOrder.indexOf(a) === -1 ? 99 : deptOrder.indexOf(a)) - (deptOrder.indexOf(b) === -1 ? 99 : deptOrder.indexOf(b))
  )

  const selectedPosition = positions.find((p) => p.id === selectedPositionId) || null
  const positionGoals = goals.filter(
    (g) => g.quarter === selectedQuarter && g.position_id === selectedPositionId
  )

  // Count goals per position for the quarter
  const goalCountByPos = goals
    .filter((g) => g.quarter === selectedQuarter)
    .reduce((acc, g) => {
      if (g.position_id) acc[g.position_id] = (acc[g.position_id] || 0) + 1
      return acc
    }, {} as Record<string, number>)

  /* ─── handlers ─── */
  const createQuarter = () => {
    if (!newQuarterVal.trim()) return
    const q = newQuarterVal.trim()
    if (!quarters.includes(q)) setQuarters([q, ...quarters].sort().reverse())
    setSelectedQuarter(q)
    setShowNewQuarter(false)
    setNewQuarterVal('')
  }

  const addGoal = async () => {
    if (!addingText.trim() || !selectedPositionId || !selectedQuarter) return
    const maxSort = positionGoals.length > 0
      ? Math.max(...positionGoals.map((g) => g.sort_order || 0))
      : 0

    const pos = selectedPosition
    const { error: err } = await supabase.from('goals').insert({
      quarter: selectedQuarter,
      position_id: selectedPositionId,
      department: pos?.title || '',
      role: pos?.holder || null,
      text: addingText.trim(),
      metric: addingMetric.trim() || null,
      status: 'active',
      sort_order: maxSort + 1,
    } as any)

    if (err) { setError(err.message); return }
    setAddingText('')
    setAddingMetric('')
    load()
  }

  const startEdit = (g: Goal) => {
    setEditingId(g.id)
    setEditText(g.text)
    setEditMetric(g.metric || '')
  }

  const saveEdit = async () => {
    if (!editingId || !editText.trim()) return
    await supabase
      .from('goals')
      .update({ text: editText.trim(), metric: editMetric.trim() || null } as any)
      .eq('id', editingId)
    setEditingId(null)
    load()
  }

  const deleteGoal = async (id: string) => {
    if (!confirm('Удалить цель?')) return
    await supabase.from('goals').delete().eq('id', id)
    setGoals(goals.filter((g) => g.id !== id))
  }

  const copyGoalToPosition = async (goal: Goal, targetPos: Position) => {
    const existing = goals.filter(
      (g) => g.quarter === goal.quarter && g.position_id === targetPos.id
    )
    const maxSort = existing.length > 0
      ? Math.max(...existing.map((g) => g.sort_order || 0))
      : 0

    await supabase.from('goals').insert({
      quarter: goal.quarter,
      position_id: targetPos.id,
      department: targetPos.title,
      role: targetPos.holder || null,
      text: goal.text,
      metric: goal.metric,
      status: 'active',
      sort_order: maxSort + 1,
    } as any)

    setCopyingGoal(null)
    load()
  }

  /* ─── render ─── */
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-center h-64">
          <p className="text-slate-500">Загрузка...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-6">
      <div className="max-w-7xl mx-auto">
        <Link
          href="/admin"
          className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-6 font-medium"
        >
          &larr; Назад к администрированию
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <Target className="w-8 h-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-slate-900">Управление целями</h1>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
            <button onClick={() => setError('')} className="ml-2 text-red-500">✕</button>
          </div>
        )}

        {/* Quarter selector */}
        <div className="mb-6 bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex flex-wrap items-center gap-3">
            <label className="font-medium text-slate-700 text-sm">Квартал:</label>
            <div className="flex flex-wrap gap-2">
              {quarters.map((q) => (
                <button
                  key={q}
                  onClick={() => setSelectedQuarter(q)}
                  className={clsx(
                    'px-4 py-1.5 rounded-lg text-sm font-medium transition-all',
                    selectedQuarter === q
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  )}
                >
                  {q}
                </button>
              ))}
            </div>
            {!showNewQuarter ? (
              <button
                onClick={() => setShowNewQuarter(true)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 text-sm font-medium"
              >
                <Plus size={14} /> Новый квартал
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  placeholder="Q3-2026"
                  value={newQuarterVal}
                  onChange={(e) => setNewQuarterVal(e.target.value)}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 w-28"
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && createQuarter()}
                />
                <button onClick={createQuarter} className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700">OK</button>
                <button onClick={() => { setShowNewQuarter(false); setNewQuarterVal('') }} className="p-1 text-slate-400">
                  <X size={16} />
                </button>
              </div>
            )}
          </div>
        </div>

        {!selectedQuarter ? (
          <div className="text-center py-20 text-slate-500">
            Создайте квартал, чтобы начать добавлять цели
          </div>
        ) : (
          <div className="flex gap-6">
            {/* Left: positions list */}
            <div className="w-80 flex-shrink-0">
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden sticky top-6">
                <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
                  <h2 className="text-sm font-bold text-slate-700">
                    Роли из оргструктуры
                  </h2>
                </div>
                <div className="max-h-[calc(100vh-280px)] overflow-y-auto">
                  {sortedDepts.map((dept) => (
                    <div key={dept}>
                      <div className="px-4 py-2 bg-slate-50/50 border-b border-slate-100">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          {dept}
                        </span>
                      </div>
                      {posByDept[dept].map((pos) => {
                        const count = goalCountByPos[pos.id] || 0
                        const isSelected = selectedPositionId === pos.id
                        return (
                          <button
                            key={pos.id}
                            onClick={() => setSelectedPositionId(pos.id)}
                            className={clsx(
                              'w-full text-left px-4 py-2.5 border-b border-slate-100 transition-colors flex items-center gap-2',
                              isSelected
                                ? 'bg-purple-50 border-l-2 border-l-purple-600'
                                : 'hover:bg-slate-50 border-l-2 border-l-transparent'
                            )}
                          >
                            <div className="flex-1 min-w-0">
                              <div className={clsx(
                                'text-sm font-medium truncate',
                                isSelected ? 'text-purple-700' : 'text-slate-800'
                              )}>
                                {pos.title}
                              </div>
                              <div className={clsx(
                                'text-xs truncate',
                                pos.is_vacancy
                                  ? 'text-orange-500 font-semibold'
                                  : 'text-slate-400'
                              )}>
                                {pos.holder || 'Вакансия'}
                              </div>
                            </div>
                            {count > 0 && (
                              <span className={clsx(
                                'text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0',
                                isSelected
                                  ? 'bg-purple-600 text-white'
                                  : 'bg-slate-200 text-slate-600'
                              )}>
                                {count}
                              </span>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: goals for selected position */}
            <div className="flex-1 min-w-0">
              {!selectedPosition ? (
                <div className="bg-white border border-slate-200 rounded-lg p-12 text-center">
                  <Briefcase size={40} className="mx-auto text-slate-300 mb-3" />
                  <p className="text-slate-500">
                    Выберите роль слева, чтобы просмотреть или добавить цели
                  </p>
                </div>
              ) : (
                <div>
                  {/* Position header */}
                  <div className="bg-white border border-slate-200 rounded-lg p-5 mb-4">
                    <div className="flex items-center gap-3">
                      <div className={clsx(
                        'w-10 h-10 rounded-lg flex items-center justify-center',
                        selectedPosition.is_vacancy ? 'bg-orange-100' : 'bg-purple-100'
                      )}>
                        <User size={20} className={selectedPosition.is_vacancy ? 'text-orange-600' : 'text-purple-600'} />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-slate-900">
                          {selectedPosition.title}
                        </h2>
                        <p className={clsx(
                          'text-sm',
                          selectedPosition.is_vacancy
                            ? 'text-orange-500 font-semibold'
                            : 'text-slate-500'
                        )}>
                          {selectedPosition.holder || 'Вакансия'}
                          {selectedPosition.department && (
                            <span className="text-slate-400"> &middot; {selectedPosition.department}</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Goals list */}
                  {positionGoals.length === 0 ? (
                    <div className="bg-white border border-slate-200 rounded-lg p-8 text-center mb-4">
                      <Target size={32} className="mx-auto text-slate-300 mb-2" />
                      <p className="text-slate-500 text-sm">
                        Нет целей на {selectedQuarter}. Добавьте первую цель ниже.
                      </p>
                    </div>
                  ) : (
                    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden mb-4">
                      <div className="divide-y divide-slate-100">
                        {positionGoals.map((g, idx) => (
                          <div
                            key={g.id}
                            className={clsx(
                              'p-4 hover:bg-slate-50 transition-colors',
                              editingId === g.id && 'bg-purple-50'
                            )}
                          >
                            {editingId === g.id ? (
                              <div className="space-y-3">
                                <textarea
                                  value={editText}
                                  onChange={(e) => setEditText(e.target.value)}
                                  rows={3}
                                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                  autoFocus
                                />
                                <input
                                  placeholder="Метрика (опционально)"
                                  value={editMetric}
                                  onChange={(e) => setEditMetric(e.target.value)}
                                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                                <div className="flex gap-2">
                                  <button
                                    onClick={saveEdit}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700"
                                  >
                                    <Save size={14} /> Сохранить
                                  </button>
                                  <button
                                    onClick={() => setEditingId(null)}
                                    className="px-3 py-1.5 bg-slate-200 text-slate-600 rounded-lg text-sm"
                                  >
                                    Отмена
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1">
                                  <div className="flex items-baseline gap-2">
                                    <span className="text-xs font-bold text-slate-400 w-5">
                                      {idx + 1}.
                                    </span>
                                    <p className="text-sm text-slate-900 font-medium">
                                      {g.text}
                                    </p>
                                  </div>
                                  {g.metric && (
                                    <span className="inline-block mt-1 ml-7 px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                                      {g.metric}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-1 flex-shrink-0">
                                  <button
                                    onClick={() => setCopyingGoal(g)}
                                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                                    title="Скопировать для другой роли"
                                  >
                                    <Copy size={14} />
                                  </button>
                                  <button
                                    onClick={() => startEdit(g)}
                                    className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded"
                                    title="Редактировать"
                                  >
                                    <Edit3 size={14} />
                                  </button>
                                  <button
                                    onClick={() => deleteGoal(g.id)}
                                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                                    title="Удалить"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Add goal form (always visible) */}
                  <div className="bg-white border border-slate-200 rounded-lg p-4">
                    <h3 className="text-sm font-bold text-slate-700 mb-3">
                      Добавить цель
                    </h3>
                    <textarea
                      value={addingText}
                      onChange={(e) => setAddingText(e.target.value)}
                      rows={2}
                      placeholder="Текст цели..."
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 mb-2"
                    />
                    <input
                      value={addingMetric}
                      onChange={(e) => setAddingMetric(e.target.value)}
                      placeholder="Метрика (опционально), например +15%"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 mb-3"
                    />
                    <button
                      onClick={addGoal}
                      disabled={!addingText.trim()}
                      className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50 transition-colors"
                    >
                      <Plus size={16} /> Добавить
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        {/* Copy goal modal */}
        {copyingGoal && (
          <CopyGoalModal
            goal={copyingGoal}
            positions={positions}
            posByDept={posByDept}
            sortedDepts={sortedDepts}
            currentPositionId={selectedPositionId}
            onCopy={(targetPos) => copyGoalToPosition(copyingGoal, targetPos)}
            onClose={() => setCopyingGoal(null)}
          />
        )}
      </div>
    </div>
  )
}

/* ─── Copy modal ─── */
function CopyGoalModal({
  goal,
  positions,
  posByDept,
  sortedDepts,
  currentPositionId,
  onCopy,
  onClose,
}: {
  goal: Goal
  positions: Position[]
  posByDept: Record<string, Position[]>
  sortedDepts: string[]
  currentPositionId: string | null
  onCopy: (pos: Position) => void
  onClose: () => void
}) {
  const [search, setSearch] = useState('')

  const filtered = search.trim()
    ? positions.filter(
        (p) =>
          p.id !== currentPositionId &&
          (p.title.toLowerCase().includes(search.toLowerCase()) ||
            (p.holder || '').toLowerCase().includes(search.toLowerCase()))
      )
    : null

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-slate-900">Скопировать цель</h2>
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded">
              <X size={18} />
            </button>
          </div>
          <div className="bg-slate-50 rounded-lg p-3 text-sm text-slate-700 mb-3">
            {goal.text}
            {goal.metric && (
              <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs">
                {goal.metric}
              </span>
            )}
          </div>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск по роли или сотруднику..."
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              autoFocus
            />
          </div>
        </div>

        {/* Positions list */}
        <div className="flex-1 overflow-y-auto">
          {filtered ? (
            filtered.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-sm">
                Ничего не найдено
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filtered.map((pos) => (
                  <PositionRow key={pos.id} pos={pos} onSelect={() => onCopy(pos)} />
                ))}
              </div>
            )
          ) : (
            sortedDepts.map((dept) => {
              const deptPositions = (posByDept[dept] || []).filter(
                (p) => p.id !== currentPositionId
              )
              if (deptPositions.length === 0) return null
              return (
                <div key={dept}>
                  <div className="px-5 py-2 bg-slate-50 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      {dept}
                    </span>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {deptPositions.map((pos) => (
                      <PositionRow key={pos.id} pos={pos} onSelect={() => onCopy(pos)} />
                    ))}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

function PositionRow({ pos, onSelect }: { pos: Position; onSelect: () => void }) {
  return (
    <button
      onClick={onSelect}
      className="w-full text-left px-5 py-3 hover:bg-purple-50 transition-colors flex items-center gap-3"
    >
      <div className={clsx(
        'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
        pos.is_vacancy ? 'bg-orange-100' : 'bg-slate-100'
      )}>
        <User size={16} className={pos.is_vacancy ? 'text-orange-500' : 'text-slate-500'} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-slate-800 truncate">{pos.title}</div>
        <div className={clsx(
          'text-xs truncate',
          pos.is_vacancy ? 'text-orange-500' : 'text-slate-400'
        )}>
          {pos.holder || 'Вакансия'}
        </div>
      </div>
      <Copy size={14} className="text-slate-300 flex-shrink-0" />
    </button>
  )
}
