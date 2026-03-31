'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ChevronDown, ChevronRight, User, UserX, Users, BarChart3, Edit2, Check, X } from 'lucide-react'
import clsx from 'clsx'
import { createClient } from '@/lib/supabase/client'

interface Position {
  id?: number
  title: string
  holder: string
  is_vacancy?: boolean
  level: 'ceo-1' | 'ceo-2' | 'ceo-3'
  department?: string
  reports_to: string
  subordinates: string[]
  key_result: string
  responsibilities: string[]
  metrics: string[]
  extra?: string
  sort_order?: number
}

function PositionCard({ pos }: { pos: Position }) {
  const [expanded, setExpanded] = useState(false)
  const [editing, setEditing] = useState<keyof Position | null>(null)
  const [editValue, setEditValue] = useState('')
  const [saving, setSaving] = useState(false)

  const handleEditStart = (field: keyof Position) => {
    setEditing(field)
    const value = pos[field]
    if (Array.isArray(value)) {
      setEditValue(value.join('\n'))
    } else {
      setEditValue(String(value || ''))
    }
  }

  const handleSave = async (field: keyof Position) => {
    if (!editValue.trim()) return

    setSaving(true)
    try {
      const supabase = createClient()

      let updateData: any = {}
      if (['responsibilities', 'metrics'].includes(field)) {
        updateData[field] = editValue
          .split('\n')
          .map((s) => s.trim())
          .filter((s) => s.length > 0)
      } else {
        updateData[field] = editValue
      }

      const { error } = await supabase
        .from('positions')
        .update(updateData)
        .eq('id', pos.id)

      if (error) throw error

      // Update local position object
      Object.assign(pos, updateData)
      setEditing(null)
      setEditValue('')
    } catch (error) {
      console.error('Error saving position:', error)
      alert('Ошибка при сохранении. Попробуйте снова.')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setEditing(null)
    setEditValue('')
  }

  const renderField = (field: keyof Position, value: any) => {
    if (field === 'responsibilities' || field === 'metrics') {
      if (editing === field) {
        return (
          <div className="space-y-2">
            <textarea
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={6}
              placeholder="По одному пункту на строку"
            />
            <div className="flex gap-2">
              <button
                onClick={() => handleCancel()}
                disabled={saving}
                className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-slate-700 border border-slate-300 rounded hover:bg-slate-50"
              >
                <X size={12} />
                Отмена
              </button>
              <button
                onClick={() => handleSave(field)}
                disabled={saving}
                className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                <Check size={12} />
                Сохранить
              </button>
            </div>
          </div>
        )
      }
      return (
        <div className="space-y-2">
          {(value as string[]).map((item, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
              <p className="text-sm text-slate-700 leading-relaxed">{item}</p>
            </div>
          ))}
          <button
            onClick={() => handleEditStart(field)}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 mt-2"
          >
            <Edit2 size={12} />
            Редактировать
          </button>
        </div>
      )
    }

    if (field === 'key_result' || field === 'extra') {
      if (editing === field) {
        return (
          <div className="space-y-2">
            <textarea
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
            <div className="flex gap-2">
              <button
                onClick={() => handleCancel()}
                disabled={saving}
                className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-slate-700 border border-slate-300 rounded hover:bg-slate-50"
              >
                <X size={12} />
                Отмена
              </button>
              <button
                onClick={() => handleSave(field)}
                disabled={saving}
                className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                <Check size={12} />
                Сохранить
              </button>
            </div>
          </div>
        )
      }
      return (
        <div>
          <p className="text-slate-800 font-semibold leading-relaxed mb-2">{value}</p>
          <button
            onClick={() => handleEditStart(field)}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700"
          >
            <Edit2 size={12} />
            Редактировать
          </button>
        </div>
      )
    }

    return value
  }

  return (
    <div
      className={clsx(
        'border rounded-lg overflow-hidden transition-shadow',
        pos.is_vacancy ? 'border-orange-200' : 'border-slate-200',
        expanded && 'shadow-md'
      )}
    >
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className={clsx(
          'w-full flex items-center gap-4 p-5 text-left transition-colors',
          pos.is_vacancy ? 'bg-orange-50 hover:bg-orange-100/70' : 'bg-white hover:bg-slate-50'
        )}
      >
        <div
          className={clsx(
            'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
            pos.is_vacancy ? 'bg-orange-200 text-orange-700' : 'bg-purple-100 text-purple-600'
          )}
        >
          {pos.is_vacancy ? <UserX size={20} /> : <User size={20} />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-slate-900">{pos.title}</h3>
            <span
              className={clsx(
                'text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider',
                pos.level === 'ceo-1'
                  ? 'bg-purple-100 text-purple-700'
                  : pos.level === 'ceo-2'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-green-100 text-green-700'
              )}
            >
              {pos.level === 'ceo-1' ? 'CEO-1' : pos.level === 'ceo-2' ? 'CEO-2' : 'CEO-3'}
            </span>
            {pos.department && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                {pos.department}
              </span>
            )}
          </div>
          <p
            className={clsx(
              'text-sm mt-0.5',
              pos.is_vacancy ? 'text-orange-600 font-medium' : 'text-slate-500'
            )}
          >
            {pos.is_vacancy ? 'ВАКАНСИЯ' : pos.holder}
          </p>
        </div>
        {expanded ? (
          <ChevronDown size={20} className="text-slate-400 flex-shrink-0" />
        ) : (
          <ChevronRight size={20} className="text-slate-400 flex-shrink-0" />
        )}
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="border-t border-slate-200 bg-white">
          {/* Key result */}
          <div className="p-5 bg-gradient-to-r from-purple-50 to-blue-50 border-b border-slate-100">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-2">
              Ключевой результат
            </p>
            {renderField('key_result', pos.key_result)}
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 border-b border-slate-100">
            <div className="p-4 border-r border-slate-100">
              <p className="text-xs text-slate-400 mb-1">Подчиняется</p>
              <p className="text-sm font-medium text-slate-800">{pos.reports_to}</p>
            </div>
            <div className="p-4">
              <p className="text-xs text-slate-400 mb-1">В подчинении</p>
              <div className="flex flex-wrap gap-1">
                {pos.subordinates.map((s, i) => (
                  <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Responsibilities */}
          <div className="p-5 border-b border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">
                Зоны ответственности
              </p>
            </div>
            {renderField('responsibilities', pos.responsibilities)}
          </div>

          {/* Metrics */}
          <div className="p-5 border-b border-slate-100">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <BarChart3 size={14} className="text-slate-400" />
                <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">
                  Ключевые метрики
                </p>
              </div>
            </div>
            {editing === 'metrics' ? (
              renderField('metrics', pos.metrics)
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {pos.metrics.map((m, i) => (
                  <div key={i} className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0" />
                    <p className="text-sm text-slate-700">{m}</p>
                  </div>
                ))}
                <button
                  onClick={() => handleEditStart('metrics')}
                  className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 mt-2 col-span-full"
                >
                  <Edit2 size={12} />
                  Редактировать
                </button>
              </div>
            )}
          </div>

          {/* Extra note */}
          {pos.extra && (
            <div className="px-5 pb-5">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-2">
                  Дополнительная информация
                </p>
                {renderField('extra', pos.extra)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function PositionsPage() {
  const [positions, setPositions] = useState<Position[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const supabase = createClient()

        const { data, error } = await supabase
          .from('positions')
          .select('*')
          .order('sort_order', { ascending: true })

        if (error) throw error

        setPositions(data || [])
      } catch (error) {
        console.error('Error fetching positions:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPositions()
  }, [])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <p className="text-slate-600">Загрузка должностей...</p>
        </div>
      </div>
    )
  }

  const ceo1 = positions.filter((p) => p.level === 'ceo-1')
  const ceo2 = positions.filter((p) => p.level === 'ceo-2')
  const ceo3Marketing = positions.filter((p) => p.level === 'ceo-3' && p.department === 'Маркетинг')
  const ceo3Sales = positions.filter((p) => p.level === 'ceo-3' && p.department === 'Продажи')
  const ceo3Product = positions.filter((p) => p.level === 'ceo-3' && p.department === 'Продукт')

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        href="/company"
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-6"
      >
        <ArrowLeft size={16} />
        Назад к разделу компании
      </Link>

      <h1 className="text-3xl font-bold text-slate-900 mb-2">Описание должностей</h1>
      <p className="text-slate-600 mb-8">
        Ключевые результаты, зоны ответственности и метрики руководителей уровня CEO-1, CEO-2 и CEO-3
      </p>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-8">
        <div className="flex items-center gap-2">
          <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider bg-purple-100 text-purple-700">
            CEO-1
          </span>
          <span className="text-xs text-slate-500">Прямое подчинение CEO</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider bg-blue-100 text-blue-700">
            CEO-2
          </span>
          <span className="text-xs text-slate-500">Подчинение COO</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider bg-green-100 text-green-700">
            CEO-3
          </span>
          <span className="text-xs text-slate-500">Руководители подразделений</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-orange-200 border border-orange-300" />
          <span className="text-xs text-slate-500">Вакансия</span>
        </div>
      </div>

      {/* CEO-1 */}
      <div className="mb-10">
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 bg-purple-600 text-white rounded-lg flex items-center justify-center text-xs font-bold">
            C1
          </span>
          Уровень CEO-1 — прямое подчинение CEO
        </h2>
        <div className="space-y-3">
          {ceo1.map((pos, idx) => (
            <PositionCard key={idx} pos={pos} />
          ))}
        </div>
      </div>

      {/* CEO-2 */}
      <div className="mb-10">
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center text-xs font-bold">
            C2
          </span>
          Уровень CEO-2 — подчинение COO
        </h2>
        <div className="space-y-3">
          {ceo2.map((pos, idx) => (
            <PositionCard key={idx} pos={pos} />
          ))}
        </div>
      </div>

      {/* CEO-3 */}
      <div className="mb-10">
        <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <span className="w-8 h-8 bg-green-600 text-white rounded-lg flex items-center justify-center text-xs font-bold">
            C3
          </span>
          Уровень CEO-3 — руководители подразделений
        </h2>

        {/* Marketing */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3 pl-1">
            Маркетинг
          </h3>
          <div className="space-y-3">
            {ceo3Marketing.map((pos, idx) => (
              <PositionCard key={idx} pos={pos} />
            ))}
          </div>
        </div>

        {/* Sales */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3 pl-1">
            Продажи
          </h3>
          <div className="space-y-3">
            {ceo3Sales.map((pos, idx) => (
              <PositionCard key={idx} pos={pos} />
            ))}
          </div>
        </div>

        {/* Product */}
        <div>
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3 pl-1">
            Продукт
          </h3>
          <div className="space-y-3">
            {ceo3Product.map((pos, idx) => (
              <PositionCard key={idx} pos={pos} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
