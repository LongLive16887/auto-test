import DashboardCard from '@/components/dashboard/DashboardCard'
import EditCardForm from '@/components/forms/EditCardForm'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useCardStore } from '@/store/cards'
import { useEditCardStore } from '@/store/editCard'
import { DialogTitle } from '@radix-ui/react-dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import MainLayout from '../layout/MainLayout'

export default function Dashboard() {
	const { data, fetchData, hasMore, filterId, filterType } = useCardStore()
	const { isOpen, selectedId, fetchCardById, reset, currentCard } =
		useEditCardStore()

	useEffect(() => {
		fetchData(filterId ?? undefined, filterType ?? undefined)
	}, [filterId, filterType])

	const handleDialogChange = async (open: boolean) => {
		if (!open) {
			reset()
		} else if (selectedId) {
			await fetchCardById(selectedId)
		}
	}

	return (
		<MainLayout>
			<InfiniteScroll
				dataLength={data.length}
				next={() => fetchData(filterId ?? undefined, filterType ?? undefined)}
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

			<Dialog open={isOpen} onOpenChange={handleDialogChange}>
				<DialogContent className='sm:max-w-[1460px]'>
					<VisuallyHidden>
						<DialogTitle>Редактирование вопроса</DialogTitle>
					</VisuallyHidden>
					{currentCard ? (
						<EditCardForm />
					) : (
						<div className='flex justify-center p-8'>
							<Loader2 className='animate-spin' />
						</div>
					)}
				</DialogContent>
			</Dialog>
		</MainLayout>
	)
}
