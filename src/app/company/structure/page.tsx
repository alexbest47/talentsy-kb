'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ChevronDown,
  ChevronRight,
  User,
  UserX,
  Briefcase,
  ArrowLeft,
} from 'lucide-react'
import clsx from 'clsx'

interface Person {
  name: string
  position: string
  isVacancy?: boolean
  halfRate?: boolean
  onLeave?: boolean
  children?: Person[]
}

const orgData: Person = {
  name: 'Кузьмин Александр Викторович',
  position: 'CEO',
  children: [
    {
      name: '',
      position: 'Операционный директор / COO',
      isVacancy: true,
      children: [
        {
          name: 'Подколзин Евгений',
          position: 'Директор по продажам',
          children: [
            { name: 'Краснов Денис Вячеславович', position: 'Проджект-менеджер продаж' },
            { name: 'Осипова Анна Алексеевна', position: 'Тренер по продажам' },
            {
              name: 'Кузьмина Марина Владимировна',
              position: 'Руководитель ОКК',
              children: [
                { name: 'Мазыкина Мария Владимировна', position: 'Специалист ОКК', halfRate: true },
                { name: 'Погодина Ксения Андреевна', position: 'Специалист ОКК', halfRate: true },
              ],
            },
            {
              name: 'Полозова Анастасия Николаевна',
              position: 'Тимлид ОП №1',
              children: [
                { name: 'Шароватов Антон Григорьевич', position: 'Менеджер по продажам' },
                { name: 'Данильченко Елена Владимировна', position: 'Менеджер по продажам' },
                { name: 'Колбасина Наталия Владимировна', position: 'Менеджер по продажам' },
                { name: 'Циркун Елена Геннадиевна', position: 'Менеджер по продажам' },
                { name: 'Измайлова Юлия Рустамовна', position: 'Менеджер по продажам' },
                { name: 'Бессонова Юлия Александровна', position: 'Менеджер по продажам' },
                { name: 'Гадяк Ольга Викторовна', position: 'Менеджер по продажам' },
                { name: 'Павлович Светлана Николаевна', position: 'Менеджер по продажам' },
                { name: 'Коробова Екатерина Игоревна', position: 'Менеджер по продажам' },
                { name: 'Петрова Надежда Георгиевна', position: 'Менеджер по продажам' },
                { name: 'Мамычева Нина Анатольевна', position: 'Менеджер по продажам' },
              ],
            },
            {
              name: '',
              position: 'Тимлид ОП №2',
              isVacancy: true,
              children: [
                { name: 'Зорина Кристина Алексеевна', position: 'Менеджер по продажам' },
                { name: 'Наговицына Марина Львовна', position: 'Менеджер по продажам' },
                { name: 'Котик (Бачурина) Юлия Аркадьевна', position: 'Менеджер по продажам' },
                { name: 'Андросова Елена Борисовна', position: 'Менеджер по продажам' },
                { name: 'Косулина Кристина Александровна', position: 'Менеджер по продажам' },
                { name: 'Воротынцева Мария Сергеевна', position: 'Менеджер по продажам' },
                { name: 'Ольшуков Александр Владимирович', position: 'Менеджер по продажам' },
                { name: 'Порханова Анастасия Дмитриевна', position: 'Менеджер по продажам' },
                { name: 'Муратова Наталья Ринатовна', position: 'Менеджер по продажам' },
                { name: 'Александрова Ольга Александровна', position: 'Менеджер по продажам' },
                { name: 'Кузнецова Елена Александровна', position: 'Менеджер по продажам' },
              ],
            },
            {
              name: '',
              position: 'Тимлид колл-центра',
              isVacancy: true,
              children: [
                { name: 'Желтоножко Ирина Анатольевна', position: 'Оператор колл-центра' },
                { name: 'Валенис Татьяна Александровна', position: 'Оператор колл-центра' },
                { name: 'Чудинова Ольга Сергеевна', position: 'Оператор колл-центра' },
                { name: 'Нугманов Альберт Тимурович', position: 'Оператор колл-центра' },
                { name: 'Филатова Юлия Александровна', position: 'Оператор колл-центра' },
                { name: 'Скобелева Оксана Владимировна', position: 'Оператор колл-центра' },
                { name: 'Павлова Анна Алексеевна', position: 'Оператор колл-центра', onLeave: true },
                { name: 'Юрасова Светлана Сергеевна', position: 'Оператор колл-центра', onLeave: true },
              ],
            },
          ],
        },
        {
          name: '',
          position: 'Директор по маркетингу',
          isVacancy: true,
          children: [
            {
              name: 'Грачев Максим Павлович',
              position: 'Head of Performance',
              children: [
                { name: 'Любовцева Ольга Константиновна', position: 'Таргетолог' },
                { name: 'Соколов Александр Дмитриевич', position: 'Проджект-менеджер' },
              ],
            },
            {
              name: '',
              position: 'Head of PMM',
              isVacancy: true,
              children: [
                { name: 'Шумова Алена Юрьевна', position: 'Продуктовый маркетолог' },
                { name: 'Тюрина Екатерина Глебовна', position: 'Веб-дизайнер' },
                { name: 'Лаптев Дмитрий Александрович', position: 'Верстальщик' },
                { name: 'Апекаловский Даниил Эрастович', position: 'Верстальщик писем' },
                { name: 'Дерфель Ксения Юрьевна', position: 'CRM-маркетолог' },
              ],
            },
            {
              name: '',
              position: 'Head of Content',
              isVacancy: true,
              children: [
                { name: 'Харитонова Ксения Валерьевна', position: 'Руководитель SMM' },
                { name: 'Мингазова Диана Равилевна', position: 'SMM-менеджер' },
                { name: 'Мураева Оксана Алексеевна', position: 'Дизайнер' },
              ],
            },
          ],
        },
        {
          name: 'Скляров Сергей Дмитриевич',
          position: 'Технический директор',
          children: [
            { name: 'Цветков Василий Алексеевич', position: 'Разработчик-программист' },
            { name: 'Зайнутдинов Анатолий Атласович', position: 'Технический специалист' },
          ],
        },
        {
          name: 'Носко Анна Владимировна',
          position: 'Директор по продукту',
          children: [
            {
              name: 'Панченко Полина Борисовна',
              position: 'Академический директор',
              children: [
                { name: 'Юдина Александра Маратовна', position: 'Коммьюнити-менеджер' },
                { name: 'Татаркина Арина Олеговна', position: 'Коммьюнити-менеджер' },
                { name: 'Качина Дарья Сергеевна', position: 'Методист' },
                { name: 'Игнатенко Алексей Сергеевич', position: 'Методолог' },
                { name: 'Коваль Ольга Юрьевна', position: 'Методист' },
              ],
            },
            {
              name: 'Петрова Анастасия Олеговна',
              position: 'Руководитель отдела сопровождения',
              children: [
                { name: 'Литвинова Марина Владимировна', position: 'Куратор Дизайн одежды' },
                { name: 'Мицкевич Татьяна Владимировна', position: 'Координатор Стиль' },
                { name: 'Савина Элла Александровна', position: 'Куратор Фэшн-стилист' },
                { name: 'Хлынова Ирина Анатольевна', position: 'Куратор Дизайн интерьера' },
                { name: 'Тимофеева Анна Тимофеевна', position: 'Куратор Archicad' },
                { name: 'Кашникова Анна Леонидовна', position: 'Куратор Астрология' },
                { name: 'Шатеева Татьяна Александровна', position: 'Куратор Астрология' },
                { name: 'Костина Юлия Вячеславовна', position: 'Куратор Нутрициология' },
                { name: 'Охочая Юлия Валерьевна', position: 'Куратор-преподаватель Нутрициология' },
                { name: 'Чепурко Любовь Геннадиевна', position: 'Помощник куратора Нутрициологии' },
                { name: 'Остапюк Татьяна Евгеньевна', position: 'Менеджер клиентской поддержки' },
                { name: 'Аджатян Светлана Аптиевна', position: 'Менеджер клиентской поддержки' },
                { name: 'Катаева Наталья Александровна', position: 'Менеджер клиентской поддержки' },
                { name: 'Немова Мария Юрьевна', position: 'Менеджер клиентской поддержки' },
                { name: 'Кобзарь Инна Сергеевна', position: 'Менеджер клиентской поддержки' },
                { name: 'Ивлиева Ирина Александровна', position: 'Менеджер по работе с возвратами' },
                { name: 'Агафонова Инна Александровна', position: 'Менеджер отдела поддержки студентов' },
                { name: 'Маркина Мария Ивановна', position: 'Куратор Клиентомания' },
                { name: 'Предтеченская Юлия Анатольевна', position: 'Куратор Клиентомания' },
                { name: 'Раубо Кристина Владиславовна', position: 'Куратор Клиентомания' },
              ],
            },
            {
              name: 'Шатунова Наталья Мансуровна',
              position: 'Координатор Психология',
              children: [
                { name: 'Клепалова Яна Александровна', position: 'Куратор, методист Психология' },
                { name: 'Иванова Елизавета Александровна', position: 'Куратор Психология' },
                { name: 'Енчин Георгий Юрьевич', position: 'Куратор Психология' },
                { name: 'Заусалин Дмитрий Валентинович', position: 'Куратор Психология' },
                { name: 'Фык Михаил Михайлович', position: 'Куратор Психология' },
                { name: 'Игуменщев Игорь Павлович', position: 'Технический куратор Психология' },
                { name: 'Фурсова Ольга Игоревна', position: 'Методист расписания' },
              ],
            },
            {
              name: 'Артамонова Алина Анатольевна',
              position: 'Руководитель отдела контентных воронок',
              children: [
                { name: 'Грикель Евгения Александровна', position: 'Продюсер контентных воронок' },
                { name: 'Дунаева Анна Сергеевна', position: 'Продюсер вебинарных воронок' },
              ],
            },
            { name: 'Луканенкова Мила Анатольевна', position: 'Архитектор сообществ' },
          ],
        },
        {
          name: 'Бортник Валерия Александровна',
          position: 'Административный директор',
          children: [
            { name: 'Ибрагимов Александр Энверович', position: 'Юрист' },
            { name: 'Окладникова Ольга Анатольевна', position: 'Специалист по документообороту' },
            { name: 'Кошкина Татьяна Игоревна', position: 'Менеджер по документообороту' },
          ],
        },
        {
          name: 'Немченко Денис Игоревич',
          position: 'HR директор',
          children: [
            { name: 'Бурамбаев Бауржан Аманатович', position: 'Специалист по подбору и адаптации' },
            { name: 'Патова Аида Рамазановна', position: 'Ведущий специалист по кадровому учету' },
          ],
        },
      ],
    },
    {
      name: 'Каневская Елена Викторовна',
      position: 'Финансовый директор',
      children: [
        { name: 'Каневский Дмитрий Александрович', position: 'Бухгалтер' },
        { name: 'Агишева Алла Николаевна', position: 'Ассистент' },
      ],
    },
  ],
}

