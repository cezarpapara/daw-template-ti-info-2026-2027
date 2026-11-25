
import { useEffect, useState } from 'react'
import { api } from '../api.js'

function HomePage() {
  const [health, setHealth] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.getHealth()
      .then((data) => setHealth(data))
      .catch((err) => setError(err.message))
  }, [])

  return (
    <div className="home-layout">
      <section className="home-hero">
        <div className="alliance-emblem">♌</div>
        <div>
          <h1>Aplicatie PW / DAW</h1>
          <p>Frontend React conectat la un backend Symfony</p>
        </div>
      </section>

      <section className="glass-panel home-backend">
        <h2><span className="panel-icon">▤</span> Starea backend-ului</h2>

        <p className="request-line">
          Cerere: <code>GET {api.url}/api/health</code>
        </p>

        {!health && !error && (
          <p className="loading-text">Se verifica conexiunea...</p>
        )}

        {error && (
          <div className="status status-error">
            <strong>Backend-ul nu raspunde.</strong>
            <p>{error}</p>
            <p>
              Porniti backend-ul din folderul principal:
              <code> docker compose -f backend/compose.yaml up -d</code>
            </p>
          </div>
        )}

        {health && (
          <div className="status status-ok">
            <p><strong>● Conectat</strong></p>
            <p><strong>Mesaj:</strong> {health.message}</p>
            <p><strong>Baza de date:</strong> {health.database}</p>
            <p><strong>Ora serverului:</strong> {health.time}</p>
          </div>
        )}
      </section>

      <section className="glass-panel home-links">
        <h2><span className="panel-icon">↗</span> Link-uri utile</h2>
        <p>Documentatia API (Swagger)</p>
        <a
          href={`${api.url}/api/doc`}
          target="_blank"
          rel="noreferrer"
          className="gold-link"
        >
          Deschide documentatia API ↗
        </a>
      </section>
    </div>
  )
}

export default HomePage
