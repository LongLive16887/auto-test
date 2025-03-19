import DashboardCard from '@/components/dashboard/DashboardCard'
import { useCardStore } from '@/store/cards'
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import MainLayout from '../layout/MainLayout'

function Dashboard() {
	const { data, fetchData, hasMore } = useCardStore()

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
				className='flex flex-wrap gap-3.5'
			>
				{data.map(item => (
					<DashboardCard key={item.id} cardData={item} />
				))}
			</InfiniteScroll>
		</MainLayout>
	)
}

export default Dashboard
