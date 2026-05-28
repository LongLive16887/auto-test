import { Mark, mergeAttributes } from '@tiptap/core'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Highlighter } from 'lucide-react'
import { useEffect } from 'react'
import { Button } from '../ui/button'

const YellowHighlight = Mark.create({
	name: 'yellowHighlight',
	renderHTML({ HTMLAttributes }) {
		return ['span', mergeAttributes(HTMLAttributes, { style: 'background: yellow; padding: 0 1px; border-radius: 2px;' }), 0]
	},
	parseHTML() {
		return [
			{
				tag: 'span',
				getAttrs: node => {
					const style = (node as HTMLElement).getAttribute('style') || ''
					return style.includes('background: yellow') ? {} : false
				},
			},
		]
	},
	addKeyboardShortcuts() {
		return {
			'Mod-d': () => this.editor.commands.toggleMark(this.name),
		}
	},
})

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
			YellowHighlight,
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

	const toggleHighlight = () => {
		editor?.chain().focus().toggleMark('yellowHighlight').run()
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
					<Button
						type='button'
						variant='ghost'
						size='sm'
						onClick={toggleHighlight}
						className={content.includes('background: yellow') ? 'bg-yellow-200' : ''}
						title='Подсветить (Cmd+D)'
					>
						<Highlighter className='h-4 w-4' />
					</Button>
				</div>
			)}
			<EditorContent editor={editor} />
		</div>
	)
}

export default CustomEditor
