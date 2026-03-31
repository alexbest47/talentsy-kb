'use client'

import { Play, CheckCircle2, Clock } from 'lucide-react'

interface OnboardingModule {
  id: string
  title: string
  description: string
  duration: string
  status: 'completed' | 'in_progress' | 'pending'
  sections: string[]
}

const modules: OnboardingModule[] = [
  {
    id: 'mod1',
    title: 'Добро пожаловать в Talentsy',
    description: 'Введение в компанию, историю и основные ценности',
    duration: '15 минут',
    status: 'completed',
    sections: [
      'История компании',
      'Миссия и ценности',
      'Структура организации',
      'Наша команда',
    ],
  },
  {
    id: 'mod2',
    title: 'Знакомство с продуктами',
    description: 'Обзор всех направлений и курсов Talentsy',
    duration: '30 минут',
    status: 'in_progress',
    sections: [
      'Платные курсы',
      'Бесплатные материалы',
      'Структура курсов',
      'Работа с платформой',
    ],
  },
  {
    id: 'mod3',
    title: 'Рабочие инструменты',
    description: 'Настройка доступов и знакомство с рабочими сервисами',
    duration: '25 минут',
    status: 'pending',
    sections: [
      'Корпоративная почта',
      'Мессенджеры и чаты',
      'CRM и внутренние системы',
      'Документооборот',
    ],
  },
  {
    id: 'mod4',
    title: 'Процессы и регламенты',
    description: 'Как устроена работа внутри компании',
    duration: '20 минут',
    status: 'pending',
    sections: [
      'Рабочий распорядок',
      'Отпуска и больничные',
      'Отчётность',
      'Коммуникация с руководством',
    ],
  },
  {
    id: 'mod5',
    title: 'Безопасность и политики',
    description: 'Правила информационной безопасности и внутренние политики',
    duration: '20 минут',
    status: 'pending',
    sections: [
      'Информационная безопасность',
      'Персональные данные',
      'NDA и конфиденциальность',
      'Корпоративная этика',
    ],
  },
  {
    id: 'mod6',
    title: 'Знакомство с командой',
    description: 'Встреча с руководителем и коллегами, назначение ментора',
    duration: '30 минут',
    status: 'pending',
    sections: [
      'Встреча с руководителем',
      'Встреча с коллегами',
      'Назначение ментора',
      'План на испытательный срок',
    ],
  },
]

function StatusBadge({ status }: { status: string }) {
  const statusConfig = {
    completed: {
      bg: 'bg-green-100',
      text: 'text-green-700',
      icon: <CheckCircle2 size={16} />,
      label: 'Завершено',
    },
    in_progress: {
      bg: 'bg-blue-100',
      text: 'text-blue-700',
      icon: <Clock size={16} />,
      label: 'В процессе',
    },
    pending: {
      bg: 'bg-gray-100',
      text: 'text-gray-700',
      icon: <Clock size={16} />,
      label: 'Ожидание',
    },
  }

  const config = statusConfig[status as keyof typeof statusConfig]

  return (
    <span className={`${config.bg} ${config.text} px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit`}>
      {config.icon}
      {config.label}
    </span>
  )
}

export default function OnboardingPage() {
  const completedCount = modules.filter((m) => m.status === 'completed').length
  const total = modules.length
  const progress = (completedCount / total) * 100

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Программа адаптации
        </h1>
        <p className="text-slate-600">
          Структурированная программа обучения для новых сотрудников Talentsy
        </p>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-lg p-6 border border-slate-200 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Ваш прогресс</h2>
          <span className="text-sm font-medium text-slate-600">
            {completedCount} из {total} модулей
          </span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-3">
          <div
            className="bg-purple-600 h-3 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Modules */}
      <div className="space-y-4">
        {modules.map((module) => (
          <div
            key={module.id}
            className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900 mb-1">{module.title}</h3>
                <p className="text-slate-600 text-sm mb-2">{module.description}</p>
                <span className="text-xs text-slate-400">{module.duration}</span>
              </div>
              <StatusBadge status={module.status} />
            </div>

            <div className="pt-3 border-t border-slate-100 mt-3">
              <div className="grid grid-cols-2 gap-1.5">
                {module.sections.map((section, idx) => (
                  <div key={idx} className="text-sm text-slate-500 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full flex-shrink-0" />
                    {section}
                  </div>
                ))}
              </div>
            </div>

            <button
              disabled={module.status === 'completed'}
              className={`w-full mt-4 py-2.5 px-4 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors ${
                module.status === 'completed'
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-purple-600 text-white hover:bg-purple-700'
              }`}
            >
              <Play size={16} />
              {module.status === 'completed' ? 'Завершено' : 'Начать модуль'}
            </button>
          </div>
        ))}
      </div>

      {/* Help */}
      <div className="mt-10 p-6 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg">
        <h2 className="text-lg font-semibold text-slate-900 mb-2">
          Нужна помощь?
        </h2>
        <p className="text-slate-600 text-sm">
          Обращайтесь к вашему ментору или в HR-отдел (Немченко Денис Игоревич).
          Специалист по адаптации — Бурамбаев Бауржан Аманатович.
        </p>
      </div>
    </div>
  )
}
