import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import VideoCard from '../components/VideoCard'

function Skeleton() {
  return (
    <div className="animate-pulse space-y-3 rounded-xl border border-gray-200 bg-white p-4">
      <div className="aspect-video rounded-lg bg-gray-200" />
      <div className="h-4 w-2/3 rounded bg-gray-200" />
      <div className="h-3 w-full rounded bg-gray-100" />
    </div>
  )
}

export default function ClassPage() {
  const { level } = useParams()
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    supabase
      .from('chapters')
      .select('id, created_at, videos(*)')
      .eq('class_level', Number(level))
      .order('created_at')
      .then(({ data }) => {
        const all = (data ?? []).flatMap((ch) => ch.videos)
        all.sort((a, b) => a.created_at.localeCompare(b.created_at))
        setVideos(all)
        setLoading(false)
      })
  }, [level])

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold text-brand-maroon">Class {level}</h1>
      <div className="mb-8 mt-2 h-1 w-14 rounded bg-brand-gold" />

      {loading && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </div>
      )}

      {!loading && videos.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500">
          No lectures have been added for this class yet.
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((v) => (
          <VideoCard key={v.id} video={v} />
        ))}
      </div>
    </div>
  )
}