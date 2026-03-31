'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Users, UserX, User, Plus, Edit, Trash2, ExternalLink, Grid3x3, FileText, Zap } from 'lucide-react'
import clsx from 'clsx'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface TeamMember {
  name: string
  role: string
  isVacancy?: boolean
  note?: string
}

interface SubUnit {
  name: string
  lead: string
  isLeadVacancy?: boolean
  members: TeamMember[]
}

interface DepartmentInfo {
  name: string
  description: string
  director: string
  directorIsVacancy?: boolean
  reportsTo: string
  headcount: number
  vacancies: number
  subUnits?: SubUnit[]
  directReports?: TeamMember[]
}

interface DepartmentGoal {
  id: string
  department_slug: string
  quarter: string
  text: string
  metric: string | null
  status: string
  sort_order: number
  created_at: string
}

interface Document {
  id: string
  product_id: string
  title: string
  url: string
  created_at: string
}

interface DepartmentLink {
  id: string
  department_slug: string
  title: string
  url: string
  icon: string | null
  sort_order: number
  created_at: string
}

const departments: Record<string, DepartmentInfo> = {
  sales: {
    name: 'Продажи',
    description: 'Отдел, ответственный за привлечение клиентов и генерацию выручки. Включает отделы продаж, колл-центр и контроль качества.',
    director: 'Подколзин Евгений',
    reportsTo: 'COO (вакансия)',
    headcount: 30,
    vacancies: 2,
    directReports: [
      { name: 'Краснов Денис Вячеславович', role: 'Проджект-менеджер продаж' },
      { name: 'Осипова Анна Алексеевна', role: 'Тренер по продажам' },
    ],
    subUnits: [
      {
        name: 'Отдел контроля качества (ОКК)',
        lead: 'Кузьмина Марина Владимировна',
        members: [
          { name: 'Мазыкина Мария Владимировна', role: 'Специалист ОКК', note: '0,5 ставки' },
          { name: 'Погодина Ксения Андреевна', role: 'Специалист ОКК', note: '0,5 ставки' },
        ],
      },
      {
        name: 'Отдел продаж №1',
        lead: 'Полозова Анастасия Николаевна',
        members: [
          { name: 'Шароватов Антон Григорьевич', role: 'Менеджер по продажам' },
          { name: 'Данильченко Елена Владимировна', role: 'Менеджер по продажам' },
          { name: 'Колбасина Наталия Владимировна', role: 'Менеджер по продажам' },
          { name: 'Циркун Елена Геннадиевна', role: 'Менеджер по продажам' },
          { name: 'Измайлова Юлия Рустамовна', role: 'Менеджер по продажам' },
          { name: 'Бессонова Юлия Александровна', role: 'Менеджер по продажам' },
          { name: 'Гадяк Ольга Викторовна', role: 'Менеджер по продажам' },
          { name: 'Павлович Светлана Николаевна', role: 'Менеджер по продажам' },
          { name: 'Коробова Екатерина Игоревна', role: 'Менеджер по продажам' },
          { name: 'Петрова Надежда Георгиевна', role: 'Менеджер по продажам' },
          { name: 'Мамычева Нина Анатольевна', role: 'Менеджер по продажам' },
        ],
      },
      {
        name: 'Отдел продаж №2',
        lead: '',
        isLeadVacancy: true,
        members: [
          { name: 'Зорина Кристина Алексеевна', role: 'Менеджер по продажам' },
          { name: 'Наговицына Марина Львовна', role: 'Менеджер по продажам' },
          { name: 'Котик (Бачурина) Юлия Аркадьевна', role: 'Менеджер по продажам' },
          { name: 'Андросова Елена Борисовна', role: 'Менеджер по продажам' },
          { name: 'Косулина Кристина Александровна', role: 'Менеджер по продажам' },
          { name: 'Воротынцева Мария Сергеевна', role: 'Менеджер по продажам' },
          { name: 'Ольшуков Александр Владимирович', role: 'Менеджер по продажам' },
          { name: 'Порханова Анастасия Дмитриевна', role: 'Менеджер по продажам' },
          { name: 'Муратова Наталья Ринатовна', role: 'Менеджер по продажам' },
          { name: 'Александрова Ольга Александровна', role: 'Менеджер по продажам' },
          { name: 'Кузнецова Елена Александровна', role: 'Менеджер по продажам' },
        ],
      },
      {
        name: 'Колл-центр',
        lead: '',
        isLeadVacancy: true,
        members: [
          { name: 'Желтоножко Ирина Анатольевна', role: 'Оператор колл-центра' },
          { name: 'Валенис Татьяна Александровна', role: 'Оператор колл-центра' },
          { name: 'Чудинова Ольга Сергеевна', role: 'Оператор колл-центра' },
          { name: 'Нугманов Альберт Тимурович', role: 'Оператор колл-центра' },
          { name: 'Филатова Юлия Александровна', role: 'Оператор колл-центра' },
          { name: 'Скобелева Оксана Владимировна', role: 'Оператор колл-центра' },
          { name: 'Павлова Анна Алексеевна', role: 'Оператор колл-центра', note: 'декрет' },
          { name: 'Юрасова Светлана Сергеевна', role: 'Оператор колл-центра', note: 'декрет' },
        ],
      },
    ],
  },
  marketing: {
    name: 'Маркетинг',
    description: 'Отдел, ответственный за привлечение трафика, маркетинговые коммуникации, контент и SMM.',
    director: '',
    directorIsVacancy: true,
    reportsTo: 'COO (вакансия)',
    headcount: 10,
    vacancies: 3,
    subUnits: [
      {
        name: 'Performance',
        lead: 'Грачев Максим Павлович',
        members: [
          { name: 'Любовцева Ольга Константиновна', role: 'Таргетолог' },
          { name: 'Соколов Александр Дмитриевич', role: 'Проджект-менеджер' },
        ],
      },
      {
        name: 'Продуктовый маркетинг (PMM)',
        lead: '',
        isLeadVacancy: true,
        members: [
          { name: 'Шумова Алена Юрьевна', role: 'Продуктовый маркетолог' },
          { name: 'Тюрина Екатерина Глебовна', role: 'Веб-дизайнер' },
          { name: 'Лаптев Дмитрий Александрович', role: 'Верстальщик' },
          { name: 'Апекаловский Даниил Эрастович', role: 'Верстальщик писем' },
          { name: 'Дерфель Ксения Юрьевна', role: 'CRM-маркетолог' },
        ],
      },
      {
        name: 'Контент',
        lead: '',
        isLeadVacancy: true,
        members: [
          { name: 'Харитонова Ксения Валерьевна', role: 'Руководитель SMM' },
          { name: 'Мингазова Диана Равилевна', role: 'SMM-менеджер' },
          { name: 'Мураева Оксана Алексеевна', role: 'Дизайнер' },
        ],
      },
    ],
  },
  tech: {
    name: 'Технический отдел',
    description: 'Разработка и техническая поддержка платформы Talentsy.',
    director: 'Скляров Сергей Дмитриевич',
    reportsTo: 'COO (вакансия)',
    headcount: 3,
    vacancies: 0,
    directReports: [
      { name: 'Цветков Василий Алексеевич', role: 'Разработчик-программист' },
      { name: 'Зайнутдинов Анатолий Атласович', role: 'Технический специалист' },
    ],
  },
  product: {
    name: 'Продукт',
    description: 'Разработка образовательных продуктов, методология, сопровождение студентов, контентные воронки и работа с сообществами.',
    director: 'Носко Анна Владимировна',
    reportsTo: 'COO (вакансия)',
    headcount: 38,
    vacancies: 0,
    subUnits: [
      {
        name: 'Академический отдел',
        lead: 'Панченко Полина Борисовна',
        members: [
          { name: 'Юдина Александра Маратовна', role: 'Коммьюнити-менеджер' },
          { name: 'Татаркина Арина Олеговна', role: 'Коммьюнити-менеджер' },
          { name: 'Качина Дарья Сергеевна', role: 'Методист' },
          { name: 'Игнатенко Алексей Сергеевич', role: 'Методолог' },
          { name: 'Коваль Ольга Юрьевна', role: 'Методист' },
        ],
      },
      {
        name: 'Отдел сопровождения',
        lead: 'Петрова Анастасия Олеговна',
        members: [
          { name: 'Литвинова Марина Владимировна', role: 'Куратор Дизайн одежды' },
          { name: 'Мицкевич Татьяна Владимировна', role: 'Координатор Стиль' },
          { name: 'Савина Элла Александровна', role: 'Куратор Фэшн-стилист' },
          { name: 'Хлынова Ирина Анатольевна', role: 'Куратор Дизайн интерьера' },
          { name: 'Тимофеева Анна Тимофеевна', role: 'Куратор Archicad' },
          { name: 'Кашникова Анна Леонидовна', role: 'Куратор Астрология' },
          { name: 'Шатеева Татьяна Александровна', role: 'Куратор Астрология' },
          { name: 'Костина Юлия Вячеславовна', role: 'Куратор Нутрициология' },
          { name: 'Охочая Юлия Валерьевна', role: 'Куратор-преподаватель Нутрициология' },
          { name: 'Чепурко Любовь Геннадиевна', role: 'Помощник куратора Нутрициологии' },
          { name: 'Остапюк Татьяна Евгеньевна', role: 'Менеджер клиентской поддержки' },
          { name: 'Аджатян Светлана Аптиевна', role: 'Менеджер клиентской поддержки' },
          { name: 'Катаева Наталья Александровна', role: 'Менеджер клиентской поддержки' },
          { name: 'Немова Мария Юрьевна', role: 'Менеджер клиентской поддержки' },
          { name: 'Кобзарь Инна Сергеевна', role: 'Менеджер клиентской поддержки' },
          { name: 'Ивлиева Ирина Александровна', role: 'Менеджер по работе с возвратами' },
          { name: 'Агафонова Инна Александровна', role: 'Менеджер отдела поддержки студентов' },
          { name: 'Маркина Мария Ивановна', role: 'Куратор Клиентомания' },
          { name: 'Предтеченская Юлия Анатольевна', role: 'Куратор Клиентомания' },
          { name: 'Раубо Кристина Владиславовна', role: 'Куратор Клиентомания' },
        ],
      },
      {
        name: 'Направление Психология',
        lead: 'Шатунова Наталья Мансуровна',
        members: [
          { name: 'Клепалова Яна Александровна', role: 'Куратор, методист Психология' },
          { name: 'Иванова Елизавета Александровна', role: 'Куратор Психология' },
          { name: 'Енчин Георгий Юрьевич', role: 'Куратор Психология' },
          { name: 'Заусалин Дмитрий Валентинович', role: 'Куратор Психология' },
          { name: 'Фык Михаил Михайлович', role: 'Куратор Психология' },
          { name: 'Игуменщев Игорь Павлович', role: 'Технический куратор Психология' },
          { name: 'Фурсова Ольга Игоревна', role: 'Методист расписания' },
        ],
      },
      {
        name: 'Контентные воронки',
        lead: 'Артамонова Алина Анатольевна',
        members: [
          { name: 'Грикель Евгения Александровна', role: 'Продюсер контентных воронок' },
          { name: 'Дунаева Анна Сергеевна', role: 'Продюсер вебинарных воронок' },
        ],
      },
    ],
    directReports: [
      { name: 'Луканенкова Мила Анатольевна', role: 'Архитектор сообществ' },
    ],
  },
  admin: {
    name: 'Администрация',
    description: 'Юридическое сопровождение, документооборот и административная поддержка компании.',
    director: 'Бортник Валерия Александровна',
    reportsTo: 'COO (вакансия)',
    headcount: 4,
    vacancies: 0,
    directReports: [
      { name: 'Ибрагимов Александр Энверович', role: 'Юрист' },
      { name: 'Окладникова Ольга Анатольевна', role: 'Специалист по документообороту' },
      { name: 'Кошкина Татьяна Игоревна', role: 'Менеджер по документообороту' },
    ],
  },
  hr: {
    name: 'HR',
    description: 'Подбор, адаптация и кадровый учёт сотрудников.',
    director: 'Немченко Денис Игоревич',
    reportsTo: 'COO (вакансия)',
    headcount: 3,
    vacancies: 0,
    directReports: [
      { name: 'Бурамбаев Бауржан Аманатович', role: 'Специалист по подбору и адаптации' },
      { name: 'Патова Аида Рамазановна', role: 'Ведущий специалист по кадровому учету' },
    ],
  },
  finance: {
    name: 'Финансы',
    description: 'Финансовое управление, бухгалтерский учёт и финансовая отчётность.',
    director: 'Каневская Елена Викторовна',
    reportsTo: 'Кузьмин Александр Викторович (CEO)',
    headcount: 3,
    vacancies: 0,
    directReports: [
      { name: 'Каневский Дмитрий Александрович', role: 'Бухгалтер' },
      { name: 'Агишева Алла Николаевна', role: 'Ассистент' },
    ],
  },
}

