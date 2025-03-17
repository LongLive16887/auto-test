import { useLocation } from 'react-router-dom'
// import { Button } from './ui/button'
import { SidebarTrigger } from './ui/sidebar'
// import { CirclePlus } from 'lucide-react'

const titles: Record<string, string> = {
	'/': 'Savollar',
	'/adverstings': 'Saytdagi Reklamalar',
	'/notifications': 'Bildirishnomalar',
	'/adverstings/add': 'Sayt yaratish',
}

const AppNav = () => {
	const location = useLocation()
	let title = titles[location.pathname]

	if (location.pathname.startsWith('/adverstings/add/new-unit/')) {
		title = 'Blok yaratish'
	} else if (location.pathname.startsWith('/adverstings/')) {
		title = "Sayt haqida ma'lumot"
	}

	return (
		<div className='bg-white rounded-xl p-5 flex justify-between mb-3.5 item-center'>
			<div className='flex items-center gap-1'>
				<SidebarTrigger />
				<p className='font-semibold text-xl text-center'>{title}</p>
			</div>
			{/* {location.pathname === '/' ? (
				<Link to='/'>
					<Button>
							<CirclePlus />
						</Button>
				</Link>
			) : null} */}
		</div>
	)
}

export default AppNav
