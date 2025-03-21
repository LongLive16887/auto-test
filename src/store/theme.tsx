import { create } from 'zustand'
import api from '@/api/axios'

interface Theme {
  id: number
  type_id: number
  name_ru: string
  name_la: string
  name_uz: string
  image: string
}

interface ThemeStore {
  data: Theme[]
  isLoading: boolean
  isOpen: boolean
  isEdit: boolean
  themeData: Theme | null
  fetchData: (typeId: number) => Promise<void>
  createTheme: (theme: Omit<Theme, 'id'>) => Promise<void>
  editTheme: (id: number) => Promise<void>
  toggleIsOpen: () => void
  toggleIsEdit: () => void

}

export const useThemeStore = create<ThemeStore>((set) => ({
  data: [],
  isLoading: false,
  isOpen: false,
  isEdit: false,
  themeData: null,

  fetchData: async (typeId: number) => {
    set({ isLoading: true })
    try {
      const res = await api.get(`/api/groups?type_id=${typeId}`)
      set({ data: res.data.data })
    } catch (error) {
      console.error('Ошибка загрузки тем:', error)
    } finally {
      set({ isLoading: false })
    }
  },

  createTheme: async (theme) => {
    try {
      const res = await api.post('/api/groups', theme)
      console.log(res)
    } catch (error) {
      console.error('Ошибка создания темы:', error)
    }
  },

  editTheme: async (id: number) => {
    try {
      const res = await api.get(`/api/groups/${id}`)
      set({ themeData: res.data.data, isOpen: true })
    } catch (error) {
      console.error('Ошибка загрузки темы:', error)
    }
  },

  toggleIsOpen: () => {
    set((state) => ({ isOpen: !state.isOpen }))
  },
  toggleIsEdit: () => {

    set((state) => ({ isEdit: !state.isEdit }))
  },
}))
