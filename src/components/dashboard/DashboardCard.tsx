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
import { Check, X } from 'lucide-react'
import { useState } from 'react'

interface Answer {
	id: number
	answerRu: string
	answerUz: string
	answerLa: string
	isCorrect: boolean
}

interface CardData {
	id: number
	groupId: number
	answers: Answer[]
	media: string
	questionRu: string
	questionUz: string
	questionLa: string
	questionDescriptionRu: string
	questionDescriptionUz: string
	questionDescriptionLa: string
}

const DashboardCard: React.FC<{ cardData: CardData }> = ({ cardData }) => {
	const [isImageOpen, setIsImageOpen] = useState(false)

	return (
		<Card className='w-full max-w-sm  flex flex-col justify-between  shadow-lg rounded-2xl p-4'>
			<CardHeader className='text-sm font-bold text-center'>
				<div className='flex items-center justify-between w-full mb-2 text-xs'>
					<p>{`id: ${cardData.id}`}</p>
					<p> {`Bilet: ${cardData.groupId}`}</p>
					<p>
						{[
							cardData.questionDescriptionLa,
							cardData.questionDescriptionUz,
							cardData.questionDescriptionRu,
						].some(desc => !desc?.trim()) ? (
							<X className='text-red-500' />
						) : (
							<Check className='text-green-500' />
						)}
					</p>
				</div>
				{cardData.questionLa && (
					<div>
						<p className='text-xs font-semibold mb-1'>La</p>
						<div dangerouslySetInnerHTML={{ __html: cardData.questionLa }} />
					</div>
				)}
				{cardData.questionUz && (
					<div>
						<p className='text-xs font-semibold mb-1'>Uz</p>
						<div dangerouslySetInnerHTML={{ __html: cardData.questionUz }} />
					</div>
				)}
				{cardData.questionRu && (
					<div>
						<p className='text-xs font-semibold mb-1'>Ru</p>
						<div dangerouslySetInnerHTML={{ __html: cardData.questionRu }} />
					</div>
				)}
			</CardHeader>

			<CardContent className='flex flex-col gap-4'>
				{cardData.media && (
					<Dialog open={isImageOpen} onOpenChange={setIsImageOpen}>
						<DialogTrigger asChild>
							<img
								src={cardData.media}
								alt={cardData.questionRu || 'Изображение'}
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

				{/* Описание */}
				<Accordion type='single' collapsible>
					<AccordionItem value='description'>
						<AccordionTrigger className='text-left text-gray-700'>
							Описание
						</AccordionTrigger>
						<AccordionContent className='flex flex-col gap-4'>
							{cardData.questionDescriptionLa && (
								<div>
									<p className='text-xs font-semibold mb-2'>La</p>
									<div
										className='text-xs'
										dangerouslySetInnerHTML={{
											__html: cardData.questionDescriptionLa,
										}}
									/>
								</div>
							)}
							{cardData.questionDescriptionUz && (
								<div>
									<p className='text-xs font-semibold mb-2'>Uz</p>
									<div
										className='text-xs'
										dangerouslySetInnerHTML={{
											__html: cardData.questionDescriptionUz,
										}}
									/>
								</div>
							)}
							{cardData.questionDescriptionRu && (
								<div>
									<p className='text-xs font-semibold mb-2'>Ru</p>
									<div
										className='text-xs'
										dangerouslySetInnerHTML={{
											__html: cardData.questionDescriptionRu,
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
							<Button className='w-full' variant='outline'>
								Показать ответы
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							{cardData.answers.length > 0 ? (
								cardData.answers.map(answer => (
									<DropdownMenuItem key={answer.id}>
										<div
											className={cn(
												'flex flex-col',
												answer.isCorrect && 'text-green-500'
											)}
										>
											<span
												dangerouslySetInnerHTML={{ __html: answer.answerLa }}
											/>
											<span
												dangerouslySetInnerHTML={{ __html: answer.answerUz }}
											/>
											<span
												dangerouslySetInnerHTML={{ __html: answer.answerRu }}
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

					{/* <Button>
						<Pencil />
					</Button> */}
				</div>
			</CardContent>
		</Card>
	)
}

export default DashboardCard
