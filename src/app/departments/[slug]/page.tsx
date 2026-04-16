'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Users, UserX, User, Plus, Edit, Trash2, ExternalLink, Grid3x3, FileText, Zap, Check, X, Eye, MessageCircle, Send, Clock, ChevronDown } from 'lucide-react'
import clsx from 'clsx'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRoleStore, type UserRole } from '@/lib/stores/role-store'

const ROLE_PROFILES: Record<UserRole, string> = {
  employee: 'Иван Иванов',
  head: 'Елена Петрова',
  admin: 'Алексей Сидоров',
}

function getMonthFromMetric(metric: string | null): number | null {
  if (!metric) return null
  const lower = metric.toLowerCase()
  if (lower.includes('январ')) return 1
  if (lower.includes('феврал')) return 2
  if (lower.includes('март') || lower.includes('марта')) return 3
  if (lower.includes('апрел')) return 4
  if (lower.includes('мая') || lower.includes('май')) return 5
  if (lower.includes('июн')) return 6
  if (lower.includes('июл')) return 7
  if (lower.includes('август')) return 8
  if (lower.includes('сентябр')) return 9
  if (lower.includes('октябр')) return 10
  if (lower.includes('ноябр')) return 11
  if (lower.includes('декабр')) return 12
  return null
}

const MONTH_NAMES: Record<number, string> = {
  1: 'Январь', 2: 'Февраль', 3: 'Март',
  4: 'Апрель', 5: 'Май', 6: 'Июнь',
  7: 'Июль', 8: 'Август', 9: 'Сентябрь',
  10: 'Октябрь', 11: 'Ноябрь', 12: 'Декабрь',
}

const QUARTER_MONTHS: Record<string, number[]> = {
  'Q1': [1, 2, 3],
  'Q2': [4, 5, 6],
  'Q3': [7, 8, 9],
  'Q4': [10, 11, 12],
}

interface DepartmentData {
  slug: string
  name: string
  description: string
  director_name: string
  director_is_vacancy: boolean
  reports_to: string
}

interface OrgUnit {
  id: string
  department_slug: string
  name: string
  lead_name: string
  is_lead_vacancy: boolean
  sort_order: number
}

interface OrgEmployee {
  id: string
  department_slug: string
  unit_id: string | null
  name: string
  role: string
  is_vacancy: boolean
  note: string | null
  is_direct_report: boolean
  sort_order: number
}

interface DepartmentGoal {
  id: string
  department_slug: string
  quarter: string
  text: string
  metric: string | null
  status: string
  sort_order: number
  created_at: string
}

interface PositionGoal {
  id: string
  quarter: string
  text: string
  metric: string | null
  status: string
  sort_order: number
  position_id: string
  department: string
  role: string | null
  position_title: string
  position_holder: string
}

interface GoalComment {
  id: string
  goal_id: string
  author_name: string
  text: string
  created_at: string
}

interface Document {
  id: string
  department_slug: string
  title: string
  category: string | null
  created_at: string
}

interface DepartmentLink {
  id: string
  department_slug: string
  title: string
  url: string
  icon: string | null
  sort_order: number
  created_at: string
}

