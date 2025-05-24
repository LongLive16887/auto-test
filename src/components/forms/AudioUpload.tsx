import api from '@/api/axios'
import { useCardStore } from '@/store/cards'
import { useEditCardStore } from '@/store/editCard'
import { useRef, useState } from 'react'
import MediaThemeTailwindAudio from 'player.style/tailwind-audio/react';

const UploadAudio = () => {
    const [preview, setPreview] = useState<string | null>(null)
    const [fileName, setFileName] = useState<string | null>(null)
    const [fileSize, setFileSize] = useState<string | null>(null)
    const [audioLoading, setAudioLoading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const { putAudio, reset, toggleIsAudio } = useEditCardStore()
    const { fetchData, filterId, filterType } = useCardStore()

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setFileName(file.name)
        setFileSize((file.size / 1024).toFixed(2) + ' KB')
        const audioURL = URL.createObjectURL(file)
        setPreview(audioURL)
    }

    const handleUpload = async () => {
        if (!preview || !fileInputRef.current?.files?.[0]) return
        const audioFile = fileInputRef.current.files[0]

        setAudioLoading(true)
        try {
            const formData = new FormData()
            formData.append('file', audioFile)

            const uploadResponse = await api.post('/api/v1/file/upload/audio', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })
            const uploadedId = uploadResponse.data.data.file_id
            putAudio(uploadedId)
            toggleIsAudio()
            reset()
            fetchData(filterId ?? undefined, filterType ?? undefined)
        } catch (error) {
            console.error('Audio upload failed:', error)
        } finally {
            setAudioLoading(false)
        }
    }

    return (
        <div className='flex flex-col items-center gap-4'>
            <input
                type='file'
                accept='audio/*'
                onChange={handleFileChange}
                ref={fileInputRef}
                className='hidden'
                disabled={audioLoading}
            />
            <button
                onClick={() => fileInputRef.current?.click()}
                className='bg-blue-500 text-white self-start mb-3 px-4 py-2 rounded-md hover:bg-blue-600'
            >
                Audio tanlang
            </button>

            {preview && (
                <div className='flex flex-col items-center gap-2 w-full'>
                    <MediaThemeTailwindAudio 
                    style={{ width: "100%" }}>
                        <audio
                            slot="media"
                            src={preview ?? undefined}
                            playsInline
                            crossOrigin="anonymous"
                        ></audio>
                    </MediaThemeTailwindAudio>
                    {fileName && <p className='text-sm'>Nomi: {fileName}</p>}
                    {fileSize && <p className='text-sm'>Hajmi: {fileSize}</p>}
                </div>
            )}

            {preview && (
                <button
                    onClick={handleUpload}
                    className='bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600'
                    disabled={audioLoading}
                >
                    {audioLoading ? 'Yuklanmoqda...' : 'Audio yuklash'}
                </button>
            )}
        </div>
    )
}

export default UploadAudio
