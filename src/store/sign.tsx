import api from '@/api/axios'
import { create } from 'zustand'

interface Answer {
	id: number
	answer_la: string
	answer_uz: string
	answer_ru: string
	answer_kaa: string
	is_correct: boolean
}

interface CardData {
	id: number
	question_la: string
	question_ru: string
	question_uz: string
	question_kaa: string
	question_description_la: string
	question_description_ru: string
	question_description_uz: string
	description_kaa: string
	is_reverse: boolean
	group_id: string    
	order_number: number
	lesson_id: string
	has_video: boolean
	answers: Answer[]
	media: string
  mobile_media: string
}

interface EditStore {
	data: CardData[]
	page: number
	hasMore: boolean
	isLoading: boolean
	filterId: string | null 
	filterType: 'group' | 'lesson' | null
	fetchData: () => Promise<void>
	setFilter: (id: string | null, type: 'group' | 'lesson' | null) => void
  isOpen: boolean,
  toggleIsOpen: () => void
}

export const useSignStore = create<EditStore>((set, get) => ({
  data: [],
  page: 0,
  hasMore: true,
  isLoading: false,
  filterId: null,
  filterType: null,
  isOpen: false,


  fetchData: async () => {
    const { page, data, isLoading } = get()
    if (isLoading) return
    set({ isLoading: true })

    try {
      let url = `/api/v1/signs?page=${page}&size=10`
      const res = await api.get(url)
      const newData = res.data?.data?.results || []

      set({
        data: page === 0 ? newData : [...data, ...newData],
        page: page + 1,
        hasMore: newData.length > 0,
      })
    } catch (error) {
      console.error('Ошибка загрузки данных:', error)
    } finally {
      set({ isLoading: false })
    }
  },

  toggleIsOpen: () => {
    set((state) => ({ isOpen: !state.isOpen }))
  },

  setFilter: (id: string | null, type: 'group' | 'lesson' | null) => {
    set({ filterId: id, filterType: type, data: [], page: 0, hasMore: true })
  },
}))