/* ─── Position Picker Component ─── */
function PositionPicker({
  value,
  onChange,
}: {
  value: string
  onChange: (val: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [roles, setRoles] = useState<string[]>([])
  const [search, setSearch] = useState('')
  const [adding, setAdding] = useState(false)
  const [newRole, setNewRole] = useState('')
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchRoles = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('org_employees')
        .select('role')
      if (data) {
        const unique = [...new Set(data.map((d) => d.role).filter(Boolean))] as string[]
        unique.sort((a, b) => a.localeCompare(b, 'ru'))
        setRoles(unique)
      }
    }
    fetchRoles()
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
        setAdding(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filtered = search.trim()
    ? roles.filter((r) => r.toLowerCase().includes(search.toLowerCase()))
    : roles

  const handleAddNew = () => {
    if (newRole.trim()) {
      onChange(newRole.trim())
      setRoles((prev) => [...prev, newRole.trim()].sort((a, b) => a.localeCompare(b, 'ru')))
      setNewRole('')
      setAdding(false)
      setOpen(false)
    }
  }

  return (
    <div ref={wrapperRef} className="relative">
      <div
        onClick={() => setOpen(!open)}
        className="w-full text-sm px-2 py-1 border border-slate-300 rounded cursor-pointer flex items-center justify-between bg-white"
      >
        <span className={value ? 'text-slate-900' : 'text-slate-400'}>
          {value || 'Должность'}
        </span>
        <ChevronDown size={14} className={clsx('text-slate-400 transition-transform', open && 'rotate-180')} />
      </div>

      {open && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-20 max-h-[240px] flex flex-col">
          {/* Search */}
          <div className="p-2 border-b border-slate-100">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск должности..."
              className="w-full text-sm px-2 py-1 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Options */}
          <div className="overflow-y-auto flex-1">
            {filtered.map((role) => (
              <button
                key={role}
                onClick={(e) => {
                  e.stopPropagation()
                  onChange(role)
                  setOpen(false)
                  setSearch('')
                }}
                className={clsx(
                  'w-full text-left px-3 py-1.5 text-sm hover:bg-purple-50 transition-colors',
                  value === role && 'bg-purple-50 text-purple-700 font-medium'
                )}
              >
                {role}
              </button>
            ))}
            {filtered.length === 0 && !adding && (
              <div className="px-3 py-2 text-xs text-slate-400">Ничего не найдено</div>
            )}
          </div>

          {/* Add new */}
          <div className="border-t border-slate-100 p-2">
            {adding ? (
              <div className="flex gap-1">
                <input
                  type="text"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  placeholder="Новая должность..."
                  className="flex-1 text-sm px-2 py-1 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddNew()}
                />
                <button
                  onClick={(e) => { e.stopPropagation(); handleAddNew() }}
                  className="p-1 text-green-600 hover:bg-green-50 rounded"
                >
                  <Check size={14} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setAdding(false); setNewRole('') }}
                  className="p-1 text-slate-400 hover:bg-slate-50 rounded"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button
                onClick={(e) => { e.stopPropagation(); setAdding(true) }}
                className="w-full flex items-center gap-1.5 px-2 py-1 text-sm text-purple-600 hover:bg-purple-50 rounded transition-colors"
              >
                <Plus size={14} />
                Создать новую должность
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function EmployeeRow({
  employee,
  onEdit,
  onSave,
  onDelete,
  editingId,
  readOnly,
}: {
  employee: OrgEmployee
  onEdit: (id: string) => void
  onSave: (id: string, name: string, role: string, note: string | null) => void
  onDelete: (id: string) => void
  editingId: string | null
  readOnly?: boolean
}) {
  const [editName, setEditName] = useState(employee.name)
  const [editRole, setEditRole] = useState(employee.role)
  const [editNote, setEditNote] = useState(employee.note || '')

  const isEditing = editingId === employee.id

  if (isEditing) {
    return (
      <div className="py-3 px-3 bg-purple-50 border-b border-slate-100">
        <div className="space-y-2">
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            placeholder="Имя сотрудника"
            className="w-full text-sm px-2 py-1 border border-slate-300 rounded"
          />
          <PositionPicker value={editRole} onChange={setEditRole} />
          <input
            type="text"
            value={editNote}
            onChange={(e) => setEditNote(e.target.value)}
            placeholder="Примечание"
            className="w-full text-sm px-2 py-1 border border-slate-300 rounded"
          />
          <div className="flex gap-2 justify-end pt-1">
            <button
              onClick={() => onSave(employee.id, editName, editRole, editNote || null)}
              className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
            >
              <Check size={16} />
            </button>
            <button
              onClick={() => onEdit('')}
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3 py-2 px-3 hover:bg-slate-50 rounded transition-colors group">
      <div className={clsx(
        'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
        employee.is_vacancy ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-500'
      )}>
        {employee.is_vacancy ? <UserX size={14} /> : <User size={14} />}
      </div>
      <div className="flex-1 min-w-0">
        <p className={clsx('text-sm font-medium', employee.is_vacancy ? 'text-orange-600' : 'text-slate-800')}>
          {employee.is_vacancy ? 'ВАКАНСИЯ' : employee.name}
        </p>
        <p className="text-xs text-slate-500">{employee.role}</p>
      </div>
      {employee.note && (
        <span className="text-[10px] px-1.5 py-0.5 bg-yellow-100 text-yellow-700 rounded font-medium flex-shrink-0">
          {employee.note}
        </span>
      )}
      {!readOnly && (
        <button
          onClick={() => onEdit(employee.id)}
          className="p-1.5 text-slate-400 opacity-0 group-hover:opacity-100 hover:text-purple-600 hover:bg-purple-50 rounded transition-all flex-shrink-0"
        >
          <Edit size={14} />
        </button>
      )}
      {!readOnly && (
        <button
          onClick={() => onDelete(employee.id)}
          className="p-1.5 text-slate-400 opacity-0 group-hover:opacity-100 hover:text-red-600 hover:bg-red-50 rounded transition-all flex-shrink-0"
        >
          <Trash2 size={14} />
        </button>
      )}
    </div>
  )
}

function StructureTab({
  dept,
  units,
  employees,
  onEmployeeEdit,
  onEmployeeAdd,
  onEmployeeDelete,
  onUnitAdd,
  readOnly,
}: {
  dept: DepartmentData
  units: OrgUnit[]
  employees: OrgEmployee[]
  onEmployeeEdit: (id: string, name: string, role: string, note: string | null) => void
  onEmployeeAdd: (name: string, role: string, note: string | null, addingTo: 'direct' | string) => void
  onEmployeeDelete: (id: string) => void
  onUnitAdd: () => void
  readOnly?: boolean
}) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [addingTo, setAddingTo] = useState<string | null>(null)
  const [addName, setAddName] = useState('')
  const [addRole, setAddRole] = useState('')
  const [addNote, setAddNote] = useState('')

  const directReports = employees.filter((e) => e.is_direct_report && !e.unit_id).sort((a, b) => a.sort_order - b.sort_order)

  const handleSave = (id: string, name: string, role: string, note: string | null) => {
    onEmployeeEdit(id, name, role, note)
    setEditingId(null)
  }

  const handleAddEmployee = () => {
    if (addName.trim() && addingTo) {
      onEmployeeAdd(addName, addRole, addNote || null, addingTo)
      setAddName('')
      setAddRole('')
      setAddNote('')
      setAddingTo(null)
    }
  }

  const handleCancelAdd = () => {
    setAddName('')
    setAddRole('')
    setAddNote('')
    setAddingTo(null)
  }

  return (
    <>
      {/* Edit department info */}
      <div className="mb-6 bg-slate-50 border border-slate-200 rounded-lg p-4">
        <h2 className="text-lg font-bold text-slate-900 mb-3">Информация об отделе</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-500 block mb-1">Руководитель</label>
            <p className="text-sm font-medium text-slate-900">{dept.director_name}</p>
          </div>
          <div>
            <label className="text-xs text-slate-500 block mb-1">Подчинение</label>
            <p className="text-sm font-medium text-slate-900">{dept.reports_to}</p>
          </div>
        </div>
        {!readOnly && (
          <button className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 text-sm text-purple-600 hover:bg-purple-50 rounded transition-colors">
            <Edit size={14} />
            Редактировать
          </button>
        )}
      </div>

      {/* Direct reports */}
      {directReports.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-900 mb-3">Прямое подчинение директору</h2>
          <div className="bg-white border border-slate-200 rounded-lg divide-y divide-slate-100">
            {directReports.map((emp) => (
              <EmployeeRow
                key={emp.id}
                employee={emp}
                onEdit={setEditingId}
                onSave={handleSave}
                onDelete={onEmployeeDelete}
                editingId={editingId}
                readOnly={readOnly}
              />
            ))}
            {!readOnly && addingTo === 'direct' && (
              <div className="py-3 px-3 bg-purple-50 border-b border-slate-100">
                <div className="space-y-2">
                  <input
                    type="text"
                    value={addName}
                    onChange={(e) => setAddName(e.target.value)}
                    placeholder="Имя сотрудника"
                    className="w-full text-sm px-2 py-1 border border-slate-300 rounded"
                    autoFocus
                  />
                  <PositionPicker value={addRole} onChange={setAddRole} />
                  <input
                    type="text"
                    value={addNote}
                    onChange={(e) => setAddNote(e.target.value)}
                    placeholder="Примечание"
                    className="w-full text-sm px-2 py-1 border border-slate-300 rounded"
                  />
                  <div className="flex gap-2 justify-end pt-1">
                    <button
                      onClick={handleAddEmployee}
                      className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={handleCancelAdd}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          {!readOnly && (
            <button
              onClick={() => setAddingTo('direct')}
              className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 text-sm text-purple-600 hover:bg-purple-50 rounded transition-colors"
            >
              <Plus size={14} />
              Добавить сотрудника
            </button>
          )}
        </div>
      )}

      {/* Sub-units */}
      {units.map((unit) => {
        const unitEmployees = employees
          .filter((e) => e.unit_id === unit.id && !e.is_direct_report)
          .sort((a, b) => a.sort_order - b.sort_order)

        return (
          <div key={unit.id} className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-lg font-bold text-slate-900">{unit.name}</h2>
              <span className="text-xs text-slate-400">{unitEmployees.length + 1} чел.</span>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg">
              {/* Lead */}
              <div className={clsx(
                'flex items-center gap-3 py-3 px-3 border-b border-slate-100',
                unit.is_lead_vacancy ? 'bg-orange-50' : 'bg-purple-50'
              )}>
                <div className={clsx(
                  'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                  unit.is_lead_vacancy ? 'bg-orange-200 text-orange-700' : 'bg-purple-200 text-purple-700'
                )}>
                  {unit.is_lead_vacancy ? <UserX size={14} /> : <Users size={14} />}
                </div>
                <div>
                  <p className={clsx('text-sm font-semibold', unit.is_lead_vacancy ? 'text-orange-700' : 'text-purple-800')}>
                    {unit.is_lead_vacancy ? 'ВАКАНСИЯ — Руководитель' : unit.lead_name}
                  </p>
                  <p className="text-xs text-slate-500">Руководитель</p>
                </div>
              </div>
              {/* Members */}
              <div className="divide-y divide-slate-50">
                {unitEmployees.map((emp) => (
                  <EmployeeRow
                    key={emp.id}
                    employee={emp}
                    onEdit={setEditingId}
                    onSave={handleSave}
                    onDelete={onEmployeeDelete}
                    editingId={editingId}
                    readOnly={readOnly}
                  />
                ))}
                {!readOnly && addingTo === unit.id && (
                  <div className="py-3 px-3 bg-purple-50 border-b border-slate-100">
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={addName}
                        onChange={(e) => setAddName(e.target.value)}
                        placeholder="Имя сотрудника"
                        className="w-full text-sm px-2 py-1 border border-slate-300 rounded"
                        autoFocus
                      />
                      <PositionPicker value={addRole} onChange={setAddRole} />
                      <input
                        type="text"
                        value={addNote}
                        onChange={(e) => setAddNote(e.target.value)}
                        placeholder="Примечание"
                        className="w-full text-sm px-2 py-1 border border-slate-300 rounded"
                      />
                      <div className="flex gap-2 justify-end pt-1">
                        <button
                          onClick={handleAddEmployee}
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={handleCancelAdd}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {!readOnly && (
              <button
                onClick={() => setAddingTo(unit.id)}
                className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 text-sm text-purple-600 hover:bg-purple-50 rounded transition-colors"
              >
                <Plus size={14} />
                Добавить сотрудника
              </button>
            )}
          </div>
        )
      })}

      {/* Add sub-unit */}
      {!readOnly && (
        <div className="pt-4">
          <button
            onClick={onUnitAdd}
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
          >
            <Plus size={16} />
            Добавить подразделение
          </button>
        </div>
      )}
    </>
  )
}

function GoalDetailModal({
  goal,
  onClose,
}: {
  goal: PositionGoal
  onClose: () => void
}) {
  const [comments, setComments] = useState<GoalComment[]>([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const { role } = useRoleStore()
  const authorName = ROLE_PROFILES[role]

  useEffect(() => {
    fetchComments()
  }, [goal.id])

  const fetchComments = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('goal_comments')
      .select('*')
      .eq('goal_id', goal.id)
      .order('created_at', { ascending: true })
    setComments(data || [])
    setLoading(false)
    setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }), 100)
  }

  const handleSend = async () => {
    const name = authorName.trim()
    const text = newComment.trim()
    if (!name || !text) return

    setSending(true)
    const supabase = createClient()
    const { data, error } = await supabase
      .from('goal_comments')
      .insert({ goal_id: goal.id, author_name: name, text })
      .select()
      .single()

    if (!error && data) {
      setComments((prev) => [...prev, data])
      setNewComment('')
      setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }), 100)
    }
    setSending(false)
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    const day = d.getDate().toString().padStart(2, '0')
    const month = (d.getMonth() + 1).toString().padStart(2, '0')
    const hours = d.getHours().toString().padStart(2, '0')
    const mins = d.getMinutes().toString().padStart(2, '0')
    return `${day}.${month} ${hours}:${mins}`
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex-shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 leading-snug">{goal.text}</p>
              {goal.metric && (
                <span className="inline-block mt-2 text-xs font-medium text-purple-600 bg-purple-50 px-2 py-0.5 rounded">
                  {goal.metric}
                </span>
              )}
              <p className="text-xs text-slate-400 mt-1">{goal.position_title} — {goal.position_holder || 'ВАКАНСИЯ'}</p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 flex-shrink-0 mt-0.5">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Comments list */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-4 min-h-[200px]">
          {loading ? (
            <p className="text-center text-sm text-slate-400 py-8">Загрузка...</p>
          ) : comments.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle size={32} className="text-slate-200 mx-auto mb-2" />
              <p className="text-sm text-slate-400">Комментариев пока нет</p>
              <p className="text-xs text-slate-300 mt-1">Напишите первый комментарий</p>
            </div>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="group">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-xs font-bold text-purple-600">
                    {c.author_name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-semibold text-slate-700">{c.author_name}</span>
                  <span className="text-[10px] text-slate-300 flex items-center gap-0.5">
                    <Clock size={10} />
                    {formatDate(c.created_at)}
                  </span>
                </div>
                <div className="ml-8 bg-slate-50 rounded-lg px-3 py-2">
                  <p className="text-sm text-slate-700 whitespace-pre-wrap">{c.text}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input */}
        <div className="px-5 py-3 border-t border-slate-200 flex-shrink-0 space-y-2">
          <div className="flex gap-2">
            <textarea
              placeholder="Напишите комментарий..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              rows={2}
              className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
            />
            <button
              onClick={handleSend}
              disabled={sending || !newComment.trim()}
              className={clsx(
                'self-end px-3 py-2 rounded-lg transition-colors flex-shrink-0',
                sending || !newComment.trim()
                  ? 'bg-slate-100 text-slate-300'
                  : 'bg-purple-600 text-white hover:bg-purple-700'
              )}
            >
              <Send size={16} />
            </button>
          </div>
          <p className="text-[10px] text-slate-300">От имени: {authorName}</p>
        </div>
      </div>
    </div>
  )
}

function GoalsTab({ slug }: { slug: string }) {
  const { role } = useRoleStore()
  const goalsReadOnly = role === 'employee'
  const [goals, setGoals] = useState<PositionGoal[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedQuarter, setSelectedQuarter] = useState('Q2-2026')
  const [selectedGoal, setSelectedGoal] = useState<PositionGoal | null>(null)
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({})

  useEffect(() => {
    const fetchGoals = async () => {
      const supabase = createClient()

      // 1. Get director position_id from org_departments
      const { data: dept } = await supabase
        .from('org_departments')
        .select('director_position_id')
        .eq('slug', slug)
        .single()

      // 2. Get all org_units position_ids for this department
      const { data: units } = await supabase
        .from('org_units')
        .select('position_id')
        .eq('department_slug', slug)

      // Collect all position IDs for this department
      const positionIds: string[] = []
      if (dept?.director_position_id) positionIds.push(dept.director_position_id)
      if (units) {
        units.forEach((u: any) => {
          if (u.position_id && !positionIds.includes(u.position_id)) {
            positionIds.push(u.position_id)
          }
        })
      }

      if (positionIds.length === 0) {
        setLoading(false)
        return
      }

      // 3. Fetch goals for these positions
      const { data: goalsData, error } = await supabase
        .from('goals')
        .select('id, quarter, text, metric, status, sort_order, position_id, department, role')
        .in('position_id', positionIds)
        .order('sort_order', { ascending: true })

      if (!error && goalsData) {
        // 4. Fetch position details for display
        const { data: positions } = await supabase
          .from('positions')
          .select('id, title, holder')
          .in('id', positionIds)

        const posMap = (positions || []).reduce((acc: any, p: any) => {
          acc[p.id] = p
          return acc
        }, {})

        const enriched = goalsData.map((g: any) => ({
          ...g,
          position_title: posMap[g.position_id]?.title || g.department,
          position_holder: posMap[g.position_id]?.holder || g.role || '',
        }))

        setGoals(enriched)

        // 5. Fetch comment counts for all goals
        const goalIds = goalsData.map((g: any) => g.id)
        if (goalIds.length > 0) {
          const { data: commentsData } = await supabase
            .from('goal_comments')
            .select('goal_id')
            .in('goal_id', goalIds)
          if (commentsData) {
            const counts: Record<string, number> = {}
            commentsData.forEach((c: any) => {
              counts[c.goal_id] = (counts[c.goal_id] || 0) + 1
            })
            setCommentCounts(counts)
          }
        }
      }
      setLoading(false)
    }

    fetchGoals()
  }, [slug])

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-500">Загружаем цели...</p>
      </div>
    )
  }

  // Get available quarters
  const quarters = [...new Set(goals.map(g => g.quarter))].sort().reverse()
  const filteredGoals = goals.filter(g => g.quarter === selectedQuarter)

  // Group by position
  const goalsByPosition = filteredGoals.reduce((acc, goal) => {
    const key = goal.position_id
    if (!acc[key]) {
      acc[key] = {
        position_title: goal.position_title,
        position_holder: goal.position_holder,
        goals: [],
      }
    }
    acc[key].goals.push(goal)
    return acc
  }, {} as Record<string, { position_title: string; position_holder: string; goals: PositionGoal[] }>)

  if (goals.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 mb-4">Целей ещё не добавлено</p>
        {!goalsReadOnly && (
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
            <Plus size={16} />
            Добавить цель
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Quarter selector */}
      {quarters.length > 1 && (
        <div className="flex gap-2">
          {quarters.map((q) => (
            <button
              key={q}
              onClick={() => setSelectedQuarter(q)}
              className={clsx(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                selectedQuarter === q
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              )}
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Goals grouped by position, then by month */}
      {Object.entries(goalsByPosition).map(([posId, group]) => {
        // Group goals by month
        const quarterPrefix = selectedQuarter.split('-')[0] // 'Q2'
        const months = QUARTER_MONTHS[quarterPrefix] || []
        const goalsByMonth: Record<number | 'other', PositionGoal[]> = { other: [] }
        months.forEach(m => { goalsByMonth[m] = [] })

        group.goals.forEach(goal => {
          const month = getMonthFromMetric(goal.metric)
          if (month && goalsByMonth[month] !== undefined) {
            goalsByMonth[month].push(goal)
          } else {
            goalsByMonth['other'].push(goal)
          }
        })

        // Build ordered list: other first (as "Весь квартал"), then by month
        const monthSections: { key: string; label: string; goals: PositionGoal[] }[] = []
        if (goalsByMonth['other'].length > 0) {
          monthSections.push({ key: 'other', label: 'Весь квартал', goals: goalsByMonth['other'] })
        }
        months.forEach(m => {
          if (goalsByMonth[m] && goalsByMonth[m].length > 0) {
            monthSections.push({ key: String(m), label: MONTH_NAMES[m], goals: goalsByMonth[m] })
          }
        })

        return (
          <div key={posId} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-5 py-3 bg-slate-50 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{group.position_title}</h3>
                  <p className={clsx(
                    'text-xs mt-0.5',
                    group.position_holder ? 'text-slate-500' : 'text-orange-500 font-medium'
                  )}>
                    {group.position_holder || 'ВАКАНСИЯ'}
                  </p>
                </div>
                <span className="text-xs text-slate-400 font-medium">
                  {group.goals.length} {group.goals.length === 1 ? 'цель' : group.goals.length < 5 ? 'цели' : 'целей'}
                </span>
              </div>
            </div>
            <div>
              {monthSections.map((section) => (
                <div key={section.key}>
                  <div className="px-5 py-2 bg-purple-50/50 border-y border-slate-100">
                    <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide">{section.label}</span>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {section.goals.map((goal) => (
                      <button
                        key={goal.id}
                        onClick={() => setSelectedGoal(goal)}
                        className="w-full px-5 py-3 flex items-start justify-between gap-4 text-left hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className={clsx(
                            'w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5',
                            goal.status === 'completed' ? 'bg-green-100' : 'bg-purple-100'
                          )}>
                            {goal.status === 'completed' ? (
                              <Check size={12} className="text-green-600" />
                            ) : (
                              <div className="w-2 h-2 rounded-full bg-purple-400" />
                            )}
                          </div>
                          <p className="text-sm text-slate-700">{goal.text}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {commentCounts[goal.id] > 0 && (
                            <span className="flex items-center gap-1 text-[11px] text-slate-400">
                              <MessageCircle size={12} />
                              {commentCounts[goal.id]}
                            </span>
                          )}
                          {goal.metric && (
                            <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded whitespace-nowrap">
                              {goal.metric}
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}

      {/* Goal detail modal with comments */}
      {selectedGoal && (
        <GoalDetailModal
          goal={selectedGoal}
          onClose={() => {
            setSelectedGoal(null)
            // Refresh comment counts
            const fetchCounts = async () => {
              const supabase = createClient()
              const goalIds = goals.map(g => g.id)
              const { data } = await supabase
                .from('goal_comments')
                .select('goal_id')
                .in('goal_id', goalIds)
              if (data) {
                const counts: Record<string, number> = {}
                data.forEach((c: any) => { counts[c.goal_id] = (counts[c.goal_id] || 0) + 1 })
                setCommentCounts(counts)
              }
            }
            fetchCounts()
          }}
        />
      )}
    </div>
  )
}

function DocumentsTab({ slug }: { slug: string }) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDocuments = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('documents')
        .select('id, title, category, department_slug, created_at')
        .eq('department_slug', slug)
        .order('created_at', { ascending: false })

      if (!error && data) {
        setDocuments(data)
      }
      setLoading(false)
    }

    fetchDocuments()
  }, [slug])

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-500">Загружаем документы...</p>
      </div>
    )
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 mb-4">Документов ещё не добавлено</p>
        <Link
          href={`/docs/new?department=${slug}`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
        >
          <Plus size={16} />
          Добавить документ
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map((doc) => (
          <div key={doc.id} className="bg-white border border-slate-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                <FileText size={20} className="text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-slate-900 truncate">{doc.title}</h3>
                <p className="text-xs text-slate-500 mt-1">
                  {doc.category && <span className="text-purple-600">{doc.category} · </span>}
                  {new Date(doc.created_at).toLocaleDateString('ru-RU')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`/docs/${doc.id}`}
                className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-purple-600 bg-purple-50 rounded hover:bg-purple-100 transition-colors"
              >
                <Eye size={14} />
                Открыть
              </Link>
              <Link
                href={`/docs/${doc.id}/edit`}
                className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors"
              >
                <Edit size={14} />
              </Link>
            </div>
          </div>
        ))}
      </div>
      <div className="pt-4">
        <Link
          href={`/docs/new?department=${slug}`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
        >
          <Plus size={16} />
          Добавить документ
        </Link>
      </div>
    </div>
  )
}

function renderTiptapContent(node: any): React.ReactNode {
  if (!node) return null

  if (node.type === 'text') {
    let content: React.ReactNode = node.text
    if (node.marks) {
      for (const mark of node.marks) {
        if (mark.type === 'bold') content = <strong>{content}</strong>
        if (mark.type === 'italic') content = <em>{content}</em>
      }
    }
    return content
  }

  const children = node.content?.map((child: any, i: number) => (
    <span key={i}>{renderTiptapContent(child)}</span>
  ))

  switch (node.type) {
    case 'doc':
      return <>{node.content?.map((child: any, i: number) => <div key={i}>{renderTiptapContent(child)}</div>)}</>
    case 'heading': {
      const level = node.attrs?.level || 2
      const Tag = `h${level}` as keyof JSX.IntrinsicElements
      const styles: Record<number, string> = {
        1: 'text-2xl font-bold text-slate-900 mt-8 mb-4 first:mt-0',
        2: 'text-xl font-bold text-slate-800 mt-6 mb-3 border-b border-slate-200 pb-2',
        3: 'text-lg font-semibold text-slate-700 mt-4 mb-2',
      }
      return <Tag className={styles[level] || styles[3]}>{children}</Tag>
    }
    case 'paragraph':
      return <p className="text-sm text-slate-600 leading-relaxed mb-3">{children}</p>
    case 'bulletList':
      return <ul className="list-disc list-inside space-y-1 mb-3 ml-2">{node.content?.map((child: any, i: number) => <li key={i} className="text-sm text-slate-600">{renderTiptapContent(child)}</li>)}</ul>
    case 'listItem':
      return <>{node.content?.map((child: any, i: number) => {
        if (child.type === 'paragraph') {
          return child.content?.map((c: any, j: number) => <span key={j}>{renderTiptapContent(c)}</span>)
        }
        return <span key={i}>{renderTiptapContent(child)}</span>
      })}</>
    default:
      return children
  }
}

function VisionTab({ slug }: { slug: string }) {
  const [content, setContent] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVision = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('department_vision')
        .select('content')
        .eq('department_slug', slug)
        .single()

      if (!error && data) {
        setContent(data.content)
      }
      setLoading(false)
    }

    fetchVision()
  }, [slug])

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-500">Загружаем видение...</p>
      </div>
    )
  }

  if (!content) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 mb-2">Видение отдела ещё не описано</p>
        <p className="text-xs text-slate-400">Здесь будет стратегическое видение работы отдела</p>
      </div>
    )
  }

  return (
    <div className="prose-sm max-w-none">
      {renderTiptapContent(content)}
    </div>
  )
}

function ServicesTab({ slug }: { slug: string }) {
  const [links, setLinks] = useState<DepartmentLink[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLinks = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('department_links')
        .select('*')
        .eq('department_slug', slug)
        .order('sort_order', { ascending: true })

      if (!error && data) {
        setLinks(data)
      }
      setLoading(false)
    }

    fetchLinks()
  }, [slug])

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-500">Загружаем сервисы...</p>
      </div>
    )
  }

  if (links.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 mb-4">Сервисов ещё не добавлено</p>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
          <Plus size={16} />
          Добавить сервис
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {links.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white border border-slate-200 rounded-lg p-4 hover:border-purple-300 hover:shadow-md transition-all group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={clsx(
                'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                link.icon ? 'bg-slate-100' : 'bg-purple-100'
              )}>
                {link.icon ? (
                  <span className="text-lg">{link.icon}</span>
                ) : (
                  <Zap size={20} className="text-purple-600" />
                )}
              </div>
              <button className="p-1.5 text-slate-400 opacity-0 group-hover:opacity-100 hover:text-purple-600 hover:bg-purple-50 rounded transition-all">
                <Edit size={14} />
              </button>
            </div>
            <h3 className="text-sm font-semibold text-slate-900 group-hover:text-purple-600 transition-colors">{link.title}</h3>
            <div className="flex items-center gap-1 mt-3 text-slate-400 group-hover:text-purple-600 transition-colors">
              <ExternalLink size={14} />
              <span className="text-xs">Открыть</span>
            </div>
          </a>
        ))}
      </div>
      <div className="pt-4">
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
          <Plus size={16} />
          Добавить сервис
        </button>
      </div>
    </div>
  )
}

