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

interface EditThemeStore {
  isOpen: boolean
  themeData: Theme | null
  editTheme: (id: number) => Promise<void>
  toggleIsOpen: () => void
}

export const useEditThemeStore = create<EditThemeStore>((set) => ({
  isOpen: false,
  themeData: null,

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
}))
