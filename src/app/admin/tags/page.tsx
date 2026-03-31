'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Tag, Plus, Trash2, X } from 'lucide-react';
import clsx from 'clsx';

interface TagWithCounts {
  id: string;
  name: string;
  color: string;
  created_at: string;
  product_count: number;
  document_count: number;
}

const DEFAULT_COLORS = [
  '#ef4444', // red
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#06b6d4', // cyan
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#ec4899', // pink
];

export default function TagsPage() {
  const [tags, setTags] = useState<TagWithCounts[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTag, setNewTag] = useState({ name: '', color: DEFAULT_COLORS[0] });
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const supabase = createClient();

  // Fetch all tags with their usage counts
  const fetchTags = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all tags
      const { data: tagsData, error: tagsError } = await supabase
        .from('tags')
        .select('*')
        .order('created_at', { ascending: false });

      if (tagsError) throw tagsError;

      // For each tag, fetch product and document counts
      const tagsWithCounts = await Promise.all(
        (tagsData || []).map(async (tag) => {
          const [productRes, documentRes] = await Promise.all([
            supabase
              .from('product_tags')
              .select('id', { count: 'exact', head: true })
              .eq('tag_id', tag.id),
            supabase
              .from('document_tags')
              .select('id', { count: 'exact', head: true })
              .eq('tag_id', tag.id),
          ]);

          return {
            ...tag,
            product_count: productRes.count || 0,
            document_count: documentRes.count || 0,
          };
        })
      );

      setTags(tagsWithCounts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при загрузке тегов');
      console.error('Error fetching tags:', err);
    } finally {
      setLoading(false);
    }
  };

  // Add new tag
  const handleAddTag = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTag.name.trim()) {
      setError('Введите название тега');
      return;
    }

    try {
      setError(null);
      const { error: insertError } = await supabase
        .from('tags')
        .insert({
          name: newTag.name.trim(),
          color: newTag.color,
        });

      if (insertError) throw insertError;

      setSuccess('Тег успешно добавлен');
      setNewTag({ name: '', color: DEFAULT_COLORS[0] });
      await fetchTags();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при добавлении тега');
      console.error('Error adding tag:', err);
    }
  };

  // Delete tag
  const handleDeleteTag = async (tagId: string) => {
    try {
      setError(null);

      // Delete from product_tags
      const { error: productError } = await supabase
        .from('product_tags')
        .delete()
        .eq('tag_id', tagId);

      if (productError) throw productError;

      // Delete from document_tags
      const { error: documentError } = await supabase
        .from('document_tags')
        .delete()
        .eq('tag_id', tagId);

      if (documentError) throw documentError;

      // Delete the tag itself
      const { error: deleteError } = await supabase
        .from('tags')
        .delete()
        .eq('id', tagId);

      if (deleteError) throw deleteError;

      setSuccess('Тег успешно удален');
      await fetchTags();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при удалении тега');
      console.error('Error deleting tag:', err);
    } finally {
      setDeleting(null);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Back link */}
        <div className="mb-8">
          <a
            href="/admin"
            className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            <X className="w-4 h-4 mr-2" />
            Назад к администрированию
          </a>
        </div>

        {/* Page header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Tag className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-slate-900">Управление тегами</h1>
          </div>
          <p className="text-slate-600">Создавайте, редактируйте и удаляйте теги для товаров и документов</p>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            {success}
          </div>
        )}

        {/* Add tag form */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-purple-600" />
            Добавить новый тег
          </h2>

          <form onSubmit={handleAddTag} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Name input */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Название
                </label>
                <input
                  type="text"
                  value={newTag.name}
                  onChange={(e) => setNewTag({ ...newTag, name: e.target.value })}
                  placeholder="Введите название тега"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Color picker */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Цвет
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={newTag.color}
                    onChange={(e) => setNewTag({ ...newTag, color: e.target.value })}
                    className="w-10 h-10 rounded cursor-pointer border border-slate-300"
                  />
                  <input
                    type="text"
                    value={newTag.color}
                    onChange={(e) => setNewTag({ ...newTag, color: e.target.value })}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono"
                    placeholder="#ef4444"
                  />
                </div>
              </div>

              {/* Preset colors */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Готовые цвета
                </label>
                <div className="flex gap-2 flex-wrap">
                  {DEFAULT_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewTag({ ...newTag, color })}
                      className={clsx(
                        'w-8 h-8 rounded border-2 transition-all hover:scale-110',
                        newTag.color === color
                          ? 'border-slate-900 ring-2 ring-offset-2 ring-purple-600'
                          : 'border-slate-200'
                      )}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
            >
              Добавить тег
            </button>
          </form>
        </div>

        {/* Tags list */}
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
            <h2 className="text-lg font-semibold text-slate-900">
              Существующие теги ({tags.length})
            </h2>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-600">
              Загрузка тегов...
            </div>
          ) : tags.length === 0 ? (
            <div className="p-8 text-center text-slate-600">
              Нет созданных тегов. Добавьте первый тег выше.
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {tags.map((tag) => (
                <div
                  key={tag.id}
                  className="px-6 py-4 hover:bg-slate-50 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-4 flex-1">
                    {/* Color circle */}
                    <div
                      className="w-6 h-6 rounded-full border border-slate-300 flex-shrink-0"
                      style={{ backgroundColor: tag.color }}
                      title={tag.color}
                    />

                    {/* Tag info */}
                    <div className="flex-1">
                      <div className="font-medium text-slate-900">{tag.name}</div>
                      <div className="text-xs text-slate-500 mt-1">
                        {tag.color}
                      </div>
                    </div>

                    {/* Usage counts */}
                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <div className="font-semibold text-slate-900">
                          {tag.product_count}
                        </div>
                        <div className="text-xs text-slate-500">товаров</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-slate-900">
                          {tag.document_count}
                        </div>
                        <div className="text-xs text-slate-500">документов</div>
                      </div>
                    </div>
                  </div>

                  {/* Delete button */}
                  {deleting === tag.id ? (
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleDeleteTag(tag.id)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-medium transition-colors"
                      >
                        Удалить
                      </button>
                      <button
                        onClick={() => setDeleting(null)}
                        className="px-3 py-1 bg-slate-300 hover:bg-slate-400 text-slate-900 rounded text-xs font-medium transition-colors"
                      >
                        Отмена
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleting(tag.id)}
                      className="ml-4 p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Удалить тег"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info section */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
          <p className="font-medium mb-2">Информация:</p>
          <ul className="list-disc list-inside space-y-1 text-blue-700">
            <li>Удаление тега также удалит все его связи с товарами и документами</li>
            <li>Цвета можно выбрать из предустановок или указать собственный hex-код</li>
            <li>Счетчики показывают количество товаров и документов с этим тегом</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
