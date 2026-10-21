import { useState } from 'react'
import { getYouTubeId } from '../lib/youtube'

export default function YouTubePlayer({ url, start = 0 }) {
  const id = getYouTubeId(url)
  const [playing, setPlaying] = useState(false)
  const [thumb, setThumb] = useState(`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`)

  if (!id) return <p className="text-sm text-red-600">This video link is invalid.</p>

  if (playing) {
    return (
      <div className="relative aspect-video overflow-hidden rounded-xl bg-black">
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${id}?start=${start}&autoplay=1&rel=0&modestbranding=1&playsinline=1`}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          title="Lecture video"
        />
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      className="group relative block aspect-video w-full overflow-hidden rounded-xl bg-black"
      aria-label="Play video"
    >
      <img
        src={thumb}
        alt=""
        loading="lazy"
        // maxres na mile to hqdefault use karo
        onError={() => setThumb(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`)}
        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
      />
      <span className="absolute inset-0 bg-black/10 transition group-hover:bg-black/25" />
      <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brand-red text-white shadow-xl transition group-hover:scale-110 sm:h-16 sm:w-16">
        <svg viewBox="0 0 24 24" fill="currentColor" className="ml-1 h-6 w-6 sm:h-7 sm:w-7">
          <path d="M8 5v14l11-7z" />
        </svg>
      </span>
    </button>
  )
}