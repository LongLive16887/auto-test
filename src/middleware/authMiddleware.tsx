import { useUserStore } from '@/store/user'
import { Navigate, Outlet } from 'react-router-dom'

export const AuthMiddleware = () => {
	const { token } = useUserStore()
	return token ? <Outlet /> : <Navigate to='/login' />
}

export const GuestMiddleware = () => {
	const { token } = useUserStore()
	return token ? <Navigate to='/' /> : <Outlet />
}
