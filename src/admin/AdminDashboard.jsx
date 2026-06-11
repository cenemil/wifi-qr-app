import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../index.css'

const INITIAL_USERS = [
  { id: 1, name: 'Alice Johnson',   device: 'iPhone 15',        status: 'active',   network: 'Home Wi-Fi',   since: '2025-06-10 09:14' },
  { id: 2, name: 'Bob Smith',       device: 'Samsung Galaxy S24',status: 'active',   network: 'Office 5G',    since: '2025-06-10 11:02' },
  { id: 3, name: 'Carol White',     device: 'MacBook Pro',       status: 'expired',  network: 'Home Wi-Fi',   since: '2025-06-09 15:30' },
  { id: 4, name: 'David Lee',       device: 'iPad Air',          status: 'active',   network: 'Guest Net',    since: '2025-06-11 08:45' },
  { id: 5, name: 'Emma Turner',     device: 'Pixel 8',           status: 'revoked',  network: 'Office 5G',    since: '2025-06-08 13:20' },
]

const INITIAL_NETWORKS = [
  { id: 1, ssid: 'Home Wi-Fi',  security: 'WPA2', password: 'supersecret123', active: true,  users: 2 },
  { id: 2, ssid: 'Office 5G',   security: 'WPA3', password: 'office@2025!',   active: true,  users: 1 },
  { id: 3, ssid: 'Guest Net',   security: 'WPA2', password: 'guest1234',      active: true,  users: 1 },
  { id: 4, ssid: 'IoT Network', security: 'WPA2', password: 'iot_pass_99',    active: false, users: 0 },
]

