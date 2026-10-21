import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import useAuth from '../../hooks/useAuth'
import ChapterForm from '../../components/ChapterForm'
import VideoForm from '../../components/VideoForm'
import { formatTime, getYouTubeId } from '../../lib/youtube'

function Stat({ label, value }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-brand-maroon">{value}</p>
    </div>
  )
}

function Empty({ children }) {
  return (
    <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500">
      {children}
    </div>
  )
}

export default function Dashboard() {
  const { session } = useAuth()
  const navigate = useNavigate()

  const [tab, setTab] = useState('videos')
  const [level, setLevel] = useState('all')
  const [query, setQuery] = useState('')
  const [chapters, setChapters] = useState([])
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null) // { type: 'chapter' | 'video', item }

  const load = useCallback(async () => {
    const [ch, vd] = await Promise.all([
      supabase.from('chapters').select('*').order('class_level').order('created_at'),
      supabase
        .from('videos')
        .select('*, chapters(class_level, title)')
        .order('created_at', { ascending: false }),
    ])
    setChapters(ch.data ?? [])
    setVideos(vd.data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function signOut() {
    await supabase.auth.signOut()
    navigate('/')
  }

  async function toggleFeatured(v) {
    const { error } = await supabase
      .from('videos')
      .update({ is_featured: !v.is_featured })
      .eq('id', v.id)
    if (error) alert(error.message)
    load()
  }

  async function removeVideo(v) {
    if (!confirm(`Delete "${v.title}"?\n\nThis action cannot be undone.`)) return
    const { error } = await supabase.from('videos').delete().eq('id', v.id)
    if (error) alert(error.message)
    load()
  }

  async function removeChapter(c) {
    const count = videos.filter((v) => v.chapter_id === c.id).length
    const warn = count ? `\n\nThis will also delete ${count} video(s) inside this chapter.` : ''
    if (!confirm(`Delete "${c.title}"?${warn}\n\nThis action cannot be undone.`)) return
    const { error } = await supabase.from('chapters').delete().eq('id', c.id)
    if (error) alert(error.message)
    load()
  }

  function openNewVideo() {
    if (chapters.length === 0) {
      alert('Please create a chapter first. Videos are added inside a chapter.')
      setTab('chapters')
      return
    }
    setModal({ type: 'video', item: null })
  }

  function saved() {
    setModal(null)
    load()
  }

  const q = query.trim().toLowerCase()

  const shownVideos = useMemo(
    () =>
      videos.filter(
        (v) =>
          (level === 'all' || v.chapters?.class_level === Number(level)) &&
          (!q || v.title.toLowerCase().includes(q) || v.chapters?.title?.toLowerCase().includes(q))
      ),
    [videos, level, q]
  )

  const shownChapters = useMemo(
    () =>
      chapters.filter(
        (c) =>
          (level === 'all' || c.class_level === Number(level)) &&
          (!q || c.title.toLowerCase().includes(q))
      ),
    [chapters, level, q]
  )

  const count11 = chapters.filter((c) => c.class_level === 11).length
  const count12 = chapters.filter((c) => c.class_level === 12).length
  const featuredCount = videos.filter((v) => v.is_featured).length

  const tabCls = (active) =>
    `rounded-lg px-5 py-2 text-sm font-semibold transition ${
      active
        ? 'bg-brand-maroon text-white shadow'
        : 'bg-white text-brand-maroon hover:bg-brand-gold/20'
    }`

  const filterCls = (active) =>
    `rounded-full border px-4 py-1.5 text-sm font-medium transition ${
      active
        ? 'border-brand-red bg-brand-red text-white'
        : 'border-gray-300 bg-white text-gray-700 hover:border-brand-red'
    }`

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-brand-maroon sm:text-3xl">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Signed in as <span className="font-medium text-gray-700">{session?.user?.email}</span>
          </p>
        </div>
        <button
          onClick={signOut}
          className="rounded-lg border border-brand-maroon px-4 py-2 text-sm font-semibold text-brand-maroon transition hover:bg-brand-maroon hover:text-white"
        >
          Sign Out
        </button>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Total Videos" value={videos.length} />
        <Stat label="Featured on Home" value={featuredCount} />
        <Stat label="Class 11 Chapters" value={count11} />
        <Stat label="Class 12 Chapters" value={count12} />
      </div>

      {/* Tabs */}
      <div className="mt-8 flex gap-2">
        <button onClick={() => setTab('videos')} className={tabCls(tab === 'videos')}>
          Videos ({videos.length})
        </button>
        <button onClick={() => setTab('chapters')} className={tabCls(tab === 'chapters')}>
          Chapters ({chapters.length})
        </button>
      </div>

      {/* Toolbar */}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={tab === 'videos' ? 'Search videos or chapters...' : 'Search chapters...'}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand-red sm:w-72"
        />

        <div className="flex gap-2">
          <button onClick={() => setLevel('all')} className={filterCls(level === 'all')}>All</button>
          <button onClick={() => setLevel('11')} className={filterCls(level === '11')}>Class 11</button>
          <button onClick={() => setLevel('12')} className={filterCls(level === '12')}>Class 12</button>
        </div>

        <button
          onClick={() =>
            tab === 'videos' ? openNewVideo() : setModal({ type: 'chapter', item: null })
          }
          className="ml-auto flex items-center gap-2 rounded-lg bg-brand-red px-5 py-2.5 text-sm font-bold text-white shadow transition hover:bg-brand-maroon"
        >
          <span className="text-lg leading-none">+</span>
          {tab === 'videos' ? 'Add Video' : 'Add Chapter'}
        </button>
      </div>

      {loading && <p className="mt-8 text-gray-500">Loading...</p>}

      {/* Videos */}
      {!loading && tab === 'videos' && (
        <div className="mt-5 space-y-3">
          {shownVideos.length === 0 && <Empty>No videos found.</Empty>}

          {shownVideos.map((v) => {
            const ytId = getYouTubeId(v.youtube_url)
            return (
              <div
                key={v.id}
                className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center"
              >
                {/* Thumbnail */}
                <div className="aspect-video w-full shrink-0 overflow-hidden rounded-lg bg-gray-200 sm:w-40">
                  {ytId && (
                    <img
                      src={`https://img.youtube.com/vi/${ytId}/mqdefault.jpg`}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-brand-maroon">{v.title}</p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                    <span className="rounded-full bg-brand-maroon/10 px-2 py-0.5 font-semibold text-brand-maroon">
                      Class {v.chapters?.class_level}
                    </span>
                    <span>{v.chapters?.title}</span>
                    {v.start_seconds > 0 && <span>· Starts at {formatTime(v.start_seconds)}</span>}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => toggleFeatured(v)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      v.is_featured
                        ? 'bg-brand-gold text-brand-maroon-dark'
                        : 'border border-gray-300 text-gray-500 hover:border-brand-gold'
                    }`}
                  >
                    {v.is_featured ? '★ Featured' : '☆ Not featured'}
                  </button>
                  <button
                    onClick={() => setModal({ type: 'video', item: v })}
                    className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-semibold hover:bg-gray-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => removeVideo(v)}
                    className="rounded-lg border border-red-300 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Chapters */}
      {!loading && tab === 'chapters' && (
        <div className="mt-5 space-y-3">
          {shownChapters.length === 0 && <Empty>No chapters found.</Empty>}

          {shownChapters.map((c) => {
            const n = videos.filter((v) => v.chapter_id === c.id).length
            return (
              <div
                key={c.id}
                className="flex flex-wrap items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-brand-maroon text-lg font-bold text-white">
                  {c.class_level}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-brand-maroon">{c.title}</p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    Class {c.class_level} · {n} {n === 1 ? 'video' : 'videos'}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setModal({ type: 'chapter', item: c })}
                    className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-semibold hover:bg-gray-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => removeChapter(c)}
                    className="rounded-lg border border-red-300 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Popups */}
      {modal?.type === 'chapter' && (
        <ChapterForm
          chapter={modal.item}
          defaultLevel={level === 'all' ? 11 : Number(level)}
          onSaved={saved}
          onClose={() => setModal(null)}
        />
      )}
      {modal?.type === 'video' && (
        <VideoForm
          video={modal.item}
          chapters={chapters}
          onSaved={saved}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}