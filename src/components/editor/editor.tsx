'use client'

import { useEditor, EditorContent, type Editor as TiptapEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import CodeBlock from '@tiptap/extension-code-block'
import Underline from '@tiptap/extension-underline'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import { FontSize } from './font-size'
import Toolbar from './toolbar'
import clsx from 'clsx'

interface EditorProps {
  content?: any
  onUpdate?: (json: any) => void
  editable?: boolean
}

export default function Editor({ content, onUpdate, editable = true }: EditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        allowBase64: true,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableCell,
      TableHeader,
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder: 'Начните писать...',
      }),
      CodeBlock.configure({
        languageClassPrefix: 'language-',
      }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      FontSize,
    ],
    content: content || '',
    editable,
    onUpdate: ({ editor }) => {
      if (onUpdate) {
        onUpdate(editor.getJSON())
      }
    },
  })

  return (
    <div className="flex flex-col h-full">
      {editable && <Toolbar editor={editor} />}
      <div className={clsx('flex-1 overflow-y-auto', editable && 'bg-white border border-slate-200')}>
        <EditorContent
          editor={editor}
          className={clsx(
            'prose prose-sm max-w-none px-6 py-4 focus-visible:outline-none',
            !editable && 'py-4'
          )}
        />
      </div>
    </div>
  )
}
