'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import {
  ChevronDown,
  ChevronRight,
  User,
  UserX,
  ArrowLeft,
  GripVertical,
  Check,
  X,
  Plus,
  Trash2,
  Save,
  Pencil,
} from 'lucide-react'
import clsx from 'clsx'
import { createClient } from '@/lib/supabase/client'
import { useRoleStore } from '@/lib/stores/role-store'

/* ─── Types ─── */
interface Person {
  id: string
  name: string
  position: string
  isVacancy?: boolean
  halfRate?: boolean
  onLeave?: boolean
  priority?: string
  vacancyDocId?: string
  children?: Person[]
}

/* ─── Default Data ─── */
const defaultOrgData: Person = {
  id: 'ceo',
  name: 'Кузьмин Александр Викторович',
  position: 'CEO',
  children: [
    {
      id: 'coo',
      name: '',
      position: 'Операционный директор / COO',
      isVacancy: true,
      children: [
        {
          id: 'dir-sales',
          name: 'Подколзин Евгений',
          position: 'Директор по продажам',
          children: [
            { id: 's1', name: 'Краснов Денис Вячеславович', position: 'Проджект-менеджер продаж' },
            { id: 's2', name: 'Осипова Анна Алексеевна', position: 'Тренер по продажам' },
            {
              id: 's-okk-lead',
              name: 'Кузьмина Марина Владимировна',
              position: 'Руководитель ОКК',
              children: [
                { id: 'okk1', name: 'Мазыкина Мария Владимировна', position: 'Специалист ОКК', halfRate: true },
                { id: 'okk2', name: 'Погодина Ксения Андреевна', position: 'Специалист ОКК', halfRate: true },
              ],
            },
            {
              id: 's-op1-lead',
              name: 'Полозова Анастасия Николаевна',
              position: 'Тимлид ОП №1',
              children: [
                { id: 'op1-1', name: 'Шароватов Антон Григорьевич', position: 'Менеджер по продажам' },
                { id: 'op1-2', name: 'Данильченко Елена Владимировна', position: 'Менеджер по продажам' },
                { id: 'op1-3', name: 'Колбасина Наталия Владимировна', position: 'Менеджер по продажам' },
                { id: 'op1-4', name: 'Циркун Елена Геннадиевна', position: 'Менеджер по продажам' },
                { id: 'op1-5', name: 'Измайлова Юлия Рустамовна', position: 'Менеджер по продажам' },
                { id: 'op1-6', name: 'Бессонова Юлия Александровна', position: 'Менеджер по продажам' },
                { id: 'op1-7', name: 'Гадяк Ольга Викторовна', position: 'Менеджер по продажам' },
                { id: 'op1-8', name: 'Павлович Светлана Николаевна', position: 'Менеджер по продажам' },
                { id: 'op1-9', name: 'Коробова Екатерина Игоревна', position: 'Менеджер по продажам' },
                { id: 'op1-10', name: 'Петрова Надежда Георгиевна', position: 'Менеджер по продажам' },
                { id: 'op1-11', name: 'Мамычева Нина Анатольевна', position: 'Менеджер по продажам' },
              ],
            },
            {
              id: 's-op2-lead',
              name: '',
              position: 'Тимлид ОП №2',
              isVacancy: true,
              children: [
                { id: 'op2-1', name: 'Зорина Кристина Алексеевна', position: 'Менеджер по продажам' },
                { id: 'op2-2', name: 'Наговицына Марина Львовна', position: 'Менеджер по продажам' },
                { id: 'op2-3', name: 'Котик (Бачурина) Юлия Аркадьевна', position: 'Менеджер по продажам' },
                { id: 'op2-4', name: 'Андросова Елена Борисовна', position: 'Менеджер по продажам' },
                { id: 'op2-5', name: 'Косулина Кристина Александровна', position: 'Менеджер по продажам' },
                { id: 'op2-6', name: 'Воротынцева Мария Сергеевна', position: 'Менеджер по продажам' },
                { id: 'op2-7', name: 'Ольшуков Александр Владимирович', position: 'Менеджер по продажам' },
                { id: 'op2-8', name: 'Порханова Анастасия Дмитриевна', position: 'Менеджер по продажам' },
                { id: 'op2-9', name: 'Муратова Наталья Ринатовна', position: 'Менеджер по продажам' },
                { id: 'op2-10', name: 'Александрова Ольга Александровна', position: 'Менеджер по продажам' },
                { id: 'op2-11', name: 'Кузнецова Елена Александровна', position: 'Менеджер по продажам' },
              ],
            },
            {
              id: 's-cc-lead',
              name: '',
              position: 'Тимлид колл-центра',
              isVacancy: true,
              children: [
                { id: 'cc1', name: 'Желтоножко Ирина Анатольевна', position: 'Оператор колл-центра' },
                { id: 'cc2', name: 'Валенис Татьяна Александровна', position: 'Оператор колл-центра' },
                { id: 'cc3', name: 'Чудинова Ольга Сергеевна', position: 'Оператор колл-центра' },
                { id: 'cc4', name: 'Нугманов Альберт Тимурович', position: 'Оператор колл-центра' },
                { id: 'cc5', name: 'Филатова Юлия Александровна', position: 'Оператор колл-центра' },
                { id: 'cc6', name: 'Скобелева Оксана Владимировна', position: 'Оператор колл-центра' },
                { id: 'cc7', name: 'Павлова Анна Алексеевна', position: 'Оператор колл-центра', onLeave: true },
                { id: 'cc8', name: 'Юрасова Светлана Сергеевна', position: 'Оператор колл-центра', onLeave: true },
              ],
            },
          ],
        },
        {
          id: 'dir-mkt',
          name: '',
          position: 'Директор по маркетингу',
          isVacancy: true,
          children: [
            {
              id: 'm-perf-lead',
              name: 'Грачев Максим Павлович',
              position: 'Head of Performance',
              children: [
                { id: 'mp1', name: 'Любовцева Ольга Константиновна', position: 'Таргетолог' },
                { id: 'mp2', name: 'Соколов Александр Дмитриевич', position: 'Проджект-менеджер' },
              ],
            },
            {
              id: 'm-pmm-lead',
              name: '',
              position: 'Head of PMM',
              isVacancy: true,
              children: [
                { id: 'pmm1', name: 'Шумова Алена Юрьевна', position: 'Продуктовый маркетолог' },
                { id: 'pmm2', name: 'Тюрина Екатерина Глебовна', position: 'Веб-дизайнер' },
                { id: 'pmm3', name: 'Лаптев Дмитрий Александрович', position: 'Верстальщик' },
                { id: 'pmm4', name: 'Апекаловский Даниил Эрастович', position: 'Верстальщик писем' },
                { id: 'pmm5', name: 'Дерфель Ксения Юрьевна', position: 'CRM-маркетолог' },
              ],
            },
            {
              id: 'm-content-lead',
              name: '',
              position: 'Head of Content',
              isVacancy: true,
              children: [
                { id: 'mc1', name: 'Харитонова Ксения Валерьевна', position: 'Руководитель SMM' },
                { id: 'mc2', name: 'Мингазова Диана Равилевна', position: 'SMM-менеджер' },
                { id: 'mc3', name: 'Мураева Оксана Алексеевна', position: 'Дизайнер' },
              ],
            },
          ],
        },
        {
          id: 'dir-tech',
          name: 'Скляров Сергей Дмитриевич',
          position: 'Технический директор',
          children: [
            { id: 't1', name: 'Цветков Василий Алексеевич', position: 'Разработчик-программист' },
            { id: 't2', name: 'Зайнутдинов Анатолий Атласович', position: 'Технический специалист' },
          ],
        },
        {
          id: 'dir-product',
          name: 'Носко Анна Владимировна',
          position: 'Директор по продукту',
          children: [
            {
              id: 'p-acad-lead',
              name: 'Панченко Полина Борисовна',
              position: 'Академический директор',
              children: [
                { id: 'pa1', name: 'Юдина Александра Маратовна', position: 'Коммьюнити-менеджер' },
                { id: 'pa2', name: 'Татаркина Арина Олеговна', position: 'Коммьюнити-менеджер' },
                { id: 'pa3', name: 'Качина Дарья Сергеевна', position: 'Методист' },
                { id: 'pa4', name: 'Игнатенко Алексей Сергеевич', position: 'Методолог' },
                { id: 'pa5', name: 'Коваль Ольга Юрьевна', position: 'Методист' },
              ],
            },
            {
              id: 'p-support-lead',
              name: 'Петрова Анастасия Олеговна',
              position: 'Руководитель отдела сопровождения',
              children: [
                { id: 'ps1', name: 'Литвинова Марина Владимировна', position: 'Куратор Дизайн одежды' },
                { id: 'ps2', name: 'Мицкевич Татьяна Владимировна', position: 'Координатор Стиль' },
                { id: 'ps3', name: 'Савина Элла Александровна', position: 'Куратор Фэшн-стилист' },
                { id: 'ps4', name: 'Хлынова Ирина Анатольевна', position: 'Куратор Дизайн интерьера' },
                { id: 'ps5', name: 'Тимофеева Анна Тимофеевна', position: 'Куратор Archicad' },
                { id: 'ps6', name: 'Кашникова Анна Леонидовна', position: 'Куратор Астрология' },
                { id: 'ps7', name: 'Шатеева Татьяна Александровна', position: 'Куратор Астрология' },
                { id: 'ps8', name: 'Костина Юлия Вячеславовна', position: 'Куратор Нутрициология' },
                { id: 'ps9', name: 'Охочая Юлия Валерьевна', position: 'Куратор-преподаватель Нутрициология' },
                { id: 'ps10', name: 'Чепурко Любовь Геннадиевна', position: 'Помощник куратора Нутрициологии' },
                { id: 'ps11', name: 'Остапюк Татьяна Евгеньевна', position: 'Менеджер клиентской поддержки' },
                { id: 'ps12', name: 'Аджатян Светлана Аптиевна', position: 'Менеджер клиентской поддержки' },
                { id: 'ps13', name: 'Катаева Наталья Александровна', position: 'Менеджер клиентской поддержки' },
                { id: 'ps14', name: 'Немова Мария Юрьевна', position: 'Менеджер клиентской поддержки' },
                { id: 'ps15', name: 'Кобзарь Инна Сергеевна', position: 'Менеджер клиентской поддержки' },
                { id: 'ps16', name: 'Ивлиева Ирина Александровна', position: 'Менеджер по работе с возвратами' },
                { id: 'ps17', name: 'Агафонова Инна Александровна', position: 'Менеджер отдела поддержки студентов' },
                { id: 'ps18', name: 'Маркина Мария Ивановна', position: 'Куратор Клиентомания' },
                { id: 'ps19', name: 'Предтеченская Юлия Анатольевна', position: 'Куратор Клиентомания' },
                { id: 'ps20', name: 'Раубо Кристина Владиславовна', position: 'Куратор Клиентомания' },
              ],
            },
            {
              id: 'p-psych-lead',
              name: 'Шатунова Наталья Мансуровна',
              position: 'Координатор Психология',
              children: [
                { id: 'pp1', name: 'Клепалова Яна Александровна', position: 'Куратор, методист Психология' },
                { id: 'pp2', name: 'Иванова Елизавета Александровна', position: 'Куратор Психология' },
                { id: 'pp3', name: 'Енчин Георгий Юрьевич', position: 'Куратор Психология' },
                { id: 'pp4', name: 'Заусалин Дмитрий Валентинович', position: 'Куратор Психология' },
                { id: 'pp5', name: 'Фык Михаил Михайлович', position: 'Куратор Психология' },
                { id: 'pp6', name: 'Игуменщев Игорь Павлович', position: 'Технический куратор Психология' },
                { id: 'pp7', name: 'Фурсова Ольга Игоревна', position: 'Методист расписания' },
              ],
            },
            {
              id: 'p-funnel-lead',
              name: 'Артамонова Алина Анатольевна',
              position: 'Руководитель отдела контентных воронок',
              children: [
                { id: 'pf1', name: 'Грикель Евгения Александровна', position: 'Продюсер контентных воронок' },
                { id: 'pf2', name: 'Дунаева Анна Сергеевна', position: 'Продюсер вебинарных воронок' },
              ],
            },
            { id: 'p-comm', name: 'Луканенкова Мила Анатольевна', position: 'Архитектор сообществ' },
          ],
        },
        {
          id: 'dir-admin',
          name: 'Бортник Валерия Александровна',
          position: 'Административный директор',
          children: [
            { id: 'a1', name: 'Ибрагимов Александр Энверович', position: 'Юрист' },
            { id: 'a2', name: 'Окладникова Ольга Анатольевна', position: 'Специалист по документообороту' },
            { id: 'a3', name: 'Кошкина Татьяна Игоревна', position: 'Менеджер по документообороту' },
          ],
        },
        {
          id: 'dir-hr',
          name: 'Немченко Денис Игоревич',
          position: 'HR директор',
          children: [
            { id: 'h1', name: 'Бурамбаев Бауржан Аманатович', position: 'Специалист по подбору и адаптации' },
            { id: 'h2', name: 'Патова Аида Рамазановна', position: 'Ведущий специалист по кадровому учету' },
          ],
        },
      ],
    },
    {
      id: 'dir-finance',
      name: 'Каневская Елена Викторовна',
      position: 'Финансовый директор',
      children: [
        { id: 'f1', name: 'Каневский Дмитрий Александрович', position: 'Бухгалтер' },
        { id: 'f2', name: 'Агишева Алла Николаевна', position: 'Ассистент' },
      ],
    },
  ],
}

