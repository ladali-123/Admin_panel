export const inputCls =
  'w-full rounded-lg border border-gray-300 p-2.5 text-sm outline-none focus:border-brand-red'
export const labelCls = 'mb-1 block text-sm font-semibold text-brand-maroon'

export default function Modal({ title, onClose, children }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border-t-4 border-brand-gold bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-brand-maroon">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-xl text-gray-500 hover:bg-gray-100"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}