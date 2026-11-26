
import Card from '../components/card';
import PageTitle from '../components/PageTitle';
import { useState } from 'react';

const sections = [
  {
    id: 1,
    title: 'Backend',
    text: 'Symfony & PHP 8.5 expun un API JSON.',
    image: '/echipa.jpg',
    imageAlt: 'Echipa de programatori'
  },
  {
    id: 2,
    title: 'Frontend',
    text: 'React 19 afișează datele primite de la API.'
  },
  {
    id: 3,
    title: 'Baza de date',
    text: 'PostgreSQL 18 păstrează datele.'
  },
  {
    id: 4,
    title: 'Docker',
    text: 'Docker permite rularea aplicației în containere izolate.'
  }
];

export default function AboutPage() {
  const [count, setCount] = useState(0);

  return (
    <section>
      <PageTitle
        title="Despre proiect"
        subtitle="Aplicație realizată la laboratorul de PW/DAW."
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

      <div className="counter">
        <h2>Contor: {count}</h2>

        <button onClick={() => setCount(count + 1)}>
          +
        </button>

        <button onClick={() => setCount(count - 1)}>
          -
        </button>

        <button onClick={() => setCount(0)}>
          Reset
        </button>
      </div>
    </section>
  );
}