/* ─── Tree Helpers ─── */
function countPeople(node: Person): number {
  let c = node.isVacancy ? 0 : 1
  if (node.children) for (const ch of node.children) c += countPeople(ch)
  return c
}

function countVacancies(node: Person): number {
  let c = node.isVacancy ? 1 : 0
  if (node.children) for (const ch of node.children) c += countVacancies(ch)
  return c
}

function deepClone(node: Person): Person {
  return JSON.parse(JSON.stringify(node))
}

// Remove a node by id and return [updatedTree, removedNode]
function removeNode(tree: Person, targetId: string): [Person, Person | null] {
  if (tree.id === targetId) return [tree, null] // can't remove root
  const clone = deepClone(tree)
  let removed: Person | null = null

  function walk(node: Person): boolean {
    if (!node.children) return false
    const idx = node.children.findIndex((c) => c.id === targetId)
    if (idx !== -1) {
      removed = node.children.splice(idx, 1)[0]
      return true
    }
    for (const ch of node.children) {
      if (walk(ch)) return true
    }
    return false
  }

  walk(clone)
  return [clone, removed]
}

// Insert a node as a child of targetParentId
function insertNode(tree: Person, parentId: string, node: Person): Person {
  const clone = deepClone(tree)

  function walk(n: Person): boolean {
    if (n.id === parentId) {
      if (!n.children) n.children = []
      n.children.push(node)
      return true
    }
    if (n.children) {
      for (const ch of n.children) if (walk(ch)) return true
    }
    return false
  }

  walk(clone)
  return clone
}

