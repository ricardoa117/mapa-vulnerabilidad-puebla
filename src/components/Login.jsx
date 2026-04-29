import { useState } from 'react'
import { supabase } from '../supabase.js'

/* ─── Patrón SVG Talavera Poblana ─── */
function TalaveraSVG({ dark }) {
  const tileBg = dark ? '#0a1f38' : '#e8f4fb'
  const tileFg = dark ? '#0092DD' : '#005ca9'
  const panelBg = dark ? '#003366' : '#0092DD'

  return (
    <svg
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      viewBox="0 0 420 600"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern id="tv" x="0" y="0" width="140" height="140" patternUnits="userSpaceOnUse">
          <rect width="140" height="140" fill={tileBg}/>
          <rect x="4" y="4" width="132" height="132" fill="none" stroke={tileFg} strokeWidth="2.5"/>
          <rect x="9" y="9" width="122" height="122" fill="none" stroke={tileFg} strokeWidth="0.7"/>
          <g fill="#0092DD" opacity="0.35">
            {[28,48,70,92,112].map(x => [28,48,92,112].map(y =>
              <circle key={`${x}-${y}`} cx={x} cy={y} r="1.8"/>
            ))}
            <circle cx="28" cy="70" r="1.8"/><circle cx="112" cy="70" r="1.8"/>
          </g>
          <polygon points="70,14 126,70 70,126 14,70" fill="none" stroke={tileFg} strokeWidth="2.2"/>
          <polygon points="70,22 118,70 70,118 22,70" fill="none" stroke="#0092DD" strokeWidth="0.9" strokeDasharray="3,3"/>
          {/* Pétalos cardinales */}
          <path d="M70,36 C63,44 60,54 63,60 C66,65 70,63 70,63 C70,63 74,65 77,60 C80,54 77,44 70,36Z" fill={tileFg}/>
          <path d="M70,104 C63,96 60,86 63,80 C66,75 70,77 70,77 C70,77 74,75 77,80 C80,86 77,96 70,104Z" fill={tileFg}/>
          <path d="M36,70 C44,63 54,60 60,63 C65,66 63,70 63,70 C63,70 65,74 60,77 C54,80 44,77 36,70Z" fill={tileFg}/>
          <path d="M104,70 C96,63 86,60 80,63 C75,66 77,70 77,70 C77,70 75,74 80,77 C86,80 96,77 104,70Z" fill={tileFg}/>
          {/* Rayitas en pétalos */}
          <line x1="70" y1="40" x2="70" y2="56" stroke={tileBg} strokeWidth="0.8" opacity="0.7"/>
          <line x1="70" y1="84" x2="70" y2="100" stroke={tileBg} strokeWidth="0.8" opacity="0.7"/>
          <line x1="40" y1="70" x2="56" y2="70" stroke={tileBg} strokeWidth="0.8" opacity="0.7"/>
          <line x1="84" y1="70" x2="100" y2="70" stroke={tileBg} strokeWidth="0.8" opacity="0.7"/>
          {/* Pétalos diagonales */}
          <path d="M47,47 C47,41 53,40 55,46 C51,48 49,49 47,47Z" fill={tileFg}/>
          <path d="M93,47 C93,41 87,40 85,46 C89,48 91,49 93,47Z" fill={tileFg}/>
          <path d="M47,93 C47,99 53,100 55,94 C51,92 49,91 47,93Z" fill={tileFg}/>
          <path d="M93,93 C93,99 87,100 85,94 C89,92 91,91 93,93Z" fill={tileFg}/>
          {/* Centro concéntrico */}
          <circle cx="70" cy="70" r="16" fill={tileBg} stroke={tileFg} strokeWidth="1.8"/>
          <circle cx="70" cy="70" r="11" fill={tileFg}/>
          <circle cx="70" cy="70" r="6.5" fill={tileBg}/>
          <circle cx="70" cy="70" r="3" fill={tileFg}/>
          <circle cx="70" cy="60" r="2" fill={tileBg}/>
          <circle cx="70" cy="80" r="2" fill={tileBg}/>
          <circle cx="60" cy="70" r="2" fill={tileBg}/>
          <circle cx="80" cy="70" r="2" fill={tileBg}/>
          {/* Volutas en vértices del diamante */}
          <path d="M70,16 Q64,23 67,27 Q71,31 70,23" fill="none" stroke={tileFg} strokeWidth="1.6" strokeLinecap="round"/>
          <path d="M70,16 Q76,23 73,27 Q69,31 70,23" fill="none" stroke={tileFg} strokeWidth="1.6" strokeLinecap="round"/>
          <path d="M70,124 Q64,117 67,113 Q71,109 70,117" fill="none" stroke={tileFg} strokeWidth="1.6" strokeLinecap="round"/>
          <path d="M70,124 Q76,117 73,113 Q69,109 70,117" fill="none" stroke={tileFg} strokeWidth="1.6" strokeLinecap="round"/>
          <path d="M16,70 Q23,64 27,67 Q31,71 23,70" fill="none" stroke={tileFg} strokeWidth="1.6" strokeLinecap="round"/>
          <path d="M16,70 Q23,76 27,73 Q31,69 23,70" fill="none" stroke={tileFg} strokeWidth="1.6" strokeLinecap="round"/>
          <path d="M124,70 Q117,64 113,67 Q109,71 117,70" fill="none" stroke={tileFg} strokeWidth="1.6" strokeLinecap="round"/>
          <path d="M124,70 Q117,76 113,73 Q109,69 117,70" fill="none" stroke={tileFg} strokeWidth="1.6" strokeLinecap="round"/>
          {/* Flores en las 4 esquinas */}
          {[[14,14],[126,14],[14,126],[126,126]].map(([cx,cy]) => (
            <g key={`${cx}-${cy}`} transform={`translate(${cx},${cy})`}>
              <circle r="8" fill="none" stroke={tileFg} strokeWidth="1.5"/>
              <circle r="4" fill={tileFg}/>
              <circle cy="-8" r="2.2" fill={tileFg}/>
              <circle cx="8" r="2.2" fill={tileFg}/>
              <circle cy="8" r="2.2" fill={tileFg}/>
              <circle cx="-8" r="2.2" fill={tileFg}/>
            </g>
          ))}
          {/* Crucetas de unión entre tiles */}
          <line x1="0" y1="70" x2="14" y2="70" stroke={tileFg} strokeWidth="1.2"/>
          <line x1="126" y1="70" x2="140" y2="70" stroke={tileFg} strokeWidth="1.2"/>
          <line x1="70" y1="0" x2="70" y2="14" stroke={tileFg} strokeWidth="1.2"/>
          <line x1="70" y1="126" x2="70" y2="140" stroke={tileFg} strokeWidth="1.2"/>
        </pattern>

        <pattern id="meandro" x="0" y="0" width="32" height="20" patternUnits="userSpaceOnUse">
          <rect width="32" height="20" fill="#005ca9"/>
          <path d="M2,10 Q2,3 9,3 Q16,3 16,10 Q16,17 23,17 Q30,17 30,10" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round"/>
          <circle cx="16" cy="10" r="1.5" fill="#fdc533"/>
        </pattern>

        <pattern id="triangulos" x="0" y="0" width="24" height="16" patternUnits="userSpaceOnUse">
          <rect width="24" height="16" fill="#005ca9"/>
          <polygon points="12,2 22,14 2,14" fill="none" stroke="#fff" strokeWidth="1.4"/>
        </pattern>

        <linearGradient id="fadedown" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#005ca9" stopOpacity="0"/>
          <stop offset="45%" stopColor="#005ca9" stopOpacity="0.7"/>
          <stop offset="100%" stopColor="#003d75" stopOpacity="0.98"/>
        </linearGradient>
      </defs>

      <rect width="420" height="600" fill={panelBg}/>
      <rect width="420" height="600" fill="url(#tv)"/>
      <rect x="0" y="0" width="420" height="22" fill="url(#meandro)"/>
      <line x1="0" y1="22" x2="420" y2="22" stroke="#0092DD" strokeWidth="1"/>
      <rect x="0" y="558" width="420" height="20" fill="url(#triangulos)"/>
      <line x1="0" y1="558" x2="420" y2="558" stroke="#0092DD" strokeWidth="1"/>
      {/* Puntitos entre franja y tiles */}
      <g fill="#ffffff" opacity="0.5">
        {Array.from({length:26},(_,i)=>
          <circle key={i} cx={8+i*16} cy="27" r="1.5"/>
        )}
      </g>
      <rect x="394" y="0" width="26" height="600" fill="#005ca9" opacity="0.75"/>
      <line x1="394" y1="0" x2="394" y2="600" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8"/>
      <rect x="0" y="330" width="420" height="270" fill="url(#fadedown)"/>
    </svg>
  )
}

