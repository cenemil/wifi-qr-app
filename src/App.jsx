import { useState } from 'react'
import './index.css'
import PhoneShell from './components/PhoneShell'
import GrantScreen from './screens/GrantScreen'
import ActiveScreen from './screens/ActiveScreen'
import ExpiredScreen from './screens/ExpiredScreen'
import OverrideScreen from './screens/OverrideScreen'

const DEMO_NETWORK = {
  ssid: 'Home Wi-Fi',
  password: 'supersecret123',
  security: 'WPA',
}

export default function App() {
  const [screen, setScreen]   = useState('grant')
  const [session, setSession] = useState(null)
  const [prevScreen, setPrev] = useState(null)

  function startSession(mins) {
    setSession({ network: DEMO_NETWORK, durationMins: mins, startedAt: Date.now() })
    setScreen('active')
  }

  function extendSession() {
    setSession(s => ({
      ...s,
      startedAt: s.startedAt + 15 * 60 * 1000,
    }))
  }

  function endSession() {
    setScreen('expired')
  }

  function openOverride() {
    setPrev(screen)
    setScreen('override')
  }

  function confirmOverride(mins) {
    setSession({ network: DEMO_NETWORK, durationMins: mins, startedAt: Date.now() })
    setScreen('active')
  }

  function cancelOverride() {
    setScreen(prevScreen || 'grant')
  }

  return (
    <div style={{ minHeight: '100dvh', background: '#E4E2DB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <PhoneShell>
        {screen === 'grant' && (
          <GrantScreen
            network={DEMO_NETWORK}
            onStart={startSession}
            onOverride={openOverride}
          />
        )}
        {screen === 'active' && session && (
          <ActiveScreen
            session={session}
            onExtend={extendSession}
            onEnd={endSession}
          />
        )}
        {screen === 'expired' && session && (
          <ExpiredScreen
            session={session}
            onGrantNew={() => setScreen('grant')}
          />
        )}
        {screen === 'override' && (
          <OverrideScreen
            onConfirm={confirmOverride}
            onCancel={cancelOverride}
          />
        )}
      </PhoneShell>
    </div>
  )
}
