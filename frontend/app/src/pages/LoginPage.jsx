import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../AuthContext.jsx'

// Pagina de autentificare: POST /api/auth/login
function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [sending, setSending] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setSending(true)
    try {
      await login(email, password)
      navigate('/produse')
    } catch (err) {
      setError(err.message)
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <h1>Autentificare</h1>

      {error && <div className="status status-error">{error}</div>}

      <section className="card">
        <form onSubmit={handleSubmit} className="form form-column">
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email"
            autoComplete="username"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Parola"
            autoComplete="current-password"
            required
          />
          <button type="submit" disabled={sending}>{sending ? 'Se verifica...' : 'Intra in cont'}</button>
        </form>
        <p className="muted">Nu aveti cont? <Link to="/inregistrare">Inregistrati-va</Link></p>
      </section>
    </>
  )
}

export default LoginPage
