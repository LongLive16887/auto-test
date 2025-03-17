import api from '@/api/axios'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../ui/button'
import { Checkbox } from '../ui/checkbox'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../ui/select'

type ParamType = {
	name: string
	type: string
	key: string
	values: string[]
	defaultValue?: string
}

type UnitType = {
	id: number
	name: string
	image: string
	description: string
	params: ParamType[]
}

const AdUnits = () => {
	const [selectedId, setSelectedId] = useState<number | null>(null)
	const [data, setData] = useState<UnitType[]>([])
	const [selectedParams, setSelectedParams] = useState<Record<string, string>>(
		{}
	)

	useEffect(() => {
		api.get('/api/v1/proma/parts').then(res => {
			setData(res.data.data)
			setSelectedId(res.data.data[0]?.id)
		})
	}, [])

	useEffect(() => {
		if (selectedId !== null) {
			const selectedAd = data.find(ad => ad.id === selectedId)
			if (!selectedAd) return

			const defaultParams = selectedAd.params.reduce((acc, param) => {
				acc[param.key] = param.defaultValue || ''
				return acc
			}, {} as Record<string, string>)

			setSelectedParams(defaultParams)
		}
	}, [selectedId])

	const handleToggle = (id: number) => {
		if (id !== selectedId) {
			setSelectedId(id)
			setSelectedParams({})
		}
	}

	const handleSelectChange = (paramKey: string, value: string) => {
		setSelectedParams(prev => ({ ...prev, [paramKey]: value }))
	}

	const handleSave = () => {
		if (!selectedId) return

		const selectedAd = data.find(ad => ad.id === selectedId)
		if (!selectedAd) return

		const paramsToSend = selectedAd.params.reduce((acc, param) => {
			acc[param.key] = selectedParams[param.key] || ''
			return acc
		}, {} as Record<string, string>)

		const payload = {
			id: selectedAd.id,
			params: paramsToSend,
		}

		console.log('data:', payload)
	}

	const selectedAd = data.find(ad => ad.id === selectedId)

	if (data.length === 0) {
		return (
			<div className='flex justify-center items-center h-40'>
				<Loader2 className='animate-spin w-10 h-10 text-primary' />
			</div>
		)
	}

	return (
		<div className='flex flex-col gap-3.5'>
			<div className='bg-white rounded-xl p-5'>
				<p className='text-xl font-semibold mb-5'>Blokning Ko'rinishi</p>
				<div className='flex flex-wrap gap-3.5'>
					{data.map(ad => (
						<div
							key={ad.id}
							className={cn(
								'w-[200px] outline-1 outline-gray-200 p-5 rounded-xl cursor-pointer',
								ad.id === selectedId && 'bg-gray-50 outline-none'
							)}
							onClick={() => handleToggle(ad.id)}
						>
							<div className='flex justify-between'>
								<img className='w-20 h-20' src={ad.image} alt='' />
								<Checkbox checked={selectedId === ad.id} />
							</div>
							<p className='text-gray-700 my-2'>{ad.name}</p>
							<p className='text-xs text-gray-700'>{ad.description}</p>
						</div>
					))}
				</div>
			</div>

			<div className='bg-white p-5 rounded-xl '>
				<p className='text-xl font-semibold mb-5'>Qo'shimcha sozlamalar</p>
				{selectedAd && (
					<div className='flex flex-col gap-3'>
						{selectedAd.params.map(param => (
							<div className='flex items-center gap-2' key={param.key}>
								<p className='text-gray-400 font-medium w-2xs'>{param.name}</p>
								<Select
									value={selectedParams[param.key]}
									onValueChange={value => handleSelectChange(param.key, value)}
								>
									<SelectTrigger className='w-2xs p-2 border rounded-'>
										<SelectValue placeholder='Tanlang' />
									</SelectTrigger>
									<SelectContent>
										{param.values.map(value => (
											<SelectItem key={value} value={value}>
												{value}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						))}
					</div>
				)}
			</div>

			<div className='flex gap-3.5'>
				<Button variant={'secondary'}>
					<Link to="/adverstings/add">Orqaga</Link>
				</Button>
				<Button onClick={handleSave}>Saqlash</Button>
			</div>
		</div>
	)
}

export default AdUnits
