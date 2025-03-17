import AdInfo from '@/components/adversting/AdInfo'
import NotFoundUnits from '@/components/notfound/NotFoundUnits'
import MainLayout from '@/layout/MainLayout'

const AdView = () => {
	return (
		<MainLayout>
			<div className='flex flex-col gap-3.5'>
				<AdInfo />
				<NotFoundUnits />
			</div>
		</MainLayout>
	)
}

export default AdView
