import NewAdverForm from '../forms/NewAdverForm'

const AddNewAdver = () => {
	return (
		<div className='flex flex-col max-w-4xl gap-3.5'>
			<div className='bg-white rounded-xl p-5'>
				<NewAdverForm />
			</div>
		</div>
	)
}

export default AddNewAdver
