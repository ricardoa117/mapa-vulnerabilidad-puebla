import { useState } from 'react'

export default function Dashboard({ user, onLogout }) {
  const [showConfirm, setShowConfirm] = useState(false)

  return (
    <div style={s.root}>

      {/* ── Header ── */}
      <header style={s.header}>
        <div style={s.headerLeft}>
          {/* Logo */}
          <div style={s.logoWrap}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
              <circle cx="12" cy="9" r="2.5"/>
            </svg>
          </div>
          <div>
            <div style={s.sysName}>Sistema TIA</div>
            <div style={s.sysDesc}>Vulnerabilidad Social · Puebla</div>
          </div>
        </div>

        <div style={s.headerRight}>
          {/* Chip de usuario */}
          <div style={s.userChip}>
            <div style={s.avatar}>
              {(user.nombre || user.username)[0].toUpperCase()}
            </div>
            <div>
              <div style={s.userName}>{user.nombre || user.username}</div>
              <div style={s.userRole}>@{user.username}</div>
            </div>
          </div>

          {/* Botón cerrar sesión */}
          {showConfirm ? (
            <div style={s.confirmRow}>
              <span style={s.confirmTxt}>¿Salir?</span>
              <button style={s.btnYes} onClick={onLogout}>Sí</button>
              <button style={s.btnNo}  onClick={() => setShowConfirm(false)}>No</button>
            </div>
          ) : (
            <button style={s.logoutBtn} onClick={() => setShowConfirm(true)} title="Cerrar sesión">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Salir
            </button>
          )}
        </div>
      </header>

      {/* ── Mapa embebido ── */}
      <main style={s.main}>
        <iframe
          src="/mapa_vulnerabilidad_combinado.html"
          style={s.iframe}
          title="Mapa de Vulnerabilidad"
        />
      </main>

      <style>{`
        button:hover { opacity: .85; }
        button:active { transform: scale(.97); }
      `}</style>
    </div>
  )
}

const s = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    background: '#0b0f1a',
    fontFamily: "'DM Sans', sans-serif",
  },
  header: {
    height: 52,
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 20px',
    background: 'rgba(17,24,39,.95)',
    borderBottom: '1px solid rgba(255,255,255,.07)',
    backdropFilter: 'blur(12px)',
    zIndex: 100,
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  logoWrap: {
    width: 34,
    height: 34,
    borderRadius: 8,
    background: 'rgba(34,197,94,.1)',
    border: '1px solid rgba(34,197,94,.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sysName: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 13,
    fontWeight: 700,
    color: '#f1f5f9',
    lineHeight: 1.2,
  },
  sysDesc: {
    fontSize: 10,
    color: '#475569',
    letterSpacing: '.04em',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  userChip: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: 'rgba(255,255,255,.04)',
    border: '1px solid rgba(255,255,255,.07)',
    borderRadius: 24,
    padding: '4px 12px 4px 4px',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #22c55e, #0ea5e9)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Syne', sans-serif",
    fontWeight: 700,
    fontSize: 12,
    color: '#052e16',
  },
  userName: {
    fontSize: 12,
    fontWeight: 500,
    color: '#e2e8f0',
    lineHeight: 1.2,
  },
  userRole: {
    fontSize: 10,
    color: '#475569',
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    background: 'rgba(239,68,68,.08)',
    border: '1px solid rgba(239,68,68,.2)',
    borderRadius: 8,
    color: '#fca5a5',
    fontSize: 12,
    fontWeight: 500,
    padding: '6px 12px',
    cursor: 'pointer',
    transition: 'opacity .15s, transform .1s',
    fontFamily: "'DM Sans', sans-serif",
  },
  confirmRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  confirmTxt: {
    fontSize: 12,
    color: '#94a3b8',
  },
  btnYes: {
    background: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: 6,
    padding: '5px 10px',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
    transition: 'opacity .15s',
  },
  btnNo: {
    background: 'rgba(255,255,255,.06)',
    color: '#94a3b8',
    border: '1px solid rgba(255,255,255,.08)',
    borderRadius: 6,
    padding: '5px 10px',
    fontSize: 12,
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
    transition: 'opacity .15s',
  },
  main: {
    flex: 1,
    overflow: 'hidden',
  },
  iframe: {
    width: '100%',
    height: '100%',
    border: 'none',
    display: 'block',
  },
}
