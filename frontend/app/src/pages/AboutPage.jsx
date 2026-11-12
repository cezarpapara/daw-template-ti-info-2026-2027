import { useState } from 'react'

// Pagina Despre: informatii despre aplicatie + butonul-contor (Laboratorul 05, ex. 1)
function AboutPage() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>Despre</h1>
      <p className="subtitle">Aplicatie realizata la disciplina Programare Web / DAW</p>

      <section className="card">
        <h2>Ce face aplicatia</h2>
        <p>
          Frontend-ul React afiseaza categorii si produse primite de la un backend Symfony,
          prin cereri catre API.
        </p>
      </section>

      <section className="card">
        <h2>Contor</h2>
        <div className="form">
          <button type="button" onClick={() => setCount(count + 1)}>
            Ați apăsat de {count} ori
          </button>
          <button type="button" onClick={() => setCount(0)} disabled={count === 0}>
            Resetează
          </button>
        </div>
      </section>
    </>
  )
}

export default AboutPage
