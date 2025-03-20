import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect } from 'react'
import { Button } from '../ui/button'

const CustomEditor = ({
  content,
  onChange,
  onBlur, 
  disabled = false,
  answer = false,
}: {
  content: string
  onChange: (content: string) => void
  onBlur?: () => void 
  disabled?: boolean
  answer?: boolean
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: {
          HTMLAttributes: {},
        },
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: `min-h-[70px] p-3 text-sm focus:outline-none prose prose-sm prose-p:my-0 prose-p:leading-snug ${
          disabled ? 'bg-gray-50' : ''
        } ${answer ? 'w-[430px]' : 'w-[452px]'}`,
      },
      handleDOMEvents: {
        blur: () => {
          if (onBlur) onBlur()
          return false
        },
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  const toggleBold = () => {
    editor?.chain().focus().toggleBold().run()
  }

  if (!editor) return null

  return (
    <div className='border rounded-xl'>
      {!disabled && (
        <div className='flex items-center border-b p-1'>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={toggleBold}
            className={editor.isActive('bold') ? 'bg-gray-200' : ''}
          >
            <span className={editor.isActive('bold') ? 'font-bold' : ''}>B</span>
          </Button>
        </div>
      )}
      <EditorContent editor={editor} />
    </div>
  )
}

export default CustomEditor
