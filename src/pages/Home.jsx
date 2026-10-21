import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import VideoCard from '../components/VideoCard'
import heroImg from '../assets/home.png'

const classes = [
  { level: 11, text: 'Concepts, reactions and numericals, chapter by chapter.' },
  { level: 12, text: 'Complete boards and competitive exam preparation.' },
]

function Skeleton() {
  return (
    <div className="animate-pulse space-y-3 rounded-xl border border-gray-200 bg-white p-4">
      <div className="aspect-video rounded-lg bg-gray-200" />
      <div className="h-4 w-2/3 rounded bg-gray-200" />
    </div>
  )
}

export default function Home() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('videos')
      .select('*')
      .eq('is_featured', true)
      .order('featured_order')
      .then(({ data }) => {
        setVideos(data ?? [])
        setLoading(false)
      })
  }, [])

  return (
    <div>
      {/* Hero */}
      <section
        className="relative bg-cover bg-center text-white md:bg-right"
        style={{ backgroundImage: `url(${heroImg})` }}
      >
        <div className="absolute inset-0 bg-brand-maroon-dark/60 md:bg-transparent md:bg-gradient-to-r md:from-brand-maroon-dark/85 md:via-brand-maroon-dark/50 md:via-40% md:to-transparent md:to-65%" />

        <div className="relative mx-auto max-w-6xl px-4 pb-24 pt-14 sm:px-6 sm:pb-32 sm:pt-20">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-brand-gold">
            Patna No 1 Chemistry Class
          </p>
          <h1 className="max-w-xl text-3xl font-bold leading-tight drop-shadow-lg sm:text-5xl">
            Understand Chemistry,
            <br className="hidden sm:block" /> don't just memorise it.
          </h1>
          <p className="mt-4 max-w-lg text-base drop-shadow-md sm:text-lg">
            Class 11 and 12 lectures by Dr. Madhuresh Sir, organised chapter by chapter.
            Watch anytime, anywhere.
          </p>
        </div>
      </section>

      {/* Class cards */}
      <section className="relative mx-auto -mt-10 max-w-6xl px-4 sm:-mt-12 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2">
          {classes.map((c) => (
            <Link
              key={c.level}
              to={`/class/${c.level}`}
              className="group flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-md transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-brand-maroon text-xl font-bold text-white sm:h-14 sm:w-14 sm:text-2xl">
                {c.level}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-bold text-brand-maroon">Class {c.level}</h2>
                <p className="text-xs text-gray-600 sm:text-sm">{c.text}</p>
              </div>
              <span className="text-xl text-brand-red transition group-hover:translate-x-1">→</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Mixed lectures */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        <div className="mb-8 max-w-2xl">
          <h2 className="text-2xl font-bold text-brand-maroon sm:text-3xl">
            Top Picks for Class 11 &amp; 12
          </h2>
          <div className="mt-2 h-1 w-14 rounded bg-brand-gold" />
          <p className="mt-4 text-gray-600">
            A handpicked mix of lectures from both classes, chosen to help you get started.
            For every chapter of a specific class, open{' '}
            <Link to="/class/11" className="font-semibold text-brand-red hover:underline">
              Class 11
            </Link>{' '}
            or{' '}
            <Link to="/class/12" className="font-semibold text-brand-red hover:underline">
              Class 12
            </Link>
            .
          </p>
        </div>

        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </div>
        )}

        {!loading && videos.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500">
            New lectures are coming soon.
          </div>
        )}

        <div className="grid items-start gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((v) => (
            <VideoCard key={v.id} video={v} />
          ))}
        </div>
      </section>
    </div>
  )
}