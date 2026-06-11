import { useState } from 'react'

const OVERRIDES = [240, 360, 480, 720]

function fmtHours(mins) { return `${mins / 60}h` }

export default function OverrideScreen({ onConfirm, onCancel }) {
  const [selected, setSelected] = useState(720)
  const [authed, setAuthed] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleConfirm() {
    if (authed) { onConfirm(selected); return }
    setLoading(true)
    // Simulate biometric — in real app: use LocalAuthentication API
    await new Promise(r => setTimeout(r, 900))
    setLoading(false)
    setAuthed(true)
    onConfirm(selected)
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 24px 32px' }}>

      <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', textAlign: 'center', marginBottom: 16, marginTop: 12 }}>
        Override
      </p>

      {/* Auth banner */}
      <div style={{ background: 'var(--amber-bg)', borderRadius: 12, padding: '12px 14px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--amber)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a4 4 0 0 1 4 4v2H8V6a4 4 0 0 1 4-4z"/>
            <rect x="3" y="10" width="18" height="12" rx="2"/>
            <circle cx="12" cy="16" r="1.5" fill="#fff" stroke="none"/>
          </svg>
        </div>
        <div>
          <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>Extended access</p>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Face ID required · max 12h</p>
        </div>
      </div>

      {/* Duration grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
        {OVERRIDES.map(m => (
          <button key={m} onClick={() => setSelected(m)} style={{
            padding: '14px 0',
            borderRadius: 12,
            border: '1.5px solid',
            borderColor: selected === m ? 'var(--btn-primary)' : 'var(--border)',
            background: selected === m ? 'var(--btn-primary)' : 'var(--bg-card)',
            color: selected === m ? 'var(--warm-white)' : 'var(--text-secondary)',
            fontSize: 15, fontWeight: 500, cursor: 'pointer',
            transition: 'all 0.1s',
            fontFamily: 'inherit',
          }}>{fmtHours(m)}</button>
        ))}
      </div>

      <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', marginBottom: 24 }}>
        Standard limit is 3 hours
      </p>

      <div style={{ flex: 1 }} />

      <button
        className="btn btn-primary mb8"
        onClick={handleConfirm}
        disabled={loading}
        style={{ opacity: loading ? 0.7 : 1 }}
      >
        {loading ? 'Authenticating…' : 'Confirm'}
      </button>
      <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
    </div>
  )
}
