import AdMain from '@/components/adversting/AdMain'
import AdUnits from '@/components/adversting/AdUnits'
import MainLayout from '@/layout/MainLayout'

const AdNewUnit = () => {
	return (
		<MainLayout>
			<div className='max-w-4xl'>
				<AdMain />
				<AdUnits />
			</div>
		</MainLayout>
	)
}

export default AdNewUnit
