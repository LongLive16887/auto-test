import api from '@/api/axios'
import { latinToCyrillic } from '@/lib/transliterate'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from '@/components/ui/form'
import { useColoredStore } from '@/store/colored'
import { useEditCardStore } from '@/store/editCard'
import { useEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'
import CustomEditor from '../tipTapeditor/CustomEditor'
import { Button } from '../ui/button'

const formSchema = z.object({
	question_la: z.string(),
	question_ru: z.string(),
	question_uz: z.string(),
	answers: z.array(
		z.object({
			id: z.number(),
			answer_la: z.string(),
			answer_ru: z.string(),
			answer_uz: z.string(),
		})
	),
})

type FormValues = z.infer<typeof formSchema>

export default function EditColoredForm() {
	const { currentCard, toggleIsOpen, reset } = useEditCardStore()
	const { fetchData, filterId, filterType } = useColoredStore()
	const form = useForm<FormValues>()

	const { handleSubmit, control, setValue, getValues } = form
	const [isFormInitialized, setIsFormInitialized] = useState(false)
	const [isLoading, setIsLoading] = useState(false)

	const syncToUzbek = (html: string, uzPath: string) => {
		setValue(uzPath as any, latinToCyrillic(html))
	}

	const applyHighlight = (html: string, cyrText: string): string => {
		if (!cyrText || !html.includes(cyrText)) return html
		const escaped = cyrText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
		const alreadyWrapped = new RegExp(`data-highlight="true"[^>]*>${escaped}<`).test(html)
		if (alreadyWrapped) return html
		return html.replace(cyrText, `<span data-highlight="true" style="background: #C59D32; padding: 0 1px; border-radius: 5px;">${cyrText}</span>`)
	}

	const syncHighlights = (laHtml: string) => {
		const parser = new DOMParser()
		const laDoc = parser.parseFromString(laHtml, 'text/html')
		const spans = laDoc.querySelectorAll('span[data-highlight="true"], span[style*="background: yellow"]')
		if (spans.length === 0) return

		const texts = Array.from(spans)
			.map(s => s.textContent?.trim() || '')
			.filter(Boolean)

		let uzHtml = getValues('question_uz')
		let ruHtml = getValues('question_ru')

		for (const laText of texts) {
			const cyrText = latinToCyrillic(laText)
			uzHtml = applyHighlight(uzHtml, cyrText)
			ruHtml = applyHighlight(ruHtml, cyrText)
		}

		setValue('question_uz', uzHtml)
		setValue('question_ru', ruHtml)
	}

	const { fields, replace, update } = useFieldArray({ control, name: 'answers' })

	useEffect(() => {
		if (currentCard && !isFormInitialized) {
			form.reset({
				question_la: currentCard.question_la_colored || currentCard.question_la || '',
				question_ru: currentCard.question_ru_colored || currentCard.question_ru || '',
				question_uz: currentCard.question_uz_colored || currentCard.question_uz || '',
				answers: (currentCard.answers || []).map(a => ({
					id: a.id,
					answer_la: a.answer_la_colored || a.answer_la || '',
					answer_ru: a.answer_ru_colored || a.answer_ru || '',
					answer_uz: a.answer_uz_colored || a.answer_uz || '',
				})),
			})

			if (currentCard.answers?.length > 0) {
				replace(
					currentCard.answers.map(a => ({
						id: a.id,
						answer_la: a.answer_la_colored || a.answer_la || '',
						answer_ru: a.answer_ru_colored || a.answer_ru || '',
						answer_uz: a.answer_uz_colored || a.answer_uz || '',
					}))
				)
			}

			setIsFormInitialized(true)
		}
	}, [currentCard, isFormInitialized, form, replace])

	const onSubmit = (data: FormValues) => {
		setIsLoading(true)
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const c = currentCard as any

		api
			.put('/api/v1/question/colored', {
				id: c.id,
				group_id: Number(c.group_id),
				order_number: Number(c.order_number),
				lesson_id: Number(c.lesson_id),
				is_reverse: c.is_reverse,
				has_video: c.has_video,
				question_la: data.question_la,
				question_ru: data.question_ru,
				question_uz: data.question_uz,
				question_kaa: c.question_kaa,
				description_la: c.question_description_la,
				description_ru: c.question_description_ru,
				description_uz: c.question_description_uz,
				description_kaa: c.question_description_kaa || 'kaa',
				answers: currentCard!.answers.map((a, i) => ({
					id: a.id,
					answer_la: data.answers[i]?.answer_la ?? a.answer_la,
					answer_ru: data.answers[i]?.answer_ru ?? a.answer_ru,
					answer_uz: data.answers[i]?.answer_uz ?? a.answer_uz,
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					answer_kaa: (a as any).answer_kaa || '',
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					media: (a as any).media || '',
					is_correct: a.is_correct,
					question_id: c.id,
				})),
			})
			.then(() => {
				toggleIsOpen()
				useColoredStore.setState({ page: 0 })
				reset()
				fetchData(filterId ?? undefined, filterType ?? undefined)
			})
			.catch(err => console.error('Save colored error:', err))
			.finally(() => setIsLoading(false))
	}

	return (
		<Form {...form}>
			<form
				className='flex flex-col gap-3.5 overflow-y-auto'
				onSubmit={handleSubmit(onSubmit)}
			>
				<div className='flex flex-col gap-3.5'>
					<p className='text-xl'>Savollar (kalit so'zlar)</p>
					<div className='flex items-start flex-wrap gap-3.5'>
						<FormField
							control={control}
							name='question_la'
							render={({ field }) => (
								<FormItem>
									<FormLabel className='text-gray-700'>Latin</FormLabel>
									<FormControl>
										<CustomEditor highlightEnabled markOnly
											content={field.value || ''}
											onChange={value => {
												setValue('question_la', value)
												syncToUzbek(value, 'question_uz')
											}}
											onHighlightChange={syncHighlights}
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
										<CustomEditor highlightEnabled markOnly
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
									<FormLabel className='text-gray-700'>Uzbek</FormLabel>
									<FormControl>
										<CustomEditor highlightEnabled markOnly
											content={field.value || ''}
											onChange={value => setValue('question_uz', value)}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
					</div>
				</div>

				<div className='flex flex-col gap-3.5'>
					<p className='text-xl'>Javoblar (kalit so'zlar)</p>
					{fields.map((field, index) => (
						<div key={field.id} className='flex items-start gap-3.5'>
							<FormField
								control={control}
								name={`answers.${index}.answer_la`}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Latin</FormLabel>
										<FormControl>
											<CustomEditor highlightEnabled markOnly
												answer
												content={field.value || ''}
												onChange={value => {
													const current = getValues(`answers.${index}`)
													update(index, { ...current, answer_la: value, answer_uz: latinToCyrillic(value) })
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
											<CustomEditor highlightEnabled markOnly
												answer
												content={field.value || ''}
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
											<CustomEditor highlightEnabled markOnly
												answer
												content={field.value || ''}
												onChange={field.onChange}
											/>
										</FormControl>
									</FormItem>
								)}
							/>
						</div>
					))}
				</div>

				<Button type='submit' disabled={isLoading}>
					{isLoading ? 'Saqlanmoqda...' : 'Saqlash'}
				</Button>
			</form>
		</Form>
	)
}
