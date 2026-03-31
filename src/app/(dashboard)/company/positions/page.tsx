'use client'

import { useState } from 'react'
import {
  Briefcase,
  MapPin,
  Users,
  DollarSign,
  ChevronDown,
  ExternalLink,
} from 'lucide-react'
import clsx from 'clsx'

interface Position {
  id: string
  title: string
  department: string
  level: string
  location: string
  salary?: string
  description: string
  requirements: string[]
  responsibilities: string[]
}

const positions: Position[] = [
  {
    id: '1',
    title: 'Senior Product Manager',
    department: 'Продукт',
    level: 'Senior',
    location: 'Москва',
    salary: '200k - 300k RUB',
    description:
      'Мы ищем опытного Product Manager, который будет вести разработку нашего основного продукта.',
    requirements: [
      '5+ лет опыта в product management',
      'Опыт работы с SaaS продуктами',
      'Навыки работы с аналитикой данных',
      'Английский язык на уровне B2+',
    ],
    responsibilities: [
      'Определение и развитие стратегии продукта',
      'Работа с cross-functional командами',
      'Анализ рынка и конкурентов',
      'Управление дорожной картой разработки',
    ],
  },
  {
    id: '2',
    title: 'Frontend Developer (React)',
    department: 'Продукт',
    level: 'Middle',
    location: 'Москва / Удаленно',
    salary: '150k - 200k RUB',
    description:
      'Присоединяйтесь к нашей команде разработчиков и помогайте создавать интуитивный интерфейс.',
    requirements: [
      '3+ лет опыта с React',
      'TypeScript',
      'Опыт работы с Next.js',
      'Знание Tailwind CSS',
    ],
    responsibilities: [
      'Разработка компонентов пользовательского интерфейса',
      'Оптимизация производительности',
      'Code review коллег',
      'Участие в планировании спринтов',
    ],
  },
  {
    id: '3',
    title: 'Marketing Manager',
    department: 'Маркетинг',
    level: 'Middle',
    location: 'Москва',
    salary: '120k - 180k RUB',
    description:
      'Возглавьте маркетинговые инициативы и помогите нам достичь целевой аудитории.',
    requirements: [
      '3+ лет опыта в digital-маркетинге',
      'Опыт с Google Analytics',
      'Знание контент-маркетинга',
      'Навыки управления проектами',
    ],
    responsibilities: [
      'Планирование маркетинговых кампаний',
      'Управление бюджетом',
      'Анализ метрик и KPI',
      'Сотрудничество с creative-командой',
    ],
  },
  {
    id: '4',
    title: 'Sales Manager',
    department: 'Продажи',
    level: 'Senior',
    location: 'Москва',
    salary: '180k - 250k RUB',
    description:
      'Управляйте командой продаж и помогите нам развивать B2B-сегмент.',
    requirements: [
      '5+ лет опыта в B2B sales',
      'Опыт управления командой',
      'Опыт работы с CRM системами',
      'Английский язык',
    ],
    responsibilities: [
      'Управление процессом продаж',
      'Развитие отношений с ключевыми клиентами',
      'Наставничество команды продаж',
      'Достижение квот продаж',
    ],
  },
  {
    id: '5',
    title: 'HR Specialist',
    department: 'HR',
    level: 'Middle',
    location: 'Москва',
    salary: '100k - 150k RUB',
    description: 'Помогите нам строить и развивать наше сообщество талантов.',
    requirements: [
      '2+ лет опыта в HR',
      'Знание трудового законодательства',
      'Навыки рекрутмента',
      'Внимательность к деталям',
    ],
    responsibilities: [
      'Рекрутмент и подбор кандидатов',
      'Адаптация новых сотрудников',
      'Разработка программ развития',
      'Ведение кадрового делопроизводства',
    ],
  },
  {
    id: '6',
    title: 'Backend Developer (Python)',
    department: 'Продукт',
    level: 'Middle',
    location: 'Москва / Удаленно',
    salary: '160k - 220k RUB',
    description: 'Разрабатывайте масштабируемые backend-решения для нашей платформы.',
    requirements: [
      '3+ лет опыта с Python',
      'Django / FastAPI',
      'PostgreSQL',
      'REST API',
    ],
    responsibilities: [
      'Разработка API endpoints',
      'Оптимизация баз данных',
      'Написание unit-тестов',
      'Деплоймент и мониторинг',
    ],
  },
]

function PositionCard({ position }: { position: Position }) {
  const [expanded, setExpanded] = useState(false)

  const levelColors = {
    Junior: 'bg-green-100 text-green-800',
    Middle: 'bg-blue-100 text-blue-800',
    Senior: 'bg-purple-100 text-purple-800',
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Briefcase size={20} className="text-purple-600 flex-shrink-0" />
              <h3 className="text-xl font-bold text-slate-900">
                {position.title}
              </h3>
            </div>
            <p className="text-slate-600 mb-3">{position.description}</p>
          </div>
          <span
            className={clsx(
              'px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ml-4',
              levelColors[position.level as keyof typeof levelColors]
            )}
          >
            {position.level}
          </span>
        </div>

        {/* Quick Info */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Users size={16} />
            <span>{position.department}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <MapPin size={16} />
            <span>{position.location}</span>
          </div>
          {position.salary && (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <DollarSign size={16} />
              <span>{position.salary}</span>
            </div>
          )}
        </div>

        {/* Expand Button */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium text-sm mt-4"
        >
          {expanded ? 'Скрыть детали' : 'Подробнее'}
          <ChevronDown
            size={16}
            className={clsx('transition-transform', expanded && 'rotate-180')}
          />
        </button>

        {/* Expanded Content */}
        {expanded && (
          <div className="mt-4 pt-4 border-t border-slate-200 space-y-4">
            <div>
              <h4 className="font-semibold text-slate-900 mb-2">
                Требования:
              </h4>
              <ul className="space-y-2">
                {position.requirements.map((req, index) => (
                  <li
                    key={index}
                    className="flex gap-2 text-sm text-slate-600"
                  >
                    <span className="text-purple-600 mt-0.5">•</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-2">
                Ответственность:
              </h4>
              <ul className="space-y-2">
                {position.responsibilities.map((resp, index) => (
                  <li
                    key={index}
                    className="flex gap-2 text-sm text-slate-600"
                  >
                    <span className="text-purple-600 mt-0.5">•</span>
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
              Применить
              <ExternalLink size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function PositionsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">
          Вакансии и должности
        </h1>
        <p className="text-lg text-slate-600">
          Узнайте о доступных позициях и требованиях к должностям в Talentsy
        </p>
      </div>

      <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-900">
          Мы постоянно ищем талантливых людей. Если вы заинтересованы в одной из
          позиций, нажмите кнопку "Применить" и отправьте свое резюме.
        </p>
      </div>

      <div className="space-y-4">
        {positions.map((position) => (
          <PositionCard key={position.id} position={position} />
        ))}
      </div>

      <div className="mt-12 p-8 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-3">
          Не нашли подходящую вакансию?
        </h2>
        <p className="text-slate-700 mb-4">
          Отправьте нам свой профиль и мы свяжемся с вами, когда появится подходящая
          возможность.
        </p>
        <button className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors">
          Оставить резюме
        </button>
      </div>
    </div>
  )
}
