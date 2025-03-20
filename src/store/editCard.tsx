import api from '@/api/axios'
import { create } from 'zustand'

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
	reset: () => void
	toggleIsOpen: () => void
}

export const useEditCardStore = create<EditStore>()(set => ({
	currentCard: null,
	isOpen: false,
	selectedId: null,

	fetchCardById: async (id: number) => {
		try {
			const response = await api.get(`/api/v1/question/id?id=${id}`)
			set({ currentCard: response.data.data })
			console.log(useEditCardStore.getState().currentCard)
		} catch (error) {}
	},

	setId: (id?: number) => {
		set({ selectedId: id })
	},

	toggleIsOpen: () => {
		set(state => ({ isOpen: !state.isOpen }))
	},

	reset: () => {
		set({
			currentCard: null,
			selectedId: null,
			isOpen: false,
		})
	},
}))
