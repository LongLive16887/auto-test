import { Mark, mergeAttributes } from '@tiptap/core'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Highlighter } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { Button } from '../ui/button'

const HIGHLIGHT_STYLE = 'background: #C59D32; padding: 0 1px; border-radius: 5px;'

const YellowHighlight = Mark.create({
	name: 'yellowHighlight',
	renderHTML({ HTMLAttributes }) {
		return ['span', mergeAttributes(HTMLAttributes, {
			'data-highlight': 'true',
			style: HIGHLIGHT_STYLE,
		}), 0]
	},
	parseHTML() {
		return [
			// новый формат — по атрибуту (не зависит от цвета)
			{ tag: 'span[data-highlight="true"]' },
			// обратная совместимость — старые данные с background: yellow
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
			'Mod-d': () => {
				const el = this.editor.view.dom.closest('.highlight-enabled')
				if (!el) return false
				return this.editor.commands.toggleMark(this.name)
			},
		}
	},
})

const NAV_KEYS = new Set([
	'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
	'Home', 'End', 'PageUp', 'PageDown',
	'Shift', 'Alt', 'Meta', 'Control', 'CapsLock', 'Escape', 'Tab',
])

const CustomEditor = ({
	content,
	onChange,
	onBlur,
	onHighlightChange,
	disabled = false,
	answer = false,
	highlightEnabled = false,
	markOnly = false,
}: {
	content: string
	onChange: (content: string) => void
	onBlur?: () => void
	onHighlightChange?: (html: string) => void
	disabled?: boolean
	answer?: boolean
	highlightEnabled?: boolean
	markOnly?: boolean
}) => {
	const highlightCountRef = useRef(0)

	const editor = useEditor({
		extensions: [
			StarterKit.configure({
				paragraph: { HTMLAttributes: {} },
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
			handleKeyDown: (_view, event) => {
				if (!markOnly) return false
				// разрешаем Cmd/Ctrl шорткаты (Cmd+B, Cmd+D, Cmd+A и т.д.)
				if (event.metaKey || event.ctrlKey) return false
				// разрешаем навигацию и выделение
				if (NAV_KEYS.has(event.key)) return false
				// блокируем всё остальное — ввод, backspace, delete, enter
				return true
			},
			handleDOMEvents: {
				blur: () => {
					if (onBlur) onBlur()
					return false
				},
				paste: () => markOnly,
			},
		},
		onUpdate: ({ editor }) => {
			const html = editor.getHTML()
			onChange(html)
			if (onHighlightChange) {
				const count = (html.match(/data-highlight="true"/g) || []).length
				if (count !== highlightCountRef.current) {
					highlightCountRef.current = count
					onHighlightChange(html)
				}
			}
		},
	})

	useEffect(() => {
		if (editor && content !== editor.getHTML()) {
			editor.commands.setContent(content)
		}
	}, [content, editor])

	const toggleBold = () => editor?.chain().focus().toggleBold().run()
	const toggleHighlight = () => editor?.chain().focus().toggleMark('yellowHighlight').run()

	if (!editor) return null

	const hasHighlight = content.includes('data-highlight="true"') || content.includes('background: yellow')

	return (
		<div className={`border rounded-xl${highlightEnabled ? ' highlight-enabled' : ''}`}>
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
					{highlightEnabled && (
						<Button
							type='button'
							variant='ghost'
							size='sm'
							onClick={toggleHighlight}
							className={hasHighlight ? 'bg-yellow-200' : ''}
							title='Подсветить (Cmd+D)'
						>
							<Highlighter className='h-4 w-4' />
						</Button>
					)}
				</div>
			)}
			<EditorContent editor={editor} />
		</div>
	)
}

export default CustomEditor
