import api from '@/api/axios'
import DashboardCard from '@/components/dashboard/DashboardCard'
import { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import MainLayout from '../layout/MainLayout'
import { Loader2 } from 'lucide-react'

interface Answer {
	id: number
	answerRu: string
	answerUz: string
	answerLa: string
	isCorrect: boolean
}


interface CardData {
	id: number
	groupId: number
	answers: Answer[]
	media: string
	questionRu: string
	questionUz: string
	questionLa: string
	questionDescriptionRu: string
	questionDescriptionUz: string
	questionDescriptionLa: string
}

function Dashboard() {
	const [data, setData] = useState<CardData[]>([])
	const [page, setPage] = useState(0)
	const [hasMore, setHasMore] = useState(true)

	const fetchData = async () => {
		try {
			const res = await api.get(`/api/v1/question?page=${page}&size=10`)
			const newData = res.data.data.results

			if (newData.length > 0) {
				setData(prevData => [...prevData, ...newData])
				setPage(prevPage => prevPage + 1)
			} else {
				setHasMore(false) 
			}
		} catch (error) {
			console.error('Ошибка загрузки данных:', error)
		}
	}

	useEffect(() => {
		fetchData() 
	}, [])

	return (
		<MainLayout>
			<InfiniteScroll
				dataLength={data.length}
				next={fetchData}
				hasMore={hasMore}
				loader={<Loader2 className='animate-spin' />}
				endMessage={
					<p className='text-center text-gray-500'>Больше вопросов нет</p>
				}
				className='flex flex-wrap gap-4'
			>
				{data.map(item => (
					<DashboardCard key={item.id} cardData={item} />
				))}
			</InfiniteScroll>
		</MainLayout>
	)
}

export default Dashboard
