import { Button } from '@/components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useUserStore } from '@/store/user'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, LogIn } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

const FormSchema = z.object({
	username: z.string().min(2, {
		message: "Iltimos ma'lumot kiriting!",
	}),
	password: z.string().min(2, {
		message: "Iltimos ma'lumot kiriting!",
	}),
})

export default function LoginForm() {
	const [loading, setLoading] = useState<boolean>(false)
	const navigate = useNavigate()
	const { authUser } = useUserStore()
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			username: '',
			password: '',
		},
	})

	function onSubmit(data: z.infer<typeof FormSchema>) {
		setLoading(true)
		authUser(data)
			.then(() => {
				setLoading(false)
				navigate('/')
			})
			.catch(() => {
				setLoading(false)
					toast('ERROR', {
						description: 'ERROR LOGIN',
					})
			})
	}



	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 w-full'>
				<FormField
					control={form.control}
					name='username'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Username</FormLabel>
							<FormControl>
								<Input border placeholder='Username' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='password'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Password</FormLabel>
							<FormControl>
								<Input
									border
									placeholder='Password'
									{...field}
									type='password'
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type='submit' className='w-full' size='lg' disabled={loading}>
					Submit
					{loading ? <Loader2 className='animate-spin' /> : <LogIn />}
				</Button>
			</form>
		</Form>
	)
}