const STATUS_STYLE = {
  active:  { background: '#EDFAF3', color: '#1A7A4A', label: 'Active'  },
  expired: { background: '#FFF8EC', color: '#C89A2E', label: 'Expired' },
  revoked: { background: '#FCEAEA', color: '#D4534E', label: 'Revoked' },
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [tab, setTab]         = useState('users')
  const [users, setUsers]     = useState(INITIAL_USERS)
  const [networks, setNetworks] = useState(INITIAL_NETWORKS)
  const [showPw, setShowPw]   = useState({})

  function logout() {
    sessionStorage.removeItem('admin_auth')
    navigate('/admin')
  }

  function revokeUser(id) {
    setUsers(u => u.map(x => x.id === id ? { ...x, status: 'revoked' } : x))
  }

  function toggleNetwork(id) {
    setNetworks(n => n.map(x => x.id === id ? { ...x, active: !x.active } : x))
  }

  return (
    <div style={styles.page}>
      <div style={styles.shell}>

        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Admin Dashboard</h1>
            <p style={styles.sub}>WiFi QR Access Management</p>
          </div>
          <button className="btn btn-ghost btn-auto" style={{ height: 36, padding: '0 16px', fontSize: 13 }} onClick={logout}>
            Sign out
          </button>
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          <button style={tabStyle(tab === 'users')}   onClick={() => setTab('users')}>
            Users <span style={styles.badge}>{users.filter(u => u.status === 'active').length}</span>
          </button>
          <button style={tabStyle(tab === 'networks')} onClick={() => setTab('networks')}>
            Networks <span style={styles.badge}>{networks.filter(n => n.active).length}</span>
          </button>
        </div>

        {/* Users Table */}
        {tab === 'users' && (
          <div style={styles.card}>
            <table style={styles.table}>
              <thead>
                <tr>
                  {['User', 'Device', 'Network', 'Since', 'Status', ''].map(h => (
                    <th key={h} style={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={u.id} style={{ background: i % 2 === 0 ? 'transparent' : 'var(--bg-base)' }}>
                    <td style={styles.td}><span style={styles.userName}>{u.name}</span></td>
                    <td style={{ ...styles.td, color: 'var(--text-secondary)', fontSize: 13 }}>{u.device}</td>
                    <td style={{ ...styles.td, fontSize: 13 }}>{u.network}</td>
                    <td style={{ ...styles.td, color: 'var(--text-muted)', fontSize: 12, whiteSpace: 'nowrap' }}>{u.since}</td>
                    <td style={styles.td}>
                      <span style={{ ...styles.pill, ...STATUS_STYLE[u.status] }}>
                        {STATUS_STYLE[u.status].label}
                      </span>
                    </td>
                    <td style={styles.td}>
                      {u.status === 'active' && (
                        <button className="btn btn-danger btn-auto" style={{ height: 30, padding: '0 12px', fontSize: 12 }} onClick={() => revokeUser(u.id)}>
                          Revoke
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Networks Table */}
        {tab === 'networks' && (
          <div style={styles.card}>
            <table style={styles.table}>
              <thead>
                <tr>
                  {['SSID', 'Security', 'Password', 'Active Users', 'Status', ''].map(h => (
                    <th key={h} style={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {networks.map((n, i) => (
                  <tr key={n.id} style={{ background: i % 2 === 0 ? 'transparent' : 'var(--bg-base)' }}>
                    <td style={styles.td}><span style={styles.userName}>{n.ssid}</span></td>
                    <td style={{ ...styles.td, fontSize: 13 }}>
                      <span style={{ ...styles.pill, background: 'var(--bg-surface)', color: 'var(--text-secondary)' }}>{n.security}</span>
                    </td>
                    <td style={styles.td}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <code style={styles.pwCode}>
                          {showPw[n.id] ? n.password : '••••••••'}
                        </code>
                        <button style={styles.eyeBtn} onClick={() => setShowPw(p => ({ ...p, [n.id]: !p[n.id] }))}>
                          {showPw[n.id] ? '🙈' : '👁'}
                        </button>
                      </div>
                    </td>
                    <td style={{ ...styles.td, textAlign: 'center' }}>{n.users}</td>
                    <td style={styles.td}>
                      <span style={{ ...styles.pill, ...(n.active
                        ? { background: '#EDFAF3', color: '#1A7A4A' }
                        : { background: 'var(--bg-surface)', color: 'var(--text-muted)' }) }}>
                        {n.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <button
                        className={`btn btn-auto ${n.active ? 'btn-danger' : 'btn-ghost'}`}
                        style={{ height: 30, padding: '0 12px', fontSize: 12 }}
                        onClick={() => toggleNetwork(n.id)}
                      >
                        {n.active ? 'Disable' : 'Enable'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  )
}

function tabStyle(active) {
  return {
    padding: '8px 20px',
    borderRadius: 10,
    border: 'none',
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 500,
    fontFamily: 'inherit',
    background: active ? 'var(--btn-primary)' : 'transparent',
    color: active ? 'var(--warm-white)' : 'var(--text-secondary)',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    transition: 'background 0.15s, color 0.15s',
  }
}

const styles = {
  page: {
    minHeight: '100dvh',
    background: 'var(--bg-surface)',
    padding: '32px 24px',
  },
  shell: {
    maxWidth: 860,
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    color: 'var(--text-primary)',
    lineHeight: 1.2,
  },
  sub: {
    fontSize: 13,
    color: 'var(--text-muted)',
    marginTop: 2,
  },
  tabs: {
    display: 'flex',
    gap: 4,
    background: 'var(--bg-base)',
    padding: 4,
    borderRadius: 12,
    width: 'fit-content',
  },
  badge: {
    background: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    padding: '1px 7px',
    fontSize: 12,
  },
  card: {
    background: 'var(--bg-card)',
    borderRadius: 16,
    overflow: 'auto',
    boxShadow: '0 1px 3px rgba(0,0,0,0.07)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    textAlign: 'left',
    padding: '12px 16px',
    fontSize: 12,
    fontWeight: 600,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    borderBottom: '1px solid var(--border-light)',
  },
  td: {
    padding: '12px 16px',
    fontSize: 14,
    color: 'var(--text-primary)',
    borderBottom: '1px solid var(--border-light)',
    verticalAlign: 'middle',
  },
  userName: {
    fontWeight: 500,
  },
  pill: {
    display: 'inline-block',
    padding: '2px 10px',
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 500,
  },
  pwCode: {
    fontFamily: 'monospace',
    fontSize: 13,
    color: 'var(--text-secondary)',
    letterSpacing: '0.03em',
  },
  eyeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: 14,
    padding: '0 2px',
    lineHeight: 1,
  },
}
