export function getYouTubeId(url) {
  const m = String(url).match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/)
  return m ? m[1] : null
}

// "12:30" ya "1:02:03" -> seconds
export function parseTime(str) {
  if (!str) return 0
  const parts = String(str).trim().split(':').map((n) => parseInt(n, 10))
  if (parts.some((n) => Number.isNaN(n))) return 0
  return parts.reduce((total, n) => total * 60 + n, 0)
}

// seconds -> "12:30" ya "1:02:03"
export function formatTime(sec) {
  const s = Number(sec) || 0
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const r = s % 60
  const pad = (n) => String(n).padStart(2, '0')
  return h ? `${h}:${pad(m)}:${pad(r)}` : `${m}:${pad(r)}`
}