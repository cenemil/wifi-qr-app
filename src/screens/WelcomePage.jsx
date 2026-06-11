import { useState, useEffect } from 'react'

function getConnectionInfo() {
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection
  return {
    online: navigator.onLine,
    type: conn?.type || null,
    effectiveType: conn?.effectiveType || null,
  }
}

function ConnectionBadge({ info }) {
  if (!info.online) {
    return (
      <div style={{ ...badge, background: 'var(--red-bg)', color: 'var(--red)' }}>
        <Dot color="var(--red)" /> Offline
      </div>
    )
  }
  if (info.type === 'wifi') {
    return (
      <div style={{ ...badge, background: '#EDFAF3', color: '#1A7A4A' }}>
        <Dot color="#1A7A4A" /> Connected via Wi-Fi
      </div>
    )
  }
  if (info.type === 'cellular') {
    return (
      <div style={{ ...badge, background: 'var(--amber-bg)', color: '#A07820' }}>
        <Dot color="#C89A2E" /> Connected via mobile data
      </div>
    )
  }
  return (
    <div style={{ ...badge, background: '#EDFAF3', color: '#1A7A4A' }}>
      <Dot color="#1A7A4A" /> Online
    </div>
  )
}

function Dot({ color }) {
  return <span style={{ width: 7, height: 7, borderRadius: '50%', background: color, display: 'inline-block', flexShrink: 0 }} />
}

const badge = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 7,
  padding: '5px 14px',
  borderRadius: 999,
  fontSize: 13,
  fontWeight: 500,
}

const STEPS = [
  { n: '1', text: 'Ask the host for the Wi-Fi QR code or link.' },
  { n: '2', text: 'Scan the QR code with your camera or open the link.' },
  { n: '3', text: 'Choose a session duration and tap Start.' },
  { n: '4', text: 'Your device connects automatically — no typing needed.' },
]

export default function WelcomePage() {
  const [info, setInfo] = useState(getConnectionInfo)

  useEffect(() => {
    function update() { setInfo(getConnectionInfo()) }
    window.addEventListener('online', update)
    window.addEventListener('offline', update)
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection
    conn?.addEventListener('change', update)
    return () => {
      window.removeEventListener('online', update)
      window.removeEventListener('offline', update)
      conn?.removeEventListener('change', update)
    }
  }, [])

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 24px 40px' }}>

      {/* Icon + status */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, paddingTop: 20, marginBottom: 28 }}>
        <div style={{ width: 64, height: 64, borderRadius: 20, background: 'var(--bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <WifiIcon online={info.online} />
        </div>
        <ConnectionBadge info={info} />
      </div>

      {/* Heading */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6, lineHeight: 1.2 }}>
          Wi-Fi QR Access
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          Get timed Wi-Fi access by scanning a QR code. No passwords to remember — just scan and connect.
        </p>
      </div>

      {/* Steps */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 32 }}>
        <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 10 }}>
          How it works
        </p>
        {STEPS.map(s => (
          <div key={s.n} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', padding: '10px 0', borderBottom: '1px solid var(--border-light)' }}>
            <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--bg-surface)', border: '1.5px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>{s.n}</span>
            </div>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.5, paddingTop: 3 }}>{s.text}</p>
          </div>
        ))}
      </div>

      <div style={{ flex: 1 }} />

      {/* CTA hint */}
      <div style={{ background: 'var(--bg-surface)', borderRadius: 14, padding: '14px 16px', textAlign: 'center' }}>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>
          Open a shared link or scan a QR code<br />to get started.
        </p>
      </div>
    </div>
  )
}

function WifiIcon({ online }) {
  const color = online ? 'var(--text-primary)' : 'var(--text-muted)'
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12.55a11 11 0 0 1 14.08 0" opacity={online ? 1 : 0.3} />
      <path d="M1.42 9a16 16 0 0 1 21.16 0"  opacity={online ? 1 : 0.2} />
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
      <circle cx="12" cy="20" r="1" fill={color} stroke="none" />
    </svg>
  )
}
