import NewThemeForm from '@/components/forms/NewThemeForm'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { DialogTitle } from '@radix-ui/react-dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { useState } from 'react'
import EditTheme from '../forms/EditThemeForm'

const CreateTheme = () => {
	const [isOpen, setIsOpen] = useState(false)

	const handleClose = () => setIsOpen(false)
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant='outline'>Mavzu qo'shish</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-[1400px]'>
				<VisuallyHidden>
					<DialogTitle>Скрытый заголовок</DialogTitle>
				</VisuallyHidden>

				<NewThemeForm onSuccess={handleClose} />
			</DialogContent>
		</Dialog>
	)
}

export default CreateTheme
