import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { api } from '../api.js'
import { useAuth } from '../AuthContext.jsx'

// Pagina de inregistrare: POST /api/auth/register, apoi autentificare automata
function RegisterPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [violations, setViolations] = useState({})
  const [sending, setSending] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setSending(true)
    try {
      await api.register(email, password)
      await login(email, password)
      navigate('/produse')
    } catch (err) {
      setError(err.message)
      setViolations(err.violations ?? {})
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <h1>Cont nou</h1>

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
          {violations.email && <span className="field-error">{violations.email}</span>}
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Parola"
            autoComplete="new-password"
            minLength={8}
            required
          />
          {violations.password && <span className="field-error">{violations.password}</span>}
          <p className="muted">Minim 8 caractere; folositi litere mari si mici, cifre si simboluri.</p>
          <button type="submit" disabled={sending}>{sending ? 'Se creeaza...' : 'Creeaza contul'}</button>
        </form>
        <p className="muted">Aveti deja cont? <Link to="/autentificare">Autentificati-va</Link></p>
      </section>
    </>
  )
}

export default RegisterPage
