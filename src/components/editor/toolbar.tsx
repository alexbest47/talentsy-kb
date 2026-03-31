'use client'

import { useState, useRef, useEffect } from 'react'
import { Editor } from '@tiptap/react'
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  CodeSquare,
  Minus,
  Image,
  Link2,
  Table2,
  RotateCcw,
  RotateCw,
  Palette,
  Highlighter,
  Type,
  ChevronDown,
} from 'lucide-react'
import clsx from 'clsx'

interface ToolbarProps {
  editor: Editor | null
}

interface ButtonProps {
  icon: React.ReactNode
  label: string
  isActive?: boolean
  disabled?: boolean
  onClick: () => void
}

function ToolbarButton({ icon, label, isActive, disabled, onClick }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={label}
      className={clsx(
        'p-2 rounded-md transition-all duration-200 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed',
        isActive && 'bg-purple-100 text-purple-600 hover:bg-purple-200'
      )}
    >
      {icon}
    </button>
  )
}

// Font size options
const FONT_SIZES = [
  { label: '12', value: '12px' },
  { label: '14', value: '14px' },
  { label: '16', value: '16px' },
  { label: '18', value: '18px' },
  { label: '20', value: '20px' },
  { label: '24', value: '24px' },
  { label: '28', value: '28px' },
  { label: '32', value: '32px' },
]

// Color palette
const TEXT_COLORS = [
  '#000000', '#374151', '#6B7280', '#EF4444', '#F97316', '#EAB308',
  '#22C55E', '#3B82F6', '#8B5CF6', '#EC4899', '#14B8A6', '#F43F5E',
]

const HIGHLIGHT_COLORS = [
  '#FEF08A', '#BBF7D0', '#BFDBFE', '#E9D5FF', '#FECACA', '#FED7AA',
  '#D1FAE5', '#DBEAFE', '#F3E8FF', '#FCE7F3', '#CCFBF1', '#FEE2E2',
]

function DropdownPicker({
  icon,
  label,
  colors,
  activeColor,
  onSelect,
  onClear,
}: {
  icon: React.ReactNode
  label: string
  colors: string[]
  activeColor?: string
  onSelect: (color: string) => void
  onClear: () => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        title={label}
        className={clsx(
          'p-2 rounded-md transition-all duration-200 hover:bg-slate-100 flex items-center gap-0.5',
          activeColor && 'bg-purple-100 text-purple-600 hover:bg-purple-200'
        )}
      >
        {icon}
        <ChevronDown size={10} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg p-2 z-50 w-[180px]">
          <div className="grid grid-cols-6 gap-1 mb-2">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => {
                  onSelect(color)
                  setOpen(false)
                }}
                className={clsx(
                  'w-6 h-6 rounded border-2 transition-transform hover:scale-110',
                  activeColor === color ? 'border-purple-500 ring-1 ring-purple-300' : 'border-slate-200'
                )}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
          <button
            onClick={() => {
              onClear()
              setOpen(false)
            }}
            className="w-full text-xs text-slate-500 hover:text-slate-700 py-1 border-t border-slate-100"
          >
            Сбросить
          </button>
        </div>
      )}
    </div>
  )
}

