import { useCardStore } from '@/store/cards'
import { useColoredStore } from '@/store/colored'
import { useUserStore } from '@/store/user'
import CreateCard from './dashboard/CreateCard'
import CreateTheme from './themes/CreateTheme'

import CardFilters from './dashboard/CardFilters'
import { SidebarTrigger } from './ui/sidebar'
import CreateSign from './signs/CreateSign'

const titles: Record<string, string> = {
	'/': 'Savollar',
	'/adverstings': 'Saytdagi Reklamalar',
	'/themes': 'Mavzular',
	'/adverstings/add': 'Sayt yaratish',
	'/signs': 'Belgilar',
	'/colored': 'Kalit so\'zlar',
}

const AppNav = () => {
	const { userRoles } = useUserStore()
	const { setFilter: setCardFilter } = useCardStore()
	const { setFilter: setColoredFilter } = useColoredStore()
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
				{location.pathname === '/' ? <CardFilters setFilter={setCardFilter} /> : null}
				{location.pathname === '/colored' ? <CardFilters setFilter={setColoredFilter} storagePrefix='colored_' /> : null}

				{userRoles.includes('WRITE') && location.pathname === '/' ? (
					<CreateCard />
				) : null}
				{userRoles.includes('WRITE') && location.pathname === '/themes' ? (
					<CreateTheme />
				) : null}

				{userRoles.includes('WRITE') && location.pathname === '/signs' ? (
					<CreateSign />
				) : null}
				{userRoles.includes('WRITE') && location.pathname === '/colored' ? (
					<CreateSign />
				) : null}
			</div>
		</div>
	)
}

export default AppNav
