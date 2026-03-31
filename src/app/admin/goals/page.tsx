'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Target, Plus, Trash2, Edit3, X, Save, ChevronDown } from 'lucide-react';
import clsx from 'clsx';

interface Goal {
  id: string;
  quarter: string;
  department: string;
  role: string | null;
  text: string;
  metric: string | null;
  status: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

interface EditingGoal {
  id: string;
  department: string;
  role: string | null;
  text: string;
  metric: string | null;
}

// All roles from org structure for dropdown
const ALL_ROLES: { name: string; position: string; department: string }[] = [
  // CEO
  { name: 'Кузьмин Александр Викторович', position: 'CEO', department: 'Руководство' },
  // Sales
  { name: 'Подколзин Евгений', position: 'Директор по продажам', department: 'Продажи' },
  { name: 'Краснов Денис Вячеславович', position: 'Проджект-менеджер продаж', department: 'Продажи' },
  { name: 'Осипова Анна Алексеевна', position: 'Тренер по продажам', department: 'Продажи' },
  { name: 'Кузьмина Марина Владимировна', position: 'Руководитель ОКК', department: 'Продажи' },
  { name: 'Полозова Анастасия Николаевна', position: 'Руководитель ОП №1', department: 'Продажи' },
  // Marketing
  { name: 'Грачев Максим Павлович', position: 'Руководитель Performance', department: 'Маркетинг' },
  { name: 'Любовцева Ольга Константиновна', position: 'Таргетолог', department: 'Маркетинг' },
  { name: 'Соколов Александр Дмитриевич', position: 'Проджект-менеджер', department: 'Маркетинг' },
  { name: 'Шумова Алена Юрьевна', position: 'Продуктовый маркетолог', department: 'Маркетинг' },
  { name: 'Тюрина Екатерина Глебовна', position: 'Веб-дизайнер', department: 'Маркетинг' },
  { name: 'Лаптев Дмитрий Александрович', position: 'Верстальщик', department: 'Маркетинг' },
  { name: 'Апекаловский Даниил Эрастович', position: 'Верстальщик писем', department: 'Маркетинг' },
  { name: 'Дерфель Ксения Юрьевна', position: 'CRM-маркетолог', department: 'Маркетинг' },
  { name: 'Харитонова Ксения Валерьевна', position: 'Руководитель SMM', department: 'Маркетинг' },
  { name: 'Мингазова Диана Равилевна', position: 'SMM-менеджер', department: 'Маркетинг' },
  { name: 'Мураева Оксана Алексеевна', position: 'Дизайнер', department: 'Маркетинг' },
  // Tech
  { name: 'Скляров Сергей Дмитриевич', position: 'Руководитель тех. отдела', department: 'Технический' },
  { name: 'Цветков Василий Алексеевич', position: 'Разработчик-программист', department: 'Технический' },
  { name: 'Зайнутдинов Анатолий Атласович', position: 'Технический специалист', department: 'Технический' },
  // Product
  { name: 'Носко Анна Владимировна', position: 'Директор по продукту', department: 'Продукт' },
  { name: 'Панченко Полина Борисовна', position: 'Руководитель академического отдела', department: 'Продукт' },
  { name: 'Петрова Анастасия Олеговна', position: 'Руководитель сопровождения', department: 'Продукт' },
  { name: 'Шатунова Наталья Мансуровна', position: 'Руководитель Психология', department: 'Продукт' },
  { name: 'Артамонова Алина Анатольевна', position: 'Руководитель контентных воронок', department: 'Продукт' },
  { name: 'Луканенкова Мила Анатольевна', position: 'Архитектор сообществ', department: 'Продукт' },
  // Admin
  { name: 'Бортник Валерия Александровна', position: 'Руководитель администрации', department: 'Администрация' },
  { name: 'Ибрагимов Александр Энверович', position: 'Юрист', department: 'Администрация' },
  // HR
  { name: 'Немченко Денис Игоревич', position: 'HR директор', department: 'HR' },
  { name: 'Бурамбаев Бауржан Аманатович', position: 'Специалист по подбору', department: 'HR' },
  { name: 'Патова Аида Рамазановна', position: 'Специалист по кадровому учету', department: 'HR' },
  // Finance
  { name: 'Каневская Елена Викторовна', position: 'Финансовый директор', department: 'Финансы' },
  { name: 'Каневский Дмитрий Александрович', position: 'Бухгалтер', department: 'Финансы' },
  // COO
  { name: 'COO (вакансия)', position: 'Операционный директор', department: 'Руководство' },
];

// Group roles by department for the dropdown
const rolesByDepartment = ALL_ROLES.reduce((acc, r) => {
  if (!acc[r.department]) acc[r.department] = [];
  acc[r.department].push(r);
  return acc;
}, {} as Record<string, typeof ALL_ROLES>);

function RoleSelect({
  value,
  onChange,
  className,
}: {
  value: string;
  onChange: (val: string) => void;
  className?: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={clsx(
        'w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white',
        className
      )}
    >
      <option value="">— выберите ответственного —</option>
      {Object.entries(rolesByDepartment).map(([dept, roles]) => (
        <optgroup key={dept} label={dept}>
          {roles.map((r) => (
            <option key={r.name} value={r.name}>
              {r.name} — {r.position}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}

export default function GoalsPage() {
  const supabase = createClient();

  const [goals, setGoals] = useState<Goal[]>([]);
  const [quarters, setQuarters] = useState<string[]>([]);
  const [selectedQuarter, setSelectedQuarter] = useState<string>('');
  const [departments, setDepartments] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingGoal, setEditingGoal] = useState<EditingGoal | null>(null);

  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    department: '',
    role: '',
    text: '',
    metric: ''
  });

  const [newQuarter, setNewQuarter] = useState('');
  const [showNewQuarterInput, setShowNewQuarterInput] = useState(false);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('goals')
          .select('*')
          .order('quarter', { ascending: false })
          .order('sort_order', { ascending: true });

        if (fetchError) throw fetchError;

        setGoals(data || []);

        const uniqueQuarters = Array.from(
          new Set((data || []).map(g => g.quarter))
        ).sort().reverse();

        setQuarters(uniqueQuarters);

        const uniqueDepartments = Array.from(
          new Set((data || []).map(g => g.department))
        ).sort();
        setDepartments(uniqueDepartments);

        if (uniqueQuarters.length > 0) {
          setSelectedQuarter(uniqueQuarters[0]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch goals');
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, [supabase]);

  const groupedGoals = goals
    .filter(g => g.quarter === selectedQuarter)
    .reduce((acc, goal) => {
      if (!acc[goal.department]) {
        acc[goal.department] = [];
      }
      acc[goal.department].push(goal);
      return acc;
    }, {} as Record<string, Goal[]>);

  const departmentsSorted = Object.keys(groupedGoals).sort();

  const handleAddGoal = async () => {
    if (!newGoal.department.trim() || !newGoal.text.trim()) {
      setError('Требуются отдел и текст цели');
      return;
    }

    try {
      const maxSortOrder = Math.max(
        0,
        ...goals
          .filter(g => g.quarter === selectedQuarter && g.department === newGoal.department)
          .map(g => g.sort_order || 0)
      );

      const { error: insertError } = await supabase
        .from('goals')
        .insert({
          quarter: selectedQuarter,
          department: newGoal.department,
          role: newGoal.role || null,
          text: newGoal.text,
          metric: newGoal.metric || null,
          status: 'active',
          sort_order: maxSortOrder + 1
        });

      if (insertError) throw insertError;

      const { data } = await supabase
        .from('goals')
        .select('*')
        .order('quarter', { ascending: false })
        .order('sort_order', { ascending: true });

      setGoals(data || []);

      const uniqueDepartments = Array.from(
        new Set((data || []).map(g => g.department))
      ).sort();
      setDepartments(uniqueDepartments);

      setNewGoal({ department: '', role: '', text: '', metric: '' });
      setIsAddingGoal(false);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add goal');
    }
  };

  const handleStartEdit = (goal: Goal) => {
    setEditingId(goal.id);
    setEditingGoal({
      id: goal.id,
      department: goal.department,
      role: goal.role,
      text: goal.text,
      metric: goal.metric
    });
  };

  const handleSaveEdit = async () => {
    if (!editingGoal || !editingGoal.text.trim()) {
      setError('Требуется текст цели');
      return;
    }

    try {
      const { error: updateError } = await supabase
        .from('goals')
        .update({
          department: editingGoal.department,
          role: editingGoal.role || null,
          text: editingGoal.text,
          metric: editingGoal.metric || null
        })
        .eq('id', editingGoal.id);

      if (updateError) throw updateError;

      const { data } = await supabase
        .from('goals')
        .select('*')
        .order('quarter', { ascending: false })
        .order('sort_order', { ascending: true });

      setGoals(data || []);
      setEditingId(null);
      setEditingGoal(null);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update goal');
    }
  };

  const handleDeleteGoal = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить эту цель?')) return;

    try {
      const { error: deleteError } = await supabase
        .from('goals')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      setGoals(goals.filter(g => g.id !== id));
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete goal');
    }
  };

  const handleCreateQuarter = async () => {
    if (!newQuarter.trim()) {
      setError('Введите квартал в формате Q1-2026');
      return;
    }
    setSelectedQuarter(newQuarter);
    if (!quarters.includes(newQuarter)) {
      setQuarters([...quarters, newQuarter].sort().reverse());
    }
    setNewQuarter('');
    setShowNewQuarterInput(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-6">
        <div className="max-w-6xl mx-auto flex items-center justify-center h-64">
          <p className="text-slate-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-6">
      <div className="max-w-6xl mx-auto">
        <Link href="/admin" className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-6 font-medium">
          ← Назад к администрированию
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <Target className="w-8 h-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-slate-900">Управление целями</h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Quarter selector */}
        <div className="mb-8 bg-white border border-slate-200 rounded-lg p-6">
          <div className="flex flex-wrap items-center gap-3">
            <label className="font-medium text-slate-700">Квартал:</label>
            <div className="flex flex-wrap gap-2">
              {quarters.map(q => (
                <button
                  key={q}
                  onClick={() => setSelectedQuarter(q)}
                  className={clsx(
                    'px-4 py-2 rounded-lg font-medium transition-all',
                    selectedQuarter === q
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  )}
                >
                  {q}
                </button>
              ))}
            </div>

            {!showNewQuarterInput ? (
              <button
                onClick={() => setShowNewQuarterInput(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors font-medium"
              >
                <Plus className="w-4 h-4" />
                Новый квартал
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Q2-2026"
                  value={newQuarter}
                  onChange={e => setNewQuarter(e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button onClick={handleCreateQuarter} className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">OK</button>
                <button onClick={() => { setShowNewQuarterInput(false); setNewQuarter(''); }} className="p-2 text-slate-500 hover:text-slate-700">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Goals by department */}
        {departmentsSorted.length > 0 ? (
          <div className="space-y-6 mb-8">
            {departmentsSorted.map(department => (
              <div key={department} className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                <div className="bg-gradient-to-r from-purple-50 to-slate-50 px-6 py-4 border-b border-slate-200">
                  <h2 className="text-lg font-bold text-slate-900">{department}</h2>
                </div>

                <div className="divide-y divide-slate-200">
                  {groupedGoals[department]?.map(goal => (
                    <div
                      key={goal.id}
                      className={clsx(
                        'p-6 hover:bg-slate-50 transition-colors',
                        editingId === goal.id && 'bg-purple-50'
                      )}
                    >
                      {editingId === goal.id && editingGoal ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">Отдел</label>
                              <input
                                type="text"
                                value={editingGoal.department}
                                onChange={e => setEditingGoal({ ...editingGoal, department: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">Ответственный</label>
                              <RoleSelect
                                value={editingGoal.role || ''}
                                onChange={(val) => setEditingGoal({ ...editingGoal, role: val || null })}
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Текст цели</label>
                            <textarea
                              value={editingGoal.text}
                              onChange={e => setEditingGoal({ ...editingGoal, text: e.target.value })}
                              rows={3}
                              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Метрика (опционально)</label>
                            <input
                              type="text"
                              value={editingGoal.metric || ''}
                              onChange={e => setEditingGoal({ ...editingGoal, metric: e.target.value || null })}
                              placeholder="например, +15%"
                              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>

                          <div className="flex items-center gap-3 pt-2">
                            <button onClick={handleSaveEdit} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium">
                              <Save className="w-4 h-4" /> Сохранить
                            </button>
                            <button onClick={() => { setEditingId(null); setEditingGoal(null); }} className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors">
                              Отмена
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <p className="text-slate-900 font-medium mb-2">{goal.text}</p>
                            {goal.role && (
                              <p className="text-sm text-slate-600 mb-2">
                                <span className="font-medium">Ответственный:</span> {goal.role}
                              </p>
                            )}
                            {goal.metric && (
                              <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                                {goal.metric}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => handleStartEdit(goal)} className="p-2 text-slate-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors" title="Редактировать">
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDeleteGoal(goal.id)} className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Удалить">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-lg p-12 text-center mb-8">
            <Target className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600">
              {quarters.length === 0
                ? 'Нет целей. Создайте новый квартал и добавьте первую цель.'
                : 'Нет целей для этого квартала. Добавьте первую цель ниже.'}
            </p>
          </div>
        )}

        {/* Add new goal */}
        {!isAddingGoal ? (
          <button
            onClick={() => setIsAddingGoal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            <Plus className="w-5 h-5" /> Добавить цель
          </button>
        ) : (
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Новая цель для {selectedQuarter}</h3>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Отдел *</label>
                  <input
                    type="text"
                    list="departments-list"
                    placeholder="выберите или введите отдел"
                    value={newGoal.department}
                    onChange={e => setNewGoal({ ...newGoal, department: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <datalist id="departments-list">
                    {departments.map(dept => (
                      <option key={dept} value={dept} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Ответственный</label>
                  <RoleSelect
                    value={newGoal.role}
                    onChange={(val) => setNewGoal({ ...newGoal, role: val })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Текст цели *</label>
                <textarea
                  placeholder="опишите цель для этого квартала"
                  value={newGoal.text}
                  onChange={e => setNewGoal({ ...newGoal, text: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Метрика (опционально)</label>
                <input
                  type="text"
                  placeholder="например, +15%, 5 экспортов, 100 часов обучения"
                  value={newGoal.metric}
                  onChange={e => setNewGoal({ ...newGoal, metric: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleAddGoal}
                  className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                  <Save className="w-4 h-4" /> Добавить цель
                </button>
                <button
                  onClick={() => { setIsAddingGoal(false); setNewGoal({ department: '', role: '', text: '', metric: '' }); }}
                  className="px-6 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
                >
                  Отмена
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
