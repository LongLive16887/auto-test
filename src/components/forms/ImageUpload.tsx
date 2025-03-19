import api from '@/api/axios'
import { useRef, useState } from 'react'

const ImageUpload = () => {
	const [preview, setPreview] = useState<string | null>(null)
	const [compressedPreview, setCompressedPreview] = useState<string | null>(
		null
	)
	const fileInputRef = useRef<HTMLInputElement>(null)
	const [quality, setQuality] = useState(0.98)
	const [imageLoading, setImageLoading] = useState(false)

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return

		const tempPreview = URL.createObjectURL(file)
		setPreview(tempPreview)
		compressImage(file, quality)
	}

	const compressImage = (file: File, quality: number) => {
		const reader = new FileReader()
		reader.readAsDataURL(file)
		reader.onload = (event) => {
			const img = new Image()
			img.src = event.target?.result as string
			img.onload = () => {
				const canvas = document.createElement('canvas')
				const ctx = canvas.getContext('2d')
	
				// Динамический коэффициент уменьшения
				const resizingFactor = img.width > 1000 ? 0.5 : 0.8
	
				canvas.width = img.width * resizingFactor
				canvas.height = img.height * resizingFactor
				ctx?.drawImage(img, 0, 0, canvas.width, canvas.height)
	
				// Отладка размеров
				console.log(`Original: ${img.width}x${img.height}, Resized: ${canvas.width}x${canvas.height}`)
	
				canvas.toBlob(
					(blob) => {
						if (blob) {
							console.log('Original Size:', (file.size / 1024).toFixed(2), 'KB')
							console.log('Compressed Size:', (blob.size / 1024).toFixed(2), 'KB')
							setCompressedPreview(URL.createObjectURL(blob))
						}
					},
					'image/jpeg',
					quality
				)
			}
		}
	}
	

	const handleUpload = async () => {
		if (!compressedPreview) return

		setImageLoading(true)
		try {
			const response = await fetch(compressedPreview)
			const blob = await response.blob()
			const formData = new FormData()
			formData.append('file', blob, 'compressed.jpg')

			const uploadResponse = await api.post('/api/v1/file/upload', formData, {
				headers: { 'Content-Type': 'multipart/form-data' },
			})
			console.log('Upload successful:', uploadResponse.data)
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
				className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600'
			>
				Выбрать изображение
			</button>
			{preview && (
				<div className='flex gap-4'>
					<img
						src={preview}
						alt='Original'
						className='w-2xl h-xl object-cover'
					/>
					{compressedPreview && (
						<img
							src={compressedPreview}
							alt='Compressed'
							className='w-2xl h-xl object-cover'
						/>
					)}
				</div>
			)}
			{preview && (
				<input
					type='range'
					min='0.1'
					max='0.98'
					step='0.05'
					value={quality}
					onChange={e => {
						const newQuality = parseFloat(e.target.value)
						setQuality(newQuality)
						compressImage(fileInputRef.current?.files?.[0] as File, newQuality)
					}}
				/>
			)}
			{compressedPreview && (
				<button
					onClick={handleUpload}
					className='bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600'
					disabled={imageLoading}
				>
					{imageLoading ? 'Загрузка...' : 'Загрузить изображение'}
				</button>
			)}
		</div>
	)
}

export default ImageUpload
