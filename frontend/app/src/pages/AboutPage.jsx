import { useEffect, useState } from 'react'
import { api } from '../api.js'
import Card from '../components/Card.jsx'
import PageTitle from '../components/PageTitle.jsx'

// Datele cardurilor: o lista de obiecte, din care cardurile se genereaza cu .map().
// Exercitiul 1: al patrulea element, "Docker", apare fara alte modificari in cod.
// Exercitiul 2: imaginea din frontend/app/public/ se foloseste cu o cale care incepe cu /.
const sections = [
  { id: 1, title: 'Backend', text: 'Symfony 8 si PHP 8.5 expun un API JSON.' },
  { id: 2, title: 'Frontend', text: 'React 19 afiseaza datele primite de la API.' },
  { id: 3, title: 'Baza de date', text: 'PostgreSQL 18 pastreaza datele.' },
  {
    id: 4,
    title: 'Docker',
    text: 'Fiecare parte ruleaza in containerul ei, asa ca proiectul porneste la fel pe orice calculator, fara sa instalam PHP, Node.js sau PostgreSQL.',
    image: '/docker.svg',
    imageAlt: 'Trei containere: nginx si PHP, PostgreSQL si React',
  },
]

// Pagina "Despre proiect": /despre
function AboutPage() {
  // Laboratorul 05, exercitiul 1: starea contorului; la fiecare setCount, React redeseneaza pagina
  const [count, setCount] = useState(0)

  // Laboratorul 06, exercitiul 5: mesajul vine de la backend, GET /api/hello/{name}
  const [hello, setHello] = useState(null)
  const [helloError, setHelloError] = useState(null)

  useEffect(() => {
    api.getHello('Stefan')
      .then((data) => setHello(data.message))
      .catch((err) => setHelloError(err.message))
  }, [])

  return (
    <section>
      <PageTitle
        title="Despre proiect"
        subtitle="Aplicatie realizata la laboratorul de PW/DAW, 2026-2027."
      />
      {/* exercitiul 5: numarul de sectiuni, calculat din lista */}
      <p className="muted">Proiectul are {sections.length} componente principale.</p>

      <section className="card">
        <h2>Mesaj de la backend</h2>  
        {hello && <p>{hello}</p>}
        {helloError && <div className="status status-error">{helloError}</div>}
        {!hello && !helloError && <p>Se incarca...</p>}
      </section>

      <section className="card">
        <h2>Contor</h2>
        <div className="form">
          <button type="button" onClick={() => setCount(count + 1)}>
            Ati apasat de {count} ori
          </button>
          <button type="button" onClick={() => setCount(0)}>Reseteaza</button>
        </div>
      </section>

      <div className="info-card-grid">
        {/* key spune lui React care card este care, ca sa actualizeze doar ce s-a schimbat;
            folosim id-ul (unic si stabil), nu pozitia din lista */}
        {sections.map((section) => (
          <Card
            key={section.id}
            title={section.title}
            text={section.text}
            image={section.image}
            imageAlt={section.imageAlt}
          >
            {/* exercitiul 4: continutul dintre <Card> si </Card> ajunge in props.children */}
            <button type="button" onClick={() => window.alert(section.text)}>Detalii</button>
          </Card>
        ))}
      </div>
    </section>
  )
}

export default AboutPage
