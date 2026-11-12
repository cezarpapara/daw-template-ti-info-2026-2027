import { useState } from 'react'
import { Link } from 'react-router'
import Card from '../components/Card.jsx'
import PageTitle from '../components/PageTitle.jsx'

const sections = [
  { id: 1, title: 'Backend', text: 'Symfony 8 și PHP 8.5 expun un API JSON.' },
  { id: 2, title: 'Frontend', text: 'React 19 afișează datele primite de la API.', link: '/produse' },
  { id: 3, title: 'Baza de date', text: 'PostgreSQL 18 păstrează datele.' },
  {
    id: 4,
    title: 'Docker',
    text: 'Fiecare parte a aplicației rulează în containerul ei, așa că proiectul pornește la fel pe orice calculator.',
    image: '/docker.svg',
    imageAlt: 'Patru containere așezate pe o navă, simbolul Docker',
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
      <p>Proiectul are {sections.length} părți principale:</p>
      <div className="info-card-grid">
        {sections.map((section) => (
          <Card
            key={section.id}
            title={section.title}
            text={section.text}
            image={section.image}
            imageAlt={section.imageAlt}
          >
            {section.link && <Link to={section.link}>Vezi produsele</Link>}
          </Card>
        ))}
      </div>

      <div className="counter">
        <button type="button" onClick={() => setCount(count + 1)}>
          Ați apăsat de {count} ori
        </button>
        <button type="button" onClick={() => setCount(0)}>
          Resetează
        </button>
      </div>
    </section>
  )
}
