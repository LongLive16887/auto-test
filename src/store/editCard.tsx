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
	question_la: string
	question_ru: string
	question_uz: string
	question_kaa: string
	description_la: string
	description_ru: string
	description_uz: string
	description_kaa: string
	is_reverse: boolean
	group_id: number
	order_number: number
	lesson_id: string
	has_video: boolean
	answers: Answer[]
}

interface EditStore {
	currentCard: CardData | null
	isOpen: boolean
	selectedId: number | null
	fetchCardById: (id: number) => Promise<void>
	setId: (id?: number) => void
	setOpen: (open: boolean) => void 
	reset: () => void
}

export const useEditCardStore = create<EditStore>()(
	persist(
		set => ({
			currentCard: null,
			isOpen: false,
			selectedId: null,

			fetchCardById: async (id: number) => {
				try {
					const response = await api.get(`/api/v1/question/id?id=${id}`)
					set({ currentCard: response.data.data })
				} catch (error) {
					console.error('Failed to fetch card:', error)
				}
			},

			setId: (id?: number) => {
				set({ selectedId: id })
			},

			setOpen: (open: boolean) => {
				set({ isOpen: open })
			},
			reset: () => {
        set({
          currentCard: null,
          selectedId: null,
          isOpen: false
        })
      },
		}),
		{
			name: 'edit-card-store',
			partialize: state => ({
				currentCard: state.currentCard,
				isOpen: state.isOpen,
			}),
		}
	)
)
