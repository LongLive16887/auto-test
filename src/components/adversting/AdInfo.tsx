import logo from '@/assets/logo.png'
import { ExternalLink, Pencil } from 'lucide-react'
import { Button } from '../ui/button'

const AdInfo = () => {
	return (
		<div className='rounded-xl p-5 bg-white'>
			<div className='flex flex-col gap-8'>
				<div className='flex items-center justify-between'>
					<div className='flex items-center gap-4'>
						<img src={logo} alt='' className='w-12 h-12 object-cover' />
						<div className='flex flex-col gap-1'>
							<p className='flex items-center gap-3 font-semibold text-xl'>
								Site name
								<Pencil className='w-4 h-4' />
							</p>
							<div className='flex items-center gap-4'>
								<a
									href={'#'}
									target='_blank'
									className='text-sm flex items-center gap-1 hover:text-primary transition-all'
								>
									somethibg.com
									<ExternalLink className='w-4 h-4' />
								</a>
								<p className='font-bold text-xs text-green-500'>Active</p>
							</div>
						</div>
					</div>
					<p className='bg-gray-100 rounded-xl cursor-pointer py-2 px-3 font-semibold text-sm hover:bg-gray-200 transition-all'>
						ID: 2342342
					</p>
				</div>
				<div className='flex items-center gap-2'>
					<Button>
							Add new unit
					</Button>
					<Button variant={'secondary'}>
						Settings
					</Button>
					<Button variant={'secondary'}>
							Statistics
					</Button>
				</div>
			</div>
		</div>
	)
}

export default AdInfo
