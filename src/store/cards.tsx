import api from '@/api/axios'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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
  lastId?: string 
  fetchData: (id?: string, type?: 'group' | 'lesson') => Promise<void>
  setData: (data: CardData[]) => void
  resetPage: () => void 
}

export const useCardStore = create<EditStore>()(
  persist(
    (set, get) => ({
      data: [],
      page: 0,
      hasMore: true,
      lastId: undefined,

      fetchData: async (id?: string, type: 'group' | 'lesson' = 'lesson') => {
        try {
          const { page, data, lastId } = get()
          
          // Сбрасываем пагинацию при изменении ID
          if(id !== lastId) {
            set({ page: 0, data: [], lastId: id, hasMore: true })
            return
          }

          const url = id
            ? type === 'group'
              ? `/api/v1/question?groupId=${id}&page=${page}`
              : `/api/v1/question?lessonId=${id}&page=${page}`
            : `/api/v1/question?page=${page}&size=10`

          const res = await api.get(url)
          const newData = res.data.data.results

          set(state => ({
            data: [...state.data, ...newData],
            page: state.page + 1,
            hasMore: newData.length > 0
          }))
          
        } catch (error) {
          console.error('Ошибка загрузки данных:', error)
        }
      },

      setData: (data: CardData[]) => set({ data }),
      resetPage: () => set({ page: 0, hasMore: true }),
    }),
    {
      name: 'edit-card-store',
    }
  )
)