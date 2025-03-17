import AdTable from '@/components/adversting/AdTable'
import NotFoundAd from '@/components/notfound/NotFoundAd'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import MainLayout from '@/layout/MainLayout'

const Adverstings = () => {
	const websites = true
	return (
		<MainLayout>
			<div className='w-full flex flex-col'>
				<div className='flex w-full items-center gap-3.5 mb-3.5'>
					<Input
						type='text'
						placeholder='Search for advertisements...'
						className='bg-white'
					/>
					<Select>
						<SelectTrigger className='w-[180px] bg-white'>
							<SelectValue placeholder='Status' />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectItem value='apple'>Apple</SelectItem>
								<SelectItem value='banana'>Banana</SelectItem>
								<SelectItem value='blueberry'>Blueberry</SelectItem>
								<SelectItem value='grapes'>Grapes</SelectItem>
								<SelectItem value='pineapple'>Pineapple</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
				</div>
				{websites ? <AdTable /> : <NotFoundAd />}
			</div>
		</MainLayout>
	)
}

export default Adverstings
