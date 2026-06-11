import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import './index.css'
import PhoneShell from './components/PhoneShell'
import WelcomePage from './screens/WelcomePage'
import GrantScreen from './screens/GrantScreen'
import ActiveScreen from './screens/ActiveScreen'
import ExpiredScreen from './screens/ExpiredScreen'
import OverrideScreen from './screens/OverrideScreen'

export default function App() {
  const [searchParams] = useSearchParams()

  const ssid     = searchParams.get('ssid')
  const security = searchParams.get('sec')  || 'WPA2'
  const password = searchParams.get('pw')   || ''

  const network = ssid ? { ssid, security, password } : null

  const [screen, setScreen]   = useState('grant')
  const [session, setSession] = useState(null)
  const [prevScreen, setPrev] = useState(null)

  function startSession(mins) {
    setSession({ network, durationMins: mins, startedAt: Date.now() })
    setScreen('active')
  }

  function extendSession() {
    setSession(s => ({ ...s, startedAt: s.startedAt + 15 * 60 * 1000 }))
  }

  function endSession() { setScreen('expired') }

  function openOverride() { setPrev(screen); setScreen('override') }

  function confirmOverride(mins) {
    setSession({ network, durationMins: mins, startedAt: Date.now() })
    setScreen('active')
  }

  function cancelOverride() { setScreen(prevScreen || 'grant') }

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <PhoneShell>
        {!network ? (
          <WelcomePage />
        ) : (
          <>
            {screen === 'grant' && (
              <GrantScreen network={network} onStart={startSession} onOverride={openOverride} />
            )}
            {screen === 'active' && session && (
              <ActiveScreen session={session} onExtend={extendSession} onEnd={endSession} />
            )}
            {screen === 'expired' && session && (
              <ExpiredScreen session={session} onGrantNew={() => setScreen('grant')} />
            )}
            {screen === 'override' && (
              <OverrideScreen onConfirm={confirmOverride} onCancel={cancelOverride} />
            )}
          </>
        )}
      </PhoneShell>
    </div>
  )
}
