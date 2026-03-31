'use client'

import Link from 'next/link'
import {
  ArrowLeft,
  AlertCircle,
  ArrowUpCircle,
  Clock,
  MapPin,
  Users,
  Briefcase,
} from 'lucide-react'
import clsx from 'clsx'

interface Vacancy {
  id: string
  position: string
  department: string
  reportsTo: string
  priority: 'critical' | 'high' | 'medium'
  description: string
  teamSize?: number
}

const vacancies: Vacancy[] = [
  {
    id: 'v1',
    position: 'Операционный директор / COO',
    department: 'Прямое подчинение CEO',
    reportsTo: 'Кузьмин Александр Викторович (CEO)',
    priority: 'critical',
    description:
      'Управление операционной деятельностью компании. Координация работы отделов продаж, маркетинга, технического отдела, продукта, администрации и HR.',
    teamSize: 70,
  },
  {
    id: 'v2',
    position: 'Директор по маркетингу',
    department: 'Подчинение COO',
    reportsTo: 'Операционный директор (COO)',
    priority: 'critical',
    description:
      'Руководство маркетинговым направлением: performance, продуктовый маркетинг, контент и SMM. Управление командой из 10+ специалистов.',
    teamSize: 10,
  },
  {
    id: 'v3',
    position: 'Head of PMM',
    department: 'Маркетинг',
    reportsTo: 'Директор по маркетингу',
    priority: 'high',
    description:
      'Руководство отделом продуктового маркетинга: веб-дизайн, вёрстка, CRM-маркетинг. В подчинении 5 специалистов.',
    teamSize: 5,
  },
  {
    id: 'v4',
    position: 'Head of Content',
    department: 'Маркетинг',
    reportsTo: 'Директор по маркетингу',
    priority: 'high',
    description:
      'Руководство контент-направлением: SMM, дизайн, контент-стратегия. В подчинении 3 специалиста.',
    teamSize: 3,
  },
  {
    id: 'v5',
    position: 'Тимлид ОП №2',
    department: 'Продажи',
    reportsTo: 'Подколзин Евгений (Директор по продажам)',
    priority: 'high',
    description:
      'Управление второй командой отдела продаж из 11 менеджеров. Контроль выполнения плана, обучение и развитие команды.',
    teamSize: 11,
  },
  {
    id: 'v6',
    position: 'Тимлид колл-центра',
    department: 'Продажи',
    reportsTo: 'Подколзин Евгений (Директор по продажам)',
    priority: 'high',
    description:
      'Управление колл-центром из 8 операторов (включая 2 в декрете). Контроль качества звонков, обучение, отчётность.',
    teamSize: 8,
  },
]

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
                    {vacancy.teamSize && (
                      <span className="flex items-center gap-1">
                        <Users size={14} />
                        {vacancy.teamSize} чел. в команде
                      </span>
                    )}
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

              <p className="text-sm text-slate-600 mb-3 leading-relaxed">
                {vacancy.description}
              </p>

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
