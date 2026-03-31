'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Building2,
  Package,
  Users,
  FileText,
  Newspaper,
  Settings,
  ChevronDown,
  LogOut,
  Menu,
  X,
  Shield,
  UserCog,
  User,
  GraduationCap,
} from 'lucide-react'
import clsx from 'clsx'
import { useRoleStore, ROLE_LABELS, ROLE_COLORS, type UserRole } from '@/lib/stores/role-store'

interface NavSection {
  id: string
  label: string
  icon: React.ReactNode
  href?: string
  items?: {
    label: string
    href: string
  }[]
  minRole?: UserRole
}

const ROLE_ICONS: Record<UserRole, React.ReactNode> = {
  employee: <User size={14} />,
  head: <UserCog size={14} />,
  admin: <Shield size={14} />,
}

const PROFILES: Record<UserRole, { full_name: string; position: string }> = {
  employee: { full_name: 'Иван Иванов', position: 'Контент-менеджер' },
  head: { full_name: 'Елена Петрова', position: 'Руководитель отдела маркетинга' },
  admin: { full_name: 'Алексей Сидоров', position: 'Системный администратор' },
}

export default function Sidebar() {
  const pathname = usePathname()
  const { role, setRole } = useRoleStore()
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    general: true,
    products: false,
    departments: false,
  })
  const [mobileOpen, setMobileOpen] = useState(false)
  const [roleSelectorOpen, setRoleSelectorOpen] = useState(false)

  const profile = PROFILES[role]

  const canSee = (minRole?: UserRole) => {
    if (!minRole) return true
    const order: UserRole[] = ['employee', 'head', 'admin']
    return order.indexOf(role) >= order.indexOf(minRole)
  }

  const navSections: NavSection[] = [
    {
      id: 'home',
      label: 'Новости',
      icon: <Newspaper size={20} />,
      href: '/news',
    },
    {
      id: 'general',
      label: 'Общее',
      icon: <Building2 size={20} />,
      items: [
        { label: 'Обзор', href: '/company' },
        { label: 'Оргструктура', href: '/company/structure' },
        { label: 'Открытые вакансии', href: '/company/vacancies' },
        { label: 'Миссия', href: '/company/mission' },
        { label: 'Принципы работы', href: '/company/values' },
        { label: 'Стратегические цели', href: '/company/goals' },
        { label: 'Должности', href: '/company/positions' },
      ],
    },
    {
      id: 'onboarding',
      label: 'Онбординг',
      icon: <GraduationCap size={20} />,
      href: '/onboarding',
    },
    {
      id: 'products',
      label: 'Продукты',
      icon: <Package size={20} />,
      items: [
        { label: 'Платные', href: '/products/paid' },
        { label: 'Бесплатные', href: '/products/free' },
      ],
    },
    {
      id: 'departments',
      label: 'Отделы',
      icon: <Users size={20} />,
      items: [
        { label: 'Продажи', href: '/departments/sales' },
        { label: 'Маркетинг', href: '/departments/marketing' },
        { label: 'Продукт', href: '/departments/product' },
        { label: 'Технический', href: '/departments/tech' },
        { label: 'Финансы', href: '/departments/finance' },
        { label: 'Администрация', href: '/departments/admin' },
        { label: 'HR', href: '/departments/hr' },
      ],
    },
    {
      id: 'docs',
      label: 'Документы',
      icon: <FileText size={20} />,
      href: '/docs',
    },
    {
      id: 'admin',
      label: 'Администрирование',
      icon: <Settings size={20} />,
      href: '/admin',
      minRole: 'admin',
    },
  ]

  const visibleSections = navSections.filter((s) => canSee(s.minRole))

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }))
  }

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="px-6 py-6 border-b border-slate-700">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">T</span>
          </div>
          <span className="text-xl font-bold text-white">Talentsy KB</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 overflow-y-auto">
        <div className="space-y-1">
          {visibleSections.map((section) => {
            const hasItems = section.items && section.items.length > 0
            const isExpanded = expandedSections[section.id]
            const isCurrentActive = hasItems
              ? section.items!.some((item) => isActive(item.href))
              : isActive(section.href || '/')

            return (
              <div key={section.id}>
                {hasItems ? (
                  <button
                    onClick={() => toggleSection(section.id)}
                    className={clsx(
                      'w-full flex items-center justify-between gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                      isCurrentActive
                        ? 'bg-purple-600 text-white'
                        : 'text-slate-300 hover:bg-slate-800'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {section.icon}
                      <span>{section.label}</span>
                    </div>
                    <ChevronDown
                      size={16}
                      className={clsx(
                        'transition-transform',
                        isExpanded && 'rotate-180'
                      )}
                    />
                  </button>
                ) : (
                  <Link
                    href={section.href || '/'}
                    className={clsx(
                      'flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                      isCurrentActive
                        ? 'bg-purple-600 text-white'
                        : 'text-slate-300 hover:bg-slate-800'
                    )}
                  >
                    {section.icon}
                    <span>{section.label}</span>
                  </Link>
                )}

                {/* Submenu Items */}
                {hasItems && isExpanded && (
                  <div className="mt-1 ml-4 space-y-1 border-l border-slate-700 pl-3">
                    {section.items!.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={clsx(
                          'block px-3 py-2 rounded text-sm transition-colors',
                          isActive(item.href)
                            ? 'bg-purple-600/20 text-purple-300 font-medium'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                        )}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </nav>

      {/* Role Switcher + User Profile */}
      <div className="px-4 py-4 border-t border-slate-700">
        {/* Role Switcher */}
        <div className="relative mb-3">
          <button
            onClick={() => setRoleSelectorOpen(!roleSelectorOpen)}
            className="w-full flex items-center justify-between gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className={clsx('w-2 h-2 rounded-full', ROLE_COLORS[role])} />
              <span className="text-slate-300">{ROLE_LABELS[role]}</span>
            </div>
            <ChevronDown
              size={14}
              className={clsx(
                'text-slate-400 transition-transform',
                roleSelectorOpen && 'rotate-180'
              )}
            />
          </button>

          {roleSelectorOpen && (
            <div className="absolute bottom-full left-0 right-0 mb-1 bg-slate-800 rounded-lg border border-slate-600 overflow-hidden shadow-xl">
              <div className="px-3 py-2 border-b border-slate-700">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Тестовый режим
                </p>
              </div>
              {(Object.keys(ROLE_LABELS) as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setRole(r)
                    setRoleSelectorOpen(false)
                  }}
                  className={clsx(
                    'w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-colors',
                    role === r
                      ? 'bg-purple-600/20 text-purple-300'
                      : 'text-slate-300 hover:bg-slate-700'
                  )}
                >
                  <span className={clsx('w-2 h-2 rounded-full', ROLE_COLORS[r])} />
                  <span className="flex items-center gap-2">
                    {ROLE_ICONS[r]}
                    {ROLE_LABELS[r]}
                  </span>
                  {role === r && (
                    <span className="ml-auto text-xs text-purple-400">✓</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="flex items-center gap-3 mb-3">
          <img
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${role}`}
            alt={profile.full_name}
            className="w-10 h-10 rounded-full bg-slate-700"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {profile.full_name}
            </p>
            <p className="text-xs text-slate-400 truncate">
              {profile.position}
            </p>
          </div>
        </div>

        <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition-colors">
          <LogOut size={16} />
          <span>Выход</span>
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 w-[280px] h-screen bg-slate-900 text-white flex-col z-30">
        {sidebarContent}
      </aside>

      {/* Spacer for fixed sidebar */}
      <div className="hidden lg:block w-[280px] flex-shrink-0" />

      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-40">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 bg-slate-900 text-white rounded-lg"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-30">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 w-[280px] h-screen bg-slate-900 text-white flex flex-col overflow-y-auto">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  )
}