/* ─── Login principal ─── */
export default function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const [shake,    setShake]    = useState(false)
  const [focused,  setFocused]  = useState(null)
  const [dark,     setDark]     = useState(false)

  function triggerShake() { setShake(true); setTimeout(() => setShake(false), 500) }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!username.trim() || !password.trim()) {
      setError('Completa todos los campos.'); triggerShake(); return
    }
    setLoading(true); setError('')
    try {
      const { data, error: dbErr } = await supabase
        .from('usuarios_sistema')
        .select('id, username, nombre, password')
        .eq('username', username.trim())
        .single()
      if (dbErr || !data) throw new Error('Usuario no encontrado.')
      if (data.password !== password) throw new Error('Contraseña incorrecta.')
      onLogin({ id: data.id, username: data.username, nombre: data.nombre })
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión.'); triggerShake()
    } finally { setLoading(false) }
  }

  const D = dark
  const T = {
    root: { display:'flex', height:'100vh', width:'100vw', fontFamily:"'DM Sans',sans-serif", overflow:'hidden', background: D?'#1d1d1b':'#fff' },
    left: { width:'54%', position:'relative', overflow:'hidden', background: D?'#003366':'#0092DD', flexShrink:0, transition:'background .3s' },
    right: { flex:1, background:D?'#1d1d1b':'#fff', display:'flex', flexDirection:'column', justifyContent:'center', padding:'38px 36px', overflowY:'auto', transition:'background .3s' },
    thBtn: { position:'absolute', top:12, right:12, zIndex:20, background:'rgba(0,0,0,0.18)', border:'1px solid rgba(255,255,255,0.25)', borderRadius:20, color:'#fff', fontSize:13, padding:'5px 11px', cursor:'pointer', fontFamily:"'DM Sans',sans-serif" },
    brandOverlay: { position:'absolute', bottom:0, left:0, right:0, padding:'26px 28px 28px', background:'linear-gradient(to top,rgba(0,92,169,0.96) 0%,rgba(0,92,169,0.55) 55%,transparent 100%)' },
    brandEye: { fontSize:10, fontWeight:500, letterSpacing:'.18em', textTransform:'uppercase', color:'rgba(255,255,255,.6)', marginBottom:6 },
    brandName: { fontFamily:"'Playfair Display',serif", fontSize:28, fontWeight:900, color:'#fff', lineHeight:1.1, marginBottom:4 },
    brandSpan: { color:'#fdc533' },
    brandCity: { fontSize:12, color:'rgba(255,255,255,.5)', fontWeight:300, letterSpacing:'.06em' },
    overline: { fontSize:10, fontWeight:500, letterSpacing:'.16em', textTransform:'uppercase', color:'#0092DD', marginBottom:10, display:'flex', alignItems:'center', gap:8 },
    obar: { width:18, height:2.5, background:'#e94362', borderRadius:2, flexShrink:0 },
    h1: { fontFamily:"'Playfair Display',serif", fontSize:24, fontWeight:700, color:D?'#f5f8fc':'#1d1d1b', lineHeight:1.2, marginBottom:5 },
    sub: { fontSize:13, color:'#C6C6C6', fontWeight:300, marginBottom:24 },
    errBox: { display:'flex', alignItems:'center', gap:7, background:'rgba(233,67,98,0.08)', border:'1px solid rgba(233,67,98,0.25)', borderRadius:8, padding:'9px 12px', fontSize:13, color:'#e94362', marginBottom:12 },
    fg: { marginBottom:13 },
    label: { fontSize:10, fontWeight:500, letterSpacing:'.1em', textTransform:'uppercase', color:'#888', display:'block', marginBottom:5 },
    wrap: (f) => ({ display:'flex', alignItems:'center', gap:9, border:`1.5px solid ${f?'#0092DD':D?'#2a2a28':'#ebebeb'}`, borderRadius:10, padding:'0 13px', background:f?(D?'#1d1d1b':'#fff'):(D?'#252523':'#fafafa'), boxShadow:f?'0 0 0 3px rgba(0,146,221,.12)':'none', transition:'border-color .2s,box-shadow .2s,background .3s' }),
    icon: { width:15, height:15, color:'#C6C6C6', flexShrink:0 },
    input: { flex:1, border:'none', background:'none', outline:'none', fontFamily:"'DM Sans',sans-serif", fontSize:14, color:D?'#f5f8fc':'#1d1d1b', padding:'12px 0' },
    btn: { marginTop:4, width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:8, background:'#0092DD', color:'#fff', border:'none', borderRadius:10, fontFamily:"'Playfair Display',serif", fontSize:15, fontWeight:700, padding:14, cursor:'pointer', boxShadow:'0 2px 14px rgba(0,146,221,.28)', transition:'background .2s,transform .1s', animation: shake?'shake .45s ease':'' },
    foot: { marginTop:18, textAlign:'center', fontSize:11, color:'#C6C6C6', letterSpacing:'.05em', borderTop:`1px solid ${D?'#2a2a28':'#f0f0f0'}`, paddingTop:14 },
    spinner: { display:'inline-block', width:16, height:16, border:'2px solid rgba(255,255,255,.3)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin .7s linear infinite' },
  }

  return (
    <div className="login-root" style={T.root}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet"/>
      <style>{`
        @keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-7px)}40%{transform:translateX(7px)}60%{transform:translateX(-4px)}80%{transform:translateX(4px)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        .tia-input::placeholder{color:#C6C6C6}
        .tia-btn:hover:not(:disabled){background:#005ca9!important;box-shadow:0 4px 20px rgba(0,146,221,.38)!important}
        .tia-btn:active:not(:disabled){transform:scale(.98)}
        .tia-btn:disabled{opacity:.65;cursor:not-allowed}
        .tia-theme:hover{background:rgba(0,0,0,0.32)!important}

        /* ─── Responsive ─── */
        @media (max-width: 768px) {
          .login-root {
            flex-direction: column !important;
            height: auto !important;
            min-height: 100vh !important;
            overflow-y: auto !important;
          }
          .login-left {
            width: 100% !important;
            height: 35vh !important;
            flex-shrink: 0 !important;
          }
          .login-right {
            padding: 28px 24px !important;
            flex: none !important;
            width: 100% !important;
            min-height: auto !important;
          }
          .login-h1 {
            font-size: 20px !important;
          }
          .login-sub {
            font-size: 12px !important;
            margin-bottom: 18px !important;
          }
          .login-overline {
            font-size: 9px !important;
            margin-bottom: 8px !important;
          }
          .login-label {
            font-size: 9px !important;
          }
          .login-input {
            font-size: 14px !important;
            padding: 10px 0 !important;
          }
          .login-btn {
            font-size: 14px !important;
            padding: 12px !important;
          }
          .login-foot {
            font-size: 10px !important;
            margin-top: 14px !important;
            padding-top: 10px !important;
          }
        }
      `}</style>

      {/* Panel izquierdo: talavera */}
      <div className="login-left" style={T.left}>
        <button className="tia-theme" style={T.thBtn} onClick={() => setDark(!D)}>
          {D ? '☀️ Claro' : '🌙 Oscuro'}
        </button>
        <TalaveraSVG dark={D}/>
        <div style={T.brandOverlay}>
          <p style={T.brandEye}>Organización sin fines de lucro</p>
          <h2 style={T.brandName}>TECHO <span style={T.brandSpan}>Puebla</span></h2>
          <p style={T.brandCity}>Sistema de análisis territorial · INEGI 2020</p>
        </div>
      </div>

      {/* Panel derecho: formulario */}
      <div className="login-right" style={T.right}>
        <div className="login-overline" style={T.overline}><span style={T.obar}/>Acceso al sistema</div>
        <h1 className="login-h1" style={T.h1}>Bienvenido<br/>de vuelta</h1>
        <p className="login-sub" style={T.sub}>Ingresa tus credenciales para continuar</p>

        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:0 }}>
          {error && (
            <div style={T.errBox}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#e94362" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          <div style={T.fg}>
            <label className="login-label" style={T.label}>Usuario</label>
            <div style={T.wrap(focused==='u')}>
              <svg style={T.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
              <input className="tia-input login-input" type="text" value={username}
                onChange={e=>setUsername(e.target.value)}
                onFocus={()=>setFocused('u')} onBlur={()=>setFocused(null)}
                placeholder="tu_usuario" autoComplete="username" disabled={loading}
                style={T.input}/>
            </div>
          </div>

          <div style={T.fg}>
            <label className="login-label" style={T.label}>Contraseña</label>
            <div style={T.wrap(focused==='p')}>
              <svg style={T.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input className="tia-input login-input" type="password" value={password}
                onChange={e=>setPassword(e.target.value)}
                onFocus={()=>setFocused('p')} onBlur={()=>setFocused(null)}
                placeholder="••••••••" autoComplete="current-password" disabled={loading}
                style={T.input}/>
            </div>
          </div>

          <button className="tia-btn login-btn" type="submit" disabled={loading} style={T.btn}>
            {loading
              ? <span style={T.spinner}/>
              : <>Ingresar al sistema
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </>
            }
          </button>
        </form>

        <p className="login-foot" style={T.foot}>Acceso restringido · datos protegidos · Techo Puebla</p>
      </div>
    </div>
  )
}
