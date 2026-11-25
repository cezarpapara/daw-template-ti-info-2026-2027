
import { useState } from 'react'
import Card from '../components/Card.jsx'
import PageTitle from '../components/PageTitle.jsx'

const sections = [
  {
    id: 1,
    title: 'Backend',
    text: 'Symfony 8 și PHP 8.5 expun un API JSON.',
  },
  {
    id: 2,
    title: 'Frontend',
    text: 'React 19 afișează datele primite de la API.',
  },
  {
    id: 3,
    title: 'Baza de date',
    text: 'PostgreSQL 18 păstrează datele.',
  },
  {
    id: 4,
    title: 'Docker',
    text: 'Docker gestionează containerele aplicației și mediul de dezvoltare.',
    image: '/arhitectura-proiect.png',
    imageAlt: 'Arhitectura tehnică a proiectului PW/DAW',
  },
]

export default function AboutPage() {
  const [count, setCount] = useState(0)

  return (
    <section>
      <PageTitle
        title="Despre proiect"
        subtitle="Aplicație realizată la laboratorul de PW/DAW, 2026–2027."
      />

      <div className="info-card-grid">
        {sections.map((section) => (
          <Card
            key={section.id}
            title={section.title}
            text={section.text}
            image={section.image}
            imageAlt={section.imageAlt}
          />
        ))}
      </div>

      <section className="counter-panel">
        <h2>Contor interactiv</h2>
        <p>Numărul apăsărilor: <strong>{count}</strong></p>

        <div className="counter-actions">
          <button type="button" onClick={() => setCount(count + 1)}>
            Incrementează
          </button>

          <button
            type="button"
            className="counter-reset"
            onClick={() => setCount(0)}
          >
            Resetează
          </button>
        </div>
      </section>
    </section>
  )
}
