import api from '@/api/axios'
import { useCardStore } from '@/store/cards'
import { useEditSignStore } from '@/store/editSigns'
import imageCompression from 'browser-image-compression'
import { useRef, useState } from 'react'

const SignImageUpload = () => {
	const [preview, setPreview] = useState<string | null>(null)
	const [compressedPreview, setCompressedPreview] = useState<string | null>(
		null
	)
	const fileInputRef = useRef<HTMLInputElement>(null)
	const [quality, setQuality] = useState(0.98)
	const [imageLoading, setImageLoading] = useState(false)
	const [originalFile, setOriginalFile] = useState<File | null>(null)
	const [originalSize, setOriginalSize] = useState<string | null>(null)
	const [compressedSize, setCompressedSize] = useState<string | null>(null)
	const { putImage, reset, toggleIsImage } = useEditSignStore()
	const { fetchData, filterId, filterType } = useCardStore()

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return

		setOriginalFile(file)
		const tempPreview = URL.createObjectURL(file)
		setPreview(tempPreview)
		setCompressedPreview(tempPreview)
		setOriginalSize((file.size / 1024).toFixed(2) + ' KB')
	}

	const compressImage = async (file: File, quality: number) => {
		const options = {
			maxSizeMB: 1,
			maxWidthOrHeight: file.type === 'image/png' ? undefined : 1000,
			useWebWorker: true,
			initialQuality: quality,
		}

		try {
			const compressedBlob = await imageCompression(file, options)
			const compressedUrl = URL.createObjectURL(compressedBlob)
			setCompressedPreview(compressedUrl)
			setCompressedSize((compressedBlob.size / 1024).toFixed(2) + ' KB')
		} catch (error) {
			console.error('Compression failed:', error)
		}
	}

	const handleUpload = async () => {
		if (!compressedPreview) return

		setImageLoading(true)
		try {
			const response = await fetch(compressedPreview)
			const blob = await response.blob()

			const file = new File([blob], originalFile?.name || 'compressed.jpg', {
				type: blob.type,
			})

			const formData = new FormData()
			formData.append('file', file)

			const uploadResponse = await api.post('/api/v1/file/upload', formData, {
				headers: { 'Content-Type': 'multipart/form-data' },
			})
			const compressedId = uploadResponse.data.data.file_id
			putImage(compressedId)
			toggleIsImage()
			reset()
			fetchData(filterId ?? undefined, filterType ?? undefined)
		} catch (error) {
			console.error('Upload failed:', error)
		} finally {
			setImageLoading(false)
		}
	}

	return (
		<div className='flex flex-col items-center gap-4'>
			<input
				type='file'
				accept='image/*'
				onChange={handleFileChange}
				ref={fileInputRef}
				className='hidden'
				disabled={imageLoading}
			/>
			<button
				onClick={() => fileInputRef.current?.click()}
				className='bg-blue-500 text-white self-start mb-3 px-4 py-2 rounded-md hover:bg-blue-600'
			>
				Rasm tanlang
			</button>
			{preview && (
				<div className='flex flex-col gap-4'>
					<div className='flex gap-4'>
						<div className='flex flex-col items-center'>
							<img
								src={preview}
								alt='Original'
								className='w-2xl h-xl object-cover'
							/>
							{originalSize && (
								<p className='text-sm text-gray-600'>
									Original: {originalSize}
								</p>
							)}
						</div>
						<div className='flex flex-col items-center'>
							{compressedPreview && (
								<img
									src={compressedPreview}
									alt='Compressed'
									className='w-2xl h-xl object-cover'
								/>
							)}
							{compressedSize && (
								<p className='text-sm text-gray-600'>
									Compressed: {compressedSize}
								</p>
							)}
						</div>
					</div>
				</div>
			)}
			{preview && (
				<input
					type='range'
					min='0.1'
					max='0.98'
					step='0.01'
					value={quality}
					onChange={e => {
						const newQuality = parseFloat(e.target.value)
						setQuality(newQuality)
						if (originalFile) compressImage(originalFile, newQuality)
					}}
					className='w-full'
				/>
			)}
			{compressedPreview && (
				<button
					onClick={handleUpload}
					className='bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 '
					disabled={imageLoading}
				>
					{imageLoading ? 'Yuklanmoqda...' : 'Rasmni yuklash'}
				</button>
			)}
		</div>
	)
}

export default SignImageUpload
