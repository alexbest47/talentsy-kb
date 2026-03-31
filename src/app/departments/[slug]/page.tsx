'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Users, UserX, User } from 'lucide-react'
import clsx from 'clsx'

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

export default function DepartmentPage() {
  const params = useParams()
  const slug = params?.slug as string
  const dept = departments[slug]

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
    </div>
  )
}
