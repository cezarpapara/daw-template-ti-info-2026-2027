import { useEffect, useState } from 'react'
import { api } from '../api.js'

function AboutPage() {
  const [count, setCount] = useState(0)
  const [greeting, setGreeting] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.getHello('Xenia')
      .then((data) => setGreeting(data.message))
      .catch((err) => setError(err.message))
  }, [])

  return (
    <>
      <h1>Despre</h1>
      <p className="subtitle">O aplicatie de laborator pentru Programare Web / DAW.</p>

      <section className="card">
        <h2>Salut de la backend</h2>
        {error && <div className="status status-error">{error}</div>}
        {!greeting && !error && <p>Se incarca...</p>}
        {greeting && <p>{greeting}</p>}
      </section>

      <section className="card">
        <h2>Contor de click-uri</h2>
        <p>Ai apasat butonul de {count} ori.</p>
        <div className="form">
          <button type="button" onClick={() => setCount((currentCount) => currentCount + 1)}>
            Adauga un click
          </button>
          <button type="button" onClick={() => setCount(0)}>Reseteaza</button>
        </div>
      </section>
    </>
  )
}

export default AboutPage
