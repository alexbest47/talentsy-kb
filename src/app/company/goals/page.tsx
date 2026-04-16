'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  PencilIcon,
  Target,
  User,
  UserX,
} from 'lucide-react'
import clsx from 'clsx'
import { createClient } from '@/lib/supabase/client'

/* ─── Types ─── */
interface Person {
  id: string
  name: string
  position: string
  isVacancy?: boolean
  halfRate?: boolean
  onLeave?: boolean
  priority?: string
  children?: Person[]
}

interface GoalRecord {
  id: string
  quarter: string
  department: string
  role: string | null
  text: string
  metric: string | null
  status: string
  sort_order: number
  position_id: string | null
}

interface PositionRecord {
  id: string
  title: string
  holder: string | null
}

/** Org tree node enriched with goals */
interface GoalTreeNode {
  person: Person
  goals: GoalRecord[]
  children: GoalTreeNode[]
  totalGoals: number // goals in this node + all descendants
}

const ORG_TREE_ID = '00000000-0000-0000-0000-000000000001'

/* ─── Color helpers ─── */
const levelColors: Record<number, { dot: string; bg: string; border: string; badge: string }> = {
  0: { dot: 'bg-purple-500', bg: 'bg-purple-50', border: 'border-purple-200', badge: 'bg-purple-100 text-purple-700' },
  1: { dot: 'bg-blue-500', bg: 'bg-blue-50', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-700' },
  2: { dot: 'bg-teal-500', bg: 'bg-teal-50', border: 'border-teal-200', badge: 'bg-teal-100 text-teal-700' },
  3: { dot: 'bg-green-500', bg: 'bg-green-50', border: 'border-green-200', badge: 'bg-green-100 text-green-700' },
  4: { dot: 'bg-amber-500', bg: 'bg-amber-50', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-700' },
}

function getColors(level: number) {
  return levelColors[Math.min(level, 4)]
}

/* ─── Normalize string for matching ─── */
function normalize(s: string): string {
  return s.toLowerCase().replace(/ё/g, 'е').replace(/\s+/g, ' ').trim()
}

/* ─── Build enriched tree, filtering to only branches with goals ─── */
function buildGoalTree(
  person: Person,
  goalsByPositionTitle: Map<string, GoalRecord[]>,
  goalsByHolder: Map<string, GoalRecord[]>,
): GoalTreeNode | null {
  const normalizedPosition = normalize(person.position)
  const normalizedName = normalize(person.name || '')

  // Find goals for this person: match by position title first, then by holder name
  let myGoals = goalsByPositionTitle.get(normalizedPosition) || []
  if (myGoals.length === 0 && normalizedName) {
    myGoals = goalsByHolder.get(normalizedName) || []
  }

  // Recurse into children
  const childNodes: GoalTreeNode[] = []
  if (person.children) {
    for (const child of person.children) {
      const childNode = buildGoalTree(child, goalsByPositionTitle, goalsByHolder)
      if (childNode) {
        childNodes.push(childNode)
      }
    }
  }

  // Include this node if it has goals or any descendant does
  const totalGoals = myGoals.length + childNodes.reduce((sum, c) => sum + c.totalGoals, 0)
  if (totalGoals === 0) return null

  return {
    person,
    goals: myGoals.sort((a, b) => a.sort_order - b.sort_order),
    children: childNodes,
    totalGoals,
  }
}

/* ─── Goal item component ─── */
function GoalItem({ goal, colors }: { goal: GoalRecord; colors: ReturnType<typeof getColors> }) {
  return (
    <div className="py-3 px-4 flex items-start gap-3">
      <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <p className="flex-1 text-sm text-slate-700 leading-relaxed">{goal.text}</p>
      {goal.metric && (
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-md flex-shrink-0 ${colors.badge}`}>
          {goal.metric}
        </span>
      )}
    </div>
  )
}

/* ─── Tree node component ─── */
function GoalTreeNodeComponent({
  node,
  level,
  defaultExpanded,
}: {
  node: GoalTreeNode
  level: number
  defaultExpanded: boolean
}) {
  const [expanded, setExpanded] = useState(defaultExpanded)
  const [goalsExpanded, setGoalsExpanded] = useState(defaultExpanded && node.goals.length > 0)
  const colors = getColors(level)
  const hasGoals = node.goals.length > 0
  const hasChildren = node.children.length > 0
  const isVacancy = node.person.isVacancy || !node.person.name

  return (
    <div className={level > 0 ? 'ml-6 mt-3' : 'mt-3'}>
      {/* Person card */}
      <div className={`border ${colors.border} rounded-lg overflow-hidden`}>
        {/* Header */}
        <div
          className={`flex items-center gap-3 p-4 ${colors.bg} cursor-pointer hover:opacity-90 transition-opacity`}
          onClick={() => {
            if (hasChildren) {
              setExpanded(!expanded)
            } else if (hasGoals) {
              setGoalsExpanded(!goalsExpanded)
            }
          }}
        >
          {/* Icon */}
          <div className="flex-shrink-0">
            {isVacancy ? (
              <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center">
                <UserX size={18} className="text-orange-500" />
              </div>
            ) : (
              <div className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center">
                <User size={18} className="text-slate-500" />
              </div>
            )}
          </div>

          {/* Name & position */}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-900 truncate">
              {isVacancy ? 'ВАКАНСИЯ' : node.person.name}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 truncate">{node.person.position}</p>
          </div>

          {/* Goal count & expand */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {hasGoals && (
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colors.badge}`}>
                {node.goals.length} {node.goals.length === 1 ? 'цель' : node.goals.length < 5 ? 'цели' : 'целей'}
              </span>
            )}
            {(hasChildren || hasGoals) && (
              expanded || goalsExpanded ? (
                <ChevronDown size={18} className="text-slate-400" />
              ) : (
                <ChevronRight size={18} className="text-slate-400" />
              )
            )}
          </div>
        </div>

        {/* Goals list */}
        {hasGoals && (expanded || goalsExpanded) && (
          <div className="bg-white divide-y divide-slate-100 border-t border-slate-100">
            {node.goals.map((goal) => (
              <GoalItem key={goal.id} goal={goal} colors={colors} />
            ))}
          </div>
        )}
      </div>

      {/* Children */}
      {expanded && hasChildren && (
        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-4 top-0 bottom-3 w-px bg-slate-200" />
          {node.children.map((child) => (
            <GoalTreeNodeComponent
              key={child.person.id}
              node={child}
              level={level + 1}
              defaultExpanded={level < 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

/* ─── Main page ─── */
export default function GoalsPage() {
  const supabase = createClient()
  const [activeQuarter, setActiveQuarter] = useState<string | null>(null)
  const [quarters, setQuarters] = useState<string[]>([])
  const [allGoals, setAllGoals] = useState<GoalRecord[]>([])
  const [positions, setPositions] = useState<PositionRecord[]>([])
  const [orgTree, setOrgTree] = useState<Person | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [goalsRes, positionsRes, treeRes] = await Promise.all([
        supabase
          .from('goals')
          .select('*')
          .order('sort_order', { ascending: true }),
        supabase
          .from('positions')
          .select('id, title, holder'),
        supabase
          .from('org_tree')
          .select('data')
          .eq('id', ORG_TREE_ID)
          .single(),
      ])

      if (goalsRes.error) throw goalsRes.error

      const goals = goalsRes.data || []
      setAllGoals(goals)

      const uniqueQuarters = Array.from(new Set(goals.map((g: GoalRecord) => g.quarter))).sort().reverse()
      setQuarters(uniqueQuarters)
      if (uniqueQuarters.length > 0) {
        setActiveQuarter(uniqueQuarters[0])
      }

      setPositions(positionsRes.data || [])

      if (treeRes.data?.data) {
        setOrgTree(treeRes.data.data as Person)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Build enriched goal tree for active quarter
  const goalTree = useMemo(() => {
    if (!orgTree || !activeQuarter || allGoals.length === 0 || positions.length === 0) return null

    const quarterGoals = allGoals.filter((g) => g.quarter === activeQuarter)

    // Build position_id → position title map
    const posIdToTitle = new Map<string, string>()
    const posIdToHolder = new Map<string, string>()
    for (const p of positions) {
      posIdToTitle.set(p.id, p.title)
      if (p.holder) posIdToHolder.set(p.id, p.holder)
    }

    // Group goals by normalized position title and by normalized holder name
    const goalsByPositionTitle = new Map<string, GoalRecord[]>()
    const goalsByHolder = new Map<string, GoalRecord[]>()

    for (const goal of quarterGoals) {
      if (!goal.position_id) continue

      const title = posIdToTitle.get(goal.position_id)
      if (title) {
        const key = normalize(title)
        if (!goalsByPositionTitle.has(key)) goalsByPositionTitle.set(key, [])
        goalsByPositionTitle.get(key)!.push(goal)
      }

      const holder = posIdToHolder.get(goal.position_id)
      if (holder) {
        const key = normalize(holder)
        if (!goalsByHolder.has(key)) goalsByHolder.set(key, [])
        goalsByHolder.get(key)!.push(goal)
      }
    }

    return buildGoalTree(orgTree, goalsByPositionTitle, goalsByHolder)
  }, [orgTree, activeQuarter, allGoals, positions])

  const totalGoals = allGoals.filter((g) => g.quarter === activeQuarter).length
  const peopleWithGoals = goalTree
    ? countPeopleWithGoals(goalTree)
    : 0

  const futureQuarters = ['Q3-2026', 'Q4-2026'].filter((q) => !quarters.includes(q))

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <p className="text-slate-500">Загрузка целей...</p>
      </div>
    )
  }

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
          <p className="text-slate-600">Квартальные цели по организационной структуре компании</p>
        </div>
        <Link
          href="/admin/goals"
          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
        >
          <PencilIcon size={16} />
          Редактировать цели
        </Link>
      </div>

      {quarters.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-600 text-lg">Цели пока не добавлены</p>
        </div>
      ) : (
        <>
          {/* Quarter selector */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
            {quarters.map((q) => (
              <button
                key={q}
                onClick={() => setActiveQuarter(q)}
                className={clsx(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
                  activeQuarter === q ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                )}
              >
                {q}
              </button>
            ))}
            {futureQuarters.map((q) => (
              <button
                key={q}
                disabled
                className="px-4 py-2 rounded-lg text-sm font-medium bg-slate-50 text-slate-300 border border-dashed border-slate-200 whitespace-nowrap cursor-not-allowed"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Summary */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white border border-slate-200 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-purple-600">{peopleWithGoals}</p>
              <p className="text-xs text-slate-500 mt-1">Сотрудников с целями</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-slate-900">{totalGoals}</p>
              <p className="text-xs text-slate-500 mt-1">Всего целей</p>
            </div>
          </div>

          {/* Goal tree */}
          {goalTree ? (
            <div className="pb-4">
              <GoalTreeNodeComponent
                node={goalTree}
                level={0}
                defaultExpanded={true}
              />
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-600">Нет целей для этого квартала</p>
            </div>
          )}
        </>
      )}

      {/* Note */}
      <div className="mt-8 p-4 bg-slate-50 border border-slate-200 rounded-lg">
        <p className="text-xs text-slate-500">
          Цели устанавливаются поквартально. Структура отражает организационную иерархию компании.
          Нажмите на сотрудника, чтобы развернуть его цели. Для редактирования обратитесь к администратору.
        </p>
      </div>
    </div>
  )
}

/** Count people who have direct goals in the tree */
function countPeopleWithGoals(node: GoalTreeNode): number {
  let count = node.goals.length > 0 ? 1 : 0
  for (const child of node.children) {
    count += countPeopleWithGoals(child)
  }
  return count
}
