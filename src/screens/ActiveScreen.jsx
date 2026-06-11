import { useState, useEffect, useRef } from 'react'
import { QRCodeSVG } from 'qrcode.react'

const RADIUS = 90
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

function fmtTime(secs) {
  const h = Math.floor(secs / 3600)
  const m = Math.floor((secs % 3600) / 60)
  const s = secs % 60
  if (h > 0) return `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
  return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
}

function fmtExpiry(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function ringColor(secs, total) {
  const pct = secs / total
  if (pct <= 0.02) return '#D4534E'  // last 2% — red
  if (pct <= 0.08) return '#C89A2E'  // last 8% — amber
  return '#444441'                    // normal — dark gray
}

export default function ActiveScreen({ session, onExtend, onEnd }) {
  const totalSecs = session.durationMins * 60
  const [secsLeft, setSecsLeft] = useState(() => {
    const elapsed = Math.floor((Date.now() - session.startedAt) / 1000)
    return Math.max(0, totalSecs - elapsed)
  })
  const intervalRef = useRef(null)

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSecsLeft(s => {
        if (s <= 1) { clearInterval(intervalRef.current); onEnd(); return 0 }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [session])

  const progress = secsLeft / totalSecs
  const dashOffset = CIRCUMFERENCE * (1 - progress)
  const color = ringColor(secsLeft, totalSecs)

  // WPA QR string
  const qrValue = `WIFI:T:${session.network.security};S:${session.network.ssid};P:${session.network.password};;`

  const expiresAt = new Date(session.startedAt + totalSecs * 1000)

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 24px 32px' }}>

      {/* Eyebrow */}
      <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', textAlign: 'center', marginBottom: 8, marginTop: 12 }}>
        Active session
      </p>

      {/* Ring + QR */}
      <div style={{ position: 'relative', width: 220, height: 220, margin: '0 auto 16px', flexShrink: 0 }}>
        <svg width="220" height="220" viewBox="0 0 220 220" style={{ position: 'absolute', top: 0, left: 0 }}>
          {/* Track */}
          <circle cx="110" cy="110" r={RADIUS} fill="none" stroke="var(--border-light)" strokeWidth="10" />
          {/* Progress */}
          <circle
            cx="110" cy="110" r={RADIUS}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            transform="rotate(-90 110 110)"
            style={{ transition: 'stroke 0.5s, stroke-dashoffset 0.9s linear' }}
          />
          {/* Time text */}
          <text x="110" y="100" textAnchor="middle" fontSize="26" fontWeight="300" fill="var(--text-primary)" fontFamily="-apple-system,sans-serif" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {fmtTime(secsLeft)}
          </text>
          <text x="110" y="122" textAnchor="middle" fontSize="12" fill="var(--text-muted)" fontFamily="-apple-system,sans-serif">
            remaining
          </text>
        </svg>

        {/* QR inset */}
        <div style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 90, height: 90,
          background: '#fff',
          borderRadius: 10,
          padding: 6,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginTop: 18,
        }}>
          <QRCodeSVG value={qrValue} size={78} bgColor="#ffffff" fgColor="#111110" level="M" />
        </div>
      </div>

      {/* Meta */}
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <p style={{ fontSize: 16, fontWeight: 500, color: 'var(--text-primary)' }}>{session.network.ssid}</p>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>Expires {fmtExpiry(expiresAt)}</p>
      </div>

      <div style={{ flex: 1 }} />

      {/* Extend + End */}
      <div className="row2 mb8">
        <button className="btn btn-warn" onClick={onExtend}>+15 min</button>
        <button className="btn btn-danger" onClick={onEnd}>End session</button>
      </div>

      {/* Share */}
      <button className="btn btn-ghost" onClick={() => {
        if (navigator.share) {
          navigator.share({ title: 'Wi-Fi Access', text: `SSID: ${session.network.ssid}\nPassword: ${session.network.password}` })
        }
      }}>
        Share QR
      </button>
    </div>
  )
}
