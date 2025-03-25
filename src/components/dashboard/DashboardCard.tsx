import { CardData } from '@/components/types/index'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { useEditCardStore } from '@/store/editCard'
import { useUserStore } from '@/store/user'
import { Check, ImageDown, Pencil, X } from 'lucide-react'
import { useState } from 'react'

const DashboardCard = ({ cardData }: { cardData: CardData }) => {
	const [isImageOpen, setIsImageOpen] = useState(false)
	const { userRoles } = useUserStore()
	const { setId, fetchCardById } = useEditCardStore()
	const { toggleIsOpen, toggleIsImage } = useEditCardStore()

	function handleEdit(id: number) {
		setId(id)
		fetchCardById(id)
		toggleIsOpen()
	}

	function handleImage(id: number) {
		setId(id)
		// fetchCardById(id)
		// toggleIsOpen()
		toggleIsImage()
	}

	return (
		<Card className='w-full max-w-sm  flex flex-col justify-between  shadow-lg rounded-2xl p-4'>
			<CardHeader className='text-sm font-bold text-center'>
				<div className='flex items-center justify-between w-full mb-2 text-xs'>
					<p>{`id: ${cardData.id}`}</p>
					<p> {`Bilet: ${cardData.group_id}`}</p>
					<p>
						{[
							cardData.question_description_la,
							cardData.question_description_uz,
							cardData.question_description_ru,
						].some(desc => !desc?.trim()) || !cardData.lesson_id ? (
							<X className='text-red-500' />
						) : (
							<Check className='text-green-500' />
						)}
					</p>
				</div>
				{cardData.question_la && (
					<div>
						<p className='text-xs font-semibold mb-1'>La</p>
						<div dangerouslySetInnerHTML={{ __html: cardData.question_la }} />
					</div>
				)}
				{cardData.question_uz && (
					<div>
						<p className='text-xs font-semibold mb-1'>Uz</p>
						<div dangerouslySetInnerHTML={{ __html: cardData.question_uz }} />
					</div>
				)}
				{cardData.question_ru && (
					<div>
						<p className='text-xs font-semibold mb-1'>Ru</p>
						<div dangerouslySetInnerHTML={{ __html: cardData.question_ru }} />
					</div>
				)}
			</CardHeader>

			<CardContent className='flex flex-col gap-4'>
				{cardData.media && (
					<Dialog open={isImageOpen} onOpenChange={setIsImageOpen}>
						<DialogTrigger asChild>
							<img
								src={cardData.media}
								alt={cardData.question_ru || 'Изображение'}
								className='rounded-lg cursor-pointer w-full h-48 object-cover'
							/>
						</DialogTrigger>
						<DialogContent className='max-w-2xl'>
							<img
								src={cardData.media}
								alt='Модальное изображение'
								className='w-full rounded-lg'
							/>
						</DialogContent>
					</Dialog>
				)}
				{cardData.mobile_media && (
					<Dialog open={isImageOpen} onOpenChange={setIsImageOpen}>
						<DialogTrigger asChild>
							<img
								src={`https://api.skillsoft.uz/api/v1/file/download/${cardData.mobile_media}`}
								alt={'Изображениеfefeegegr'}
								className='rounded-lg cursor-pointer w-full h-48 object-cover'
							/>
						</DialogTrigger>
						<DialogContent className='max-w-2xl'>
							<img
								src={`https://api.skillsoft.uz/api/v1/file/download/${cardData.mobile_media}`}
								alt='Модальное изображение'
								className='w-full rounded-lg'
							/>
						</DialogContent>
					</Dialog>
				)}

				{/* Описание */}
				<Accordion type='single' collapsible>
					<AccordionItem value='description'>
						<AccordionTrigger className='text-left text-gray-700'>
							Описание
						</AccordionTrigger>
						<AccordionContent className='flex flex-col gap-4'>
							{cardData.question_description_la && (
								<div>
									<p className='text-xs font-semibold mb-2'>La</p>
									<div
										className='text-xs'
										dangerouslySetInnerHTML={{
											__html: cardData.question_description_la,
										}}
									/>
								</div>
							)}
							{cardData.question_description_uz && (
								<div>
									<p className='text-xs font-semibold mb-2'>Uz</p>
									<div
										className='text-xs'
										dangerouslySetInnerHTML={{
											__html: cardData.question_description_uz,
										}}
									/>
								</div>
							)}
							{cardData.question_description_ru && (
								<div>
									<p className='text-xs font-semibold mb-2'>Ru</p>
									<div
										className='text-xs'
										dangerouslySetInnerHTML={{
											__html: cardData.question_description_ru,
										}}
									/>
								</div>
							)}
						</AccordionContent>
					</AccordionItem>
				</Accordion>

				{/* Ответы в Dropdown Menu */}
				<div className='flex items-center w-full justify-between'>
					<DropdownMenu modal={false}>
						<DropdownMenuTrigger asChild>
							<Button className='' variant='outline'>
								Показать ответы
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							{cardData.answers?.length > 0 ? (
								cardData.answers.map(answer => (
									<DropdownMenuItem key={answer.id}>
										<div
											className={cn(
												'flex flex-col',
												answer.is_correct && 'text-green-500'
											)}
										>
											<span
												dangerouslySetInnerHTML={{ __html: answer.answer_la }}
											/>
											<span
												dangerouslySetInnerHTML={{ __html: answer.answer_uz }}
											/>
											<span
												dangerouslySetInnerHTML={{ __html: answer.answer_ru }}
											/>
										</div>
									</DropdownMenuItem>
								))
							) : (
								<DropdownMenuItem className='text-gray-500'>
									Ответов нет
								</DropdownMenuItem>
							)}
						</DropdownMenuContent>
					</DropdownMenu>
					<div className='flex items-center gap-2'>
						{userRoles.includes('UPDATE') ? (
							<Button onClick={() => handleEdit(cardData.id)}>
								<Pencil />
							</Button>
						) : null}

						{userRoles.includes('MEDIA') ? (
							<Button onClick={() => handleImage(cardData.id)}>
								<ImageDown />
							</Button>
						) : null}
					</div>
				</div>
			</CardContent>
		</Card>
	)
}

export default DashboardCard
