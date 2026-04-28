import { useState } from 'react'

/* ─── Paleta oficial Techo:
   Principal: #0092DD (celeste), #ffffff
   Secundarios: #fdc533 #2fac66 #005ca9 #e94362 #f088b6 #954b97 #1d1d1b #C6C6C6
─── */

export default function Dashboard({ user, onLogout }) {
  const [confirm, setConfirm] = useState(false)
  const [dark,    setDark]    = useState(false)
  const D = dark

  const header = {
    height: 52,
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 18px',
    background: D ? '#111110' : '#ffffff',
    borderBottom: `1px solid ${D?'rgba(255,255,255,0.07)':'rgba(0,0,0,0.07)'}`,
    fontFamily: "'DM Sans', sans-serif",
    transition: 'background .3s',
    zIndex: 100,
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh', background:D?'#1d1d1b':'#f5f8fc', transition:'background .3s' }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet"/>
      <style>{`
        .dash-btn:hover{opacity:.8}
        .dash-btn:active{transform:scale(.97)}
      `}</style>

      {/* ── Header ── */}
      <header style={header}>

        {/* Logo + nombre */}
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:34, height:34, borderRadius:8, background:'#0092DD', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </div>
          <div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:13, fontWeight:700, color:D?'#f5f8fc':'#1d1d1b', lineHeight:1.2 }}>
              TECHO <span style={{ color:'#0092DD' }}>Puebla</span>
            </div>
            <div style={{ fontSize:10, color:'#C6C6C6', letterSpacing:'.04em' }}>
              Sistema de Análisis Territorial
            </div>
          </div>
        </div>

        {/* Controles derecha */}
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>

          {/* Toggle tema */}
          <button className="dash-btn" onClick={() => setDark(!D)} style={{
            background: D?'rgba(255,255,255,0.06)':'rgba(0,0,0,0.05)',
            border: `1px solid ${D?'rgba(255,255,255,0.1)':'rgba(0,0,0,0.08)'}`,
            borderRadius: 20, color: D?'#f5f8fc':'#1d1d1b',
            fontSize: 12, padding: '5px 11px', cursor: 'pointer',
            fontFamily:"'DM Sans',sans-serif", transition:'opacity .15s',
          }}>
            {D ? '☀️ Claro' : '🌙 Oscuro'}
          </button>

          {/* Chip usuario */}
          <div style={{
            display:'flex', alignItems:'center', gap:8,
            background: D?'rgba(255,255,255,0.05)':'rgba(0,146,221,0.07)',
            border: `1px solid ${D?'rgba(255,255,255,0.08)':'rgba(0,146,221,0.2)'}`,
            borderRadius: 24, padding: '4px 12px 4px 4px',
          }}>
            <div style={{
              width:28, height:28, borderRadius:'50%',
              background:'linear-gradient(135deg,#0092DD,#005ca9)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:12, color:'#fff',
            }}>
              {(user.nombre||user.username)[0].toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize:12, fontWeight:500, color:D?'#f5f8fc':'#1d1d1b', lineHeight:1.2 }}>
                {user.nombre||user.username}
              </div>
              <div style={{ fontSize:10, color:'#C6C6C6' }}>@{user.username}</div>
            </div>
          </div>

          {/* Cerrar sesión */}
          {confirm ? (
            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
              <span style={{ fontSize:12, color:'#C6C6C6' }}>¿Salir?</span>
              <button className="dash-btn" onClick={onLogout} style={{
                background:'#e94362', color:'#fff', border:'none',
                borderRadius:7, padding:'5px 10px', fontSize:12, fontWeight:600,
                cursor:'pointer', fontFamily:"'DM Sans',sans-serif", transition:'opacity .15s',
              }}>Sí</button>
              <button className="dash-btn" onClick={()=>setConfirm(false)} style={{
                background:D?'rgba(255,255,255,0.06)':'rgba(0,0,0,0.05)',
                color:D?'#f5f8fc':'#1d1d1b',
                border:`1px solid ${D?'rgba(255,255,255,0.1)':'rgba(0,0,0,0.08)'}`,
                borderRadius:7, padding:'5px 10px', fontSize:12, fontWeight:500,
                cursor:'pointer', fontFamily:"'DM Sans',sans-serif", transition:'opacity .15s',
              }}>No</button>
            </div>
          ) : (
            <button className="dash-btn" onClick={()=>setConfirm(true)} style={{
              display:'flex', alignItems:'center', gap:5,
              background:'rgba(233,67,98,0.07)',
              border:'1px solid rgba(233,67,98,0.2)',
              borderRadius:8, color:'#e94362',
              fontSize:12, fontWeight:500, padding:'6px 12px', cursor:'pointer',
              fontFamily:"'DM Sans',sans-serif", transition:'opacity .15s',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Salir
            </button>
          )}
        </div>
      </header>

      {/* ── Mapa ── */}
      <main style={{ flex:1, overflow:'hidden' }}>
        <iframe
          src="/mapa_vulnerabilidad_combinado.html"
          style={{ width:'100%', height:'100%', border:'none', display:'block' }}
          title="Mapa de Vulnerabilidad — Techo Puebla"
        />
      </main>
    </div>
  )
}
