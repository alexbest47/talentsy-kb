'use client'

import Link from 'next/link'
import { Package, ShoppingCart, Gift, ArrowRight } from 'lucide-react'

export default function ProductsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">
          Наши продукты
        </h1>
        <p className="text-lg text-slate-600">
          Обзор платных и бесплатных продуктов, которые предлагает Talentsy
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Paid Products */}
        <Link href="/products/paid">
          <div className="h-full p-8 bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-lg hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
            <div className="flex items-center gap-3 mb-4">
              <ShoppingCart size={32} className="text-purple-600" />
              <h2 className="text-2xl font-bold text-slate-900">
                Платные продукты
              </h2>
            </div>
            <p className="text-slate-700 mb-4">
              Полнофункциональные решения для управления талантами и развития
              персонала
            </p>
            <div className="space-y-2 mb-6">
              <p className="text-sm text-slate-600 flex items-center gap-2">
                <span className="text-purple-600">✓</span>
                Продвинутые возможности аналитики
              </p>
              <p className="text-sm text-slate-600 flex items-center gap-2">
                <span className="text-purple-600">✓</span>
                Интеграция с HR-системами
              </p>
              <p className="text-sm text-slate-600 flex items-center gap-2">
                <span className="text-purple-600">✓</span>
                Поддержка 24/7
              </p>
            </div>
            <div className="bg-white rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-purple-600">5 продуктов</p>
              <p className="text-xs text-slate-600 mt-1">в каталоге</p>
            </div>
            <button className="w-full mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
              Посмотреть
              <ArrowRight size={16} />
            </button>
          </div>
        </Link>

        {/* Free Products */}
        <Link href="/products/free">
          <div className="h-full p-8 bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-lg hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
            <div className="flex items-center gap-3 mb-4">
              <Gift size={32} className="text-green-600" />
              <h2 className="text-2xl font-bold text-slate-900">
                Бесплатные продукты
              </h2>
            </div>
            <p className="text-slate-700 mb-4">
              Достаточно мощные инструменты для начала работы с управлением талантами
            </p>
            <div className="space-y-2 mb-6">
              <p className="text-sm text-slate-600 flex items-center gap-2">
                <span className="text-green-600">✓</span>
                Базовая аналитика
              </p>
              <p className="text-sm text-slate-600 flex items-center gap-2">
                <span className="text-green-600">✓</span>
                До 50 пользователей
              </p>
              <p className="text-sm text-slate-600 flex items-center gap-2">
                <span className="text-green-600">✓</span>
                Сообщество поддержки
              </p>
            </div>
            <div className="bg-white rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-green-600">7 продуктов</p>
              <p className="text-xs text-slate-600 mt-1">в каталоге</p>
            </div>
            <button className="w-full mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
              Посмотреть
              <ArrowRight size={16} />
            </button>
          </div>
        </Link>
      </div>

      {/* Info Section */}
      <div className="mt-12 p-6 bg-slate-50 border border-slate-200 rounded-lg">
        <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
          <Package size={20} className="text-purple-600" />
          О наших продуктах
        </h3>
        <p className="text-slate-700 mb-4">
          Talentsy предлагает комплексное решение для управления человеческими
          ресурсами. Наша платформа помогает организациям находить, развивать и
          удерживать лучшие таланты. Мы предлагаем как платные решения для крупных
          предприятий, так и доступные варианты для малых и средних компаний.
        </p>
        <p className="text-slate-700">
          Каждый продукт тщательно разработан на основе отзывов клиентов и лучших
          практик в индустрии. Независимо от выбранного плана, вы получите надежный
          инструмент для оптимизации процессов управления персоналом.
        </p>
      </div>
    </div>
  )
}
