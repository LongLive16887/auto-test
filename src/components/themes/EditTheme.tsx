import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { DialogTitle } from '@radix-ui/react-dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import EditThemeForm from '../forms/EditThemeForm'

interface EditThemeProps {
	isOpen: boolean
	onClose: () => void
	themeData: object
}

const EditTheme = ({ isOpen, onClose, themeData }: EditThemeProps) => {
	console.log(themeData, 224242424234)
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogTrigger asChild>
				<Button variant='outline'>Mavzu qo'shish</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-[1400px]'>
				<VisuallyHidden>
					<DialogTitle>Скрытый заголовок</DialogTitle>
				</VisuallyHidden>

				<EditThemeForm  themeData={themeData} />
			</DialogContent>
		</Dialog>
	)
}

export default EditTheme
