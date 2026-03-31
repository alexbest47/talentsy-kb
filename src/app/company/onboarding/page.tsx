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
    title: 'Технологический стек',
    description: 'Знакомство с основными технологиями и инструментами',
    duration: '30 минут',
    status: 'in_progress',
    sections: [
      'Backend стек',
      'Frontend стек',
      'Базы данных',
      'DevOps и инфраструктура',
    ],
  },
  {
    id: 'mod3',
    title: 'Процессы и методологии',
    description: 'Изучение процессов разработки и управления проектами',
    duration: '25 минут',
    status: 'pending',
    sections: [
      'Agile методология',
      'Git workflow',
      'Code review процесс',
      'Deployment процесс',
    ],
  },
  {
    id: 'mod4',
    title: 'Система и инструменты',
    description: 'Настройка рабочего окружения и доступа к системам',
    duration: '20 минут',
    status: 'pending',
    sections: [
      'VPN и сетевой доступ',
      'Коммуникационные платформы',
      'Системы управления проектами',
      'Документация и wiki',
    ],
  },
  {
    id: 'mod5',
    title: 'Политики и процедуры',
    description: 'Важная информация о политиках компании и процедурах',
    duration: '20 минут',
    status: 'pending',
    sections: [
      'HR политики',
      'Безопасность информации',
      'Рабочий распорядок',
      'Отпуск и L&D',
    ],
  },
  {
    id: 'mod6',
    title: 'Команда и менторство',
    description: 'Встреча с вашей командой и назначение ментора',
    duration: '30 минут',
    status: 'pending',
    sections: [
      'Встреча с руководителем',
      'Встреча с коллегами',
      'Назначение ментора',
      'Первые проекты',
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

function ProgressBar() {
  const completed = 1
  const total = 6
  const progress = (completed / total) * 100

  return (
    <div className="bg-white rounded-lg p-6 border border-slate-200 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-900">Ваш прогресс адаптации</h2>
        <span className="text-sm font-medium text-slate-600">
          {completed} из {total} модулей
        </span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-3">
        <div
          className="bg-purple-600 h-3 rounded-full transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

function ModuleCard({ module }: { module: OnboardingModule }) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-slate-900 mb-2">{module.title}</h3>
          <p className="text-slate-600 text-sm mb-3">{module.description}</p>
          <span className="text-xs text-slate-500">{module.duration}</span>
        </div>
        <StatusBadge status={module.status} />
      </div>

      <div className="pt-4 border-t border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
          {module.sections.map((section, idx) => (
            <div key={idx} className="text-sm text-slate-600 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-purple-600 rounded-full"></span>
              {section}
            </div>
          ))}
        </div>
      </div>

      <button
        disabled={module.status === 'completed'}
        className={`w-full mt-4 py-2 px-4 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors ${
          module.status === 'completed'
            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
            : 'bg-purple-600 text-white hover:bg-purple-700'
        }`}
      >
        <Play size={16} />
        {module.status === 'completed' ? 'Завершено' : 'Начать модуль'}
      </button>
    </div>
  )
}

export default function OnboardingPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">
          Программа адаптации
        </h1>
        <p className="text-lg text-slate-600">
          Структурированная программа обучения для новых сотрудников
        </p>
      </div>

      <ProgressBar />

      <div className="space-y-6">
        {modules.map((module) => (
          <ModuleCard key={module.id} module={module} />
        ))}
      </div>

      <div className="mt-12 p-6 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg">
        <h2 className="text-lg font-semibold text-slate-900 mb-2">
          Нужна помощь?
        </h2>
        <p className="text-slate-700">
          Если у вас есть вопросы во время программы адаптации, не стесняйтесь
          обращаться к вашему ментору или отделу HR. Мы здесь, чтобы помочь вам
          успешно интегрироваться в команду Talentsy!
        </p>
      </div>
    </div>
  )
}
