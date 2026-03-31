'use client'

import { useState } from 'react'
import { Play, CheckCircle2, Clock, BookOpen } from 'lucide-react'
import clsx from 'clsx'

interface OnboardingModule {
  id: string
  title: string
  description: string
  duration: number
  videoUrl: string
  completed: boolean
  order: number
}

const modules: OnboardingModule[] = [
  {
    id: '1',
    title: 'Добро пожаловать в Talentsy',
    description: 'Введение в компанию, её историю, миссию и ценности',
    duration: 12,
    videoUrl: '#',
    completed: true,
    order: 1,
  },
  {
    id: '2',
    title: 'Обзор наших продуктов',
    description: 'Подробный обзор платных и бесплатных продуктов компании',
    duration: 18,
    videoUrl: '#',
    completed: true,
    order: 2,
  },
  {
    id: '3',
    title: 'Технические инструменты и доступы',
    description: 'Настройка рабочего окружения, доступов и необходимых инструментов',
    duration: 15,
    videoUrl: '#',
    completed: false,
    order: 3,
  },
  {
    id: '4',
    title: 'Процессы и процедуры',
    description: 'Основные бизнес-процессы, политики и регламенты компании',
    duration: 20,
    videoUrl: '#',
    completed: false,
    order: 4,
  },
  {
    id: '5',
    title: 'Структура и команды',
    description: 'Знакомство со структурой компании и ключевыми командами',
    duration: 14,
    videoUrl: '#',
    completed: false,
    order: 5,
  },
  {
    id: '6',
    title: 'Культура и ценности',
    description: 'Погружение в корпоративную культуру и совместные ценности',
    duration: 11,
    videoUrl: '#',
    completed: false,
    order: 6,
  },
]

function ModuleCard({
  module,
  isActive,
  onPlay,
}: {
  module: OnboardingModule
  isActive: boolean
  onPlay: (id: string) => void
}) {
  return (
    <div
      className={clsx(
        'p-6 bg-white border rounded-lg transition-all cursor-pointer',
        isActive
          ? 'border-purple-500 ring-2 ring-purple-200'
          : 'border-slate-200 hover:border-slate-300'
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1">
          <div
            className={clsx(
              'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 font-semibold text-white',
              module.completed
                ? 'bg-green-600'
                : isActive
                  ? 'bg-purple-600'
                  : 'bg-slate-400'
            )}
          >
            {module.completed ? (
              <CheckCircle2 size={20} />
            ) : (
              module.order
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-900 mb-1">{module.title}</h3>
            <p className="text-sm text-slate-600 line-clamp-2">
              {module.description}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Clock size={16} />
          <span>{module.duration} минут</span>
        </div>
        {module.completed ? (
          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
            Завершено
          </span>
        ) : (
          <button
            onClick={() => onPlay(module.id)}
            className={clsx(
              'px-4 py-1 rounded-lg text-sm font-medium transition-colors flex items-center gap-2',
              isActive
                ? 'bg-purple-600 hover:bg-purple-700 text-white'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
            )}
          >
            <Play size={14} />
            Смотреть
          </button>
        )}
      </div>
    </div>
  )
}

export default function OnboardingPage() {
  const [activeModule, setActiveModule] = useState<string>('3')
  const completedCount = modules.filter((m) => m.completed).length
  const progress = Math.round((completedCount / modules.length) * 100)

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">
          Программа адаптации новых сотрудников
        </h1>
        <p className="text-lg text-slate-600">
          Набор обучающих видеоматериалов для успешной адаптации в компании
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8 p-6 bg-white border border-slate-200 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-slate-900">Ваш прогресс</h2>
          <span className="text-lg font-bold text-purple-600">
            {progress}% завершено
          </span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-purple-600 to-purple-500 h-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-slate-600 mt-2">
          {completedCount} из {modules.length} модулей завершено
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Video Player Section */}
        <div className="lg:col-span-2">
          <div className="mb-6">
            <div className="w-full aspect-video bg-slate-900 rounded-lg flex items-center justify-center mb-4">
              <div className="text-center">
                <Play size={64} className="text-white mx-auto mb-4" />
                <p className="text-white text-lg font-medium">
                  {modules.find((m) => m.id === activeModule)?.title}
                </p>
              </div>
            </div>

            {/* Video Info */}
            {modules.find((m) => m.id === activeModule) && (
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  {modules.find((m) => m.id === activeModule)?.title}
                </h2>
                <p className="text-slate-600 mb-4">
                  {modules.find((m) => m.id === activeModule)?.description}
                </p>

                <div className="flex items-center gap-6 mb-6">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Clock size={18} />
                    <span>
                      {modules.find((m) => m.id === activeModule)?.duration}{' '}
                      минут
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <BookOpen size={18} />
                    <span>Видео-урок</span>
                  </div>
                </div>

                <button className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                  <Play size={18} />
                  Начать просмотр
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Modules List */}
        <div className="lg:col-span-1">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <BookOpen size={20} className="text-purple-600" />
            Все модули
          </h3>
          <div className="space-y-3">
            {modules.map((module) => (
              <button
                key={module.id}
                onClick={() => setActiveModule(module.id)}
                className={clsx(
                  'w-full p-4 rounded-lg border transition-all text-left',
                  activeModule === module.id
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                )}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={clsx(
                      'w-8 h-8 rounded flex items-center justify-center flex-shrink-0 text-sm font-semibold text-white',
                      module.completed
                        ? 'bg-green-600'
                        : activeModule === module.id
                          ? 'bg-purple-600'
                          : 'bg-slate-400'
                    )}
                  >
                    {module.completed ? (
                      <CheckCircle2 size={16} />
                    ) : (
                      module.order
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 line-clamp-2">
                      {module.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {module.duration} мин
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="mt-12 p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-bold text-slate-900 mb-3">Советы для успешной адаптации</h3>
        <ul className="space-y-2 text-slate-700">
          <li className="flex gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>
              Смотрите видео в спокойной обстановке и делайте заметки по важным
              моментам
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>
              Не стесняйтесь задавать вопросы вашему руководителю или команде HR
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>
              Завершите все модули в течение первой недели для лучшей адаптации
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>
              После завершения всех модулей пройдите небольшой тест для проверки
              знаний
            </span>
          </li>
        </ul>
      </div>
    </div>
  )
}
