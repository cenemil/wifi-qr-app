import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
  const authed = sessionStorage.getItem('admin_auth') === 'true'
  return authed ? children : <Navigate to="/admin" replace />
}
