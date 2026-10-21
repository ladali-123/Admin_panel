import { useState } from 'react'
import { supabase } from '../lib/supabase'
import Modal, { inputCls, labelCls } from './Modal'

export default function ChapterForm({ chapter, defaultLevel = 11, onSaved, onClose }) {
  const [level, setLevel] = useState(chapter?.class_level ?? defaultLevel)
  const [title, setTitle] = useState(chapter?.title ?? '')
  const [description, setDescription] = useState(chapter?.description ?? '')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function submit(e) {
    e.preventDefault()
    if (!title.trim()) return setError('Chapter name is required.')

    setBusy(true)
    setError('')
    const row = {
      class_level: Number(level),
      title: title.trim(),
      description: description.trim() || null,
    }
    const { error } = chapter
      ? await supabase.from('chapters').update(row).eq('id', chapter.id)
      : await supabase.from('chapters').insert(row)
    setBusy(false)

    if (error) return setError(error.message)
    onSaved()
  }

  return (
    <Modal title={chapter ? 'Edit Chapter' : 'Add Chapter'} onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className={labelCls}>Class *</label>
          <select value={level} onChange={(e) => setLevel(e.target.value)} className={inputCls}>
            <option value={11}>Class 11</option>
            <option value={12}>Class 12</option>
          </select>
        </div>

        <div>
          <label className={labelCls}>Chapter Name *</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Atoms and Nuclei"
            className={inputCls}
          />
        </div>

        <div>
          <label className={labelCls}>Description (optional)</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={inputCls}
          />
        </div>

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