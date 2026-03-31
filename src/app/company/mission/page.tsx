'use client'

import Link from 'next/link'
import { ArrowLeft, GraduationCap, Heart, Rocket, BookOpen } from 'lucide-react'

export default function MissionPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <Link
        href="/company"
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-6"
      >
        <ArrowLeft size={16} />
        Назад к разделу компании
      </Link>

      <h1 className="text-3xl font-bold text-slate-900 mb-8">Миссия и философия</h1>

      {/* Mission */}
      <div className="bg-slate-800 rounded-lg p-8 text-white mb-8">
        <p className="text-sm text-slate-400 uppercase tracking-wider mb-3">Наша миссия</p>
        <p className="text-xl leading-relaxed font-medium">
          С помощью инновационного образования подготавливать квалифицированных специалистов
          в области помогающих профессий для улучшения благополучия общества
        </p>
      </div>

      {/* What are helping professions */}
      <div className="bg-white border border-slate-200 rounded-lg p-8 mb-8">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Heart size={24} className="text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              Что означает «помогающие профессии»?
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Это психологи, нутрициологи, коучи, стилисты...
              Это люди, которые напрямую работают с человеком, улучшая его ментальное
              и физическое здоровье, красоту и качество жизни. Они помогают людям
              и делают мир лучше.
            </p>
          </div>
        </div>
      </div>

      {/* Philosophy — Lifelong Learning */}
      <div className="bg-slate-800 rounded-lg p-8 text-white mb-8">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <BookOpen size={24} className="text-purple-300" />
          </div>
          <div>
            <h2 className="text-xl font-bold mb-1">
              Наша философия — Lifelong Learning
            </h2>
            <p className="text-slate-400 text-sm mb-4">(Обучение длиною в жизнь)</p>
            <p className="text-lg text-white font-semibold leading-relaxed mb-3">
              Мы верим, что в помогающих профессиях нужно учиться всю жизнь.
            </p>
            <p className="text-slate-300 leading-relaxed">
              Наш ассортимент построен так, чтобы сопровождать специалиста на всем его пути:
              от базового курса «Психолог-консультант» до бесконечного повышения квалификации.
            </p>
          </div>
        </div>
      </div>

      {/* Future plans */}
      <div className="bg-slate-800 rounded-lg p-8 text-white mb-10">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <Rocket size={24} className="text-purple-300" />
          </div>
          <div>
            <h2 className="text-xl font-bold mb-4">В будущем:</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
                <p className="text-slate-300 leading-relaxed">
                  Мы будем постоянно расширять линейку продуктов в психологии, коучинге и нутрициологии
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
                <p className="text-slate-300 leading-relaxed">
                  В планах на несколько лет вперёд — запуск новых направлений:{' '}
                  <span className="text-purple-300 font-semibold">логопедия</span>,{' '}
                  <span className="text-purple-300 font-semibold">дефектология</span>,{' '}
                  <span className="text-purple-300 font-semibold">педагогика</span> и{' '}
                  <span className="text-purple-300 font-semibold">повышение квалификации для врачей</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="flex gap-4">
        <Link
          href="/company/values"
          className="flex-1 p-4 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors text-center"
        >
          <p className="font-semibold text-orange-700">Как мы работаем вместе</p>
          <p className="text-xs text-orange-500 mt-1">4 принципа Talentsy</p>
        </Link>
        <Link
          href="/company/goals"
          className="flex-1 p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors text-center"
        >
          <p className="font-semibold text-green-700">Стратегические цели</p>
          <p className="text-xs text-green-500 mt-1">Куда мы движемся</p>
        </Link>
      </div>
    </div>
  )
}
