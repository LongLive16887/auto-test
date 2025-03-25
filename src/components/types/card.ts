export type CardData = {
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

type Answer = {
	id: number
	answer_la: string
	answer_uz: string
	answer_ru: string
	answer_kaa: string
	is_correct: boolean
}
