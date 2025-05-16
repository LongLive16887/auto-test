import { SignData } from '@/components/types/index'
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
import { useEditSignStore } from '@/store/editSigns'
import { useUserStore } from '@/store/user'
import { Check, ImageDown, Pencil, X } from 'lucide-react'
import { useState } from 'react'

const SignCard = ({ cardData }: { cardData: SignData }) => {
	const [isImageOpen, setIsImageOpen] = useState(false)
	const { userRoles } = useUserStore()
	const { setId, fetchCardById, toggleIsOpen, toggleIsImage } = useEditSignStore()

	function handleEdit(id: number) {
		setId(id)
		fetchCardById(id)
		toggleIsOpen()
	}

	function handleImage(id: number) {
		setId(id)
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
							cardData.sign_name_la,
							cardData.sign_name_ru,
							cardData.sign_name_uz,
						].some(desc => !desc?.trim()) || !cardData.lesson_id ? (
							<X className='text-red-500' />
						) : (
							<Check className='text-green-500' />
						)}
					</p>
				</div>
				{cardData.sign_name_la && (
					<div>
						<p className='text-xs font-semibold mb-1'>La</p>
						<div dangerouslySetInnerHTML={{ __html: cardData.sign_name_la }} />
					</div>
				)}
				{cardData.sign_name_ru && (
					<div>
						<p className='text-xs font-semibold mb-1'>Uz</p>
						<div dangerouslySetInnerHTML={{ __html: cardData.sign_name_ru }} />
					</div>
				)}
				{cardData.sign_name_uz && (
					<div>
						<p className='text-xs font-semibold mb-1'>Ru</p>
						<div dangerouslySetInnerHTML={{ __html: cardData.sign_name_uz }} />
					</div>
				)}
			</CardHeader>

			<CardContent className='flex flex-col gap-4'>
				{cardData.sign_image && (
					<Dialog open={isImageOpen} onOpenChange={setIsImageOpen}>
						<DialogTrigger asChild>
							<img
								src={`https://api.skillsoft.uz/api/v1/file/download/${cardData.sign_image}`}
								alt={'Модальное изображение'}
								className='rounded-lg cursor-pointer w-full h-48 object-cover'
							/>
						</DialogTrigger>
						<DialogContent className='max-w-2xl'>
							<img
								src={`https://api.skillsoft.uz/api/v1/file/download/${cardData.sign_image}`}
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
							{cardData.description_la && (
								<div>
									<p className='text-xs font-semibold mb-2'>La</p>
									<div
										className='text-xs'
										dangerouslySetInnerHTML={{
											__html: cardData.description_la,
										}}
									/>
								</div>
							)}
							{cardData.description_uz && (
								<div>
									<p className='text-xs font-semibold mb-2'>Uz</p>
									<div
										className='text-xs'
										dangerouslySetInnerHTML={{
											__html: cardData.description_uz,
										}}
									/>
								</div>
							)}
							{cardData.description_ru && (
								<div>
									<p className='text-xs font-semibold mb-2'>Ru</p>
									<div
										className='text-xs'
										dangerouslySetInnerHTML={{
											__html: cardData.description_ru,
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

export default SignCard
