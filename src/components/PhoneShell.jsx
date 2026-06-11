export default function PhoneShell({ children }) {
  return (
    <div style={{
      width: '100%',
      maxWidth: 390,
      margin: '0 auto',
      minHeight: '100dvh',
      background: 'var(--bg-base)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Status bar */}
      <div style={{
        height: 50,
        background: 'var(--bg-base)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingBottom: 6,
        flexShrink: 0,
      }}>
        <div style={{
          width: 120,
          height: 34,
          background: '#1A1A18',
          borderRadius: '0 0 20px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#2C2C2A' }} />
        </div>
      </div>
      {children}
    </div>
  )
}
