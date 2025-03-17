import { MonitorX } from 'lucide-react'
import { Button } from '../ui/button'
import { Link } from 'react-router-dom'

const NotFoundAd = () => {
	return (
		<>
			<div className='w-full  bg-white flex flex-col items-center justify-center rounded-xl gap-5 p-10'>
				<MonitorX size={48} />
				<p className='text-xl font-semibold text-gray-700'>
					Sizda hali veb-saytlar yo'q
				</p>
				<Link to={'/adverstings/add'}>
				<Button>Qo'shish</Button>
				
				</Link>
			</div>
		</>
	)
}

export default NotFoundAd
