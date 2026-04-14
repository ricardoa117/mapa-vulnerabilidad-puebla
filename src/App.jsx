import { useState, useEffect } from 'react'
import Login from './components/Login.jsx'
import Dashboard from './components/Dashboard.jsx'

export default function App() {
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // Revisar sesión guardada en sessionStorage
    const saved = sessionStorage.getItem('tia_user')
    if (saved) {
      try { setUser(JSON.parse(saved)) } catch {}
    }
    setReady(true)
  }, [])

  function handleLogin(userData) {
    sessionStorage.setItem('tia_user', JSON.stringify(userData))
    setUser(userData)
  }

  function handleLogout() {
    sessionStorage.removeItem('tia_user')
    setUser(null)
  }

  if (!ready) return null

  return user
    ? <Dashboard user={user} onLogout={handleLogout} />
    : <Login onLogin={handleLogin} />
}
