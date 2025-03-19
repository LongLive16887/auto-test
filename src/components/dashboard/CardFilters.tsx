import api from '@/api/axios'
import { useCardStore } from '@/store/cards'
import { useEffect, useState } from 'react'
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

function CardFilters() {
	const [select, setSelect] = useState<CardData[]>([])
	const [inputValue, setInputValue] = useState('') 
	const { fetchData, setData } = useCardStore()

	useEffect(() => {
		api.get('/api/groups?type_id=100').then(res => {
			setSelect(res.data.data)
		})
	}, [])

	const handleSelectChange = (value: string) => {
		setData([])
		// setPage(0)
		fetchData(value)
	}

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value
		if (/^\d*$/.test(value)) {
			setInputValue(value)
			if (value) {
				setData([])
				// setPage(0)
				fetchData(value)
			}
		}
	}

	return (
		<div className='flex items-center gap-4'>
			<Select onValueChange={handleSelectChange}>
				<SelectTrigger className='w-fit max-w-[800px]'>
					<SelectValue placeholder='Mavzuni tanlang' />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						{select.map(item => (
							<SelectItem key={item.id} value={item.id}>
								{item.name_la}
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>

			<Input
			border
				type='text'

				value={inputValue}
				onChange={handleInputChange}
				placeholder='Введите group_id'
				className='w-fit'
			/>
		</div>
	)
}

export default CardFilters
