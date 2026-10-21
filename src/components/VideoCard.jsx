import YouTubePlayer from './YouTubePlayer'

export default function VideoCard({ video }) {
  return (
    <article className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <YouTubePlayer url={video.youtube_url} start={video.start_seconds} />

      <h3 className="text-base font-semibold leading-snug text-brand-maroon">
        {video.title}
      </h3>

      {video.description && (
        <details className="rounded-lg bg-brand-cream p-3">
          <summary className="cursor-pointer text-sm font-semibold text-brand-maroon">
            Description
          </summary>
          <p className="mt-2 whitespace-pre-wrap text-justify text-sm leading-relaxed text-gray-700">
            {video.description}
          </p>
        </details>
      )}

      {video.transcript && (
        <details className="rounded-lg bg-brand-cream p-3">
          <summary className="cursor-pointer text-sm font-semibold text-brand-maroon">
            Transcript
          </summary>
          <p className="mt-2 whitespace-pre-wrap text-justify text-sm leading-relaxed text-gray-700">
            {video.transcript}
          </p>
        </details>
      )}
    </article>
  )
}