// Update a node's fields
function updateNode(tree: Person, nodeId: string, updates: Partial<Person>): Person {
  const clone = deepClone(tree)

  function walk(n: Person): boolean {
    if (n.id === nodeId) {
      Object.assign(n, updates)
      return true
    }
    if (n.children) {
      for (const ch of n.children) if (walk(ch)) return true
    }
    return false
  }

  walk(clone)
  return clone
}

function generateId(): string {
  return 'n_' + Math.random().toString(36).substring(2, 10)
}

/* ─── Org Node Component ─── */
function OrgNode({
  person,
  level = 0,
  draggedId,
  dropTargetId,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  onEdit,
  onAdd,
  onDelete,
  editingId,
  editData,
  setEditData,
  onSaveEdit,
  onCancelEdit,
}: {
  person: Person
  level?: number
  draggedId: string | null
  dropTargetId: string | null
  onDragStart: (id: string) => void
  onDragOver: (e: React.DragEvent, id: string) => void
  onDrop: (e: React.DragEvent, targetId: string) => void
  onDragEnd: () => void
  onEdit: (person: Person) => void
  onAdd: (parentId: string) => void
  onDelete: (id: string) => void
  editingId: string | null
  editData: { name: string; position: string; isVacancy: boolean; priority: string } | null
  setEditData: (d: { name: string; position: string; isVacancy: boolean; priority: string }) => void
  onSaveEdit: () => void
  onCancelEdit: () => void
  readOnly?: boolean
}) {
  const [expanded, setExpanded] = useState(level < 2)
  const hasChildren = person.children && person.children.length > 0
  const childCount = hasChildren ? person.children!.length : 0
  const isEditing = editingId === person.id
  const isDragged = draggedId === person.id
  const isDropTarget = dropTargetId === person.id && draggedId !== person.id

  const borderColor = isDropTarget
    ? 'border-purple-400 bg-purple-50 ring-2 ring-purple-300'
    : person.isVacancy
    ? 'border-orange-300 bg-orange-50/50'
    : level === 0
    ? 'border-purple-300 bg-purple-50/50'
    : level === 1
    ? 'border-blue-200 bg-white'
    : 'border-slate-200 bg-white'

  return (
    <div className={clsx('relative', level > 0 && 'ml-6', isDragged && 'opacity-30')}>
      {level > 0 && <div className="absolute -left-6 top-0 bottom-0 w-px bg-slate-200" />}
      {level > 0 && <div className="absolute -left-6 top-5 w-6 h-px bg-slate-200" />}

      <div
        draggable={!readOnly && level > 0}
        onDragStart={(e) => {
          e.stopPropagation()
          onDragStart(person.id)
        }}
        onDragOver={(e) => onDragOver(e, person.id)}
        onDrop={(e) => onDrop(e, person.id)}
        onDragEnd={onDragEnd}
        className={clsx(
          'flex items-start gap-2 p-3 rounded-lg border transition-all group',
          borderColor,
          !readOnly && level > 0 && 'cursor-grab active:cursor-grabbing'
        )}
      >
        {/* Drag handle */}
        {!readOnly && level > 0 && (
          <div className="mt-1 text-slate-300 group-hover:text-slate-400 flex-shrink-0">
            <GripVertical size={14} />
          </div>
        )}

        {/* Avatar */}
        <div
          className={clsx(
            'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5',
            person.isVacancy
              ? 'bg-orange-100 text-orange-600'
              : level === 0
              ? 'bg-purple-100 text-purple-600'
              : 'bg-slate-100 text-slate-600'
          )}
        >
          {person.isVacancy ? <UserX size={16} /> : <User size={16} />}
        </div>

        {/* Info — editable or display */}
        <div className="flex-1 min-w-0">
          {isEditing && editData ? (
            <div className="space-y-1.5" onClick={(e) => e.stopPropagation()}>
              <input
                type="text"
                value={editData.position}
                onChange={(e) => setEditData({ ...editData, position: e.target.value })}
                placeholder="Должность"
                className="w-full text-sm font-bold px-2 py-1 border border-purple-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && onSaveEdit()}
              />
              <input
                type="text"
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                placeholder="ФИО (пусто = вакансия)"
                className="w-full text-xs px-2 py-1 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                onKeyDown={(e) => e.key === 'Enter' && onSaveEdit()}
              />
              <div className="flex items-center gap-3 pt-0.5">
                <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editData.isVacancy}
                    onChange={(e) => setEditData({ ...editData, isVacancy: e.target.checked })}
                    className="rounded border-slate-300"
                  />
                  <span className="text-orange-600 font-medium">Вакансия</span>
                </label>
                {editData.isVacancy && (
                  <select
                    value={editData.priority}
                    onChange={(e) => setEditData({ ...editData, priority: e.target.value })}
                    className="text-[11px] px-1.5 py-0.5 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                  >
                    <option value="critical">Критический</option>
                    <option value="high">Высокий</option>
                    <option value="medium">Средний</option>
                    <option value="low">Низкий</option>
                  </select>
                )}
              </div>
              <div className="flex gap-1 pt-0.5">
                <button onClick={onSaveEdit} className="p-1 text-green-600 hover:bg-green-50 rounded"><Check size={14} /></button>
                <button onClick={onCancelEdit} className="p-1 text-slate-400 hover:bg-slate-50 rounded"><X size={14} /></button>
              </div>
            </div>
          ) : (
            <div
              onDoubleClick={readOnly ? undefined : (e) => { e.stopPropagation(); onEdit(person) }}
              className={readOnly ? '' : 'cursor-pointer'}
              title={readOnly ? undefined : 'Дважды кликните для редактирования'}
            >
              <p className={clsx('font-bold text-sm', person.isVacancy ? 'text-orange-700' : 'text-slate-900')}>
                {person.position}
              </p>
              <div className="flex items-center gap-2 flex-wrap mt-0.5">
                <p className={clsx('text-xs', person.isVacancy ? 'text-orange-500 font-medium' : 'text-slate-400')}>
                  {person.isVacancy ? (
                    <span className="flex items-center gap-1.5">
                      ВАКАНСИЯ
                      {person.priority && (
                        <span className={clsx('text-[9px] px-1.5 py-0.5 rounded-full font-bold',
                          person.priority === 'critical' ? 'bg-red-100 text-red-600' :
                          person.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                          person.priority === 'medium' ? 'bg-blue-100 text-blue-600' :
                          'bg-slate-100 text-slate-500'
                        )}>
                          {person.priority === 'critical' ? 'КРИТ' : person.priority === 'high' ? 'ВЫСОК' : person.priority === 'medium' ? 'СРЕД' : 'НИЗК'}
                        </span>
                      )}
                    </span>
                  ) : person.name}
                </p>
                {person.halfRate && <span className="text-[10px] px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded font-medium">0,5</span>}
                {person.onLeave && <span className="text-[10px] px-1.5 py-0.5 bg-yellow-100 text-yellow-700 rounded font-medium">декрет</span>}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        {!isEditing && !readOnly && (
          <div className="flex items-center gap-0.5 flex-shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(person) }}
              className="p-1 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded"
              title="Редактировать роль"
            >
              <Pencil size={13} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onAdd(person.id) }}
              className="p-1 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded"
              title="Добавить подчинённого"
            >
              <Plus size={13} />
            </button>
            {level > 0 && (
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(person.id) }}
                className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                title="Удалить"
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>
        )}

        {/* Expand toggle */}
        {hasChildren && (
          <button
            onClick={(e) => { e.stopPropagation(); setExpanded(!expanded) }}
            className="flex items-center gap-1 flex-shrink-0 mt-1"
          >
            <span className="text-[10px] text-slate-400 font-medium">{childCount}</span>
            {expanded ? <ChevronDown size={16} className="text-slate-400" /> : <ChevronRight size={16} className="text-slate-400" />}
          </button>
        )}
      </div>

      {/* Children */}
      {hasChildren && expanded && (
        <div className="mt-1 space-y-1">
          {person.children!.map((child) => (
            <OrgNode
              key={child.id}
              person={child}
              level={level + 1}
              draggedId={draggedId}
              dropTargetId={dropTargetId}
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDrop={onDrop}
              onDragEnd={onDragEnd}
              onEdit={onEdit}
              onAdd={onAdd}
              onDelete={onDelete}
              editingId={editingId}
              editData={editData}
              setEditData={setEditData}
              onSaveEdit={onSaveEdit}
              onCancelEdit={onCancelEdit}
              readOnly={readOnly}
            />
          ))}
        </div>
      )}
    </div>
  )
}

