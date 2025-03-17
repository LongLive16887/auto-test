import api from '@/api/axios'
import Logo from '@/assets/logo.png'
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { Loader2, MonitorPlay } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../ui/button'

type DataType = {
	id: number
	name: string
	domain: string
}

const AdTable = () => {
	const [data, setData] = useState<DataType[] | null>(null)

	useEffect(() => {
		api.get('/api/v1/proma/projects').then(res => {
			setData(res.data.data)
		})
	}, [])

	if (!data) {
		return (
			<div className='flex justify-center items-center h-40'>
				<Loader2 className='animate-spin w-10 h-10 text-primary' />
			</div>
		)
	}

	return (
		<Table>
			<TableCaption>A list of your recent invoices.</TableCaption>
			<TableHeader>
				<TableRow>
					<TableHead className='w-[400px]'>Site</TableHead>
					<TableHead className='text-center'>Status</TableHead>
					<TableHead className='text-right'>Ad units</TableHead>
					<TableHead className='text-right'>Settings</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{data.map(row => (
					<TableRow key={row.id}>
						<TableCell className='font-medium'>
							<div className='flex gap-3'>
								<div className='p-2 bg-slate-50 rounded-xl'>
									<img src={Logo} alt='' className='w-10 h-10 object-cover' />
								</div>
								<div className='flex flex-col gap-0.5'>
									<Link to={`/adverstings/${row.id}`} className='hover:text-primary transition-all cursor-pointer'>
										{row.name}
									</Link>
									<div className='flex items-center gap-2 text-xs'>
										<span className='hover:text-primary transition-all cursor-pointer'>
											ID: {row.id}
										</span>
										<span>-</span>
										<a
											href={`https://${row.domain}`}
											target='_blank'
											className='hover:text-primary transition-all cursor-pointer'
										>
											{row.domain}
										</a>
									</div>
									<div className='flex items-center gap-2 text-xs'>
										<Link to={`/adverstings/${row.id}`} className='hover:text-primary transition-all cursor-pointer'>
											View
										</Link>
										<span className='hover:text-primary transition-all cursor-pointer'>
											Edit
										</span>
										<span className='hover:text-primary transition-all cursor-pointer'>
											Statistics
										</span>
										<span className='hover:text-primary transition-all cursor-pointer'>
											More
										</span>
									</div>
								</div>
							</div>
						</TableCell>
						<TableCell className='text-center'>
							<div className='flex justify-center'>
								<div className='flex flex-col gap-1.5 items-start'>
									<div className='flex justify-center items-center gap-1.5'>
										<MonitorPlay className='w-4 h-4 text-green-500' />
										<span>Active</span>
									</div>
									<span className='text-xs hover:text-red-500 transition-all cursor-pointer'>
										Stop ad
									</span>
								</div>
							</div>
						</TableCell>
						<TableCell className='text-right'>
							<Button variant={'secondary'} size={'sm'}>
								<Link to={`/adverstings/add/new-unit/${row.id}`}>Add</Link>
							</Button>
						</TableCell>
						<TableCell className='text-right'>-----</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	)
}

export default AdTable
