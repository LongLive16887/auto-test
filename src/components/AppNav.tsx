import api from '@/api/axios'
import { useUserStore } from '@/store/user'
import { useEffect, useState } from 'react'
import CreateCard from './dashboard/CreateCard'
import CreateTheme from './themes/CreateTheme'
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from './ui/select'
import { SidebarTrigger } from './ui/sidebar'

const titles: Record<string, string> = {
	'/': 'Savollar',
	'/adverstings': 'Saytdagi Reklamalar',
	'/themes': 'Mavzular',
	'/adverstings/add': 'Sayt yaratish',
}

interface CardData {
	id: string
	type_id: number
	name_ru: string
	name_la: string
	name_uz: string
	image: string
}

const AppNav = () => {
	const { userRoles } = useUserStore()
	let title = titles[location.pathname]

	if (location.pathname.startsWith('/adverstings/add/new-unit/')) {
		title = 'Blok yaratish'
	} else if (location.pathname.startsWith('/adverstings/')) {
		title = "Sayt haqida ma'lumot"
	}
	const [select, setSelect] = useState<CardData[]>([])

	useEffect(() => {
		api.get('/api/groups?type_id=100').then(res => {
			setSelect(res.data.data)
		})
	}, [])



	return (
		<div className='bg-white rounded-xl p-5 flex justify-between mb-3.5 item-center'>
			<div className='flex items-center gap-1'>
				<SidebarTrigger />
				<p className='font-semibold text-xl text-center'>{title}</p>
			</div>
			<div className='flex items-center gap-3'>
				<div>
					<Select>
						<SelectTrigger className='w-fit max-w-[800px]'>
							<SelectValue placeholder='Mavzuni tanlang' />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								{select.map(item => (
									<SelectItem key={item.id} value={item.id}>
										{item.name_la}
									</SelectItem>
								))}
							</SelectGroup>
						</SelectContent>
					</Select>
				</div>
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
