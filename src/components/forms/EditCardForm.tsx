import api from '@/api/axios'
import { latinToCyrillic } from '@/lib/transliterate'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from '@/components/ui/form'
import { useCardStore } from '@/store/cards'
import { useEditCardStore } from '@/store/editCard'
import { Minus, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'
import CustomEditor from '../tipTapeditor/CustomEditor'
import { SelectData } from '../types'
import { Button } from '../ui/button'
import { Checkbox } from '../ui/checkbox'
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../ui/select'

const formSchema = z.object({
	question_la: z.string(),
	question_ru: z.string(),
	question_uz: z.string(),
	question_kaa: z.string(),
	question_description_la: z.string(),
	question_description_ru: z.string(),
	question_description_uz: z.string(),
	description_kaa: z.string(),
	is_reverse: z.boolean().default(true),
	group_id: z.number(),
	order_number: z.number(),
	lesson_id: z.string(),
	has_video: z.boolean(),
	answers: z.array(
		z.object({
			answer_la: z.string(),
			answer_uz: z.string(),
			answer_ru: z.string(),
			answer_kaa: z.string(),
			is_correct: z.boolean().default(true),
		})
	),
})

export default function EditCardForm() {
	const { currentCard, toggleIsOpen, reset } = useEditCardStore()
	const { fetchData, filterType, filterId } = useCardStore()
	const form = useForm<z.infer<typeof formSchema>>()

	const { handleSubmit, control, setValue } = form
	const [isFormInitialized, setIsFormInitialized] = useState(false)
	const [isLoading] = useState(false)
	const [apiError] = useState('')
	const [select, setSelect] = useState<SelectData[]>([])

	const { fields, append, remove, replace } = useFieldArray({
		control,
		name: 'answers',
	})
	useEffect(() => {
		api
			.get<{ data: SelectData[] }>('/api/groups?type_id=100')
			.then(res => {
				const data = res.data.data.map(item => ({
					...item,
					id: String(item.id),
				}))
				setSelect(data)
			})
			.catch(error => console.error('API Error:', error))
	}, [])

	useEffect(() => {
		if (currentCard && !isFormInitialized && select.length > 0) {
			const formData = {
				...currentCard,
				lesson_id:
					currentCard.lesson_id === 'null' ? '' : String(currentCard.lesson_id),
			}
			form.reset(formData)
			setIsFormInitialized(true)

			if (currentCard.answers && currentCard.answers.length > 0) {
				replace(currentCard.answers)
			}
		}
	}, [currentCard, form, isFormInitialized, replace, select])

	const syncLatinToUzbek = (html: string, uzPath: string) => {
		setValue(uzPath as any, latinToCyrillic(html))
	}

	const onSubmit = (data: any) => {
		const transformedData = {
			...data,
			description_la: data.question_description_la,
			description_ru: data.question_description_ru,
			description_uz: data.question_description_uz,
			description_kaa: 'kaa',
		}
		api.put('api/v1/question', transformedData).then(() => {
			toggleIsOpen()
			useCardStore.setState({ page: 0 })
			reset()
			fetchData(filterId ?? undefined, filterType ?? undefined)
		})
	}
	const removeAnswer = (index: number) => {
		if (fields.length > 1) {
			remove(index)
		}
	}

	return (
		<Form {...form}>
			<form
				className='flex flex-col gap-3.5 overflow-y-auto'
				onSubmit={handleSubmit(onSubmit)}
			>
				<div className='flex flex-col gap-3.5'>
					<p className='text-xl'>Savollar</p>
					<div className='flex items-start flex-wrap gap-3.5'>
						<FormField
							control={control}
							name='question_la'
							render={({ field }) => (
								<FormItem>
									<FormLabel className='text-gray-700'>Latin</FormLabel>
									<FormControl>
										<CustomEditor
											content={field.value || ''}
											onChange={value => {
												setValue('question_la', value)
												syncLatinToUzbek(value, 'question_uz')
											}}
										/>
									</FormControl>
								</FormItem>
							)}
						/>

						<FormField
							control={control}
							name='question_ru'
							render={({ field }) => (
								<FormItem>
									<FormLabel className='text-gray-700'>Russian</FormLabel>
									<FormControl>
										<CustomEditor
											content={field.value || ''}
											onChange={value => setValue('question_ru', value)}
										/>
									</FormControl>
								</FormItem>
							)}
						/>

						<FormField
							control={control}
							name='question_uz'
							render={({ field }) => (
								<FormItem>
									<FormLabel className='text-gray-700'>
										Uzbek {isLoading && '(Translating...)'}
										{apiError && (
											<span className='text-red-500 ml-2'>{apiError}</span>
										)}
									</FormLabel>
									<FormControl>
										<CustomEditor
											content={field.value || ''}
											onChange={value => setValue('question_uz', value)}
											disabled={isLoading}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
					</div>
				</div>

				<div className='flex flex-col gap-3.5'>
					<p className='text-xl'>Izohlar</p>
					<div className='flex items-start flex-wrap gap-3.5'>
						<FormField
							control={control}
							name='question_description_la'
							render={({ field }) => (
								<FormItem>
									<FormLabel className='text-gray-700'>Latin</FormLabel>
									<FormControl>
										<CustomEditor
											content={field.value || ''}
											onChange={value => {
												setValue('question_description_la', value)
												syncLatinToUzbek(value, 'question_description_uz')
											}}
										/>
									</FormControl>
								</FormItem>
							)}
						/>

						<FormField
							control={control}
							name='question_description_ru'
							render={({ field }) => (
								<FormItem>
									<FormLabel className='text-gray-700'>Russian</FormLabel>
									<FormControl>
										<CustomEditor
											content={field.value || ''}
											onChange={value =>
												setValue('question_description_ru', value)
											}
										/>
									</FormControl>
								</FormItem>
							)}
						/>

						<FormField
							control={control}
							name='question_description_uz'
							render={({ field }) => (
								<FormItem>
									<FormLabel className='text-gray-700'>
										Uzbek {isLoading && '(Translating...)'}
										{apiError && (
											<span className='text-red-500 ml-2'>{apiError}</span>
										)}
									</FormLabel>
									<FormControl>
										<CustomEditor
											content={field.value || ''}
											onChange={value =>
												setValue('question_description_uz', value)
											}
											disabled={isLoading}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
					</div>
				</div>

				<div className='my-3 flex items-center gap-10'>
					<FormField
						control={control}
						name='is_reverse'
						render={({ field }) => (
							<FormItem className='flex items-center gap-2.5'>
								<label
									htmlFor='is_reverse'
									className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
								>
									Javoblarni random chiqarish
								</label>
								<FormControl>
									<Checkbox
										checked={field.value}
										onCheckedChange={field.onChange}
									/>
								</FormControl>
							</FormItem>
						)}
					/>
					<div>
						<FormField
							control={control}
							name='lesson_id'
							render={({ field }) => (
								<FormItem className='flex items-center gap-2.5'>
									<FormControl>
										<div className='flex items-center gap-2.5'>
											<Select
												value={field.value}
												onValueChange={value => {
													field.onChange(value)
												}}
											>
												<SelectTrigger className='w-fit max-w-[800px]'>
													<SelectValue placeholder='Mavzuni tanlang' />
												</SelectTrigger>
												<SelectContent>
													<SelectGroup>
														{select.map(item => (
															<SelectItem key={item.id} value={String(item.id)}>
																<span
																	dangerouslySetInnerHTML={{
																		__html: item.name_uz || 'Empty',
																	}}
																/>
															</SelectItem>
														))}
													</SelectGroup>
												</SelectContent>
											</Select>

											<button
												type='button'
												onClick={() => field.onChange('')}
												className='px-3 py-2 rounded-md text-sm bg-red-100 hover:bg-red-200 text-red-600'
											>
												Tozalash
											</button>
										</div>
									</FormControl>
								</FormItem>
							)}
						/>
					</div>
				</div>

				<div className='flex flex-col gap-3.5'>
					<div className='flex items-center gap-2'>
						<p className='text-xl'>Javoblar</p>
						<Button
							type='button'
							onClick={() =>
								append({
									answer_la: '',
									answer_uz: '',
									answer_ru: '',
									answer_kaa: '',
									is_correct: false,
								})
							}
							className='bg-green-500'
							size='sm'
						>
							<Plus className='h-4 w-4' />
						</Button>
					</div>

					{fields.map((field, index) => (
						<div key={field.id} className='flex items-center gap-3.5'>
							<FormField
								control={control}
								name={`answers.${index}.is_correct`}
								render={({ field }) => (
									<FormItem className='flex items-center gap-2'>
										<FormControl>
											<Checkbox
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
									</FormItem>
								)}
							/>
							<div className='flex items-start gap-3.5'>
								<FormField
									control={control}
									name={`answers.${index}.answer_la`}
									render={({ field }) => (
										<FormItem>
											<FormLabel>Latin Answer</FormLabel>
											<FormControl>
												<CustomEditor
													answer
													content={field.value}
													onChange={value => {
														field.onChange(value)
														syncLatinToUzbek(value, `answers.${index}.answer_uz`)
													}}
												/>
											</FormControl>
										</FormItem>
									)}
								/>
								<FormField
									control={control}
									name={`answers.${index}.answer_ru`}
									render={({ field }) => (
										<FormItem>
											<FormLabel>Russian</FormLabel>
											<FormControl>
												<CustomEditor
													answer
													content={field.value}
													onChange={field.onChange}
												/>
											</FormControl>
										</FormItem>
									)}
								/>
								<FormField
									control={control}
									name={`answers.${index}.answer_uz`}
									render={({ field }) => (
										<FormItem>
											<FormLabel>Uzbek</FormLabel>
											<FormControl>
												<CustomEditor
													answer
													content={field.value}
													onChange={field.onChange}
												/>
											</FormControl>
										</FormItem>
									)}
								/>
							</div>

							<div className='flex items-center gap-2'>
								{fields.length > 1 && (
									<Button
										size='sm'
										type='button'
										onClick={() => removeAnswer(index)}
										className='bg-red-500'
									>
										<Minus />
									</Button>
								)}
							</div>
						</div>
					))}
				</div>

				<Button type='submit' disabled={isLoading}>
					O'zgartirish
				</Button>
			</form>
		</Form>
	)
}
