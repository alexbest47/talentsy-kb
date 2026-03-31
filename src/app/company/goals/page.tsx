'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, ChevronDown, ChevronRight, PencilIcon } from 'lucide-react'
import clsx from 'clsx'
import { createClient } from '@/lib/supabase/client'

interface GoalRecord {
  id: string
  quarter: string
  department: string
  role: string | null
  text: string
  metric: string | null
  status: string
  sort_order: number
  created_at: string
  updated_at: string
}

interface Goal {
  text: string
  metric?: string | null
  role?: string | null
  status: string
  sort_order: number
}

interface DepartmentGoals {
  department: string
  role?: string | null
  color: string
  goals: Goal[]
}

const colorPalette = ['purple', 'blue', 'green', 'amber', 'red', 'teal', 'indigo', 'cyan', 'lime', 'pink']

const colorMap: Record<string, { bg: string; border: string; badge: string; dot: string }> = {
  purple: { bg: 'bg-purple-50', border: 'border-purple-200', badge: 'bg-purple-100 text-purple-700', dot: 'bg-purple-500' },
  blue: { bg: 'bg-blue-50', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' },
  green: { bg: 'bg-green-50', border: 'border-green-200', badge: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
  amber: { bg: 'bg-amber-50', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
  red: { bg: 'bg-red-50', border: 'border-red-200', badge: 'bg-red-100 text-red-700', dot: 'bg-red-500' },
  teal: { bg: 'bg-teal-50', border: 'border-teal-200', badge: 'bg-teal-100 text-teal-700', dot: 'bg-teal-500' },
  indigo: { bg: 'bg-indigo-50', border: 'border-indigo-200', badge: 'bg-indigo-100 text-indigo-700', dot: 'bg-indigo-500' },
  cyan: { bg: 'bg-cyan-50', border: 'border-cyan-200', badge: 'bg-cyan-100 text-cyan-700', dot: 'bg-cyan-500' },
  lime: { bg: 'bg-lime-50', border: 'border-lime-200', badge: 'bg-lime-100 text-lime-700', dot: 'bg-lime-500' },
  pink: { bg: 'bg-pink-50', border: 'border-pink-200', badge: 'bg-pink-100 text-pink-700', dot: 'bg-pink-500' },
}

function getDepartmentColor(department: string, departmentMap: Map<string, number>): string {
  if (!departmentMap.has(department)) {
    departmentMap.set(department, departmentMap.size)
  }
  const index = departmentMap.get(department)!
  return colorPalette[index % colorPalette.length]
}

function DepartmentSection({ dept }: { dept: DepartmentGoals }) {
  const [expanded, setExpanded] = useState(true)
  const colors = colorMap[dept.color] || colorMap.blue

  return (
    <div className={`border ${colors.border} rounded-lg overflow-hidden`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className={`w-full flex items-center justify-between p-4 ${colors.bg} hover:opacity-90 transition-opacity`}
      >
        <div className="flex items-center gap-3">
          <span className={`w-3 h-3 rounded-full ${colors.dot}`} />
          <div className="flex flex-col items-start">
            <h3 className="font-bold text-slate-900">{dept.department}</h3>
            {dept.role && <p className="text-xs text-slate-500 mt-0.5">{dept.role}</p>}
          </div>
          <span className="text-xs text-slate-500 ml-auto mr-2">{dept.goals.length} {dept.goals.length === 1 ? 'цель' : dept.goals.length < 5 ? 'цели' : 'целей'}</span>
        </div>
        {expanded ? <ChevronDown size={18} className="text-slate-400" /> : <ChevronRight size={18} className="text-slate-400" />}
      </button>

      {expanded && (
        <div className="bg-white divide-y divide-slate-100">
          {dept.goals.length > 0 ? (
            dept.goals.map((goal, idx) => (
              <div key={idx} className="p-4 flex items-start gap-3">
                <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <div className="flex-1">
                  <p className="text-sm text-slate-700 leading-relaxed">{goal.text}</p>
                </div>
                {goal.metric && (
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-md flex-shrink-0 ${colors.badge}`}>
                    {goal.metric}
                  </span>
                )}
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-sm text-slate-500">Нет целей для этого отдела</div>
          )}
        </div>
      )}
    </div>
  )
}

export default function GoalsPage() {
  const supabase = createClient()
  const [activeQuarter, setActiveQuarter] = useState<string | null>(null)
  const [quarters, setQuarters] = useState<string[]>([])
  const [departments, setDepartments] = useState<DepartmentGoals[]>([])
  const [loading, setLoading] = useState(true)
  const [allGoals, setAllGoals] = useState<GoalRecord[]>([])
  const [departmentColorMap] = useState(new Map<string, number>())

  useEffect(() => {
    fetchGoals()
  }, [])

  const fetchGoals = async () => {
    try {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .order('quarter', { ascending: false })
        .order('sort_order', { ascending: true })

      if (error) throw error

      setAllGoals(data || [])

      // Extract unique quarters
      const uniqueQuarters = Array.from(new Set((data || []).map((g) => g.quarter))).sort().reverse()
      setQuarters(uniqueQuarters)

      if (uniqueQuarters.length > 0) {
        setActiveQuarter(uniqueQuarters[0])
      }
    } catch (error) {
      console.error('Error fetching goals:', error)
    } finally {
      setLoading(false)
    }
  }

  // Update departments when active quarter or goals change
  useEffect(() => {
    if (!activeQuarter || allGoals.length === 0) {
      setDepartments([])
      return
    }

    const quarterGoals = allGoals.filter((g) => g.quarter === activeQuarter)

    // Group by department
    const deptMap = new Map<string, Goal[]>()
    const deptRoleMap = new Map<string, string | null>()

    quarterGoals.forEach((goal) => {
      const key = goal.department
      if (!deptMap.has(key)) {
        deptMap.set(key, [])
        deptRoleMap.set(key, goal.role)
      }
      deptMap.get(key)!.push({
        text: goal.text,
        metric: goal.metric,
        status: goal.status,
        sort_order: goal.sort_order,
      })
    })

    const depts: DepartmentGoals[] = Array.from(deptMap.entries())
      .map(([dept, goals]) => ({
        department: dept,
        role: deptRoleMap.get(dept),
        color: getDepartmentColor(dept, departmentColorMap),
        goals: goals.sort((a, b) => a.sort_order - b.sort_order),
      }))
      .sort((a, b) => a.department.localeCompare(b.department))

    setDepartments(depts)
  }, [activeQuarter, allGoals, departmentColorMap])

  const totalGoals = departments.reduce((sum, d) => sum + d.goals.length, 0)
  const futureQuarters = ['Q2 2026', 'Q3 2026', 'Q4 2026'].filter((q) => !quarters.includes(q))

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <p className="text-slate-500">Загрузка целей...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        href="/company"
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-6"
      >
        <ArrowLeft size={16} />
        Назад к разделу компании
      </Link>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Стратегические цели</h1>
          <p className="text-slate-600">Квартальные цели для отделов и подразделений компании</p>
        </div>
        <Link
          href="/admin/goals"
          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
        >
          <PencilIcon size={16} />
          Редактировать цели
        </Link>
      </div>

      {quarters.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-600 text-lg">Нет целей для этого квартала</p>
        </div>
      ) : (
        <>
          {/* Quarter selector */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
            {quarters.map((q) => (
              <button
                key={q}
                onClick={() => setActiveQuarter(q)}
                className={clsx(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
                  activeQuarter === q ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                )}
              >
                {q}
              </button>
            ))}
            {futureQuarters.map((q) => (
              <button
                key={q}
                disabled
                className="px-4 py-2 rounded-lg text-sm font-medium bg-slate-50 text-slate-300 border border-dashed border-slate-200 whitespace-nowrap cursor-not-allowed"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Summary */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white border border-slate-200 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-purple-600">{departments.length}</p>
              <p className="text-xs text-slate-500 mt-1">Отделов с целями</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-slate-900">{totalGoals}</p>
              <p className="text-xs text-slate-500 mt-1">Всего целей</p>
            </div>
          </div>

          {/* Department goals */}
          {departments.length > 0 ? (
            <div className="space-y-4">
              {departments.map((dept, idx) => (
                <DepartmentSection key={idx} dept={dept} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-600">Нет целей для этого квартала</p>
            </div>
          )}
        </>
      )}

      {/* Note */}
      <div className="mt-8 p-4 bg-slate-50 border border-slate-200 rounded-lg">
        <p className="text-xs text-slate-500">
          Цели устанавливаются поквартально. Метрики фиксируются по итогам последнего месяца квартала.
          Для обсуждения целей вашего отдела обратитесь к руководителю подразделения.
        </p>
      </div>
    </div>
  )
}
