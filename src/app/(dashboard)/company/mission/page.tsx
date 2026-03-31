'use client'

import { Target, Heart, Zap, Users } from 'lucide-react'

interface ValueCard {
  icon: React.ReactNode
  title: string
  description: string
}

const values: ValueCard[] = [
  {
    icon: <Target size={32} />,
    title: 'Результативность',
    description:
      'Мы сосредоточены на достижении результатов и постоянном улучшении качества нашей работы.',
  },
  {
    icon: <Heart size={32} />,
    title: 'Человекоцентричность',
    description:
      'Люди в центре всего, что мы делаем. Мы заботимся о развитии и благополучии каждого члена команды.',
  },
  {
    icon: <Zap size={32} />,
    title: 'Инновация',
    description:
      'Мы постоянно ищем новые способы решения проблем и не боимся экспериментировать.',
  },
  {
    icon: <Users size={32} />,
    title: 'Сотрудничество',
    description:
      'Вместе мы сильнее. Мы верим в силу командной работы и открытого общения.',
  },
]

export default function MissionPage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          Миссия и ценности Talentsy
        </h1>
        <p className="text-lg text-slate-600">
          Наша миссия, видение и принципы, которые определяют нашу работу
        </p>
      </div>

      {/* Mission Statement */}
      <section className="mb-12 p-8 bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-lg">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Наша миссия</h2>
        <p className="text-lg text-slate-800 leading-relaxed">
          Transforming talent management through innovative technology and people-centric
          approaches. We empower organizations to discover, develop, and retain their best
          talent, creating an environment where people can achieve their full potential.
        </p>
      </section>

      {/* Vision Statement */}
      <section className="mb-12 p-8 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Наше видение</h2>
        <p className="text-lg text-slate-800 leading-relaxed">
          Быть глобальным лидером в области управления талантами, создавая экосистему,
          в которой организации и люди могут вместе расти и процветать. Мы стремимся
          изменить способ, которым компании относятся к развитию своего персонала.
        </p>
      </section>

      {/* Core Values */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-8">Наши ценности</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {values.map((value, index) => (
            <div
              key={index}
              className="p-6 bg-white border border-slate-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="text-purple-600 mb-4">{value.icon}</div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {value.title}
              </h3>
              <p className="text-slate-600">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Strategy */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">
          Стратегия развития
        </h2>
        <div className="space-y-4">
          <div className="p-4 bg-white border border-slate-200 rounded-lg">
            <h3 className="font-bold text-slate-900 mb-2">Технологическое лидерство</h3>
            <p className="text-slate-600">
              Инвестирование в передовые технологии искусственного интеллекта и машинного
              обучения для создания более умных решений.
            </p>
          </div>
          <div className="p-4 bg-white border border-slate-200 rounded-lg">
            <h3 className="font-bold text-slate-900 mb-2">
              Расширение глобального присутствия
            </h3>
            <p className="text-slate-600">
              Выход на новые рынки и построение партнерств с ведущими организациями
              по всему миру.
            </p>
          </div>
          <div className="p-4 bg-white border border-slate-200 rounded-lg">
            <h3 className="font-bold text-slate-900 mb-2">Развитие талантов</h3>
            <p className="text-slate-600">
              Создание условий для профессионального роста и развития каждого члена
              нашей команды.
            </p>
          </div>
          <div className="p-4 bg-white border border-slate-200 rounded-lg">
            <h3 className="font-bold text-slate-900 mb-2">Социальная ответственность</h3>
            <p className="text-slate-600">
              Вклад в развитие общества и поддержка инициатив, направленных на улучшение
              качества жизни.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <div className="p-8 bg-slate-900 text-white rounded-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Присоединяйтесь к нашей миссии</h2>
        <p className="text-slate-300 mb-6">
          Если вы разделяете наши ценности и хотите внести свой вклад в трансформацию
          управления талантами, мы с удовольствием пригласим вас в нашу команду.
        </p>
        <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors">
          Рассказать нам о себе
        </button>
      </div>
    </div>
  )
}
