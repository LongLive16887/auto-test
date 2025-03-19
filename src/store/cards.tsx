import api from '@/api/axios'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Answer {
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
	fetchData: () => Promise<void>
}
export const useCardStore = create<EditStore>()(
	persist(
		(set, get) => ({
			data: [],
			page: 0,
			hasMore: true,

			fetchData: async () => {
				try {
					const { page, data } = get()
					const res = await api.get(`/api/v1/question?page=${page}&size=10`)
					const newData = res.data.data.results

					if (newData.length > 0) {
						set({
							data: [...data, ...newData],
							page: page + 1,
						})
					} else {
						set({ hasMore: false })
					}
				} catch (error) {
					console.error('Ошибка загрузки данных:', error)
				}
			},
		}),
		{
			name: 'edit-card-store',
			partialize: state => ({}),
		}
	)
)
