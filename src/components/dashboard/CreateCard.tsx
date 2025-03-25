import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { useCardStore } from '@/store/cards'
import { DialogTitle } from '@radix-ui/react-dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import NewCardForm from '../forms/NewCardForm'

const EditCard = () => {
	const { isOpen, toggleIsOpen } = useCardStore()

	return (
		<Dialog open={isOpen} onOpenChange={toggleIsOpen}>
			<DialogTrigger asChild>
				<Button variant='outline'>Savol qo'shish</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-[1460px]'>
				<VisuallyHidden>
					<DialogTitle>Скрытый заголовок</DialogTitle>
				</VisuallyHidden>
				<NewCardForm />
			</DialogContent>
		</Dialog>
	)
}

export default EditCard
