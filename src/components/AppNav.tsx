import { useUserStore } from '@/store/user'
import CreateCard from './dashboard/CreateCard'
import CreateTheme from './themes/CreateTheme'

import CardFilters from './dashboard/CardFilters'
import { SidebarTrigger } from './ui/sidebar'

const titles: Record<string, string> = {
	'/': 'Savollar',
	'/adverstings': 'Saytdagi Reklamalar',
	'/themes': 'Mavzular',
	'/adverstings/add': 'Sayt yaratish',
	'/signs': 'Belgilar',
}

const AppNav = () => {
	const { userRoles } = useUserStore()
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
			<div className='flex items-center gap-3'>
				{location.pathname === '/' ? <CardFilters /> : null}

				{userRoles.includes('WRITE') && location.pathname === '/' ? (
					<CreateCard />
				) : null}
				{userRoles.includes('WRITE') && location.pathname === '/themes' ? (
					<CreateTheme />
				) : null}
			</div>
		</div>
	)
}

export default AppNav
