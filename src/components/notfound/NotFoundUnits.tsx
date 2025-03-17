import { MonitorX } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../ui/button'

const NotFoundUnits = () => {
	return (
		<>
			<div className='w-full  bg-white flex flex-col items-center justify-center rounded-xl gap-5 p-10'>
				<MonitorX size={48} />
				<p className='text-xl font-semibold text-gray-700'>
					Saytga tegishli blok topilpmadi
				</p>
				<Button>
					<Link to={'/adverstings/add'}>Qo'shish</Link>
				</Button>
			</div>
		</>
	)
}

export default NotFoundUnits