function MemberRow({ member }: { member: TeamMember }) {
  return (
    <div className="flex items-center gap-3 py-2 px-3 hover:bg-slate-50 rounded transition-colors">
      <div className={clsx(
        'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
        member.isVacancy ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-500'
      )}>
        {member.isVacancy ? <UserX size={14} /> : <User size={14} />}
      </div>
      <div className="flex-1 min-w-0">
        <p className={clsx('text-sm font-medium', member.isVacancy ? 'text-orange-600' : 'text-slate-800')}>
          {member.isVacancy ? 'ВАКАНСИЯ' : member.name}
        </p>
        <p className="text-xs text-slate-500">{member.role}</p>
      </div>
      {member.note && (
        <span className="text-[10px] px-1.5 py-0.5 bg-yellow-100 text-yellow-700 rounded font-medium flex-shrink-0">
          {member.note}
        </span>
      )}
    </div>
  )
}

function StructureTab({ dept }: { dept: DepartmentInfo }) {
  return (
    <>
      {/* Direct reports */}
      {dept.directReports && dept.directReports.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-900 mb-3">Прямое подчинение директору</h2>
          <div className="bg-white border border-slate-200 rounded-lg divide-y divide-slate-100">
            {dept.directReports.map((m, idx) => (
              <MemberRow key={idx} member={m} />
            ))}
          </div>
        </div>
      )}

      {/* Sub-units */}
      {dept.subUnits && dept.subUnits.map((unit, idx) => (
        <div key={idx} className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <h2 className="text-lg font-bold text-slate-900">{unit.name}</h2>
            <span className="text-xs text-slate-400">{unit.members.length + 1} чел.</span>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg">
            {/* Lead */}
            <div className={clsx(
              'flex items-center gap-3 py-3 px-3 border-b border-slate-100',
              unit.isLeadVacancy ? 'bg-orange-50' : 'bg-purple-50'
            )}>
              <div className={clsx(
                'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                unit.isLeadVacancy ? 'bg-orange-200 text-orange-700' : 'bg-purple-200 text-purple-700'
              )}>
                {unit.isLeadVacancy ? <UserX size={14} /> : <Users size={14} />}
              </div>
              <div>
                <p className={clsx('text-sm font-semibold', unit.isLeadVacancy ? 'text-orange-700' : 'text-purple-800')}>
                  {unit.isLeadVacancy ? 'ВАКАНСИЯ — Руководитель' : unit.lead}
                </p>
                <p className="text-xs text-slate-500">Руководитель</p>
              </div>
            </div>
            {/* Members */}
            <div className="divide-y divide-slate-50">
              {unit.members.map((m, mIdx) => (
                <MemberRow key={mIdx} member={m} />
              ))}
            </div>
          </div>
        </div>
      ))}
    </>
  )
}

