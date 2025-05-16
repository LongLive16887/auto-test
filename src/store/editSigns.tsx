import api from '@/api/axios'
import { create } from 'zustand'

interface Answer {
	answer_la: string
	answer_uz: string
	answer_ru: string
	answer_kaa: string
	is_correct: boolean
}

export type CardData = {
	id: number
	sign_name_la: string
	sign_name_ru: string
	sign_name_uz: string
	question_kaa: string
	description_la: string
	description_ru: string
	description_uz: string
	description_kaa: string
	is_reverse: boolean
	image: string
	type_id: number
	group_id: string
	order_number: number
	lesson_id: string
	has_video: boolean
	answers: Answer[]
	media: string
	mobile_media: string
}

interface EditStore {
	currentCard: CardData | null
	isOpen: boolean
	isImage: boolean
	selectedId: number | null
	fetchCardById: (id: number) => Promise<void>
	setId: (id?: number) => void
	reset: () => void
	toggleIsOpen: () => void
	toggleIsImage: () => void
	putImage: (media: string) => void
}

export const useEditSignStore = create<EditStore>()((set, get) => ({
	currentCard: null,
	isOpen: false,
	isImage: false,
	selectedId: null,

	fetchCardById: async (id: number) => {
		try {
			const response = await api.get(`/api/v1/signs/${id}`)
			const data = response.data.data

			const modifiedData = {
				...data,
				group_id: String(data.group_id),
				lesson_id: String(data.lesson_id),
			}

			set({ currentCard: modifiedData })
			console.log(
				'Modified card data:',
				useEditSignStore.getState().currentCard
			)
		} catch (error) {
			console.error('Error fetching card:', error)
		}
	},

	setId: (id?: number) => {
		set({ selectedId: id })
	},

	putImage: (media: string) => {
		const { selectedId } = get()
		api.put(`api/v1/signs/media?id=${selectedId}`, {
			media_id: media
		})
	},

	toggleIsOpen: () => {
		set(state => ({ isOpen: !state.isOpen }))
	},

	toggleIsImage: () => {
		set(state => ({ isImage: !state.isImage }))
	},

	reset: () => {
		set({
			currentCard: null,
			selectedId: null,
			isOpen: false,
		})
	},
}))
