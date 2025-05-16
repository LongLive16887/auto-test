import { Toaster } from '@/components/ui/sonner'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthMiddleware, GuestMiddleware } from './middleware/authMiddleware'
import LoginView from './views/auth/LoginView'
import Dashboard from './views/Dashboard'
import Signs from './views/Signs'
import Themes from './views/Themes'

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route element={<GuestMiddleware />}>
					<Route path='/login' element={<LoginView />} />
				</Route>

				<Route element={<AuthMiddleware />}>
					<Route path='/' element={<Dashboard />} />
					<Route path='/themes' element={<Themes />} />
					<Route path='/signs' element={<Signs />} />
				</Route>
			</Routes>
			<Toaster />
		</BrowserRouter>
	)
}

export default App
