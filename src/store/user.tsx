import axios from '@/api/axios'
import Cookies from 'js-cookie'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type UserStore = {
	user: {
		username?: string
	}
	token: string
	setUser: (val: any) => void
	lougoutUser: () => void
	authUser: (loginData: { username: string; password: string }) => Promise<void>
}

export const useUserStore = create<UserStore>()(
	persist(
		set => ({
			token: Cookies.get('token') || '',
			user: {},
			setToken: (val: string) => {
				Cookies.set('token', val, { expires: 1, path: '/' })
				set({ token: val })
			},
			setUser: val => {
				set({ user: val })
			},
			authUser: async loginData => {
				try {
					const res = await axios.post('/api/v1/auth/login', loginData)
					console.log(res)
					const token = res.data.data.access_token

					Cookies.set('token', token, { expires: 1, path: '/' })
					set({ token, user: loginData })
				} catch (error) {
					console.error('Ошибка авторизации:', error)
				}
			},
			lougoutUser: () => {
				Cookies.set('token', '', { expires: 1, path: '/' })
				set({ token: '', user: {} })
			},
		}),
		{
			name: 'Administrator',
			partialize: state => ({
				user: state.user,
			}),
		}
	)
)
