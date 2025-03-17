import { Toaster } from '@/components/ui/sonner'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthMiddleware, GuestMiddleware } from './middleware/authMiddleware'
import Adverstings from './views/adverstings/Adverstings'
import AdView from './views/adverstings/AdView'
import LoginView from './views/auth/LoginView'
import Dashboard from './views/Dashboard'
import Notifications from './views/Notifications'

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route element={<GuestMiddleware />}>
					<Route path='/login' element={<LoginView />} />
				</Route>

				<Route element={<AuthMiddleware />}>
					<Route path='/' element={<Dashboard />} />
					<Route path='/adverstings' element={<Adverstings />} />
					<Route path='/adverstings/:id' element={<AdView />} />
					<Route path='/notifications' element={<Notifications />} />
				</Route>
			</Routes>
			<Toaster />
		</BrowserRouter>
	)
}

export default App
