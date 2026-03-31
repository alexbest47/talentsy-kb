'use client'

import Link from 'next/link'
import { ArrowLeft, Users, Handshake, TrendingUp, Target } from 'lucide-react'

interface Principle {
  number: number
  title: string
  icon: React.ReactNode
  color: string
  points: { text: string; bold?: string }[]
}

const principles: Principle[] = [
  {
    number: 1,
    title: 'Каждый в команде важен',
    icon: <Users size={24} />,
    color: 'purple',
    points: [
      {
        text: 'Мы верим, что великую компанию невозможно построить в одиночку.',
        bold: 'Мы ценим вклад, идеи и личную ситуацию каждого сотрудника',
      },
      {
        text: 'Но это двустороннее движение. Приходя в команду, вы становитесь её частью. Ваша обязанность — не молчать',
      },
      {
        text: 'Если вы видите проблему, риск или неэффективность — вы должны сообщить об этом',
      },
    ],
  },
  {
    number: 2,
    title: 'Мы — команда, а не семья',
    icon: <Handshake size={24} />,
    color: 'blue',
    points: [
      {
        text: 'Мы — команда. Эта метафора для нас ключевая. Мы ценим здоровые, уважительные отношения: общаемся корректно, не грубим и всегда готовы извиниться',
      },
      {
        bold: 'Но на первом месте всегда стоит результат.',
        text: ' В семье любят безусловно, в команде — уважают за вклад в общую победу',
      },
    ],
  },
  {
    number: 3,
    title: 'Каждый сам отвечает за свой рост',
    icon: <TrendingUp size={24} />,
    color: 'amber',
    points: [
      {
        text: 'Компания и команда всегда помогут, но никто не будет вашим «добрым самаритянином». Ваше развитие — это ваша ответственность',
      },
      {
        bold: 'Просить о помощи — это сила, а не слабость.',
        text: ' Если вы чего-то не знаете или не понимаете — победите свое эго и обратитесь к коллегам или руководителю',
      },
    ],
  },
  {
    number: 4,
    title: '«Дожимать» результат до конца',
    icon: <Target size={24} />,
    color: 'red',
    points: [
      {
        text: 'Есть известная формула: 90% усилий дают обычный результат, и только дополнительные 10%, доведённые до 110%, — дают прорыв',
      },
      {
        bold: 'Между «почти готово» и «готово» — пропасть.',
        text: ' Мы играем до финального свистка',
      },
    ],
  },
]

const colorMap: Record<string, { bg: string; border: string; badge: string; icon: string; number: string }> = {
  purple: { bg: 'bg-purple-50', border: 'border-purple-200', badge: 'bg-purple-600', icon: 'text-purple-600', number: 'bg-orange-500' },
  blue: { bg: 'bg-blue-50', border: 'border-blue-200', badge: 'bg-blue-600', icon: 'text-blue-600', number: 'bg-orange-500' },
  amber: { bg: 'bg-amber-50', border: 'border-amber-200', badge: 'bg-amber-600', icon: 'text-amber-600', number: 'bg-orange-500' },
  red: { bg: 'bg-red-50', border: 'border-red-200', badge: 'bg-red-600', icon: 'text-red-600', number: 'bg-orange-500' },
}

export default function ValuesPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <Link
        href="/company"
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-6"
      >
        <ArrowLeft size={16} />
        Назад к разделу компании
      </Link>

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Как мы работаем вместе</h1>
        <p className="text-slate-600">4 принципа, которые определяют культуру Talentsy</p>
      </div>

      {/* Principles */}
      <div className="space-y-6">
        {principles.map((p) => {
          const colors = colorMap[p.color]
          return (
            <div key={p.number} className={`${colors.bg} border ${colors.border} rounded-lg p-6`}>
              {/* Title */}
              <div className="flex items-center gap-3 mb-5">
                <span className="bg-orange-500 text-white text-sm font-bold px-3 py-1 rounded-md">
                  Принцип {p.number}:
                </span>
                <h2 className="text-xl font-bold text-slate-900">{p.title}</h2>
              </div>

              {/* Points */}
              <div className="space-y-3">
                {p.points.map((point, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <p className="text-slate-700 leading-relaxed">
                      {point.bold && <span className="font-bold text-slate-900">{point.bold}</span>}
                      {point.bold ? point.text : point.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Link to mission */}
      <div className="mt-10 flex gap-4">
        <Link
          href="/company/mission"
          className="flex-1 p-4 bg-slate-100 border border-slate-200 rounded-lg hover:bg-slate-200 transition-colors text-center"
        >
          <p className="font-semibold text-slate-700">Миссия и философия</p>
          <p className="text-xs text-slate-500 mt-1">Lifelong Learning</p>
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
