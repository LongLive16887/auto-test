import api from '@/api/axios'
import { useCardStore } from '@/store/cards'
import { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../ui/select'

interface CardData {
	id: string
	type_id: number
	name_ru: string
	name_la: string
	name_uz: string
	image: string
}

export default function CardFilters() {
	const [select, setSelect] = useState<CardData[]>([])
	const [isOpen, setIsOpen] = useState(false)

	const [selectedLesson, setSelectedLesson] = useState('')
	const [inputGroup, setInputGroup] = useState('')
	const [inputSearch, setInputSearch] = useState('')

	const { setFilter } = useCardStore()

	useEffect(() => {
		api.get('/api/groups?type_id=100').then(res => {
			setSelect(res.data.data)
		})

		const savedLessonId = localStorage.getItem('lessonId')
		const savedGroupId = localStorage.getItem('groupId')

		if (savedLessonId) {
			setSelectedLesson(savedLessonId)
			setFilter(savedLessonId, 'lesson')
		}

		if (savedGroupId) {
			setInputGroup(savedGroupId)
			setFilter(savedGroupId, 'group')
		}
	}, [])

	const handleSelectChange = (value: string) => {
		setSelectedLesson(value)
		setFilter(value, 'lesson')
		localStorage.setItem('lessonId', value)
	}

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value
		if (/^\d*$/.test(value)) {
			setInputGroup(value)
			setFilter(value, 'group')
			localStorage.setItem('groupId', value)
		}
	}

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value
		setInputSearch(value)

		if (value.trim().length >= 3) {
			setFilter(value, 'search')
		}

		if (value.trim().length === 0) {
			setFilter(null, null)
		}
	}

	const handleClearFilters = () => {
		setInputSearch('')
		setSelectedLesson('')
		setInputGroup('')
		setFilter(null, null)
		localStorage.removeItem('lessonId')
		localStorage.removeItem('groupId')
		setIsOpen(false)
		console.log('Filters cleared:', selectedLesson, inputGroup)
	}

	return (
		<div className='flex items-center gap-4'>
			<Button
				variant='secondary'
				disabled={!selectedLesson && !inputGroup && !inputSearch}
				size='lg'
				onClick={handleClearFilters}
			>
				Tozalash
			</Button>

			<Select
				open={isOpen}
				onOpenChange={setIsOpen}
				onValueChange={handleSelectChange}
				value={selectedLesson}
			>
				<SelectTrigger className='w-fit max-w-[500px]'>
					<SelectValue placeholder='Mavzuni tanlang' />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						{select.map(item => (
							<SelectItem key={item.id} value={item.id}>
								<span dangerouslySetInnerHTML={{ __html: item.name_uz }} />
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>

			<Input
				border
				type='number'
				value={inputGroup}
				onChange={handleInputChange}
				placeholder='Bilet raqami'
				className='w-48 h-8.5'
			/>

			<Input
				border
				type="text"
				value={inputSearch}
				onChange={handleSearchChange}
				placeholder='Qidiruv'
				className='w-48 h-8.5'
			/>
		</div>
	)
}