function GoalsTab({ slug }: { slug: string }) {
  const [goals, setGoals] = useState<DepartmentGoal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGoals = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('department_goals')
        .select('*')
        .eq('department_slug', slug)
        .order('sort_order', { ascending: true })

      if (!error && data) {
        setGoals(data)
      }
      setLoading(false)
    }

    fetchGoals()
  }, [slug])

  const goalsGrouped = goals.reduce((acc, goal) => {
    if (!acc[goal.quarter]) {
      acc[goal.quarter] = []
    }
    acc[goal.quarter].push(goal)
    return acc
  }, {} as Record<string, DepartmentGoal[]>)

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-500">Загружаем цели...</p>
      </div>
    )
  }

  if (goals.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 mb-4">Целей ещё не добавлено</p>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
          <Plus size={16} />
          Добавить цель
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {Object.entries(goalsGrouped).map(([quarter, quarterGoals]) => (
        <div key={quarter}>
          <h3 className="text-lg font-bold text-slate-900 mb-3">{quarter}</h3>
          <div className="space-y-2">
            {quarterGoals.map((goal) => (
              <div key={goal.id} className="bg-white border border-slate-200 rounded-lg p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">{goal.text}</p>
                    {goal.metric && (
                      <p className="text-xs text-slate-500 mt-2">Метрика: {goal.metric}</p>
                    )}
                    <div className="flex items-center gap-2 mt-3">
                      <span className={clsx(
                        'text-[11px] font-semibold px-2 py-1 rounded',
                        goal.status === 'завершена' ? 'bg-green-100 text-green-700' :
                        goal.status === 'в работе' ? 'bg-blue-100 text-blue-700' :
                        'bg-slate-100 text-slate-700'
                      )}>
                        {goal.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors">
                      <Edit size={16} />
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="pt-4">
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
          <Plus size={16} />
          Добавить цель
        </button>
      </div>
    </div>
  )
}

function DocumentsTab({ slug }: { slug: string }) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDocuments = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('product_id', slug)
        .order('created_at', { ascending: false })

      if (!error && data) {
        setDocuments(data)
      }
      setLoading(false)
    }

    fetchDocuments()
  }, [slug])

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-500">Загружаем документы...</p>
      </div>
    )
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 mb-4">Документов ещё не добавлено</p>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
          <Plus size={16} />
          Добавить документ
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map((doc) => (
          <div key={doc.id} className="bg-white border border-slate-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                <FileText size={20} className="text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-slate-900 truncate">{doc.title}</h3>
                <p className="text-xs text-slate-500 mt-1">
                  {new Date(doc.created_at).toLocaleDateString('ru-RU')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-purple-600 bg-purple-50 rounded hover:bg-purple-100 transition-colors"
              >
                <ExternalLink size={14} />
                Открыть
              </a>
              <button className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors">
                <Edit size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="pt-4">
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
          <Plus size={16} />
          Добавить документ
        </button>
      </div>
    </div>
  )
}

function ServicesTab({ slug }: { slug: string }) {
  const [links, setLinks] = useState<DepartmentLink[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLinks = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('department_links')
        .select('*')
        .eq('department_slug', slug)
        .order('sort_order', { ascending: true })

      if (!error && data) {
        setLinks(data)
      }
      setLoading(false)
    }

    fetchLinks()
  }, [slug])

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-500">Загружаем сервисы...</p>
      </div>
    )
  }

  if (links.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 mb-4">Сервисов ещё не добавлено</p>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
          <Plus size={16} />
          Добавить сервис
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {links.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white border border-slate-200 rounded-lg p-4 hover:border-purple-300 hover:shadow-md transition-all group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={clsx(
                'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                link.icon ? 'bg-slate-100' : 'bg-purple-100'
              )}>
                {link.icon ? (
                  <span className="text-lg">{link.icon}</span>
                ) : (
                  <Zap size={20} className="text-purple-600" />
                )}
              </div>
              <button className="p-1.5 text-slate-400 opacity-0 group-hover:opacity-100 hover:text-purple-600 hover:bg-purple-50 rounded transition-all">
                <Edit size={14} />
              </button>
            </div>
            <h3 className="text-sm font-semibold text-slate-900 group-hover:text-purple-600 transition-colors">{link.title}</h3>
            <div className="flex items-center gap-1 mt-3 text-slate-400 group-hover:text-purple-600 transition-colors">
              <ExternalLink size={14} />
              <span className="text-xs">Открыть</span>
            </div>
          </a>
        ))}
      </div>
      <div className="pt-4">
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
          <Plus size={16} />
          Добавить сервис
        </button>
      </div>
    </div>
  )
}

