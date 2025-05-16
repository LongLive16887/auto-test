import api from '@/api/axios'
import EditSignForm from '@/components/forms/EditSignForm'
import SignImageUpload from '@/components/forms/SignImageUpload'
import SignCard from '@/components/signs/SignCard'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useEditSignStore } from '@/store/editSigns'
import { DialogTitle } from '@radix-ui/react-dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import MainLayout from '../layout/MainLayout'

export default function Signs() {
	const [data, setData] = useState<any[]>([])
	const [hasMore, setHasMore] = useState(true)
	const [page, setPage] = useState(1)

	function fetchData() {
		api
			.get(`api/v1/signs?page=${page}`)
			.then(res => {
				const newData = res.data.data
				if (newData.length === 0) {
					setHasMore(false)
				} else {
					setData(prev => [...prev, ...newData])
					setPage(prev => prev + 1)
				}
			})
			.catch(error => {
				console.error(error)
				setHasMore(false)
			})
	}

	const {
		isOpen,
		isImage,
		toggleIsImage,
		toggleIsOpen,
		selectedId,
		fetchCardById,
		reset,
		currentCard,
	} = useEditSignStore()

	useEffect(() => {
		fetchData()
	}, [])

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
				next={fetchData}
				hasMore={hasMore}
				loader={<Loader2 className='animate-spin' />}
				endMessage={
					<p className='text-center text-gray-500'>Больше вопросов нет</p>
				}
				className='flex flex-wrap gap-3.5'
			>
				{data.map(item => (
					<SignCard key={item.id} cardData={item} />
				))}
			</InfiniteScroll>

			<Dialog open={isOpen} onOpenChange={handleDialogChange}>
				<DialogContent className='sm:max-w-[1460px]'>
					<VisuallyHidden>
						<DialogTitle>Редактирование вопроса</DialogTitle>
					</VisuallyHidden>
					{currentCard ? (
						<EditSignForm themeData={currentCard} onClose={toggleIsOpen} />
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
					<SignImageUpload />
				</DialogContent>
			</Dialog>
		</MainLayout>
	)
}
