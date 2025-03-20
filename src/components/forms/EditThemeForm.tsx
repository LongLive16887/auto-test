import api from '@/api/axios'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from '@/components/ui/form'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import CustomEditor from '../tipTapeditor/CustomEditor'
import { Button } from '../ui/button'

const formSchema = z.object({
	name_la: z.string(),
	name_ru: z.string(),
	name_uz: z.string(),
	image: z.string(),
	type_id: z.number(),
})

type themeType = {
	id: number
	name_la: string
	name_ru: string
	name_uz: string
	image: string
	type_id: number
}

interface EditThemeProps {
	themeData: themeType
}


export default function EditThemeForm({themeData}: EditThemeProps) {
	const form = useForm<z.infer<typeof formSchema>>({
		defaultValues: themeData || {},
	})

	console.log(23424242, themeData)
	

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
		api.put('api/groups', {
			...data,
			type_id: 100,
			id: themeData.id
		}).then(res => {
			console.log(res)
		})
	}

	return (
		<Form  {...form}>
			<form
				className='flex flex-col gap-3.5 overflow-y-auto'
				onSubmit={handleSubmit(onSubmit)}
			>
				<div className='flex flex-col gap-3.5'>
					<p className='text-xl'>Savollar</p>
					<div className='flex items-start flex-wrap gap-3.5'>
						<FormField
							control={control}
							name='name_la'
							render={({ field }) => (
								<FormItem>
									<FormLabel className='text-gray-700'>Latin</FormLabel>
									<FormControl>
										<CustomEditor
											content={field.value || ''}
											onChange={value => setValue('name_la', value)}
											onBlur={() => handleLatinBlur(field.value, 'name_la')}
										/>
									</FormControl>
								</FormItem>
							)}
						/>

						<FormField
							control={control}
							name='name_ru'
							render={({ field }) => (
								<FormItem>
									<FormLabel className='text-gray-700'>Russian</FormLabel>
									<FormControl>
										<CustomEditor
											content={field.value || ''}
											onChange={value => setValue('name_ru', value)}
										/>
									</FormControl>
								</FormItem>
							)}
						/>

						<FormField
							control={control}
							name='name_uz'
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
											onChange={value => setValue('name_uz', value)}
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