export default function DepartmentPage() {
  const params = useParams()
  const slug = params?.slug as string
  const dept = departments[slug]
  const [activeTab, setActiveTab] = useState<'structure' | 'goals' | 'documents' | 'services'>('structure')

  if (!dept) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Отдел не найден</h1>
        <p className="text-slate-500 mb-6">К сожалению, информация об этом отделе недоступна</p>
        <Link href="/departments/sales" className="text-purple-600 hover:underline text-sm">
          Перейти к отделу продаж
        </Link>
      </div>
    )
  }

  const tabs = [
    { id: 'structure' as const, label: 'Структура', icon: Users },
    { id: 'goals' as const, label: 'Цели', icon: Grid3x3 },
    { id: 'documents' as const, label: 'Документы', icon: FileText },
    { id: 'services' as const, label: 'Сервисы', icon: Zap },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-6"
      >
        <ArrowLeft size={16} />
        На главную
      </Link>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">{dept.name}</h1>
        <p className="text-slate-600">{dept.description}</p>
      </div>

      {/* Key info */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <div className="bg-white border border-slate-200 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-purple-600">{dept.headcount}</p>
          <p className="text-xs text-slate-500">Человек</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-orange-500">{dept.vacancies}</p>
          <p className="text-xs text-slate-500">Вакансий</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <p className="text-xs text-slate-500 mb-1">Руководитель</p>
          <p className={clsx('text-sm font-semibold', dept.directorIsVacancy ? 'text-orange-600' : 'text-slate-900')}>
            {dept.directorIsVacancy ? 'ВАКАНСИЯ' : dept.director}
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <p className="text-xs text-slate-500 mb-1">Подчинение</p>
          <p className="text-sm font-semibold text-slate-900">{dept.reportsTo}</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-1 mb-6 border-b border-slate-200 bg-white rounded-t-lg px-1 sticky top-0 z-10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={clsx(
              'px-4 py-3 text-sm font-medium transition-colors flex items-center gap-2 border-b-2 -mb-[2px]',
              activeTab === tab.id
                ? 'text-purple-600 border-purple-600'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            )}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-b-lg p-6 border border-slate-200 border-t-0">
        {activeTab === 'structure' && <StructureTab dept={dept} />}
        {activeTab === 'goals' && <GoalsTab slug={slug} />}
        {activeTab === 'documents' && <DocumentsTab slug={slug} />}
        {activeTab === 'services' && <ServicesTab slug={slug} />}
      </div>
    </div>
  )
}
