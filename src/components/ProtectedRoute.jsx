import { Navigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

export default function ProtectedRoute({ children }) {
  const { session, loading } = useAuth()

  if (loading) return <p className="p-6 text-gray-500">Loading...</p>
  if (!session) return <Navigate to="/admin/login" replace />
  return children
}