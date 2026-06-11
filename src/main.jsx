import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import AdminLogin from './admin/AdminLogin.jsx'
import AdminDashboard from './admin/AdminDashboard.jsx'
import ProtectedRoute from './admin/ProtectedRoute.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={
          <ProtectedRoute><AdminDashboard /></ProtectedRoute>
        } />
      </Routes>
    </HashRouter>
  </StrictMode>,
)
