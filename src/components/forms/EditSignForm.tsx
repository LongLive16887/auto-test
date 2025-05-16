import api from '@/api/axios'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from '@/components/ui/form'
import { useSignStore } from '@/store/sign'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import CustomEditor from '../tipTapeditor/CustomEditor'
import { Button } from '../ui/button'

const formSchema = z.object({
	sign_name_la: z.string(),
	sign_name_ru: z.string(),
	sign_name_uz: z.string(),
	description_la: z.string(),
	description_ru: z.string(),
	description_uz: z.string(),
	image: z.string(),
	type_id: z.number(),
})

type themeType = {
	id: number
	sign_name_la: string
	sign_name_ru: string
	sign_name_uz: string
	description_la: string
	description_ru: string
	description_uz: string
	image: string
	type_id: number
}

interface EditThemeProps {
	themeData: themeType
	onClose: () => void
}


export default function EditThemeForm({ themeData, onClose }: EditThemeProps) {
	
	const form = useForm<z.infer<typeof formSchema>>({
		defaultValues: themeData || {},
	})

	const { fetchData } = useSignStore()
	const { handleSubmit, control, setValue, reset } = form
	const [isLoading, setIsLoading] = useState(false)
	const [apiError] = useState('')

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

	useEffect(() => {
		if (themeData) {
			reset(themeData)
		}
	}, [themeData, reset])

	const onSubmit = (data: any) => {
		api
			.put('api/v1/signs', {
				...data,
				type_id: 100,
				id: themeData.id,
			})
			.then(() => {
				fetchData()
				onClose()
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
											onBlur={() => handleLatinBlur(field.value, 'sign_name_la')}
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
											onBlur={() => handleLatinBlur(field.value, 'description_la')}
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

				<Button type='submit' disabled={isLoading}>
					O'zgartirish
				</Button>
			</form>
		</Form>
	)
}
