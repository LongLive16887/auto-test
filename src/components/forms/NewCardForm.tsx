import api from '@/api/axios'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from '@/components/ui/form'
import { Minus, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'
import CustomEditor from '../tipTapeditor/CustomEditor'
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
	description_la: z.string(),
	description_ru: z.string(),
	description_uz: z.string(),
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

interface CardData {
	id: string
	type_id: number
	name_ru: string
	name_la: string
	name_uz: string
	image: string
}

export default function TiptapForm() {
	const form = useForm<z.infer<typeof formSchema>>({
		defaultValues: {
			question_la: '',
			question_ru: '',
			question_uz: '',
			question_kaa: 'null',
			description_la: '',
			description_ru: '',
			description_uz: '',
			description_kaa: 'null',
			is_reverse: true,
			group_id: 1,
			order_number: 1,
			lesson_id: '',
			has_video: false,
			answers: [
				{
					answer_la: '',
					answer_uz: '',
					answer_ru: '',
					answer_kaa: 'null',
					is_correct: true,
				},
			],
		},
	})

	const { handleSubmit, control, setValue } = form
	const [isLoading, setIsLoading] = useState(false)
	const [apiError, setApiError] = useState('')
	const [select, setSelect] = useState<CardData[]>([])

	const { fields, append, remove } = useFieldArray({
		control,
		name: 'answers',
	})

	const handleLatinBlur = async (html: string, fieldPath: string) => {
		if (!html.trim()) return

		try {
			setIsLoading(true)
			const raw = JSON.stringify({
				mod: 'lattocyr',
				text: html,
				ignoreHtml: true,
			})

			const response = await fetch('https://lotin.uz/api/translate', {
				method: 'POST',
				body: raw,
				headers: { 'Content-Type': 'application/json' },
			})

			if (!response.ok) throw new Error('Translation failed')

			const data = await response.json()
			const targetPath = fieldPath.replace('_la', '_uz')
			setValue(targetPath as any, data.result)
		} catch (err) {
			console.error('Translation error:', err)
		} finally {
			setIsLoading(false)
		}
	}

	const handleAnswerBlur = (index: number) => (html: string) => {
		handleLatinBlur(html, `answers.${index}.answer_la`)
	}

	const onSubmit = (data: any) => {
		api.post('api/v1/question', data).then(res => {
			console.log(res)
		})
	}
	const removeAnswer = (index: number) => {
		if (fields.length > 1) {
			remove(index)
		}
	}

	useEffect(() => {
		api.get('/api/groups?type_id=100').then(res => {
			setSelect(res.data.data)
		})
	}, [])

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
											onChange={value => setValue('question_la', value)}
											onBlur={() => handleLatinBlur(field.value, 'question_la')}
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
							name='description_la'
							render={({ field }) => (
								<FormItem>
									<FormLabel className='text-gray-700'>Latin</FormLabel>
									<FormControl>
										<CustomEditor
											content={field.value || ''}
											onChange={value => setValue('description_la', value)}
											onBlur={() =>
												handleLatinBlur(field.value, 'description_la')
											}
										/>
									</FormControl>
								</FormItem>
							)}
						/>

						<FormField
							control={control}
							name='description_ru'
							render={({ field }) => (
								<FormItem>
									<FormLabel className='text-gray-700'>Russian</FormLabel>
									<FormControl>
										<CustomEditor
											content={field.value || ''}
											onChange={value => setValue('description_ru', value)}
										/>
									</FormControl>
								</FormItem>
							)}
						/>

						<FormField
							control={control}
							name='description_uz'
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
											onChange={value => setValue('description_uz', value)}
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
					<FormField
						control={control}
						name='lesson_id'
						render={({ field }) => (
							<FormItem className='flex items-center gap-2.5'>
								<FormControl>
									<Select value={field.value} onValueChange={(value) => {field.onChange(value)}}>
										<SelectTrigger className='w-fit max-w-[800px]'>
											<SelectValue placeholder='Mavzuni tanlang' />
										</SelectTrigger>
										<SelectContent>
											<SelectGroup>
												{select.map(item => (
													<SelectItem key={item.id} value={item.id}>
														{item.name_la}
													</SelectItem>
												))}
											</SelectGroup>
										</SelectContent>
									</Select>
								</FormControl>
							</FormItem>
						)}
					/>
				</div>

				<div className='flex flex-col gap-3.5'>
					<div className='flex items-center gap-2'>
						<p className='text-xl'>Javoblar</p>
						<Button
							type='button'
							onClick={() =>
								append({ answer_la: '', answer_uz: '', answer_ru: '' })
							}
							className='bg-green-500'
							size='sm'
						>
							<Plus className='h-4 w-4' />
						</Button>
					</div>

					{fields.map((field, index) => (
						<div key={field.id} className='flex items-start flex-wrap gap-3.5'>
							<FormField
								control={control}
								name={`answers.${index}.answer_la`}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Latin Answer</FormLabel>
										<FormControl>
											<CustomEditor
												content={field.value}
												onChange={field.onChange}
												onBlur={() => handleAnswerBlur(index)(field.value)}
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
												content={field.value}
												onChange={field.onChange}
											/>
										</FormControl>
									</FormItem>
								)}
							/>
							{fields.length !== 1 ? (
								<Button
									type='button'
									onClick={() => removeAnswer(index)}
									className='bg-red-500'
									size='icon'
								>
									<Minus className='h-4 w-4' />
								</Button>
							) : null}
						</div>
					))}
				</div>

				<Button type='submit' disabled={isLoading}>
					Submit
				</Button>
			</form>
		</Form>
	)
}
