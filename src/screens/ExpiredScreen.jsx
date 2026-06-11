import { QRCodeSVG } from 'qrcode.react'

function fmtDuration(mins) {
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return m === 0 ? `${h}h` : `${h}h ${m}m`
}

function fmtTime(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export default function ExpiredScreen({ session, onGrantNew }) {
  const endedAt = new Date(session.startedAt + session.durationMins * 60 * 1000)
  const qrValue = `WIFI:T:${session.network.security};S:${session.network.ssid};P:${session.network.password};;`

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 24px 32px' }}>

      <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', textAlign: 'center', marginBottom: 16, marginTop: 12 }}>
        Session ended
      </p>

      {/* Expired badge */}
      <div style={{ background: 'var(--red-bg)', borderRadius: 12, padding: '12px 16px', textAlign: 'center', marginBottom: 20 }}>
        <p style={{ fontSize: 15, fontWeight: 500, color: 'var(--red)' }}>Access expired</p>
        <p style={{ fontSize: 12, color: 'var(--red)', opacity: 0.7, marginTop: 2 }}>QR code is now invalid</p>
      </div>

      {/* Ghost QR */}
      <div style={{ width: 100, height: 100, margin: '0 auto 20px', opacity: 0.2, borderRadius: 10, overflow: 'hidden', background: '#fff', padding: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <QRCodeSVG value={qrValue} size={88} bgColor="#ffffff" fgColor="#111110" level="M" />
      </div>

      {/* Summary card */}
      <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border-light)', marginBottom: 24 }}>
        {[
          { label: 'Network',  value: session.network.ssid },
          { label: 'Duration', value: fmtDuration(session.durationMins) },
          { label: 'Ended',    value: fmtTime(endedAt) },
        ].map((row, i, arr) => (
          <div key={row.label} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '11px 14px',
            borderBottom: i < arr.length - 1 ? '1px solid var(--border-light)' : 'none',
            background: 'var(--bg-card)',
          }}>
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{row.label}</span>
            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>{row.value}</span>
          </div>
        ))}
      </div>

      <div style={{ flex: 1 }} />

      <button className="btn btn-primary" onClick={onGrantNew}>Grant new</button>
    </div>
  )
}
