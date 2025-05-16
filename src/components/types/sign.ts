export type SignData = {
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