export default function DepartmentPage() {
  const params = useParams()
  const slug = params?.slug as string
  const { role } = useRoleStore()
  const readOnly = role === 'employee'
  const [activeTab, setActiveTab] = useState<'vision' | 'structure' | 'goals' | 'documents' | 'services'>('vision')
  const [dept, setDept] = useState<DepartmentData | null>(null)
  const [units, setUnits] = useState<OrgUnit[]>([])
  const [employees, setEmployees] = useState<OrgEmployee[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()

      // Fetch department
      const { data: deptData, error: deptError } = await supabase
        .from('org_departments')
        .select('*')
        .eq('slug', slug)
        .single()

      if (deptError || !deptData) {
        setLoading(false)
        return
      }

      // Fetch units
      const { data: unitsData, error: unitsError } = await supabase
        .from('org_units')
        .select('*')
        .eq('department_slug', slug)
        .order('sort_order', { ascending: true })

      // Fetch employees
      const { data: employeesData, error: employeesError } = await supabase
        .from('org_employees')
        .select('*')
        .eq('department_slug', slug)
        .order('sort_order', { ascending: true })

      // Derive director + reports_to from org_tree (source of truth)
      try {
        const { data: treeRow } = await supabase
          .from('org_tree')
          .select('data')
          .limit(1)
          .maybeSingle()
        const root = (treeRow as any)?.data
        if (root) {
          const norm = (s: string) => (s || '').toLowerCase().replace(/ё/g, 'е').trim()
          const target = norm(deptData.name)
          let foundNode: any = null
          let parentNode: any = null
          const walk = (node: any, parent: any) => {
            if (!node) return
            if (!foundNode && norm(node.name) === target) {
              foundNode = node
              parentNode = parent
              return
            }
            ;(node.children || []).forEach((c: any) => walk(c, node))
          }
          walk(root, null)
          if (foundNode) {
            const dirName = (foundNode.name || '').trim()
            const isVacancy = !dirName || /вакансия/i.test(dirName)
            ;(deptData as any).director_name = isVacancy ? '' : dirName
            ;(deptData as any).director_is_vacancy = isVacancy
            ;(deptData as any).director_position = foundNode.position || (deptData as any).director_position
            if (parentNode) {
              const pName = (parentNode.name || '').trim()
              const pPos = parentNode.position || ''
              const pIsVacancy = !pName || /вакансия/i.test(pName)
              ;(deptData as any).reports_to = pIsVacancy
                ? `${pPos || 'Руководитель'} (вакансия)`
                : `${pName}${pPos ? ` (${pPos})` : ''}`
            }
          }
        }
      } catch {}

      setDept(deptData)
      if (!unitsError && unitsData) {
        setUnits(unitsData)
      }
      if (!employeesError && employeesData) {
        setEmployees(employeesData)
      }
      setLoading(false)
    }

    fetchData()
  }, [slug])

  const handleEmployeeEdit = async (id: string, name: string, role: string, note: string | null) => {
    const supabase = createClient()
    const { error } = await supabase
      .from('org_employees')
      .update({ name, role, note })
      .eq('id', id)

    if (!error) {
      setEmployees((prevEmployees) =>
        prevEmployees.map((emp) =>
          emp.id === id ? { ...emp, name, role, note } : emp
        )
      )
    }
  }

  const handleEmployeeAdd = async (name: string, role: string, note: string | null, addingTo: 'direct' | string) => {
    const supabase = createClient()
    const isDirectReport = addingTo === 'direct'

    const { data, error } = await supabase
      .from('org_employees')
      .insert({
        department_slug: slug,
        name,
        role,
        note,
        is_direct_report: isDirectReport,
        unit_id: isDirectReport ? null : addingTo,
        is_vacancy: false,
        sort_order: employees.length,
      })
      .select()

    if (!error && data && data.length > 0) {
      setEmployees((prev) => [...prev, data[0]])
    }
  }

  const handleEmployeeDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить этого сотрудника?')) {
      return
    }

    const supabase = createClient()
    const { error } = await supabase
      .from('org_employees')
      .delete()
      .eq('id', id)

    if (!error) {
      setEmployees((prev) => prev.filter((emp) => emp.id !== id))
    }
  }

  const handleUnitAdd = async () => {
    const unitName = prompt('Введите название подразделения:')
    if (!unitName || !unitName.trim()) {
      return
    }

    const supabase = createClient()
    const { data, error } = await supabase
      .from('org_units')
      .insert({
        department_slug: slug,
        name: unitName.trim(),
        lead_name: '',
        is_lead_vacancy: true,
        sort_order: units.length,
      })
      .select()

    if (!error && data && data.length > 0) {
      setUnits((prev) => [...prev, data[0]])
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <p className="text-slate-500">Загружаем отдел...</p>
      </div>
    )
  }

  if (!dept) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Отдел не найден</h1>
        <p className="text-slate-500 mb-6">К сожалению, информация об этом отделе недоступна</p>
        <Link href="/" className="text-purple-600 hover:underline text-sm">
          На главную
        </Link>
      </div>
    )
  }

  // Calculate headcount and vacancies
  const headcount = employees.length
  const vacancies = employees.filter((e) => e.is_vacancy).length + (dept.director_is_vacancy ? 1 : 0) + units.filter((u) => u.is_lead_vacancy).length

  const tabs = [
    { id: 'vision' as const, label: 'Видение', icon: Eye },
    { id: 'goals' as const, label: 'Цели', icon: Grid3x3 },
    { id: 'structure' as const, label: 'Структура', icon: Users },
    { id: 'documents' as const, label: 'Документы', icon: FileText },
    { id: 'services' as const, label: 'Сервисы', icon: Zap },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-6"
      >
        <ArrowLeft size={16} />
        На главную
      </Link>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">{dept.name}</h1>
        <p className="text-slate-600">{dept.description}</p>
      </div>

      {/* Key info */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <div className="bg-white border border-slate-200 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-purple-600">{headcount}</p>
          <p className="text-xs text-slate-500">Человек</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-orange-500">{vacancies}</p>
          <p className="text-xs text-slate-500">Вакансий</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <p className="text-xs text-slate-500 mb-1">Руководитель</p>
          <p className={clsx('text-sm font-semibold', dept.director_is_vacancy ? 'text-orange-600' : 'text-slate-900')}>
            {dept.director_is_vacancy ? 'ВАКАНСИЯ' : dept.director_name}
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <p className="text-xs text-slate-500 mb-1">Подчинение</p>
          <p className="text-sm font-semibold text-slate-900">{dept.reports_to}</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-1 mb-6 border-b border-slate-200 bg-white rounded-t-lg px-1 sticky top-0 z-10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={clsx(
              'px-4 py-3 text-sm font-medium transition-colors flex items-center gap-2 border-b-2 -mb-[2px]',
              activeTab === tab.id
                ? 'text-purple-600 border-purple-600'
                : 'text-slate-500 hover:text-slate-700 border-transparent'
            )}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white border border-slate-200 rounded-b-lg rounded-tr-lg p-6">
        {activeTab === 'vision' && <VisionTab slug={slug} />}
        {activeTab === 'goals' && <GoalsTab slug={slug} />}
        {activeTab === 'structure' && (
          <StructureTab
            dept={dept}
            units={units}
            employees={employees}
            onEmployeeEdit={handleEmployeeEdit}
            onEmployeeAdd={handleEmployeeAdd}
            onEmployeeDelete={handleEmployeeDelete}
            onUnitAdd={handleUnitAdd}
            readOnly={readOnly}
          />
        )}
        {activeTab === 'documents' && <DocumentsTab slug={slug} />}
        {activeTab === 'services' && <ServicesTab slug={slug} />}
      </div>
    </div>
  )
}