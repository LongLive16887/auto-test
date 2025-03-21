import { ReactNode } from 'react'
import AppFooter from '@/components/AppFooter'
import AppNav from '@/components/AppNav'
import AppSidebar from '@/components/AppSidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
interface MainLayoutProps {
	children: ReactNode
}

function MainLayout({ children }: MainLayoutProps) {


	return (
		<SidebarProvider>
			<AppSidebar />
			<div className='p-3.5 w-full flex flex-col justify-between'>
				<div>
					<AppNav />
					{children}
				</div>
				<AppFooter />
			</div>
		</SidebarProvider>
	)
}

export default MainLayout
