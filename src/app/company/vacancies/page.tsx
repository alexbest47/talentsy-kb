'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  AlertCircle,
  ArrowUpCircle,
  Clock,
  MapPin,
  Users,
  Briefcase,
  Edit2,
  Check,
  X,
} from 'lucide-react'
import clsx from 'clsx'
import { createClient } from '@/lib/supabase/client'

interface Vacancy {
  id: string
  position: string
  department: string
  reportsTo: string
  priority: 'critical' | 'high' | 'medium'
  description: string
  teamSize?: number
}

const priorityConfig = {
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
}

export default function VacanciesPage() {
  const [vacancies, setVacancies] = useState<Vacancy[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchVacancies = async () => {
      try {
        const supabase = createClient()

        // Fetch positions that are vacancies
        const { data, error } = await supabase
          .from('positions')
          .select('*')
          .eq('is_vacancy', true)
          .order('sort_order', { ascending: true })

        if (error) throw error

        // Transform positions data to Vacancy format
        const transformedVacancies: Vacancy[] = (data || []).map((pos) => ({
          id: pos.id?.toString() || pos.title,
          position: pos.title,
          department: pos.department || 'CEO',
          reportsTo: pos.reports_to || 'CEO',
          priority: pos.level === 'ceo-1' ? 'critical' : pos.level === 'ceo-2' ? 'critical' : 'high',
          description: pos.extra || pos.key_result || 'Вакансия на должность',
          teamSize: pos.subordinates?.length || 0,
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

  const handleEditStart = (vacancy: Vacancy) => {
    setEditingId(vacancy.id)
    setEditValue(vacancy.description)
  }

  const handleSave = async (vacancy: Vacancy) => {
    if (!editValue.trim()) return

    setSaving(true)
    try {
      const supabase = createClient()

      // Update the positions table
      const { error } = await supabase
        .from('positions')
        .update({ extra: editValue })
        .eq('title', vacancy.position)

      if (error) throw error

      // Update local state
      setVacancies((prev) =>
        prev.map((v) =>
          v.id === vacancy.id ? { ...v, description: editValue } : v
        )
      )

      setEditingId(null)
      setEditValue('')
    } catch (error) {
      console.error('Error saving vacancy:', error)
      alert('Ошибка при сохранении. Попробуйте снова.')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditValue('')
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
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-slate-200 rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-slate-900">{vacancies.length}</p>
          <p className="text-xs text-slate-500 mt-1">Всего вакансий</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-red-600">{criticalCount}</p>
          <p className="text-xs text-red-600 mt-1">Критический приоритет</p>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-orange-600">{highCount}</p>
          <p className="text-xs text-orange-600 mt-1">Высокий приоритет</p>
        </div>
      </div>

      {/* Vacancy Cards */}
      <div className="space-y-4">
        {vacancies.map((vacancy) => {
          const prio = priorityConfig[vacancy.priority]
          const isEditing = editingId === vacancy.id

          return (
            <div
              key={vacancy.id}
              className={clsx(
                'bg-white border rounded-lg p-5 hover:shadow-md transition-shadow',
                prio.border
              )}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {vacancy.position}
                  </h3>
                  <div className="flex items-center gap-3 mt-1.5 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <Briefcase size={14} />
                      {vacancy.department}
                    </span>
                    {vacancy.teamSize ? (
                      <span className="flex items-center gap-1">
                        <Users size={14} />
                        {vacancy.teamSize} чел. в команде
                      </span>
                    ) : null}
                  </div>
                </div>
                <span
                  className={clsx(
                    'flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0',
                    prio.bg,
                    prio.text
                  )}
                >
                  {prio.icon}
                  {prio.label}
                </span>
              </div>

              {isEditing ? (
                <div className="space-y-3 mb-3">
                  <textarea
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => handleCancel()}
                      disabled={saving}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50"
                    >
                      <X size={14} />
                      Отмена
                    </button>
                    <button
                      onClick={() => handleSave(vacancy)}
                      disabled={saving || !editValue.trim()}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      <Check size={14} />
                      Сохранить
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-sm text-slate-600 mb-3 leading-relaxed">
                    {vacancy.description}
                  </p>
                  <button
                    onClick={() => handleEditStart(vacancy)}
                    className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 mb-3"
                  >
                    <Edit2 size={13} />
                    Редактировать описание
                  </button>
                </>
              )}

              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400">
                  Подчинение: <span className="text-slate-600">{vacancy.reportsTo}</span>
                </p>
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
    </div>
  )
}
