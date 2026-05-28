import DashboardCard from '@/components/dashboard/DashboardCard'
import EditColoredForm from '@/components/forms/EditColoredForm'
import ImageUpload from '@/components/forms/ImageUpload'
import AudioUpload from '@/components/forms/AudioUpload'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useColoredStore } from '@/store/colored'
import { useEditCardStore } from '@/store/editCard'
import { DialogTitle } from '@radix-ui/react-dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import MainLayout from '../layout/MainLayout'

export default function Colored() {
	const { data, fetchData, hasMore, filterId, filterType } = useColoredStore()
	const { isOpen, isImage, toggleIsImage, selectedId, fetchCardById, reset, currentCard, isAudio, toggleIsAudio } = useEditCardStore()

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
					<DashboardCard key={item.id} cardData={item} showColored />
				))}
			</InfiniteScroll>

			<Dialog open={isOpen} onOpenChange={handleDialogChange}>
				<DialogContent className='sm:max-w-[1460px]'>
					<VisuallyHidden>
						<DialogTitle>Редактирование вопроса</DialogTitle>
					</VisuallyHidden>
					{currentCard ? (
						<EditColoredForm />
					) : (
						<div className='flex justify-center p-8'>
							<Loader2 className='animate-spin' />
						</div>
					)}
				</DialogContent>
			</Dialog>

			<Dialog open={isImage} onOpenChange={toggleIsImage}>
				<DialogContent className='sm:max-w-[1460px]'>
					<VisuallyHidden>
						<DialogTitle>Редактирование вопроса</DialogTitle>
					</VisuallyHidden>
					<ImageUpload />
				</DialogContent>
			</Dialog>

			<Dialog open={isAudio} onOpenChange={toggleIsAudio}>
				<DialogContent>
					<VisuallyHidden>
						<DialogTitle>Редактирование вопроса</DialogTitle>
					</VisuallyHidden>
					<AudioUpload />
				</DialogContent>
			</Dialog>
		</MainLayout>
	)
}
