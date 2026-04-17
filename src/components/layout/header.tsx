'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  ChevronRight,
  Home,
} from 'lucide-react'

const BREADCRUMB_MAP: Record<string, string> = {
  '/': 'Главная',
  '/company': 'Компания',
  '/company/mission': 'Миссия',
  '/company/positions': 'Должности',
  '/company/onboarding': 'Онбординг',
  '/products': 'Продукты',
  '/products/paid': 'Платные продукты',
  '/products/free': 'Бесплатные продукты',
  '/departments': 'Отделы',
  '/departments/marketing': 'Маркетинг',
  '/departments/sales': 'Продажи',
  '/departments/product': 'Продукт',
  '/docs': 'Документы',
  '/news': 'Новости',
  '/admin': 'Администрирование',
  '/admin/users': 'Управление пользователями',
  '/admin/trainings': 'Тренинги',
  '/trainings': 'Обучение и тренинги',
}

function generateBreadcrumbs(pathname: string) {
  const segments = pathname.split('/').filter(Boolean)
  const breadcrumbs: { label: string; href: string }[] = [
    { label: 'Главная', href: '/' },
  ]

  let currentPath = ''
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`
    const label = BREADCRUMB_MAP[currentPath] || segment
    breadcrumbs.push({ label, href: currentPath })
  })

  return breadcrumbs
}

export default function Header() {
  const pathname = usePathname()
  const breadcrumbs = generateBreadcrumbs(pathname)

  return (
    <header className="sticky top-0 bg-white border-b border-slate-200 z-20">
      <div className="flex items-center h-16 px-6">
        {/* Breadcrumbs */}
        <nav className="hidden sm:flex items-center gap-2 min-w-0">
          {breadcrumbs.map((breadcrumb, index) => (
            <div key={breadcrumb.href} className="flex items-center gap-2 min-w-0">
              {index === 0 && (
                <Link
                  href={breadcrumb.href}
                  className="text-slate-600 hover:text-slate-900 transition-colors flex-shrink-0"
                  title={breadcrumb.label}
                >
                  <Home size={18} />
                </Link>
              )}
              {index > 0 && (
                <>
                  <ChevronRight size={16} className="text-slate-400 flex-shrink-0" />
                  <Link
                    href={breadcrumb.href}
                    className="text-sm text-slate-600 hover:text-slate-900 transition-colors truncate"
                    title={breadcrumb.label}
                  >
                    {breadcrumb.label}
                  </Link>
                </>
              )}
            </div>
          ))}
        </nav>
      </div>
    </header>
  )
}
