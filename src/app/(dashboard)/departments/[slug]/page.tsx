'use client'

import { Users, FileText, Mail, MapPin, Target } from 'lucide-react'

interface TeamMember {
  id: string
  name: string
  role: string
  avatar: string
  email: string
}

interface DepartmentInfo {
  slug: string
  name: string
  title: string
  description: string
  icon: string
  color: string
  members: TeamMember[]
  head: TeamMember
  location: string
  documents: string[]
  objectives: string[]
}

const departmentData: Record<string, DepartmentInfo> = {
  marketing: {
    slug: 'marketing',
    name: 'Маркетинг',
    title: 'Отдел маркетинга',
    description:
      'Отдел отвечает за разработку и реализацию маркетинговой стратегии компании, управление брендом и привлечение новых клиентов.',
    icon: '📊',
    color: 'blue',
    location: 'Москва, офис 3-й этаж',
    head: {
      id: '1',
      name: 'Мария Сидорова',
      role: 'Директор маркетинга',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maria',
      email: 'maria.sidorova@talentsy.ru',
    },
    members: [
      {
        id: '1',
        name: 'Мария Сидорова',
        role: 'Директор маркетинга',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maria',
        email: 'maria.sidorova@talentsy.ru',
      },
      {
        id: '2',
        name: 'Иван Петров',
        role: 'Менеджер по digital-маркетингу',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ivan',
        email: 'ivan.petrov@talentsy.ru',
      },
      {
        id: '3',
        name: 'Елена Смирнова',
        role: 'Специалист по контент-маркетингу',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=elena',
        email: 'elena.smirnova@talentsy.ru',
      },
      {
        id: '4',
        name: 'Алексей Иванов',
        role: 'Дизайнер',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
        email: 'alex.ivanov@talentsy.ru',
      },
    ],
    documents: [
      'Маркетинговая стратегия 2024',
      'Руководство по брендированию',
      'Процесс запуска кампании',
      'Шаблоны контента',
    ],
    objectives: [
      'Увеличить присутствие в социальных сетях на 50%',
      'Запустить 12 маркетинговых кампаний в год',
      'Повысить узнаваемость бренда',
      'Улучшить ROI маркетинга на 30%',
    ],
  },
  sales: {
    slug: 'sales',
    name: 'Продажи',
    title: 'Отдел продаж',
    description:
      'Отдел отвечает за генерацию доходов, управление отношениями с клиентами и достижение целей по продажам.',
    icon: '💰',
    color: 'green',
    location: 'Москва, офис 2-й этаж',
    head: {
      id: '5',
      name: 'Александр Федоров',
      role: 'Директор по продажам',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alexander',
      email: 'alexander.fedorov@talentsy.ru',
    },
    members: [
      {
        id: '5',
        name: 'Александр Федоров',
        role: 'Директор по продажам',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alexander',
        email: 'alexander.fedorov@talentsy.ru',
      },
      {
        id: '6',
        name: 'Дмитрий Коров',
        role: 'Менеджер по продажам - Enterprise',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dmitry',
        email: 'dmitry.korov@talentsy.ru',
      },
      {
        id: '7',
        name: 'Ольга Новикова',
        role: 'Менеджер по продажам - SMB',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=olga',
        email: 'olga.novikova@talentsy.ru',
      },
      {
        id: '8',
        name: 'Константин Волков',
        role: 'Sales Development Representative',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=konstantin',
        email: 'konstantin.volkov@talentsy.ru',
      },
    ],
    documents: [
      'Процесс продаж',
      'CRM инструкция',
      'Ценовое предложение шаблоны',
      'Контракты и T&C',
    ],
    objectives: [
      'Достичь $10M ARR',
      'Увеличить conversion rate на 25%',
      'Снизить sales cycle на 2 недели',
      'Расширить клиентскую базу на 40%',
    ],
  },
  product: {
    slug: 'product',
    name: 'Продукт',
    title: 'Отдел продукта',
    description:
      'Отдел отвечает за развитие и улучшение продуктов компании, управление дорожной картой и взаимодействие со всеми заинтересованными сторонами.',
    icon: '🚀',
    color: 'purple',
    location: 'Москва, офис 4-й этаж',
    head: {
      id: '9',
      name: 'Виктория Строганова',
      role: 'VP Product',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=victoria',
      email: 'victoria.stroganova@talentsy.ru',
    },
    members: [
      {
        id: '9',
        name: 'Виктория Строганова',
        role: 'VP Product',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=victoria',
        email: 'victoria.stroganova@talentsy.ru',
      },
      {
        id: '10',
        name: 'Павел Рыжов',
        role: 'Senior Product Manager',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=pavel',
        email: 'pavel.ryzhov@talentsy.ru',
      },
      {
        id: '11',
        name: 'Софья Волкова',
        role: 'Product Designer',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sophia',
        email: 'sophia.volkova@talentsy.ru',
      },
      {
        id: '12',
        name: 'Сергей Сизов',
        role: 'Frontend Team Lead',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sergey',
        email: 'sergey.sizov@talentsy.ru',
      },
      {
        id: '13',
        name: 'Николай Киров',
        role: 'Backend Team Lead',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nikolai',
        email: 'nikolai.kirov@talentsy.ru',
      },
    ],
    documents: [
      'Дорожная карта продукта',
      'Архитектура системы',
      'API документация',
      'Процесс разработки',
    ],
    objectives: [
      'Запустить 5 новых функций в 2024',
      'Улучшить UX score на 20%',
      'Снизить load time на 40%',
      'Достичь 99.99% uptime',
    ],
  },
}