function FontSizeDropdown({
  editor,
}: {
  editor: Editor
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const currentSize = editor.getAttributes('textStyle').fontSize || ''

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        title="Размер шрифта"
        className="px-2 py-1.5 rounded-md transition-all duration-200 hover:bg-slate-100 flex items-center gap-1 text-xs font-medium text-slate-700 min-w-[52px]"
      >
        <Type size={14} />
        <span>{currentSize ? currentSize.replace('px', '') : '—'}</span>
        <ChevronDown size={10} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-50 w-[80px]">
          {FONT_SIZES.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => {
                editor.chain().focus().setFontSize(value).run()
                setOpen(false)
              }}
              className={clsx(
                'w-full text-left px-3 py-1.5 text-sm hover:bg-slate-100 transition-colors',
                currentSize === value && 'bg-purple-50 text-purple-600 font-medium'
              )}
            >
              {label}px
            </button>
          ))}
          <div className="border-t border-slate-100 mt-1 pt-1">
            <button
              onClick={() => {
                editor.chain().focus().unsetFontSize().run()
                setOpen(false)
              }}
              className="w-full text-left px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700"
            >
              Сбросить
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Toolbar({ editor }: ToolbarProps) {
  if (!editor) {
    return null
  }

  const handleInsertImage = () => {
    const url = prompt('Введите URL изображения:')
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  const handleInsertLink = () => {
    const existingHref = editor.getAttributes('link').href
    const url = prompt('Введите URL:', existingHref || 'https://')
    if (url === null) return
    if (url === '') {
      editor.chain().focus().unsetLink().run()
      return
    }
    editor.chain().focus().setLink({ href: url }).run()
  }

  const handleInsertTable = () => {
    editor
      .chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run()
  }

  const currentTextColor = editor.getAttributes('textStyle').color || ''
  const currentHighlight = editor.getAttributes('highlight').color || ''

  return (
    <div className="sticky top-0 z-40 bg-white border-b border-slate-200 p-2 flex flex-wrap gap-1 items-center">
      {/* Text Formatting */}
      <div className="flex gap-0.5 border-r border-slate-200 pr-1">
        <ToolbarButton
          icon={<Bold size={18} />}
          label="Жирный (Ctrl+B)"
          isActive={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
        />
        <ToolbarButton
          icon={<Italic size={18} />}
          label="Курсив (Ctrl+I)"
          isActive={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        />
        <ToolbarButton
          icon={<UnderlineIcon size={18} />}
          label="Подчёркивание (Ctrl+U)"
          isActive={editor.isActive('underline')}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        />
        <ToolbarButton
          icon={<Strikethrough size={18} />}
          label="Зачеркивание"
          isActive={editor.isActive('strike')}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        />
        <ToolbarButton
          icon={<Code size={18} />}
          label="Инлайн код"
          isActive={editor.isActive('code')}
          onClick={() => editor.chain().focus().toggleCode().run()}
        />
      </div>

      {/* Font Size */}
      <div className="flex gap-0.5 border-r border-slate-200 pr-1">
        <FontSizeDropdown editor={editor} />
      </div>

      {/* Text Color & Highlight */}
      <div className="flex gap-0.5 border-r border-slate-200 pr-1">
        <DropdownPicker
          icon={<Palette size={16} />}
          label="Цвет текста"
          colors={TEXT_COLORS}
          activeColor={currentTextColor}
          onSelect={(color) => editor.chain().focus().setColor(color).run()}
          onClear={() => editor.chain().focus().unsetColor().run()}
        />
        <DropdownPicker
          icon={<Highlighter size={16} />}
          label="Выделение маркером"
          colors={HIGHLIGHT_COLORS}
          activeColor={currentHighlight}
          onSelect={(color) => editor.chain().focus().toggleHighlight({ color }).run()}
          onClear={() => editor.chain().focus().unsetHighlight().run()}
        />
      </div>

      {/* Headings */}
      <div className="flex gap-0.5 border-r border-slate-200 pr-1">
        <ToolbarButton
          icon={<Heading1 size={18} />}
          label="Заголовок 1"
          isActive={editor.isActive('heading', { level: 1 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        />
        <ToolbarButton
          icon={<Heading2 size={18} />}
          label="Заголовок 2"
          isActive={editor.isActive('heading', { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        />
        <ToolbarButton
          icon={<Heading3 size={18} />}
          label="Заголовок 3"
          isActive={editor.isActive('heading', { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        />
      </div>

      {/* Lists */}
      <div className="flex gap-0.5 border-r border-slate-200 pr-1">
        <ToolbarButton
          icon={<List size={18} />}
          label="Маркированный список"
          isActive={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        />
        <ToolbarButton
          icon={<ListOrdered size={18} />}
          label="Нумерованный список"
          isActive={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        />
      </div>

      {/* Block Elements */}
      <div className="flex gap-0.5 border-r border-slate-200 pr-1">
        <ToolbarButton
          icon={<Quote size={18} />}
          label="Цитата"
          isActive={editor.isActive('blockquote')}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        />
        <ToolbarButton
          icon={<CodeSquare size={18} />}
          label="Блок кода"
          isActive={editor.isActive('codeBlock')}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        />
        <ToolbarButton
          icon={<Minus size={18} />}
          label="Горизонтальная линия"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        />
      </div>

      {/* Insert Elements */}
      <div className="flex gap-0.5 border-r border-slate-200 pr-1">
        <ToolbarButton
          icon={<Image size={18} />}
          label="Вставить изображение"
          onClick={handleInsertImage}
        />
        <ToolbarButton
          icon={<Link2 size={18} />}
          label="Вставить ссылку"
          isActive={editor.isActive('link')}
          onClick={handleInsertLink}
        />
        <ToolbarButton
          icon={<Table2 size={18} />}
          label="Вставить таблицу (3x3)"
          onClick={handleInsertTable}
        />
      </div>

      {/* Undo/Redo */}
      <div className="flex gap-0.5">
        <ToolbarButton
          icon={<RotateCcw size={18} />}
          label="Отменить"
          disabled={!editor.can().undo()}
          onClick={() => editor.chain().focus().undo().run()}
        />
        <ToolbarButton
          icon={<RotateCw size={18} />}
          label="Повторить"
          disabled={!editor.can().redo()}
          onClick={() => editor.chain().focus().redo().run()}
        />
      </div>
    </div>
  )
}
