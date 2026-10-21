import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()

  async function handleLogin(e) {
    e.preventDefault()
    setBusy(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setBusy(false)
    if (error) setError('Incorrect email or password.')
    else navigate('/admin')
  }

  return (
    <div className="mx-auto mt-12 max-w-sm px-4">
      <form
        onSubmit={handleLogin}
        className="space-y-4 rounded-2xl border-t-4 border-brand-gold bg-white p-6 shadow-md"
      >
        <h1 className="text-2xl font-bold text-brand-maroon">Admin Login</h1>

        <input
          type="email"
          required
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-gray-300 p-2.5 outline-none focus:border-brand-red"
        />
        <input
          type="password"
          required
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-gray-300 p-2.5 outline-none focus:border-brand-red"
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          disabled={busy}
          className="w-full rounded-lg bg-brand-maroon py-2.5 font-semibold text-white transition hover:bg-brand-red disabled:opacity-60"
        >
          {busy ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  )
}