/* ─── Main Page ─── */
const ORG_TREE_ID = '00000000-0000-0000-0000-000000000001'

export default function StructurePage() {
  const { role } = useRoleStore()
  const readOnly = role === 'employee'

  const [orgData, setOrgData] = useState<Person>(defaultOrgData)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [hasUnsaved, setHasUnsaved] = useState(false)

  // Drag state
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [dropTargetId, setDropTargetId] = useState<string | null>(null)

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<{ name: string; position: string; isVacancy: boolean; priority: string } | null>(null)

  // Load tree from DB
  useEffect(() => {
    const load = async () => {
      try {
        const supabase = createClient()
        // Таймаут 8 секунд, чтобы страница не висела бесконечно,
        // если RLS/сессия заблокировали запрос.
        const timeout = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('timeout')), 8000)
        )
        const query = supabase
          .from('org_tree')
          .select('data')
          .eq('id', ORG_TREE_ID)
          .single()
        const { data, error } = (await Promise.race([query, timeout])) as any

        if (!error && data && data.data && data.data.id) {
          setOrgData(data.data as Person)
        } else {
          if (error) console.warn('[structure] load error:', error.message)
          // First load — save default data (best-effort)
          try {
            await supabase
              .from('org_tree')
              .update({ data: defaultOrgData as any, updated_at: new Date().toISOString() })
              .eq('id', ORG_TREE_ID)
          } catch {}
        }
      } catch (err) {
        console.error('Error loading org tree:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Save to DB
  const saveToDb = useCallback(async (tree: Person) => {
    setSaving(true)
    try {
      const supabase = createClient()
      await supabase
        .from('org_tree')
        .update({ data: tree as any, updated_at: new Date().toISOString() })
        .eq('id', ORG_TREE_ID)
      setHasUnsaved(false)
    } catch (err) {
      console.error('Error saving org tree:', err)
    } finally {
      setSaving(false)
    }
  }, [])

  // Auto-save debounced
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const scheduleAutoSave = useCallback((tree: Person) => {
    setHasUnsaved(true)
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(() => saveToDb(tree), 1500)
  }, [saveToDb])

  // Update tree helper
  const updateTree = useCallback((newTree: Person) => {
    setOrgData(newTree)
    scheduleAutoSave(newTree)
  }, [scheduleAutoSave])

  /* ─── Drag handlers ─── */
  const handleDragStart = (id: string) => setDraggedId(id)

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault()
    e.stopPropagation()
    if (draggedId && draggedId !== id) {
      setDropTargetId(id)
    }
  }

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault()
    e.stopPropagation()
    if (!draggedId || draggedId === targetId) { setDraggedId(null); setDropTargetId(null); return }

    // Check we're not dropping into own subtree
    function isDescendant(tree: Person, parentId: string, childId: string): boolean {
      if (tree.id === parentId) {
        function hasId(n: Person): boolean {
          if (n.id === childId) return true
          return n.children?.some(hasId) || false
        }
        return hasId(tree)
      }
      return tree.children?.some((c) => isDescendant(c, parentId, childId)) || false
    }

    if (isDescendant(orgData, draggedId, targetId)) {
      setDraggedId(null); setDropTargetId(null); return
    }

    const [treeWithout, removed] = removeNode(orgData, draggedId)
    if (removed) {
      const newTree = insertNode(treeWithout, targetId, removed)
      updateTree(newTree)
    }

    setDraggedId(null)
    setDropTargetId(null)
  }

  const handleDragEnd = () => { setDraggedId(null); setDropTargetId(null) }

  /* ─── Edit handlers ─── */
  const handleEdit = (person: Person) => {
    setEditingId(person.id)
    setEditData({ name: person.name, position: person.position, isVacancy: !!person.isVacancy, priority: person.priority || 'medium' })
  }

  const handleSaveEdit = () => {
    if (!editingId || !editData) return
    const isVacancy = editData.isVacancy || !editData.name.trim()
    const newTree = updateNode(orgData, editingId, {
      name: editData.name.trim(),
      position: editData.position.trim(),
      isVacancy,
      priority: isVacancy ? editData.priority : undefined,
    })
    updateTree(newTree)
    setEditingId(null)
    setEditData(null)
  }

  const handleCancelEdit = () => { setEditingId(null); setEditData(null) }

  /* ─── Add / Delete ─── */
  const handleAdd = (parentId: string) => {
    const newPerson: Person = {
      id: generateId(),
      name: '',
      position: 'Новая должность',
      isVacancy: true,
    }
    const newTree = insertNode(orgData, parentId, newPerson)
    updateTree(newTree)
    setEditingId(newPerson.id)
    setEditData({ name: '', position: 'Новая должность', isVacancy: true, priority: 'medium' })
  }

  const handleDelete = (id: string) => {
    if (!confirm('Удалить сотрудника и всех его подчинённых?')) return
    const [newTree] = removeNode(orgData, id)
    updateTree(newTree)
  }

  const totalPeople = countPeople(orgData)
  const totalVacancies = countVacancies(orgData)

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="text-center py-12"><p className="text-slate-600">Загрузка оргструктуры...</p></div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <Link href="/company" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-4">
          <ArrowLeft size={16} />
          Назад к разделу компании
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Организационная структура</h1>
            <p className="text-slate-600">
              {readOnly
                ? 'Структура компании и подчинения.'
                : 'Перетаскивайте сотрудников для изменения подчинения. Дважды кликните для редактирования.'}
            </p>
          </div>
          {!readOnly && (
            <div className="flex items-center gap-2">
              {saving && <span className="text-xs text-purple-600 animate-pulse">Сохранение...</span>}
              {hasUnsaved && !saving && <span className="text-xs text-amber-600">Не сохранено</span>}
              {!hasUnsaved && !saving && <span className="text-xs text-green-600">Сохранено</span>}
            </div>
          )}
        </div>
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
        {!readOnly && (
          <div className="flex items-center gap-1.5">
            <GripVertical size={14} className="text-slate-400" />
            <span>Перетаскивание</span>
          </div>
        )}
      </div>

      {/* Org Tree */}
      <div
        className="space-y-1"
        onDragOver={(e) => e.preventDefault()}
      >
        <OrgNode
          person={orgData}
          level={0}
          draggedId={readOnly ? null : draggedId}
          dropTargetId={readOnly ? null : dropTargetId}
          onDragStart={readOnly ? () => {} : handleDragStart}
          onDragOver={readOnly ? () => {} : handleDragOver}
          onDrop={readOnly ? () => {} : handleDrop}
          onDragEnd={readOnly ? () => {} : handleDragEnd}
          onEdit={readOnly ? () => {} : handleEdit}
          onAdd={readOnly ? () => {} : handleAdd}
          onDelete={readOnly ? () => {} : handleDelete}
          editingId={readOnly ? null : editingId}
          editData={readOnly ? null : editData}
          setEditData={readOnly ? () => {} : setEditData}
          onSaveEdit={readOnly ? () => {} : handleSaveEdit}
          onCancelEdit={readOnly ? () => {} : handleCancelEdit}
          readOnly={readOnly}
        />
      </div>

      {/* Link to vacancies */}
      <div className="mt-10 p-6 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-1">Открытые вакансии</h2>
            <p className="text-slate-600 text-sm">{totalVacancies} позиций ждут своих кандидатов</p>
          </div>
          <Link href="/company/vacancies" className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium text-sm transition-colors">
            Смотреть вакансии
          </Link>
        </div>
      </div>
    </div>
  )
}
