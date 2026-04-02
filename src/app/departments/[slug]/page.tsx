'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Users, UserX, User, Plus, Edit, Trash2, ExternalLink, Grid3x3, FileText, Zap, Check, X, Eye } from 'lucide-react'
import clsx from 'clsx'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

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

interface Document {
  id: string
  product_id: string
  title: string
  url: string
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

function EmployeeRow({
  employee,
  onEdit,
  onSave,
  onDelete,
  editingId,
}: {
  employee: OrgEmployee
  onEdit: (id: string) => void
  onSave: (id: string, name: string, role: string, note: string | null) => void
  onDelete: (id: string) => void
  editingId: string | null
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
          <input
            type="text"
            value={editRole}
            onChange={(e) => setEditRole(e.target.value)}
            placeholder="Должность"
            className="w-full text-sm px-2 py-1 border border-slate-300 rounded"
          />
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
      <button
        onClick={() => onEdit(employee.id)}
        className="p-1.5 text-slate-400 opacity-0 group-hover:opacity-100 hover:text-purple-600 hover:bg-purple-50 rounded transition-all flex-shrink-0"
      >
        <Edit size={14} />
      </button>
      <button
        onClick={() => onDelete(employee.id)}
        className="p-1.5 text-slate-400 opacity-0 group-hover:opacity-100 hover:text-red-600 hover:bg-red-50 rounded transition-all flex-shrink-0"
      >
        <Trash2 size={14} />
      </button>
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
}: {
  dept: DepartmentData
  units: OrgUnit[]
  employees: OrgEmployee[]
  onEmployeeEdit: (id: string, name: string, role: string, note: string | null) => void
  onEmployeeAdd: (name: string, role: string, note: string | null, addingTo: 'direct' | string) => void
  onEmployeeDelete: (id: string) => void
  onUnitAdd: () => void
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
        <button className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 text-sm text-purple-600 hover:bg-purple-50 rounded transition-colors">
          <Edit size={14} />
          Редактировать
        </button>
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
              />
            ))}
            {addingTo === 'direct' && (
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
                  <input
                    type="text"
                    value={addRole}
                    onChange={(e) => setAddRole(e.target.value)}
                    placeholder="Должность"
                    className="w-full text-sm px-2 py-1 border border-slate-300 rounded"
                  />
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
          <button
            onClick={() => setAddingTo('direct')}
            className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 text-sm text-purple-600 hover:bg-purple-50 rounded transition-colors"
          >
            <Plus size={14} />
            Добавить сотрудника
          </button>
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
                  />
                ))}
                {addingTo === unit.id && (
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
                      <input
                        type="text"
                        value={addRole}
                        onChange={(e) => setAddRole(e.target.value)}
                        placeholder="Должность"
                        className="w-full text-sm px-2 py-1 border border-slate-300 rounded"
                      />
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
            <button
              onClick={() => setAddingTo(unit.id)}
              className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 text-sm text-purple-600 hover:bg-purple-50 rounded transition-colors"
            >
              <Plus size={14} />
              Добавить сотрудника
            </button>
          </div>
        )
      })}

      {/* Add sub-unit */}
      <div className="pt-4">
        <button
          onClick={onUnitAdd}
          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
        >
          <Plus size={16} />
          Добавить подразделение
        </button>
      </div>
    </>
  )
}

function GoalsTab({ slug }: { slug: string }) {
  const [goals, setGoals] = useState<DepartmentGoal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGoals = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('department_goals')
        .select('*')
        .eq('department_slug', slug)
        .order('sort_order', { ascending: true })

      if (!error && data) {
        setGoals(data)
      }
      setLoading(false)
    }

    fetchGoals()
  }, [slug])

  const goalsGrouped = goals.reduce((acc, goal) => {
    if (!acc[goal.quarter]) {
      acc[goal.quarter] = []
    }
    acc[goal.quarter].push(goal)
    return acc
  }, {} as Record<string, DepartmentGoal[]>)

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-500">Загружаем цели...</p>
      </div>
    )
  }

  if (goals.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 mb-4">Целей ещё не добавлено</p>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
          <Plus size={16} />
          Добавить цель
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {Object.entries(goalsGrouped).map(([quarter, quarterGoals]) => (
        <div key={quarter}>
          <h3 className="text-lg font-bold text-slate-900 mb-3">{quarter}</h3>
          <div className="space-y-2">
            {quarterGoals.map((goal) => (
              <div key={goal.id} className="bg-white border border-slate-200 rounded-lg p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">{goal.text}</p>
                    {goal.metric && (
                      <p className="text-xs text-slate-500 mt-2">Метрика: {goal.metric}</p>
                    )}
                    <div className="flex items-center gap-2 mt-3">
                      <span className={clsx(
                        'text-[11px] font-semibold px-2 py-1 rounded',
                        goal.status === 'завершена' ? 'bg-green-100 text-green-700' :
                        goal.status === 'в работе' ? 'bg-blue-100 text-blue-700' :
                        'bg-slate-100 text-slate-700'
                      )}>
                        {goal.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors">
                      <Edit size={16} />
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="pt-4">
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
          <Plus size={16} />
          Добавить цель
        </button>
      </div>
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
        .select('*')
        .eq('product_id', slug)
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
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
          <Plus size={16} />
          Добавить документ
        </button>
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
                  {new Date(doc.created_at).toLocaleDateString('ru-RU')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-purple-600 bg-purple-50 rounded hover:bg-purple-100 transition-colors"
              >
                <ExternalLink size={14} />
                Открыть
              </a>
              <button className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors">
                <Edit size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="pt-4">
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
          <Plus size={16} />
          Добавить документ
        </button>
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
                : 'text-slate-600 border-transparent hover:text-slate-900'
            )}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-b-lg p-6 border border-slate-200 border-t-0">
        {activeTab === 'vision' && <VisionTab slug={slug} />}
        {activeTab === 'structure' && (
          <StructureTab
            dept={dept}
            units={units}
            employees={employees}
            onEmployeeEdit={handleEmployeeEdit}
            onEmployeeAdd={handleEmployeeAdd}
            onEmployeeDelete={handleEmployeeDelete}
            onUnitAdd={handleUnitAdd}
          />
        )}
        {activeTab === 'goals' && <GoalsTab slug={slug} />}
        {activeTab === 'documents' && <DocumentsTab slug={slug} />}
        {activeTab === 'services' && <ServicesTab slug={slug} />}
      </div>
    </div>
  )
}
