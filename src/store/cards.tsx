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
	group_id: number    
	order_number: number
	lesson_id: string
	has_video: boolean
	answers: Answer[]
	media: string
}

interface EditStore {
	data: CardData[]
	page: number
	hasMore: boolean
	isLoading: boolean
	filterId: string | null 
	filterType: 'group' | 'lesson' | null
	fetchData: (id?: string, type?: 'group' | 'lesson') => Promise<void>
	setFilter: (id: string | null, type: 'group' | 'lesson' | null) => void
  isOpen: boolean,
  toggleIsOpen: () => void
}

export const useCardStore = create<EditStore>((set, get) => ({
  data: [],
  page: 0,
  hasMore: true,
  isLoading: false,
  filterId: null,
  filterType: null,
  isOpen: false,


  fetchData: async (id?: string, type?: 'group' | 'lesson') => {
    const { page, data, isLoading, filterId, filterType } = get()
    if (isLoading) return
    set({ isLoading: true })

    try {
      const finalId = id ?? filterId
      const finalType = type ?? filterType
      let url = `/api/v1/question?page=${page}&size=10`

      if (finalId) {
        url = finalType === 'group'
          ? `/api/v1/question?groupId=${finalId}&page=${page}&size=10`
          : `/api/v1/question?lessonId=${finalId}&page=${page}&size=10`
      }

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
