import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../index.css'

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()
    if (username === 'admin' && password === 'root') {
      sessionStorage.setItem('admin_auth', 'true')
      navigate('/admin/dashboard')
    } else {
      setError('Invalid credentials')
      setPassword('')
    }
  }

  return (
    <div style={styles.page}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <div style={styles.logoWrap}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>
        <h1 style={styles.title}>Admin Access</h1>
        <p style={styles.sub}>This page is not publicly linked.</p>

        <div style={styles.field}>
          <label style={styles.label}>Username</label>
          <input
            style={styles.input}
            type="text"
            autoComplete="username"
            value={username}
            onChange={e => { setUsername(e.target.value); setError('') }}
            required
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Password</label>
          <input
            style={styles.input}
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={e => { setPassword(e.target.value); setError('') }}
            required
          />
        </div>

        {error && <p style={styles.error}>{error}</p>}

        <button type="submit" className="btn btn-primary" style={{ marginTop: 8 }}>
          Sign in
        </button>
      </form>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100dvh',
    background: 'var(--bg-surface)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px 16px',
  },
  card: {
    background: 'var(--bg-card)',
    borderRadius: 20,
    padding: '36px 32px',
    width: '100%',
    maxWidth: 380,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  },
  logoWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    background: 'var(--bg-surface)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-primary)',
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: 600,
    color: 'var(--text-primary)',
    lineHeight: 1.2,
  },
  sub: {
    fontSize: 13,
    color: 'var(--text-muted)',
    marginBottom: 8,
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: 500,
    color: 'var(--text-secondary)',
  },
  input: {
    height: 42,
    borderRadius: 10,
    border: '1.5px solid var(--border-light)',
    padding: '0 12px',
    fontSize: 15,
    color: 'var(--text-primary)',
    background: 'var(--bg-base)',
    outline: 'none',
    fontFamily: 'inherit',
    transition: 'border-color 0.15s',
  },
  error: {
    fontSize: 13,
    color: 'var(--red)',
    fontWeight: 500,
  },
}
