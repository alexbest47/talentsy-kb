'use client'

import { useEffect, useState, useRef } from 'react'
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
} from 'lucide-react'
import clsx from 'clsx'
import { createClient } from '@/lib/supabase/client'

type Priority = 'critical' | 'high' | 'medium' | 'low'

interface Vacancy {
  id: string
  position: string
  department: string
  reportsTo: string
  priority: Priority
  teamSize: number
  vacancyDocId: string | null
  vacancyDocTitle: string | null
  level: string
  subordinates: string[]
}

interface DocOption {
  id: string
  title: string
  category: string | null
  updated_at: string | null
}

const priorityConfig: Record<Priority, { label: string; bg: string; text: string; border: string; icon: React.ReactNode; dot: string }> = {
  critical: {
    label: 'Критический',
    bg: 'bg-red-100',
    text: 'text-red-700',
    border: 'border-red-200',
    icon: <AlertCircle size={14} />,
    dot: 'bg-red-500',
  },
  high: {
    label: 'Высокий',
    bg: 'bg-orange-100',
    text: 'text-orange-700',
    border: 'border-orange-200',
    icon: <ArrowUpCircle size={14} />,
    dot: 'bg-orange-500',
  },
  medium: {
    label: 'Средний',
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    border: 'border-blue-200',
    icon: <Clock size={14} />,
    dot: 'bg-blue-500',
  },
  low: {
    label: 'Низкий',
    bg: 'bg-slate-100',
    text: 'text-slate-600',
    border: 'border-slate-200',
    icon: <MinusCircle size={14} />,
    dot: 'bg-slate-400',
  },
}

const priorityOrder: Priority[] = ['critical', 'high', 'medium', 'low']

