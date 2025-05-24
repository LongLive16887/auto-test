import React, { useEffect, useState } from 'react'
import MediaThemeTailwindAudio from 'player.style/tailwind-audio/react';
import api from '@/api/axios'

interface AudioPlayerProps {
  fileId: string | null
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ fileId }) => {
  const [audioBlobUrl, setAudioBlobUrl] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string>('audio.mp3')
  const [fileSize, setFileSize] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (!fileId) return 

    const fetchAudio = async () => {
      setLoading(true)
      try {
        const response = await api.get(
          `/api/v1/file/download/audio/${fileId}`,
          { responseType: 'blob' }
        )

        const blob = response.data
        const url = URL.createObjectURL(blob)

        setAudioBlobUrl(url)
        setFileSize((blob.size / 1024).toFixed(2) + ' KB')
        setFileName(`audio-${fileId}.mp3`)
      } catch (error) {
        console.error('Ошибка загрузки аудио:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAudio()
  }, [fileId])

  if (!fileId) return null

  return (
    <div className="p-4 bg-white rounded-xl shadow w-full max-w-xl space-y-3">
      {loading && <p className="text-gray-500">Загрузка аудио...</p>}

      {!loading && audioBlobUrl && (
        <>
          <MediaThemeTailwindAudio style={{ width: '100%' }}>
            <audio
              slot="media"
              src={audioBlobUrl}
              controls
              playsInline
              crossOrigin="anonymous"
            />
          </MediaThemeTailwindAudio>

          <div className="text-sm text-gray-700">
            <p>{fileName} {fileSize}</p>
          </div>
        </>
      )}
    </div>
  )
}

export default AudioPlayer
