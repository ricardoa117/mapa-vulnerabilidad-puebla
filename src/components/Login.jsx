import { useState, useEffect, useRef } from 'react'
import { supabase } from '../supabase.js'

/* ─── Tiny canvas de puntos que simulan un mapa de calor ─── */
function MapCanvas() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let W = canvas.width  = canvas.offsetWidth
    let H = canvas.height = canvas.offsetHeight

    // Puntos fijos que recuerdan al mapa de Puebla
    const SEED = 42
    const rng = (() => { let s = SEED; return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff } })()
    const pts = Array.from({ length: 180 }, () => ({
      x: rng() * W, y: rng() * H,
      vx: (rng() - .5) * .18, vy: (rng() - .5) * .18,
      r: rng(),                   // 0..1 → color
      s: 1.5 + rng() * 3,
    }))

    const COLORS = ['#22c55e','#0ea5e9','#f59e0b','#ef4444','#a78bfa']

    let raf
    function draw() {
      ctx.clearRect(0, 0, W, H)

      // Líneas de conexión suaves entre puntos cercanos
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x
          const dy = pts[i].y - pts[j].y
          const d  = Math.sqrt(dx*dx + dy*dy)
          if (d < 90) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(34,197,94,${(1 - d/90) * .12})`
            ctx.lineWidth = .6
            ctx.moveTo(pts[i].x, pts[i].y)
            ctx.lineTo(pts[j].x, pts[j].y)
            ctx.stroke()
          }
        }
      }

      pts.forEach(p => {
        ctx.beginPath()
        const col = COLORS[Math.floor(p.r * COLORS.length)]
        ctx.fillStyle = col.replace(')', ', .65)').replace('rgb', 'rgba').replace('#', '')
        // Convertir hex a rgba manualmente
        ctx.fillStyle = hexToRgba(col, .65)
        ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2)
        ctx.fill()

        // Halo
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.s * 6)
        g.addColorStop(0, hexToRgba(col, .08))
        g.addColorStop(1, 'transparent')
        ctx.beginPath()
        ctx.fillStyle = g
        ctx.arc(p.x, p.y, p.s * 6, 0, Math.PI * 2)
        ctx.fill()

        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0
      })

      raf = requestAnimationFrame(draw)
    }

    function hexToRgba(hex, a) {
      const r = parseInt(hex.slice(1,3),16)
      const g = parseInt(hex.slice(3,5),16)
      const b = parseInt(hex.slice(5,7),16)
      return `rgba(${r},${g},${b},${a})`
    }

    draw()
    const obs = new ResizeObserver(() => {
      W = canvas.width  = canvas.offsetWidth
      H = canvas.height = canvas.offsetHeight
    })
    obs.observe(canvas)
    return () => { cancelAnimationFrame(raf); obs.disconnect() }
  }, [])

  return <canvas ref={ref} style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:.6 }} />
}

/* ─── Componente principal de Login ─── */
export default function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const [shake,    setShake]    = useState(false)
  const [focused,  setFocused]  = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!username.trim() || !password.trim()) {
      setError('Completa todos los campos.')
      triggerShake()
      return
    }

    setLoading(true)
    setError('')

    try {
      const { data, error: dbErr } = await supabase
        .from('usuarios_sistema')
        .select('id, username, nombre, password')
        .eq('username', username.trim())
        .single()

      if (dbErr || !data) {
        throw new Error('Usuario no encontrado.')
      }

      // Comparación directa de contraseña (texto plano según la tabla)
      if (data.password !== password) {
        throw new Error('Contraseña incorrecta.')
      }

      onLogin({ id: data.id, username: data.username, nombre: data.nombre })

    } catch (err) {
      setError(err.message || 'Error al iniciar sesión.')
      triggerShake()
    } finally {
      setLoading(false)
    }
  }

  function triggerShake() {
    setShake(true)
    setTimeout(() => setShake(false), 500)
  }

  return (
    <div style={styles.root}>
      {/* Canvas de fondo */}
      <MapCanvas />

      {/* Gradiente radial de ambiente */}
      <div style={styles.glow1} />
      <div style={styles.glow2} />

      {/* Cuadrícula sutil */}
      <div style={styles.grid} />

      {/* Tarjeta */}
      <div style={{ ...styles.card, ...(shake ? styles.cardShake : {}) }}>

        {/* Logo / Ícono */}
        <div style={styles.logoWrap}>
          <div style={styles.logoRing}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
              <circle cx="12" cy="9" r="2.5"/>
            </svg>
          </div>
          <div style={styles.pulse} />
        </div>

        {/* Títulos */}
        <div style={styles.titleBlock}>
          <p style={styles.overline}>Sistema MV · Puebla</p>
          <h1 style={styles.title}>Acceso al<br/>Sistema</h1>
          <p style={styles.subtitle}>Análisis de Vulnerabilidad Social</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} style={styles.form}>

          <div style={styles.field}>
            <label style={styles.label}>Usuario</label>
            <div style={{
              ...styles.inputWrap,
              ...(focused === 'user' ? styles.inputWrapFocus : {})
            }}>
              <svg style={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                onFocus={() => setFocused('user')}
                onBlur={() => setFocused(null)}
                placeholder="tu_usuario"
                autoComplete="username"
                style={styles.input}
                disabled={loading}
              />
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Contraseña</label>
            <div style={{
              ...styles.inputWrap,
              ...(focused === 'pass' ? styles.inputWrapFocus : {})
            }}>
              <svg style={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onFocus={() => setFocused('pass')}
                onBlur={() => setFocused(null)}
                placeholder="••••••••"
                autoComplete="current-password"
                style={styles.input}
                disabled={loading}
              />
            </div>
          </div>

          {error && (
            <div style={styles.errorBox}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          <button type="submit" style={styles.btn} disabled={loading}>
            {loading ? (
              <span style={styles.spinner} />
            ) : (
              <>
                Ingresar al sistema
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </>
            )}
          </button>
        </form>

        {/* Footer de la tarjeta */}
        <p style={styles.cardFooter}>
          Acceso restringido · datos protegidos
        </p>
      </div>

      {/* Footer global */}
      <p style={styles.globalFooter}>
        Proyecto MV · INEGI 2020 · Puebla, México
      </p>

      <style>{`
        @keyframes shake {
          0%,100%{transform:translateX(0) translateY(-50%)}
          20%{transform:translateX(-10px) translateY(-50%)}
          40%{transform:translateX(10px) translateY(-50%)}
          60%{transform:translateX(-6px) translateY(-50%)}
          80%{transform:translateX(6px) translateY(-50%)}
        }
        @keyframes pulse-ring {
          0%{transform:scale(1);opacity:.6}
          100%{transform:scale(2.2);opacity:0}
        }
        @keyframes spin {
          to{transform:rotate(360deg)}
        }
        @keyframes fadeUp {
          from{opacity:0;transform:translateY(20px) translateX(-50%)}
          to{opacity:1;transform:translateY(0) translateX(-50%)}
        }
        input::placeholder { color: #475569; }
        input:disabled { opacity: .5; cursor: not-allowed; }
        button:not(:disabled):hover {
          background: #16a34a !important;
          box-shadow: 0 0 32px rgba(34,197,94,.35) !important;
        }
        button:not(:disabled):active { transform: scale(.98); }
      `}</style>
    </div>
  )
}

/* ─── Estilos inline ─── */
const styles = {
  root: {
    position: 'relative',
    width: '100vw',
    height: '100vh',
    background: 'radial-gradient(ellipse at 60% 40%, #0d1f12 0%, #0b0f1a 60%)',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow1: {
    position: 'absolute',
    width: 600,
    height: 600,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(34,197,94,.08) 0%, transparent 70%)',
    top: '-10%',
    left: '60%',
    pointerEvents: 'none',
  },
  glow2: {
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(14,165,233,.06) 0%, transparent 70%)',
    bottom: '-5%',
    left: '10%',
    pointerEvents: 'none',
  },
  grid: {
    position: 'absolute',
    inset: 0,
    backgroundImage: 'linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px)',
    backgroundSize: '48px 48px',
    pointerEvents: 'none',
  },
  card: {
    position: 'relative',
    zIndex: 10,
    width: '100%',
    maxWidth: 420,
    background: 'rgba(17,24,39,.85)',
    border: '1px solid rgba(255,255,255,.08)',
    borderRadius: 20,
    padding: '40px 36px 32px',
    backdropFilter: 'blur(24px)',
    boxShadow: '0 32px 80px rgba(0,0,0,.6), 0 0 0 1px rgba(34,197,94,.06) inset',
  },
  cardShake: {
    animation: 'shake .5s ease',
  },
  logoWrap: {
    position: 'relative',
    width: 56,
    height: 56,
    marginBottom: 24,
  },
  logoRing: {
    width: 56,
    height: 56,
    borderRadius: '50%',
    background: 'rgba(34,197,94,.1)',
    border: '1.5px solid rgba(34,197,94,.35)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulse: {
    position: 'absolute',
    inset: 0,
    borderRadius: '50%',
    border: '1.5px solid rgba(34,197,94,.4)',
    animation: 'pulse-ring 2s ease-out infinite',
  },
  titleBlock: {
    marginBottom: 28,
  },
  overline: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 11,
    fontWeight: 500,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: '#22c55e',
    marginBottom: 8,
  },
  title: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 32,
    fontWeight: 800,
    lineHeight: 1.15,
    color: '#f1f5f9',
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 13,
    color: '#64748b',
    fontWeight: 300,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  label: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 11,
    fontWeight: 500,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: '#94a3b8',
  },
  inputWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    background: 'rgba(255,255,255,.04)',
    border: '1px solid rgba(255,255,255,.08)',
    borderRadius: 10,
    padding: '0 14px',
    transition: 'border-color .2s, box-shadow .2s',
  },
  inputWrapFocus: {
    borderColor: 'rgba(34,197,94,.5)',
    boxShadow: '0 0 0 3px rgba(34,197,94,.08)',
  },
  inputIcon: {
    width: 16,
    height: 16,
    color: '#475569',
    flexShrink: 0,
  },
  input: {
    flex: 1,
    background: 'none',
    border: 'none',
    outline: 'none',
    color: '#e2e8f0',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 14,
    fontWeight: 400,
    padding: '13px 0',
  },
  errorBox: {
    display: 'flex',
    alignItems: 'center',
    gap: 7,
    background: 'rgba(239,68,68,.08)',
    border: '1px solid rgba(239,68,68,.2)',
    borderRadius: 8,
    padding: '9px 12px',
    fontSize: 13,
    color: '#fca5a5',
    fontFamily: "'DM Sans', sans-serif",
  },
  btn: {
    marginTop: 4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    background: '#22c55e',
    color: '#052e16',
    fontFamily: "'Syne', sans-serif",
    fontSize: 14,
    fontWeight: 700,
    letterSpacing: '.02em',
    border: 'none',
    borderRadius: 10,
    padding: '14px 20px',
    cursor: 'pointer',
    transition: 'background .2s, box-shadow .2s, transform .1s',
    boxShadow: '0 0 20px rgba(34,197,94,.2)',
  },
  spinner: {
    display: 'inline-block',
    width: 18,
    height: 18,
    border: '2px solid rgba(5,46,22,.3)',
    borderTopColor: '#052e16',
    borderRadius: '50%',
    animation: 'spin .7s linear infinite',
  },
  cardFooter: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 11,
    color: '#334155',
    fontFamily: "'DM Sans', sans-serif",
    letterSpacing: '.06em',
    textTransform: 'uppercase',
  },
  globalFooter: {
    position: 'absolute',
    bottom: 20,
    left: '50%',
    transform: 'translateX(-50%)',
    fontSize: 11,
    color: '#1e293b',
    fontFamily: "'DM Sans', sans-serif",
    letterSpacing: '.08em',
    whiteSpace: 'nowrap',
    zIndex: 10,
  },
}