function countPeople(node: Person): number {
  let count = node.isVacancy ? 0 : 1
  if (node.children) {
    for (const child of node.children) {
      count += countPeople(child)
    }
  }
  return count
}

function countVacancies(node: Person): number {
  let count = node.isVacancy ? 1 : 0
  if (node.children) {
    for (const child of node.children) {
      count += countVacancies(child)
    }
  }
  return count
}

function OrgNode({ person, level = 0 }: { person: Person; level?: number }) {
  const [expanded, setExpanded] = useState(level < 2)
  const hasChildren = person.children && person.children.length > 0
  const childCount = hasChildren ? person.children!.length : 0

  const borderColor = person.isVacancy
    ? 'border-orange-300 bg-orange-50/50'
    : level === 0
    ? 'border-purple-300 bg-purple-50/50'
    : level === 1
    ? 'border-blue-200 bg-white'
    : 'border-slate-200 bg-white'

  return (
    <div className={clsx('relative', level > 0 && 'ml-6')}>
      {/* Connector line */}
      {level > 0 && (
        <div className="absolute -left-6 top-0 bottom-0 w-px bg-slate-200" />
      )}
      {level > 0 && (
        <div className="absolute -left-6 top-5 w-6 h-px bg-slate-200" />
      )}

      <div
        className={clsx(
          'flex items-start gap-3 p-3 rounded-lg border transition-all',
          borderColor,
          hasChildren && 'cursor-pointer hover:shadow-sm'
        )}
        onClick={() => hasChildren && setExpanded(!expanded)}
      >
        {/* Avatar / Icon */}
        <div
          className={clsx(
            'w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5',
            person.isVacancy
              ? 'bg-orange-100 text-orange-600'
              : level === 0
              ? 'bg-purple-100 text-purple-600'
              : 'bg-slate-100 text-slate-600'
          )}
        >
          {person.isVacancy ? <UserX size={18} /> : <User size={18} />}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p
            className={clsx(
              'font-bold text-sm',
              person.isVacancy ? 'text-orange-700' : 'text-slate-900'
            )}
          >
            {person.position}
          </p>
          <div className="flex items-center gap-2 flex-wrap mt-0.5">
            <p className={clsx(
              'text-xs',
              person.isVacancy ? 'text-orange-500 font-medium' : 'text-slate-400'
            )}>
              {person.isVacancy ? 'ВАКАНСИЯ' : person.name}
            </p>
            {person.halfRate && (
              <span className="text-[10px] px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded font-medium">
                0,5 ставки
              </span>
            )}
            {person.onLeave && (
              <span className="text-[10px] px-1.5 py-0.5 bg-yellow-100 text-yellow-700 rounded font-medium">
                декрет
              </span>
            )}
          </div>
        </div>

        {/* Expand toggle */}
        {hasChildren && (
          <div className="flex items-center gap-1.5 flex-shrink-0 mt-1">
            <span className="text-[10px] text-slate-400 font-medium">{childCount}</span>
            {expanded ? (
              <ChevronDown size={16} className="text-slate-400" />
            ) : (
              <ChevronRight size={16} className="text-slate-400" />
            )}
          </div>
        )}
      </div>

      {/* Children */}
      {hasChildren && expanded && (
        <div className="mt-1 space-y-1">
          {person.children!.map((child, idx) => (
            <OrgNode key={`${child.position}-${idx}`} person={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function StructurePage() {
  const totalPeople = countPeople(orgData)
  const totalVacancies = countVacancies(orgData)

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <Link
          href="/company"
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-4"
        >
          <ArrowLeft size={16} />
          Назад к разделу компании
        </Link>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Организационная структура
        </h1>
        <p className="text-slate-600">
          Структура компании Talentsy — все подразделения и сотрудники
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-slate-200 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-purple-600">{totalPeople}</p>
          <p className="text-xs text-slate-500 mt-1">Сотрудников</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-orange-500">{totalVacancies}</p>
          <p className="text-xs text-slate-500 mt-1">Открытых вакансий</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">8</p>
          <p className="text-xs text-slate-500 mt-1">Отделов</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-green-600">5</p>
          <p className="text-xs text-slate-500 mt-1">Директоров</p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-6 text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-purple-100 border border-purple-300" />
          <span>Руководство</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-orange-100 border border-orange-300" />
          <span>Вакансия</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded font-medium">0,5</span>
          <span>Частичная занятость</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] px-1.5 py-0.5 bg-yellow-100 text-yellow-700 rounded font-medium">декрет</span>
          <span>В отпуске</span>
        </div>
      </div>

      {/* Org Tree */}
      <div className="space-y-1">
        <OrgNode person={orgData} level={0} />
      </div>

      {/* Link to vacancies */}
      <div className="mt-10 p-6 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-1">
              Открытые вакансии
            </h2>
            <p className="text-slate-600 text-sm">
              {totalVacancies} позиций ждут своих кандидатов
            </p>
          </div>
          <Link
            href="/company/vacancies"
            className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium text-sm transition-colors"
          >
            Смотреть вакансии
          </Link>
        </div>
      </div>
    </div>
  )
}
