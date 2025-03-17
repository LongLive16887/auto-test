import LoginForm from '@/components/forms/LoginForm'
import { Link } from 'react-router-dom'
function LoginView() {
	return (
		<div className='w-full min-h-dvh p-4 flex items-center justify-center'>
			<div className='max-w-[400px] w-full bg-white rounded-2xl p-4'>
				<h1 className='mb-4 text-2xl font-bold text-gray-900'>Login</h1>
				<LoginForm />
				<p className='flex justify-center gap-2 mt-4 text-sm'>
					Akkauntingiz yo'qmi?
					<Link className='font-semibold underline' to='/register'>Ro'yxatdan o'ting</Link>
				</p>
			</div>
		</div>
	)
}

export default LoginView
