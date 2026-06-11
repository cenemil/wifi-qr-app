import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../index.css'

const STORAGE_KEY = 'admin_networks'

function loadNetworks() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [] }
  catch { return [] }
}

function saveNetworks(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

const SECURITY_OPTIONS = ['WPA3', 'WPA2', 'WPA', 'None']

const BLANK_FORM = { ssid: '', security: 'WPA2', password: '' }

const STATUS_STYLE = {
  active:  { background: '#EDFAF3', color: '#1A7A4A', label: 'Active'  },
  expired: { background: '#FFF8EC', color: '#C89A2E', label: 'Expired' },
  revoked: { background: '#FCEAEA', color: '#D4534E', label: 'Revoked' },
}

export default function AdminDashboard() {
  const navigate  = useNavigate()
  const [tab, setTab]           = useState('users')
  const [users]                 = useState([])
  const [networks, setNetworks] = useState(loadNetworks)
  const [showPw, setShowPw]     = useState({})
  const [modal, setModal]       = useState(null) // null | { mode:'add'|'edit', form, editId }
  const [deleteConfirm, setDeleteConfirm] = useState(null) // id to delete
  const [formError, setFormError] = useState('')

  function logout() {
    sessionStorage.removeItem('admin_auth')
    navigate('/admin')
  }

  // ── Network CRUD ──────────────────────────────────────────────

  function openAdd() {
    setFormError('')
    setModal({ mode: 'add', form: { ...BLANK_FORM }, editId: null })
  }

  function openEdit(network) {
    setFormError('')
    setModal({ mode: 'edit', form: { ssid: network.ssid, security: network.security, password: network.password }, editId: network.id })
  }

  function closeModal() { setModal(null); setFormError('') }

  function handleFormChange(field, value) {
    setModal(m => ({ ...m, form: { ...m.form, [field]: value } }))
    setFormError('')
  }

  function submitNetwork() {
    const { ssid, security, password } = modal.form
    if (!ssid.trim()) { setFormError('SSID is required.'); return }
    if (security !== 'None' && !password.trim()) { setFormError('Password is required for secured networks.'); return }

    if (modal.mode === 'add') {
      const duplicate = networks.some(n => n.ssid.toLowerCase() === ssid.trim().toLowerCase())
      if (duplicate) { setFormError('A network with this SSID already exists.'); return }
      const next = [
        ...networks,
        { id: Date.now(), ssid: ssid.trim(), security, password: security === 'None' ? '' : password.trim(), active: true },
      ]
      setNetworks(next)
      saveNetworks(next)
    } else {
      const duplicate = networks.some(n => n.ssid.toLowerCase() === ssid.trim().toLowerCase() && n.id !== modal.editId)
      if (duplicate) { setFormError('A network with this SSID already exists.'); return }
      const next = networks.map(n =>
        n.id === modal.editId
          ? { ...n, ssid: ssid.trim(), security, password: security === 'None' ? '' : password.trim() }
          : n
      )
      setNetworks(next)
      saveNetworks(next)
    }
    closeModal()
  }

  function toggleNetwork(id) {
    const next = networks.map(n => n.id === id ? { ...n, active: !n.active } : n)
    setNetworks(next)
    saveNetworks(next)
  }

  function confirmDelete(id) { setDeleteConfirm(id) }
  function cancelDelete()    { setDeleteConfirm(null) }

  function deleteNetwork() {
    const next = networks.filter(n => n.id !== deleteConfirm)
    setNetworks(next)
    saveNetworks(next)
    setDeleteConfirm(null)
  }

  // ── Render ────────────────────────────────────────────────────

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
          <button style={tabStyle(tab === 'users')}    onClick={() => setTab('users')}>
            Users
            {users.length > 0 && <span style={styles.badge}>{users.filter(u => u.status === 'active').length}</span>}
          </button>
          <button style={tabStyle(tab === 'networks')} onClick={() => setTab('networks')}>
            Networks
            {networks.length > 0 && <span style={styles.badge}>{networks.filter(n => n.active).length}</span>}
          </button>
        </div>

        {/* Users Tab */}
        {tab === 'users' && (
          users.length === 0
            ? <EmptyState icon="👤" text="No users yet." />
            : (
              <div style={styles.card}>
                <table style={styles.table}>
                  <thead>
                    <tr>{['User', 'Device', 'Network', 'Since', 'Status', ''].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {users.map((u, i) => (
                      <tr key={u.id} style={{ background: i % 2 === 0 ? 'transparent' : 'var(--bg-base)' }}>
                        <td style={styles.td}><span style={styles.strong}>{u.name}</span></td>
                        <td style={{ ...styles.td, color: 'var(--text-secondary)', fontSize: 13 }}>{u.device}</td>
                        <td style={{ ...styles.td, fontSize: 13 }}>{u.network}</td>
                        <td style={{ ...styles.td, color: 'var(--text-muted)', fontSize: 12, whiteSpace: 'nowrap' }}>{u.since}</td>
                        <td style={styles.td}>
                          <span style={{ ...styles.pill, ...STATUS_STYLE[u.status] }}>{STATUS_STYLE[u.status].label}</span>
                        </td>
                        <td style={styles.td} />
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
        )}

        {/* Networks Tab */}
        {tab === 'networks' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-primary btn-auto" style={{ height: 38, padding: '0 18px', fontSize: 14 }} onClick={openAdd}>
                + Add Network
              </button>
            </div>

            {networks.length === 0
              ? <EmptyState icon="📡" text="No networks yet. Add one to get started." />
              : (
                <div style={styles.card}>
                  <table style={styles.table}>
                    <thead>
                      <tr>{['SSID', 'Security', 'Password', 'Status', ''].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr>
                    </thead>
                    <tbody>
                      {networks.map((n, i) => (
                        <tr key={n.id} style={{ background: i % 2 === 0 ? 'transparent' : 'var(--bg-base)' }}>
                          <td style={styles.td}><span style={styles.strong}>{n.ssid}</span></td>
                          <td style={{ ...styles.td, fontSize: 13 }}>
                            <span style={{ ...styles.pill, background: 'var(--bg-surface)', color: 'var(--text-secondary)' }}>{n.security}</span>
                          </td>
                          <td style={styles.td}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <code style={styles.pwCode}>{showPw[n.id] ? (n.password || '—') : '••••••••'}</code>
                              {n.security !== 'None' && (
                                <button style={styles.eyeBtn} onClick={() => setShowPw(p => ({ ...p, [n.id]: !p[n.id] }))}>
                                  {showPw[n.id] ? '🙈' : '👁'}
                                </button>
                              )}
                            </div>
                          </td>
                          <td style={styles.td}>
                            <span style={{ ...styles.pill, ...(n.active
                              ? { background: '#EDFAF3', color: '#1A7A4A' }
                              : { background: 'var(--bg-surface)', color: 'var(--text-muted)' }) }}>
                              {n.active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td style={styles.td}>
                            <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                              <button
                                className={`btn btn-auto ${n.active ? 'btn-warn' : 'btn-ghost'}`}
                                style={{ height: 30, padding: '0 12px', fontSize: 12 }}
                                onClick={() => toggleNetwork(n.id)}
                              >
                                {n.active ? 'Disable' : 'Enable'}
                              </button>
                              <button
                                className="btn btn-ghost btn-auto"
                                style={{ height: 30, padding: '0 12px', fontSize: 12 }}
                                onClick={() => openEdit(n)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-danger btn-auto"
                                style={{ height: 30, padding: '0 12px', fontSize: 12 }}
                                onClick={() => confirmDelete(n.id)}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            }
          </>
        )}
      </div>

      {/* Add / Edit Modal */}
      {modal && (
        <Overlay onClose={closeModal}>
          <div style={styles.modal}>
            <h2 style={styles.modalTitle}>{modal.mode === 'add' ? 'Add Network' : 'Edit Network'}</h2>

            <Field label="SSID">
              <input
                style={styles.input}
                type="text"
                placeholder="e.g. Home Wi-Fi"
                value={modal.form.ssid}
                onChange={e => handleFormChange('ssid', e.target.value)}
                autoFocus
              />
            </Field>

            <Field label="Security">
              <select
                style={styles.input}
                value={modal.form.security}
                onChange={e => handleFormChange('security', e.target.value)}
              >
                {SECURITY_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </Field>

            {modal.form.security !== 'None' && (
              <Field label="Password">
                <input
                  style={styles.input}
                  type="text"
                  placeholder="Network password"
                  value={modal.form.password}
                  onChange={e => handleFormChange('password', e.target.value)}
                />
              </Field>
            )}

            {formError && <p style={{ fontSize: 13, color: 'var(--red)', fontWeight: 500 }}>{formError}</p>}

            <div className="row2" style={{ marginTop: 8 }}>
              <button className="btn btn-ghost" onClick={closeModal}>Cancel</button>
              <button className="btn btn-primary" onClick={submitNetwork}>
                {modal.mode === 'add' ? 'Add Network' : 'Save Changes'}
              </button>
            </div>
          </div>
        </Overlay>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm !== null && (
        <Overlay onClose={cancelDelete}>
          <div style={styles.modal}>
            <h2 style={styles.modalTitle}>Delete Network</h2>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Are you sure you want to delete <strong>{networks.find(n => n.id === deleteConfirm)?.ssid}</strong>? This cannot be undone.
            </p>
            <div className="row2" style={{ marginTop: 16 }}>
              <button className="btn btn-ghost" onClick={cancelDelete}>Cancel</button>
              <button className="btn btn-danger" style={{ height: 44, borderRadius: 12, fontSize: 15 }} onClick={deleteNetwork}>Delete</button>
            </div>
          </div>
        </Overlay>
      )}
    </div>
  )
}

function Overlay({ children, onClose }) {
  return (
    <div style={styles.overlay} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      {children}
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>{label}</label>
      {children}
    </div>
  )
}

function EmptyState({ icon, text }) {
  return (
    <div style={styles.empty}>
      <span style={{ fontSize: 32 }}>{icon}</span>
      <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>{text}</p>
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
  strong: { fontWeight: 500 },
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
  empty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: '60px 24px',
    background: 'var(--bg-card)',
    borderRadius: 16,
    boxShadow: '0 1px 3px rgba(0,0,0,0.07)',
  },
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.35)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    zIndex: 100,
  },
  modal: {
    background: 'var(--bg-card)',
    borderRadius: 20,
    padding: '32px 28px',
    width: '100%',
    maxWidth: 420,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 650,
    color: 'var(--text-primary)',
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
    width: '100%',
  },
}
