import api from '@/api/axios'
import { ExternalLink, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

type DataType = {
	id: number
	name: string
	logo: string
	domain: string
}

const AdMain = () => {
	const [data, setData] = useState<DataType | null>(null)
	console.log(data)
	let params = useParams()

	useEffect(() => {
		if (params.id) {
			api.get(`/api/v1/proma/project?id=${params.id}`).then(res => {
				setData(res.data.data);
			});
		}
	}, [params.id]);
	

	if (!data) {
		return (
			<div className='flex justify-center items-center h-40'>
				<Loader2 className='animate-spin w-10 h-10 text-primary' />
			</div>
		)
	}

	return (
		<div className='flex bg-white p-5 rounded-xl items-center justify-between mb-3.5'>
			<div className='flex items-center gap-4'>
				{/* <div className='bg-slate-50 rounded-xl p-2'></div> */}
					<img className='w-10 h-10 object-cover' src={data.logo} alt='' />
				<p className='font-semibold'>{data.name}</p>
			</div>

			<div className='flex flex-col gap-2'>
				<p className='text-gray-400'>Domain</p>
				<a href={`https://${data.domain}`} target='_blank' className='font-semibold text-sm flex items-center gap-1 hover:text-primary transition-all'>
					{data.domain}
					<ExternalLink className='w-4 h-4' />
				</a>
			</div>

			<p className='bg-gray-100 rounded-xl cursor-pointer py-2 px-3 font-semibold text-sm hover:bg-gray-200 transition-all'>
				ID: {data.id}
			</p>
		</div>
	)
}

export default AdMain
