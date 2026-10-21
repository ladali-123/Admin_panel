import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { getYouTubeId, parseTime, formatTime } from '../lib/youtube'
import Modal, { inputCls, labelCls } from './Modal'

export default function VideoForm({ video, chapters, defaultLevel = '', onSaved, onClose }) {
  const currentChapter = chapters.find((c) => c.id === video?.chapter_id)

  // edit: bina chapter wala video = "home"
  const initialLevel = video
    ? video.chapter_id
      ? String(currentChapter?.class_level ?? video.chapters?.class_level ?? '')
      : 'home'
    : defaultLevel

  const [level, setLevel] = useState(initialLevel)
  const [chapterName, setChapterName] = useState(currentChapter?.title ?? video?.chapters?.title ?? '')
  const [title, setTitle] = useState(video?.title ?? '')
  const [description, setDescription] = useState(video?.description ?? '')
  const [url, setUrl] = useState(video?.youtube_url ?? '')
  const [time, setTime] = useState(video?.start_seconds ? formatTime(video.start_seconds) : '')
  const [transcript, setTranscript] = useState(video?.transcript ?? '')
  const [featured, setFeatured] = useState(video?.is_featured ?? false)
  const [order, setOrder] = useState(video?.featured_order ?? 0)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const isHome = level === 'home'
  const levelChapters = chapters.filter((c) => String(c.class_level) === level)

  async function submit(e) {
    e.preventDefault()
    const name = chapterName.trim()

    if (!level) return setError('Please select where this video should appear.')
    if (!isHome && !name) return setError('Please enter a chapter name.')
    if (!title.trim()) return setError('Video title is required.')
    if (!getYouTubeId(url)) return setError('Please enter a valid YouTube link.')

    setBusy(true)
    setError('')

    let chapterId = null

    if (!isHome) {
      // same class + same naam wala chapter dhundo, nahi mila to naya banao
      chapterId = levelChapters.find(
        (c) => c.title.trim().toLowerCase() === name.toLowerCase()
      )?.id

      if (!chapterId) {
        const { data, error: chErr } = await supabase
          .from('chapters')
          .insert({ class_level: Number(level), title: name })
          .select('id')
          .single()

        if (chErr) {
          setBusy(false)
          return setError(chErr.message)
        }
        chapterId = data.id
      }
    }

    const row = {
      chapter_id: chapterId,
      title: title.trim(),
      description: description.trim() || null,
      transcript: transcript.trim() || null,
      youtube_url: url.trim(),
      start_seconds: parseTime(time),
      is_featured: isHome ? true : featured, // Home-only video hamesha Home par dikhta hai
      featured_order: Number(order) || 0,
    }

    const { error: vErr } = video
      ? await supabase.from('videos').update(row).eq('id', video.id)
      : await supabase.from('videos').insert(row)

    setBusy(false)
    if (vErr) return setError(vErr.message)
    onSaved()
  }

  return (
    <Modal title={video ? 'Edit Video' : 'Add Video'} onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className={labelCls}>Show this video in *</label>
          <select value={level} onChange={(e) => setLevel(e.target.value)} className={inputCls}>
            <option value="">Select...</option>
            <option value="home">Home page only</option>
            <option value="11">Class 11</option>
            <option value="12">Class 12</option>
          </select>
        </div>

        {/* Chapter sirf Class 11/12 ke liye */}
        {level && !isHome && (
          <div>
            <label className={labelCls}>Chapter Name *</label>
            <input
              list="chapter-suggestions"
              value={chapterName}
              onChange={(e) => setChapterName(e.target.value)}
              placeholder="Type a chapter name"
              className={inputCls}
            />
            <datalist id="chapter-suggestions">
              {levelChapters.map((c) => (
                <option key={c.id} value={c.title} />
              ))}
            </datalist>
            <p className="mt-1 text-xs text-gray-500">
              Pick an existing chapter from the suggestions, or type a new name to create one.
            </p>
          </div>
        )}

        <div>
          <label className={labelCls}>Title *</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} />
        </div>

        <div>
          <label className={labelCls}>YouTube Link *</label>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://youtu.be/..."
            className={inputCls}
          />
        </div>

        <div>
          <label className={labelCls}>Start Time (optional)</label>
          <input
            value={time}
            onChange={(e) => setTime(e.target.value)}
            placeholder="e.g. 12:30"
            className={inputCls}
          />
        </div>

        <div>
          <label className={labelCls}>Description</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={inputCls}
          />
        </div>

        <div>
          <label className={labelCls}>Transcript</label>
          <textarea
            rows={5}
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            className={inputCls}
          />
        </div>

        {/* Home settings */}
        {level && (
          <div className="rounded-lg bg-brand-cream p-3">
            {isHome ? (
              <p className="text-sm font-semibold text-brand-maroon">
                This video will appear on the Home page only.
              </p>
            ) : (
              <label className="flex items-center gap-2 text-sm font-semibold text-brand-maroon">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="h-4 w-4"
                />
                Also feature on the Home page
              </label>
            )}

            {(isHome || featured) && (
              <div className="mt-3">
                <label className="mb-1 block text-xs text-gray-600">
                  Display order on Home (lower numbers appear first: 0, 1, 2...)
                </label>
                <input
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(e.target.value)}
                  className={inputCls}
                />
              </div>
            )}
          </div>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="rounded-lg border px-4 py-2 text-sm">
            Cancel
          </button>
          <button
            disabled={busy}
            className="rounded-lg bg-brand-maroon px-5 py-2 text-sm font-semibold text-white hover:bg-brand-red disabled:opacity-60"
          >
            {busy ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </Modal>
  )
}