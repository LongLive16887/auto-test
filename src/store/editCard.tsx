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
	isImage: boolean
	isAudio: boolean
	selectedId: number | null
	fetchCardById: (id: number) => Promise<void>
	setId: (id?: number) => void
	reset: () => void
	toggleIsOpen: () => void
	toggleIsImage: () => void
	toggleIsAudio: () => void
	putImage: (media: string) => void
	putAudio: (media: string) => void
}

export const useEditCardStore = create<EditStore>()((set, get) => ({
	currentCard: null,
	isOpen: false,
	isImage: false,
	isAudio: false,
	selectedId: null,

	fetchCardById: async (id: number) => {
		try {
			const response = await api.get(`/api/v1/question/id?id=${id}`)
			const data = response.data.data

			const modifiedData = {
				...data,
				group_id: String(data.group_id),
				lesson_id: String(data.lesson_id),
			}

			set({ currentCard: modifiedData })
			console.log(
				'Modified card data:',
				useEditCardStore.getState().currentCard
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
		api.put('api/v1/question/media', {
			question_id: selectedId,
			mobile_media: media
		})
	},

	putAudio: (audio: string) => {
		const { selectedId } = get()
		if (!selectedId) return
		api.put('api/v1/question/add-audio', {
			question_id: selectedId,
			audio_id: audio,
		},
			{
				params: {
					questionId: selectedId,
				},
			})
	},

	toggleIsOpen: () => {
		set(state => ({ isOpen: !state.isOpen }))
	},

	toggleIsImage: () => {
		set(state => ({ isImage: !state.isImage }))
	},

	toggleIsAudio: () => {
		set(state => ({ isAudio: !state.isAudio }))
	},

	reset: () => {
		set({
			currentCard: null,
			selectedId: null,
			isOpen: false,
		})
	},
}))
