import { useState } from 'react'

function AboutPage() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>Despre</h1>
      <p className="subtitle">O aplicatie de laborator pentru Programare Web / DAW.</p>

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