/* ─── Document Picker Modal ─── */
function DocPickerModal({
  vacancy,
  onClose,
  onSelect,
  onUnlink,
}: {
  vacancy: Vacancy
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
          .eq('status', 'published')
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

  const filtered = search.trim()
    ? docs.filter((d) => d.title.toLowerCase().includes(search.toLowerCase()))
    : docs

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <div>
            <h3 className="text-base font-bold text-slate-900">Документ для вакансии</h3>
            <p className="text-xs text-slate-500 mt-0.5">{vacancy.position}</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
            <X size={18} className="text-slate-400" />
          </button>
        </div>

        {/* Actions row */}
        <div className="px-5 py-3 border-b border-slate-100 flex gap-2">
          <button
            onClick={() => {
              router.push(
                `/docs/new?title=${encodeURIComponent('Вакансия: ' + vacancy.position)}&category=${encodeURIComponent('Описание вакансии')}&linkPositionId=${vacancy.id}`
              )
            }}
            className="flex items-center gap-1.5 px-3 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus size={15} />
            Создать новый документ
          </button>
          {vacancy.vacancyDocId && (
            <button
              onClick={() => {
                onUnlink()
                onClose()
              }}
              className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 text-sm text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Unlink size={14} />
              Отвязать
            </button>
          )}
        </div>

        {/* Search */}
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

        {/* Documents list */}
        <div className="flex-1 overflow-y-auto px-2 py-2">
          {loading ? (
            <div className="text-center py-8 text-sm text-slate-500">Загрузка документов...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-8 text-sm text-slate-500">
              {search ? 'Документы не найдены' : 'Нет опубликованных документов'}
            </div>
          ) : (
            <div className="space-y-0.5">
              {filtered.map((doc) => {
                const isLinked = doc.id === vacancy.vacancyDocId
                return (
                  <button
                    key={doc.id}
                    onClick={() => {
                      onSelect(doc.id, doc.title)
                      onClose()
                    }}
                    className={clsx(
                      'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors',
                      isLinked
                        ? 'bg-purple-50 border border-purple-200'
                        : 'hover:bg-slate-50'
                    )}
                  >
                    <FileText
                      size={16}
                      className={isLinked ? 'text-purple-600 flex-shrink-0' : 'text-slate-400 flex-shrink-0'}
                    />
                    <div className="min-w-0 flex-1">
                      <p className={clsx('text-sm truncate', isLinked ? 'font-medium text-purple-700' : 'text-slate-700')}>
                        {doc.title}
                      </p>
                      {doc.category && (
                        <p className="text-xs text-slate-400 mt-0.5">{doc.category}</p>
                      )}
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

/* ─── Main Page ─── */
export default function VacanciesPage() {
  const [vacancies, setVacancies] = useState<Vacancy[]>([])
  const [loading, setLoading] = useState(true)
  const [savingPriority, setSavingPriority] = useState<string | null>(null)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [docPickerFor, setDocPickerFor] = useState<string | null>(null)

  useEffect(() => {
    const fetchVacancies = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('positions')
          .select('*')
          .eq('is_vacancy', true)
          .order('sort_order', { ascending: true })

        if (error) throw error

        // Fetch document titles for linked vacancies
        const docIds = (data || [])
          .map((p) => p.vacancy_doc_id)
          .filter(Boolean) as string[]

        let docTitles: Record<string, string> = {}
        if (docIds.length > 0) {
          const { data: docs } = await supabase
            .from('documents')
            .select('id, title')
            .in('id', docIds)

          if (docs) {
            docTitles = Object.fromEntries(docs.map((d) => [d.id, d.title]))
          }
        }

        const transformedVacancies: Vacancy[] = (data || []).map((pos) => ({
          id: pos.id?.toString() || pos.title,
          position: pos.title,
          department: pos.department || 'Руководство',
          reportsTo: pos.reports_to || 'CEO',
          priority: (pos.priority as Priority) || (pos.level === 'ceo-1' || pos.level === 'ceo-2' ? 'critical' : 'high'),
          teamSize: pos.subordinates?.length || 0,
          vacancyDocId: pos.vacancy_doc_id || null,
          vacancyDocTitle: pos.vacancy_doc_id ? (docTitles[pos.vacancy_doc_id] || 'Документ') : null,
          level: pos.level || 'ceo-3',
          subordinates: pos.subordinates || [],
        }))

        setVacancies(transformedVacancies)
      } catch (error) {
        console.error('Error fetching vacancies:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchVacancies()
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = () => setOpenDropdown(null)
    if (openDropdown) {
      document.addEventListener('click', handleClick)
      return () => document.removeEventListener('click', handleClick)
    }
  }, [openDropdown])

  const handlePriorityChange = async (vacancy: Vacancy, newPriority: Priority) => {
    setOpenDropdown(null)
    if (newPriority === vacancy.priority) return

    setSavingPriority(vacancy.id)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('positions')
        .update({ priority: newPriority })
        .eq('id', vacancy.id)

      if (error) throw error

      setVacancies((prev) =>
        prev.map((v) =>
          v.id === vacancy.id ? { ...v, priority: newPriority } : v
        )
      )
    } catch (error) {
      console.error('Error updating priority:', error)
    } finally {
      setSavingPriority(null)
    }
  }

  const handleDocSelect = async (vacancyId: string, docId: string, docTitle: string) => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('positions')
        .update({ vacancy_doc_id: docId })
        .eq('id', vacancyId)

      if (error) throw error

      setVacancies((prev) =>
        prev.map((v) =>
          v.id === vacancyId ? { ...v, vacancyDocId: docId, vacancyDocTitle: docTitle } : v
        )
      )
    } catch (error) {
      console.error('Error linking document:', error)
    }
  }

  const handleDocUnlink = async (vacancyId: string) => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('positions')
        .update({ vacancy_doc_id: null })
        .eq('id', vacancyId)

      if (error) throw error

      setVacancies((prev) =>
        prev.map((v) =>
          v.id === vacancyId ? { ...v, vacancyDocId: null, vacancyDocTitle: null } : v
        )
      )
    } catch (error) {
      console.error('Error unlinking document:', error)
    }
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="text-center py-12">
          <p className="text-slate-600">Загрузка вакансий...</p>
        </div>
      </div>
    )
  }

  const criticalCount = vacancies.filter((v) => v.priority === 'critical').length
  const highCount = vacancies.filter((v) => v.priority === 'high').length
  const mediumCount = vacancies.filter((v) => v.priority === 'medium').length
  const lowCount = vacancies.filter((v) => v.priority === 'low').length
  const pickerVacancy = docPickerFor ? vacancies.find((v) => v.id === docPickerFor) : null

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <Link
          href="/company/structure"
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-4"
        >
          <ArrowLeft size={16} />
          Назад к оргструктуре
        </Link>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Открытые вакансии
        </h1>
        <p className="text-slate-600">
          Позиции, которые требуют заполнения для полноценной работы компании
        </p>
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
      <div className="space-y-4">
        {vacancies.map((vacancy) => {
          const prio = priorityConfig[vacancy.priority]
          const isDropdownOpen = openDropdown === vacancy.id
          const isSaving = savingPriority === vacancy.id

          return (
            <div
              key={vacancy.id}
              className={clsx(
                'bg-white border rounded-lg p-5 hover:shadow-md transition-shadow',
                prio.border
              )}
            >
              {/* Header: Title + Priority dropdown */}
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-bold text-slate-900">
                    {vacancy.position}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 mt-1.5 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <Briefcase size={14} />
                      {vacancy.department}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={14} />
                      {vacancy.teamSize > 0
                        ? `${vacancy.teamSize} чел. в команде`
                        : 'Формирование команды'}
                    </span>
                  </div>
                </div>

                {/* Priority Dropdown */}
                <div className="relative flex-shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setOpenDropdown(isDropdownOpen ? null : vacancy.id)
                    }}
                    disabled={isSaving}
                    className={clsx(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all',
                      prio.bg,
                      prio.text,
                      isSaving && 'opacity-50'
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
                            onClick={(e) => {
                              e.stopPropagation()
                              handlePriorityChange(vacancy, p)
                            }}
                            className={clsx(
                              'w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50 transition-colors text-left',
                              vacancy.priority === p && 'bg-slate-50 font-medium'
                            )}
                          >
                            <span className={clsx('w-2 h-2 rounded-full flex-shrink-0', cfg.dot)} />
                            <span className={cfg.text}>{cfg.label}</span>
                            {vacancy.priority === p && (
                              <span className="ml-auto text-purple-600 text-xs">&#10003;</span>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Document link or add button */}
              <div className="mb-3 flex items-center gap-2">
                {vacancy.vacancyDocId ? (
                  <>
                    <Link
                      href={`/docs/${vacancy.vacancyDocId}`}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors group"
                    >
                      <FileText size={16} className="text-purple-600" />
                      <span className="text-sm font-medium text-purple-700">
                        {vacancy.vacancyDocTitle || 'Описание вакансии'}
                      </span>
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
                    <span className="text-sm text-slate-500 group-hover:text-slate-700">
                      + Добавить описание вакансии
                    </span>
                  </button>
                )}
              </div>

              {/* Footer: Reports to */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <p className="text-xs text-slate-400">
                  Подчинение: <span className="text-slate-600">{vacancy.reportsTo}</span>
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

      {/* Contact HR */}
      <div className="mt-10 p-6 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
        <h2 className="text-xl font-bold text-slate-900 mb-2">
          Знаете подходящего кандидата?
        </h2>
        <p className="text-slate-600 text-sm mb-4">
          Свяжитесь с HR-отделом для рекомендации кандидата. Мы ценим внутренние рекомендации!
        </p>
        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-slate-200">
            <Users size={16} className="text-purple-600" />
            <span className="text-slate-700">Немченко Денис Игоревич — HR директор</span>
          </div>
        </div>
      </div>

      {/* Document Picker Modal */}
      {pickerVacancy && (
        <DocPickerModal
          vacancy={pickerVacancy}
          onClose={() => setDocPickerFor(null)}
          onSelect={(docId, docTitle) => handleDocSelect(pickerVacancy.id, docId, docTitle)}
          onUnlink={() => handleDocUnlink(pickerVacancy.id)}
        />
      )}
    </div>
  )
}
