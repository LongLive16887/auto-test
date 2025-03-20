import NewThemeForm from '@/components/forms/NewThemeForm'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { useThemeStore } from '@/store/theme'
import { DialogTitle } from '@radix-ui/react-dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'

const CreateTheme = () => {
	const {isOpen, toggleIsOpen} = useThemeStore()

	return (
		<Dialog open={isOpen} onOpenChange={toggleIsOpen}>
			<DialogTrigger asChild>
				<Button variant='outline'>Mavzu qo'shish</Button>
			</DialogTrigger>	
			<DialogContent className='sm:max-w-[1460px]'>
				<VisuallyHidden>
					<DialogTitle>Скрытый заголовок</DialogTitle>
				</VisuallyHidden>

				<NewThemeForm   />
			</DialogContent>
		</Dialog>
	)
}

export default CreateTheme
