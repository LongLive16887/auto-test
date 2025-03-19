import Logo from '@/assets/logo.png'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui/sidebar'
import { useUserStore } from '@/store/user'
import {
	ChevronUp,
	Lightbulb,
	MessageCircleQuestion,
	User2,
} from 'lucide-react'

const items = [
	{ title: 'Savollar', url: '/', icon: MessageCircleQuestion },
	// { title: 'Saytdagi Reklamalar', url: '/adverstings', icon: Monitor },
	{ title: 'Mavzular', url: '/themes', icon: Lightbulb },
]

const AppSidebar = () => {
	const { user, lougoutUser } = useUserStore()

	return (
		<Sidebar variant='inset' collapsible='icon'>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton>
							<a href='/' className='flex items-center gap-2'>
								<img src={Logo} alt='' className='w-fit max-h-5' />
								<span className='font-bold whitespace-nowrap'>
									{' '}
									AutoTest ADMIN
								</span>
							</a>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							{items.map(item => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton
										isActive={
											item.url === '/'
												? location.pathname === '/'
												: location.pathname.startsWith(item.url)
										}
										asChild
									>
										<a href={item.url} className='font-semibold text-sm'>
											<item.icon />
											<span>{item.title}</span>
										</a>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<SidebarMenuButton>
									<User2 />
									<span>{user.username}</span>
									<ChevronUp className='ml-auto' />
								</SidebarMenuButton>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								side='right'
								className='w-[--radix-popper-anchor-width]'
							>
								<DropdownMenuItem>
									<span>Account</span>
								</DropdownMenuItem>
								<DropdownMenuItem>
									<span>Billing</span>
								</DropdownMenuItem>
								<DropdownMenuItem>
									<span
										onClick={() => {
											lougoutUser()
										}}
									>
										Sign out
									</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	)
}

export default AppSidebar
