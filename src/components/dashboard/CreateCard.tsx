import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { DialogTitle } from '@radix-ui/react-dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import NewCardForm from '../forms/NewCardForm'

const EditCard = () => {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant='outline'>Savol qo'shish</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-[1400px]'>
				<VisuallyHidden>
					<DialogTitle>Скрытый заголовок</DialogTitle>
				</VisuallyHidden>

				<NewCardForm />
			</DialogContent>
		</Dialog>
	)
}

export default EditCard
