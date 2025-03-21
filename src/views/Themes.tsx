import api from '@/api/axios'
import EditTheme from '@/components/themes/EditTheme'
import ThemeCard from '@/components/themes/ThemeCard'
import MainLayout from '@/layout/MainLayout'
import { useThemeStore } from '@/store/theme'
import { useEffect, useState } from 'react'

const Themes = () => {
	const { data, fetchData } = useThemeStore()
	const [themeData, setThemeData] = useState(null)
	const [edit, setEdit] = useState(false)

	useEffect(() => {
		fetchData(100)
	}, [])

	const handleEdit = (id: number) => {
		setEdit(true)
		api.get(`api/groups/${id}`).then(res => {
			setThemeData(res.data.data)
		})
	}



	return (
		<MainLayout>
			<div className='flex flex-wrap gap-2'>
				{data.map(item => (
					<ThemeCard key={item.id} cardData={item} onEdit={handleEdit} />
				))}
			</div>
			{edit && themeData ? (
				<EditTheme
					isOpen={edit}
					onClose={() => setEdit(false)}
					themeData={themeData}
				/>
			) : null}
		</MainLayout>
	)
}

export default Themes
