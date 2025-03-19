import api from '@/api/axios'
import EditTheme from '@/components/themes/EditTheme'
import ThemeCard from '@/components/themes/ThemeCard'
import MainLayout from '@/layout/MainLayout'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'

interface themeType {
	id: number
	type_id: number
	name_ru: string
	name_la: string
	name_uz: string
	image: string
}

const Themes = () => {
	const [data, setData] = useState<themeType[]>([]);
	const [themeData, setThemeData] = useState(null); 
	const [edit, setEdit] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		api
			.get('/api/groups?type_id=100')
			.then((res) => {
				setData(res.data.data);
			})
			.finally(() => setLoading(false));
	}, []);

	const handleEdit = (id: number) => {
		setEdit(true);
		api.get(`api/groups/${id}`).then((res) => {
			setThemeData(res.data.data);
		});
	};

	if (loading) {
		return (
			<div className='flex justify-center items-center h-screen'>
				<Loader2 className='animate-spin text-gray-500 w-10 h-10' />
			</div>
		);
	}

	return (
		<MainLayout>
			<div className='flex flex-wrap gap-2'>
				{data.map((item) => (
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
	);
};

export default Themes;
