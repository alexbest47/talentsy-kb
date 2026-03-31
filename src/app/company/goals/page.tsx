'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ChevronDown, ChevronRight, Target, TrendingUp } from 'lucide-react'
import clsx from 'clsx'

interface Goal {
  text: string
  metric?: string
}

interface DepartmentGoals {
  department: string
  color: string
  goals: Goal[]
}

interface QuarterData {
  id: string
  label: string
  year: number
  departments: DepartmentGoals[]
}

const quarters: QuarterData[] = [
  {
    id: 'q1-2026',
    label: 'Q1 2026',
    year: 2026,
    departments: [
      {
        department: 'Операционный директор',
        color: 'purple',
        goals: [
          {
            text: 'Продажи по реферальной программе составили 1 млн в месяц',
            metric: '1 млн ₽/мес',
          },
        ],
      },
      {
        department: 'Отдел продаж',
        color: 'blue',
        goals: [
          {
            text: 'SLA по горячим лидам / квал лидам составляет 30 мин в рабочее время по итогам марта',
            metric: '30 мин SLA',
          },
          {
            text: 'Средняя сквозная конверсия диагностик составила 1% в рамках месяца по итогам марта',
            metric: '1% конверсия',
          },
          {
            text: 'Расходы на отдел продаж (с учетом налогов) составляют до 15% по итогам марта (или все коммерческие расходы до 35% от выручки)',
            metric: '≤15% расходы',
          },
        ],
      },
      {
        department: 'Продукт',
        color: 'green',
        goals: [
          {
            text: 'Расходы на не_психологические направления снижены в 2 и более раз',
            metric: '×2 снижение',
          },
        ],
      },
      {
        department: 'Performance',
        color: 'amber',
        goals: [
          {
            text: 'Выручка с SEO + прямые заходы + не_известно — 10 млн в месяц',
            metric: '10 млн ₽/мес',
          },
          {
            text: 'Выручка с CPA (без витрин) — 8 млн в месяц',
            metric: '8 млн ₽/мес',
          },
        ],
      },
      {
        department: 'PMM',
        color: 'red',
        goals: [
          {
            text: 'Обновление сайта (главной и всех страниц платных курсов)',
          },
          {
            text: 'Средняя конверсия прохождения квиза составила больше 20%',
            metric: '>20% конверсия',
          },
          {
            text: 'Марафон на холодный трафик и ДРР до 50% в рамках марта',
            metric: 'ДРР ≤50%',
          },
          {
            text: 'В Экспертум разработана воронка на холодный трафик со стоимостью привлечения пользователя до 1500–2000 рублей по итогам марта',
            metric: 'CAC 1500–2000 ₽',
          },
        ],
      },
    ],
  },
]

const colorMap: Record<string, { bg: string; border: string; badge: string; dot: string }> = {
  purple: { bg: 'bg-purple-50', border: 'border-purple-200', badge: 'bg-purple-100 text-purple-700', dot: 'bg-purple-500' },
  blue: { bg: 'bg-blue-50', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' },
  green: { bg: 'bg-green-50', border: 'border-green-200', badge: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
  amber: { bg: 'bg-amber-50', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
  red: { bg: 'bg-red-50', border: 'border-red-200', badge: 'bg-red-100 text-red-700', dot: 'bg-red-500' },
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
          <h3 className="font-bold text-slate-900">{dept.department}</h3>
          <span className="text-xs text-slate-500">{dept.goals.length} {dept.goals.length === 1 ? 'цель' : dept.goals.length < 5 ? 'цели' : 'целей'}</span>
        </div>
        {expanded ? <ChevronDown size={18} className="text-slate-400" /> : <ChevronRight size={18} className="text-slate-400" />}
      </button>

      {expanded && (
        <div className="bg-white divide-y divide-slate-100">
          {dept.goals.map((goal, idx) => (
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
          ))}
        </div>
      )}
    </div>
  )
}

export default function GoalsPage() {
  const [activeQuarter, setActiveQuarter] = useState('q1-2026')
  const quarter = quarters.find((q) => q.id === activeQuarter) || quarters[0]

  const totalGoals = quarter.departments.reduce((sum, d) => sum + d.goals.length, 0)

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
          <p className="text-slate-600">
            Квартальные цели для отделов и подразделений компании
          </p>
        </div>
      </div>

      {/* Quarter selector */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {quarters.map((q) => (
          <button
            key={q.id}
            onClick={() => setActiveQuarter(q.id)}
            className={clsx(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
              activeQuarter === q.id
                ? 'bg-purple-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            )}
          >
            {q.label}
          </button>
        ))}
        {/* Placeholder for future quarters */}
        <button
          disabled
          className="px-4 py-2 rounded-lg text-sm font-medium bg-slate-50 text-slate-300 border border-dashed border-slate-200 whitespace-nowrap cursor-not-allowed"
        >
          Q2 2026
        </button>
        <button
          disabled
          className="px-4 py-2 rounded-lg text-sm font-medium bg-slate-50 text-slate-300 border border-dashed border-slate-200 whitespace-nowrap cursor-not-allowed"
        >
          Q3 2026
        </button>
        <button
          disabled
          className="px-4 py-2 rounded-lg text-sm font-medium bg-slate-50 text-slate-300 border border-dashed border-slate-200 whitespace-nowrap cursor-not-allowed"
        >
          Q4 2026
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white border border-slate-200 rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-purple-600">{quarter.departments.length}</p>
          <p className="text-xs text-slate-500 mt-1">Отделов с целями</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-slate-900">{totalGoals}</p>
          <p className="text-xs text-slate-500 mt-1">Всего целей</p>
        </div>
      </div>

      {/* Department goals */}
      <div className="space-y-4">
        {quarter.departments.map((dept, idx) => (
          <DepartmentSection key={idx} dept={dept} />
        ))}
      </div>

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
