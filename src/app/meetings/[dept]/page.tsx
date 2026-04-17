'use client'

import { use, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'
import {
  Plus,
  Calendar,
  FileText,
  ExternalLink,
  Trash2,
  MessageSquare,
  ChevronDown,
  ChevronRight,
  X,
  Search,
  Send,
  Pencil,
} from 'lucide-react'

const DEPARTMENTS: Record<string, string> = {
  dreamteam: 'DreamTeam',
  sales: 'Продажи',
  marketing: 'Маркетинг',
  product: 'Продукт',
  tech: 'Технический',
  finance: 'Финансы',
  admin: 'Администрация',
  hr: 'HR',
}

const TYPE_LABELS: Record<string, string> = {
  plan_fact: 'План / Факт',
  strategic: 'Стратегическая сессия',
  discussion: 'Обсуждение',
}

const TYPE_COLORS: Record<string, string> = {
  plan_fact: 'bg-blue-100 text-blue-700',
  strategic: 'bg-purple-100 text-purple-700',
  discussion: 'bg-amber-100 text-amber-700',
}

interface Meeting {
  id: string
  department: string
  title: string
  meeting_date: string
  meeting_type: string
  doc_id: string | null
  external_url: string | null
  doc_title?: string | null
}

interface Decision {
  id: string
  meeting_id: string
  title: string
  description: string | null
  responsible: string | null
  deadline: string | null
}

interface Comment {
  id: string
  decision_id: string
  author_name: string
  text: string
  created_at: string
}

interface DocOption {
  id: string
  title: string
}

interface FlatPerson {
  fullName: string
  position: string
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

function flattenTree(node: any, out: FlatPerson[]) {
  if (!node) return
  const fullName: string =
    node.name ||
    node.fullName ||
    node.person?.fullName ||
    node.person?.name ||
    ''
  const position: string =
    node.position ||
    node.title ||
    node.role ||
    node.person?.position ||
    node.person?.title ||
    ''
  if (fullName) {
    out.push({ fullName, position })
  }
  ;(node.children || []).forEach((c: any) => flattenTree(c, out))
}

function DocPickerModal({
  onClose,
  onPick,
}: {
  onClose: () => void
  onPick: (d: DocOption) => void
}) {
  const [docs, setDocs] = useState<DocOption[]>([])
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [newTitle, setNewTitle] = useState('')

  useEffect(() => {
    getSupabase()
      .from('documents')
      .select('id,title')
      .order('created_at', { ascending: false })
      .limit(300)
      .then(({ data }: any) => {
        setDocs(data || [])
        setLoading(false)
      })
  }, [])

  const createNewDoc = async () => {
    const title = newTitle.trim()
    if (!title) return
    setCreating(true)
    const { data } = await getSupabase()
      .from('documents')
      .insert({ title, category: 'Планерка', status: 'published' })
      .select('id,title')
      .single()
    setCreating(false)
    if (data) {
      onPick(data as DocOption)
      onClose()
    }
  }
  const filtered = useMemo(
    () => docs.filter((d) => d.title.toLowerCase().includes(q.toLowerCase())),
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
        <div className="p-4 border-b space-y-3">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Поиск..."
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm"
            />
          </div>
          <div className="flex gap-2">
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && createNewDoc()}
              placeholder="Название нового документа..."
              className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm"
            />
            <button
              onClick={createNewDoc}
              disabled={!newTitle.trim() || creating}
              className="px-3 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50 whitespace-nowrap"
            >
              {creating ? '...' : '+ Создать'}
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <p className="p-4 text-center text-slate-500 text-sm">Загрузка...</p>
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

function CreateMeetingModal({
  department,
  existing,
  onClose,
  onCreated,
}: {
  department: string
  existing?: Meeting | null
  onClose: () => void
  onCreated: () => void
}) {
  const isEdit = !!existing
  const [title, setTitle] = useState(existing?.title || '')
  const [date, setDate] = useState(
    existing?.meeting_date || new Date().toISOString().slice(0, 10)
  )
  const [type, setType] = useState(existing?.meeting_type || 'plan_fact')
  const [doc, setDoc] = useState<DocOption | null>(
    existing?.doc_id && existing?.doc_title
      ? { id: existing.doc_id, title: existing.doc_title }
      : null
  )
  const [externalUrl, setExternalUrl] = useState(existing?.external_url || '')
  const [pickerOpen, setPickerOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  const submit = async () => {
    setSaving(true)
    const finalTitle =
      title.trim() ||
      `${TYPE_LABELS[type]} ${new Date(date).toLocaleDateString('ru-RU')}`
    const payload = {
      department,
      title: finalTitle,
      meeting_date: date,
      meeting_type: type,
      doc_id: doc?.id || null,
      external_url: externalUrl.trim() || null,
    }
    if (isEdit && existing) {
      await getSupabase().from('meetings').update(payload).eq('id', existing.id)
    } else {
      await getSupabase().from('meetings').insert(payload)
    }
    setSaving(false)
    onCreated()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-lg">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-bold text-slate-900">{isEdit ? 'Редактировать планерку' : 'Новая планерка'}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Название (необязательно)
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm"
              placeholder="Например: Еженедельная планерка"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Дата
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Тип
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm"
              >
                <option value="plan_fact">План / Факт</option>
                <option value="strategic">Стратегическая сессия</option>
                <option value="discussion">Обсуждение</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Документ из системы
            </label>
            <div className="mt-1 flex items-center gap-2">
              {doc ? (
                <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg text-sm">
                  <FileText size={14} className="text-slate-400" />
                  <span className="flex-1 truncate">{doc.title}</span>
                  <button
                    onClick={() => setDoc(null)}
                    className="text-slate-400 hover:text-red-600"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setPickerOpen(true)}
                  className="flex-1 px-3 py-2 border border-dashed border-slate-300 rounded-lg text-sm text-slate-500 hover:border-purple-400 hover:text-purple-600"
                >
                  + Прикрепить документ
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Ссылка на запись (внешняя)
            </label>
            <input
              value={externalUrl}
              onChange={(e) => setExternalUrl(e.target.value)}
              placeholder="https://..."
              className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono"
            />
          </div>
        </div>
        <div className="p-4 border-t flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            Отмена
          </button>
          <button
            onClick={submit}
            disabled={saving}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50"
          >
            {saving ? 'Сохраняем...' : isEdit ? 'Сохранить' : 'Создать'}
          </button>
        </div>
      </div>
      {pickerOpen && (
        <DocPickerModal
          onClose={() => setPickerOpen(false)}
          onPick={(d) => setDoc(d)}
        />
      )}
    </div>
  )
}

function DecisionRow({
  decision,
  index,
  people,
  onUpdate,
  onDelete,
}: {
  decision: Decision
  index: number
  people: FlatPerson[]
  onUpdate: (patch: Partial<Decision>) => void
  onDelete: () => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [loadingC, setLoadingC] = useState(false)

  const loadComments = async () => {
    setLoadingC(true)
    const { data } = await getSupabase()
      .from('meeting_decision_comments')
      .select('*')
      .eq('decision_id', decision.id)
      .order('created_at', { ascending: true })
    setComments((data as Comment[]) || [])
    setLoadingC(false)
  }

  useEffect(() => {
    if (expanded) loadComments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded])

  const addComment = async () => {
    if (!newComment.trim()) return
    await getSupabase().from('meeting_decision_comments').insert({
      decision_id: decision.id,
      author_name: 'Текущий пользователь',
      text: newComment.trim(),
    })
    setNewComment('')
    loadComments()
  }

  const saveField = async (patch: Partial<Decision>) => {
    onUpdate(patch)
    await getSupabase()
      .from('meeting_decisions')
      .update(patch)
      .eq('id', decision.id)
  }

  return (
    <div className="border border-slate-200 rounded-lg bg-white">
      <div className="p-3 space-y-2">
        <div className="flex items-start gap-2">
          <span className="flex-shrink-0 w-7 h-7 mt-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold flex items-center justify-center">
            #{index + 1}
          </span>
          <input
            defaultValue={decision.title}
            onBlur={(e) => saveField({ title: e.target.value })}
            placeholder="Решение"
            className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium"
          />
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 text-slate-500 hover:text-purple-600 hover:bg-slate-50 rounded-lg"
            title="Комментарии"
          >
            <MessageSquare size={16} />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-slate-50 rounded-lg"
          >
            <Trash2 size={16} />
          </button>
        </div>
        <textarea
          defaultValue={decision.description || ''}
          onBlur={(e) => saveField({ description: e.target.value })}
          placeholder="Описание..."
          rows={2}
          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm ml-9"
          style={{ width: 'calc(100% - 2.25rem)' }}
        />
        <div className="flex items-center gap-2 ml-9">
          <select
            value={decision.responsible || ''}
            onChange={(e) => saveField({ responsible: e.target.value })}
            className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
          >
            <option value="">
              {people.length === 0
                ? '— Сотрудники не загружены —'
                : '— Ответственный —'}
            </option>
            {people.map((p, i) => (
              <option key={i} value={`${p.position} — ${p.fullName}`}>
                {p.position ? `${p.position} — ${p.fullName}` : p.fullName}
              </option>
            ))}
          </select>
          <input
            type="date"
            defaultValue={decision.deadline || ''}
            onBlur={(e) => saveField({ deadline: e.target.value || null })}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm"
          />
        </div>
      </div>
      {expanded && (
        <div className="px-3 pb-3 border-t border-slate-200 bg-white rounded-b-lg">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-3 mb-2">
            История комментариев
          </p>
          <div className="space-y-2 mb-3">
            {loadingC ? (
              <p className="text-xs text-slate-400">Загрузка...</p>
            ) : comments.length === 0 ? (
              <p className="text-xs text-slate-400 italic">Комментариев пока нет</p>
            ) : (
              comments.map((c) => (
                <div key={c.id} className="bg-slate-50 rounded p-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-slate-700">
                      {c.author_name}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(c.created_at).toLocaleString('ru-RU')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 whitespace-pre-wrap">
                    {c.text}
                  </p>
                </div>
              ))
            )}
          </div>
          <div className="flex gap-2">
            <input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addComment()}
              placeholder="Добавить комментарий..."
              className="flex-1 px-3 py-1.5 border border-slate-200 rounded text-xs"
            />
            <button
              onClick={addComment}
              disabled={!newComment.trim()}
              className="px-3 py-1.5 bg-purple-600 text-white rounded text-xs disabled:opacity-50"
            >
              <Send size={12} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function MeetingCard({
  meeting,
  people,
  onDelete,
  onEdit,
}: {
  meeting: Meeting
  people: FlatPerson[]
  onDelete: () => void
  onEdit: () => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [decisions, setDecisions] = useState<Decision[]>([])
  const [loading, setLoading] = useState(false)

  const loadDecisions = async () => {
    setLoading(true)
    const { data } = await getSupabase()
      .from('meeting_decisions')
      .select('*')
      .eq('meeting_id', meeting.id)
      .order('created_at', { ascending: true })
    setDecisions((data as Decision[]) || [])
    setLoading(false)
  }

  useEffect(() => {
    if (expanded && decisions.length === 0) loadDecisions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded])

  const addDecision = async () => {
    const { data } = await getSupabase()
      .from('meeting_decisions')
      .insert({ meeting_id: meeting.id, title: 'Новое решение' })
      .select()
      .single()
    if (data) setDecisions([...decisions, data as Decision])
  }

  const updateDecision = (id: string, patch: Partial<Decision>) => {
    setDecisions((arr) => arr.map((d) => (d.id === id ? { ...d, ...patch } : d)))
  }

  const deleteDecision = async (id: string) => {
    if (!confirm('Удалить решение?')) return
    await getSupabase().from('meeting_decisions').delete().eq('id', id)
    setDecisions((arr) => arr.filter((d) => d.id !== id))
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
      <div
        className="p-4 cursor-pointer hover:bg-slate-50"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            <div className="text-slate-400 mt-1">
              {expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-slate-900">{meeting.title}</h3>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${TYPE_COLORS[meeting.meeting_type]}`}
                >
                  {TYPE_LABELS[meeting.meeting_type]}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Calendar size={12} />
                  {new Date(meeting.meeting_date).toLocaleDateString('ru-RU')}
                </span>
                {meeting.doc_id && meeting.doc_title && (
                  <Link
                    href={`/docs/${meeting.doc_id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1 text-purple-600 hover:underline"
                  >
                    <FileText size={12} />
                    {meeting.doc_title}
                  </Link>
                )}
                {meeting.external_url && (
                  <a
                    href={meeting.external_url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1 text-purple-600 hover:underline"
                  >
                    <ExternalLink size={12} />
                    Запись
                  </a>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onEdit()
              }}
              className="text-slate-400 hover:text-purple-600 p-1"
              title="Редактировать"
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                if (confirm('Удалить планерку?')) onDelete()
              }}
              className="text-slate-400 hover:text-red-600 p-1"
              title="Удалить"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
      {expanded && (
        <div className="border-t border-slate-200 p-4 bg-slate-50">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-sm text-slate-700">
              Реестр принятых решений
            </h4>
            <button
              onClick={addDecision}
              className="inline-flex items-center gap-1 px-2 py-1 bg-slate-900 text-white rounded text-xs font-medium hover:bg-slate-800"
            >
              <Plus size={12} /> Решение
            </button>
          </div>
          {loading ? (
            <p className="text-xs text-slate-400">Загрузка...</p>
          ) : decisions.length === 0 ? (
            <p className="text-xs text-slate-400 italic">
              Решения по этой планерке пока не зафиксированы
            </p>
          ) : (
            <div className="space-y-2">
              {decisions.map((d, i) => (
                <DecisionRow
                  key={d.id}
                  decision={d}
                  index={i}
                  people={people}
                  onUpdate={(p) => updateDecision(d.id, p)}
                  onDelete={() => deleteDecision(d.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function MeetingsDeptPage({
  params,
}: {
  params: Promise<{ dept: string }>
}) {
  const { dept } = use(params)
  const deptName = DEPARTMENTS[dept] || dept
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [loading, setLoading] = useState(true)
  const [createOpen, setCreateOpen] = useState(false)
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null)
  const [people, setPeople] = useState<FlatPerson[]>([])
  const [filter, setFilter] = useState<string>('all')

  const load = async () => {
    setLoading(true)
    const supabase = getSupabase()
    const { data: ms } = await supabase
      .from('meetings')
      .select('*, documents(title)')
      .eq('department', dept)
      .order('meeting_date', { ascending: false })
    const mapped: Meeting[] = (ms || []).map((m: any) => ({
      ...m,
      doc_title: m.documents?.title || null,
    }))
    setMeetings(mapped)
    setLoading(false)
  }

  useEffect(() => {
    load()
    // load people from org_tree
    getSupabase()
      .from('org_tree')
      .select('data')
      .limit(1)
      .maybeSingle()
      .then(({ data }: any) => {
        if (data?.data) {
          const out: FlatPerson[] = []
          flattenTree(data.data, out)
          // dedupe
          const seen = new Set<string>()
          const uniq = out.filter((p) => {
            const k = `${p.position}|${p.fullName}`
            if (seen.has(k)) return false
            seen.add(k)
            return true
          })
          setPeople(uniq)
        }
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dept])

  const deleteMeeting = async (id: string) => {
    await getSupabase().from('meetings').delete().eq('id', id)
    setMeetings((arr) => arr.filter((m) => m.id !== id))
  }

  const filtered = useMemo(
    () =>
      filter === 'all' ? meetings : meetings.filter((m) => m.meeting_type === filter),
    [meetings, filter]
  )

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
            Планерки
          </p>
          <h1 className="text-3xl font-bold text-slate-900">{deptName}</h1>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700"
        >
          <Plus size={16} /> Новая планерка
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        {[
          { v: 'all', l: 'Все' },
          { v: 'plan_fact', l: 'План / Факт' },
          { v: 'strategic', l: 'Стратегические' },
          { v: 'discussion', l: 'Обсуждения' },
        ].map((b) => (
          <button
            key={b.v}
            onClick={() => setFilter(b.v)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
              filter === b.v
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            {b.l}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-slate-500 text-sm p-8 text-center">Загрузка...</p>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-lg p-12 text-center text-slate-500 text-sm">
          Планерок пока нет. Нажмите «Новая планерка», чтобы создать первую.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((m) => (
            <MeetingCard
              key={m.id}
              meeting={m}
              people={people}
              onDelete={() => deleteMeeting(m.id)}
              onEdit={() => setEditingMeeting(m)}
            />
          ))}
        </div>
      )}

      {createOpen && (
        <CreateMeetingModal
          department={dept}
          onClose={() => setCreateOpen(false)}
          onCreated={load}
        />
      )}

      {editingMeeting && (
        <CreateMeetingModal
          department={dept}
          existing={editingMeeting}
          onClose={() => setEditingMeeting(null)}
          onCreated={load}
        />
      )}
    </div>
  )
}
