import { useState } from 'react'

const QUICK = [15, 30, 60, 120, 180]

function fmtDuration(mins) {
  if (mins < 60) return `${mins}m`
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return m === 0 ? `${h}h` : `${h}h ${m}m`
}

export default function GrantScreen({ network, onStart, onOverride }) {
  const [mins, setMins] = useState(60)

  function add() { if (mins < 180) setMins(m => Math.min(180, m + 15)) }
  function sub() { if (mins > 15)  setMins(m => Math.max(15,  m - 15)) }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 24px 32px' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 28, marginTop: 12 }}>
        <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 6 }}>Grant access</p>
        <p style={{ fontSize: 22, fontWeight: 500, color: 'var(--text-primary)' }}>{network.ssid}</p>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 3 }}>{network.security} · ready to share</p>
      </div>

      {/* Duration display */}
      <div style={{ textAlign: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: 52, fontWeight: 300, color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
          {fmtDuration(mins)}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          session duration
        </div>
      </div>

      {/* Stepper */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32, marginBottom: 24 }}>
        <button onClick={sub} disabled={mins <= 15} style={{
          width: 44, height: 44, borderRadius: '50%',
          border: '1.5px solid var(--border)',
          background: mins <= 15 ? 'var(--bg-surface)' : 'var(--bg-card)',
          color: mins <= 15 ? 'var(--text-muted)' : 'var(--text-primary)',
          fontSize: 22, cursor: mins <= 15 ? 'default' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.1s',
        }}>−</button>
        <span style={{ fontSize: 13, color: 'var(--text-muted)', letterSpacing: '0.06em' }}>15 min steps</span>
        <button onClick={add} disabled={mins >= 180} style={{
          width: 44, height: 44, borderRadius: '50%',
          border: '1.5px solid var(--border)',
          background: mins >= 180 ? 'var(--bg-surface)' : 'var(--bg-card)',
          color: mins >= 180 ? 'var(--text-muted)' : 'var(--text-primary)',
          fontSize: 22, cursor: mins >= 180 ? 'default' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.1s',
        }}>+</button>
      </div>

      {/* Quick pills */}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 28 }}>
        {QUICK.map(q => (
          <button key={q} onClick={() => setMins(q)} style={{
            height: 34, padding: '0 14px', borderRadius: 999,
            border: '1.5px solid',
            borderColor: mins === q ? 'var(--btn-primary)' : 'var(--border)',
            background: mins === q ? 'var(--btn-primary)' : 'var(--bg-card)',
            color: mins === q ? 'var(--warm-white)' : 'var(--text-secondary)',
            fontSize: 13, fontWeight: 500, cursor: 'pointer',
            transition: 'all 0.1s',
            fontFamily: 'inherit',
          }}>{fmtDuration(q)}</button>
        ))}
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Override link */}
      <button onClick={onOverride} style={{
        background: 'none', border: 'none', cursor: 'pointer',
        fontSize: 13, color: 'var(--text-muted)', textDecoration: 'underline',
        marginBottom: 14, fontFamily: 'inherit', padding: '4px 0',
      }}>need more time?</button>

      {/* CTA */}
      <button className="btn btn-primary" onClick={() => onStart(mins)}>
        Start session
      </button>
    </div>
  )
}
