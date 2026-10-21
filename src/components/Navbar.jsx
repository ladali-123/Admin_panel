import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import logo from '../assets/logo.png'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/class/11', label: 'Class 11' },
  { to: '/class/12', label: 'Class 12' },
]

const linkClass = ({ isActive }) =>
  `rounded-lg px-4 py-2 text-sm font-semibold transition sm:text-base ${
    isActive
      ? 'bg-brand-red text-white shadow-sm'
      : 'text-brand-maroon hover:bg-brand-gold/20'
  }`

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-20 border-b-4 border-brand-gold bg-white shadow-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" onClick={() => setOpen(false)} className="shrink-0">
          <img
            src={logo}
            alt="Dr. Madhuresh Chemistry Class"
            className="h-10 w-auto sm:h-14"
          />
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-2 sm:flex">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setOpen(!open)}
          className="rounded-lg border border-brand-maroon/20 px-3 py-1 text-xl text-brand-maroon sm:hidden"
          aria-label="Menu"
        >
          {open ? '✕' : '☰'}
        </button>
      </nav>

      {/* Mobile links */}
      {open && (
        <div className="flex flex-col gap-1 border-t bg-white px-4 py-3 sm:hidden">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  )
}