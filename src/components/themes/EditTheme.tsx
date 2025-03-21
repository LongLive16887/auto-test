import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { DialogTitle } from '@radix-ui/react-dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import EditThemeForm from '../forms/EditThemeForm'

interface EditThemeProps {
	isOpen: boolean
	onClose: () => void
	themeData: themeType
}

type themeType = {
	id: number
	name_la: string
	name_ru: string
	name_uz: string
	image: string
	type_id: number
}
const EditTheme = ({ isOpen, onClose, themeData }: EditThemeProps) => {
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogTrigger asChild>
				<Button variant='outline'>Mavzu qo'shish</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-[1460px]'>
				<VisuallyHidden>
					<DialogTitle>Скрытый заголовок</DialogTitle>
				</VisuallyHidden>
				<EditThemeForm themeData={themeData} onClose={onClose} />
			</DialogContent>
		</Dialog>
	)
}

export default EditTheme
