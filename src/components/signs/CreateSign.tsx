import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { useSignStore } from '@/store/sign'
import { DialogTitle } from '@radix-ui/react-dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import NewSignForm from '../forms/NewSignForm'

const CreateSign = () => {
	const { isOpen, toggleIsOpen } = useSignStore()

	return (
		<Dialog open={isOpen} onOpenChange={toggleIsOpen}>
			<DialogTrigger asChild>
				<Button variant='outline'>Savol qo'shish</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-[1460px]'>
				<VisuallyHidden>
					<DialogTitle>Скрытый заголовок</DialogTitle>
				</VisuallyHidden>
				<NewSignForm />
			</DialogContent>
		</Dialog>
	)
}

export default CreateSign