export default function DepartmentPage({
  params,
}: {
  params: { slug: string }
}) {
  const dept = departmentData[params.slug]

  if (!dept) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">
          Отдел не найден
        </h1>
        <p className="text-slate-600">
          К сожалению, информация об этом отделе недоступна
        </p>
      </div>
    )
  }

  const colorClasses = {
    purple: 'from-purple-50 to-purple-100 border-purple-200',
    blue: 'from-blue-50 to-blue-100 border-blue-200',
    green: 'from-green-50 to-green-100 border-green-200',
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div
        className={`mb-8 p-8 bg-gradient-to-r ${colorClasses[dept.color as keyof typeof colorClasses]} border rounded-lg`}
      >
        <div className="flex items-center gap-4 mb-4">
          <span className="text-4xl">{dept.icon}</span>
          <div>
            <h1 className="text-4xl font-bold text-slate-900">{dept.title}</h1>
            <p className="text-slate-700">{dept.description}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Department Head */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Users size={24} />
              Руководитель отдела
            </h2>
            <div className="p-6 bg-white border border-slate-200 rounded-lg">
              <div className="flex items-center gap-4">
                <img
                  src={dept.head.avatar}
                  alt={dept.head.name}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {dept.head.name}
                  </h3>
                  <p className="text-slate-600">{dept.head.role}</p>
                  <a
                    href={`mailto:${dept.head.email}`}
                    className="text-purple-600 hover:text-purple-700 text-sm mt-1"
                  >
                    {dept.head.email}
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Team Members */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Users size={24} />
              Команда ({dept.members.length} человек)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dept.members.map((member) => (
                <div
                  key={member.id}
                  className="p-4 bg-white border border-slate-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900">
                        {member.name}
                      </h3>
                      <p className="text-sm text-slate-600">{member.role}</p>
                      <a
                        href={`mailto:${member.email}`}
                        className="text-xs text-purple-600 hover:text-purple-700"
                      >
                        {member.email}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Documents */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <FileText size={24} />
              Документы отдела
            </h2>
            <div className="space-y-3">
              {dept.documents.map((doc, index) => (
                <div
                  key={index}
                  className="p-4 bg-white border border-slate-200 rounded-lg flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <FileText size={20} className="text-purple-600" />
                    <span className="font-medium text-slate-900">{doc}</span>
                  </div>
                  <span className="text-slate-400">→</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Location */}
          <div className="p-6 bg-white border border-slate-200 rounded-lg">
            <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <MapPin size={18} className="text-purple-600" />
              Локация
            </h3>
            <p className="text-slate-700">{dept.location}</p>
          </div>

          {/* Objectives */}
          <div className="p-6 bg-white border border-slate-200 rounded-lg">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Target size={18} className="text-purple-600" />
              Цели отдела
            </h3>
            <ul className="space-y-3">
              {dept.objectives.map((obj, index) => (
                <li
                  key={index}
                  className="flex gap-2 text-sm text-slate-700"
                >
                  <span className="text-purple-600 font-bold">✓</span>
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Department */}
          <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg">
            <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <Mail size={18} className="text-purple-600" />
              Связаться с отделом
            </h3>
            <button className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors text-sm">
              Отправить сообщение
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
