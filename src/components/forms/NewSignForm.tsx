import api from '@/api/axios'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from '@/components/ui/form'
import { useSignStore } from '@/store/sign'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import CustomEditor from '../tipTapeditor/CustomEditor'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

const formSchema = z.object({
	sign_name_la: z.string(),
	sign_name_ru: z.string(),
	sign_name_uz: z.string(),
	description_la: z.string(),
	description_ru: z.string(),
	description_uz: z.string(),
	sign_image: z.string(),
	group_id: z.number(),
	sign_number: z.string(),
})

export default function NewSignForm() {
	const form = useForm<z.infer<typeof formSchema>>({
		defaultValues: {
			sign_name_la: '',
			sign_name_ru: '',
			sign_name_uz: '',
			description_la: '',
			description_ru: '',
			description_uz: '',
			group_id: 1,
			sign_number: '',
			sign_image: '',
		},
	})

	const { handleSubmit, control, setValue } = form
	const [isLoading, setIsLoading] = useState(false)
	const [apiError] = useState('')
	const { fetchData, toggleIsOpen } = useSignStore()

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

	const onSubmit = (data: any) => {
		api.post('api/v1/signs', data).then(() => {
			fetchData()
			toggleIsOpen()
		})
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
							name='sign_name_la'
							render={({ field }) => (
								<FormItem>
									<FormLabel className='text-gray-700'>Latin</FormLabel>
									<FormControl>
										<CustomEditor
											content={field.value || ''}
											onChange={value => setValue('sign_name_la', value)}
											onBlur={() =>
												handleLatinBlur(field.value, 'sign_name_la')
											}
										/>
									</FormControl>
								</FormItem>
							)}
						/>

						<FormField
							control={control}
							name='sign_name_ru'
							render={({ field }) => (
								<FormItem>
									<FormLabel className='text-gray-700'>Russian</FormLabel>
									<FormControl>
										<CustomEditor
											content={field.value || ''}
											onChange={value => setValue('sign_name_ru', value)}
										/>
									</FormControl>
								</FormItem>
							)}
						/>

						<FormField
							control={control}
							name='sign_name_uz'
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
											onChange={value => setValue('sign_name_uz', value)}
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
				<FormField
					control={control}
					name='sign_number'
					render={({ field }) => (
						<FormItem>
							<FormLabel className='text-gray-700'>Sign Number</FormLabel>
							<FormControl>
								<Input border placeholder='Sign number' {...field} />
							</FormControl>
						</FormItem>
					)}
				/>
				<Button type='submit' disabled={isLoading}>
					Yaratish
				</Button>
			</form>
		</Form>
	)
}
