import { Card, CardFooter, CardHeader } from '@/components/ui/card'
import { useUserStore } from '@/store/user'
import { Pencil } from 'lucide-react'
import { Button } from '../ui/button'

interface CardData {
	id: number
	type_id: number
	name_ru: string
	name_la: string
	name_uz: string
	image: string
}

interface ThemeCardProps {
	cardData: CardData
	onEdit: (id: number) => void
}

const ThemeCard = ({ cardData, onEdit }: ThemeCardProps) => {
	const { userRoles } = useUserStore()
	return (
		<Card className='w-full max-w-sm  flex flex-col justify-between  shadow-lg rounded-2xl p-4'>
			<CardHeader className='text-sm text-center'>
				<div className='flex items-center justify-between w-full mb-2 text-xs'>
					<p>{`id: ${cardData.id}`}</p>
				</div>
				{cardData.name_la && (
					<div>
						<p className='text-xs font-semibold mb-1'>La</p>
						<div dangerouslySetInnerHTML={{ __html: cardData.name_la }} />
					</div>
				)}
				{cardData.name_uz && (
					<div>
						<p className='text-xs font-semibold mb-1'>Uz</p>
						<div dangerouslySetInnerHTML={{ __html: cardData.name_uz }} />
					</div>
				)}
				{cardData.name_ru && (
					<div>
						<p className='text-xs font-semibold mb-1'>Ru</p>
						<div dangerouslySetInnerHTML={{ __html: cardData.name_ru }} />
					</div>
				)}
			</CardHeader>
			<CardFooter>
				{userRoles.includes('UPDATE') ? (
					<Button onClick={() => onEdit(cardData.id)}>
						<Pencil />
					</Button>
				) : null}
			</CardFooter>
		</Card>
	)
}

export default ThemeCard
