import { useState } from 'react';
import Card from '../components/Card';
import PageTitle from '../components/PageTitle';

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
    text: 'Rulează serviciile aplicației în containere izolate.',
    image: '/docker.jpg', // Asigură-te că numele corespunde cu poza pusă în folderul public/
    imageAlt: 'Logo Docker',
  },
];

export default function AboutPage() {
  const [count, setCount] = useState(0);

  return (
    <section>
      <PageTitle 
        title="Despre proiect" 
        subtitle={`Aplicație realizată la laboratorul de PW/DAW, 2026-2027 (${sections.length} componente principale).`} 
      />

      {/* Secțiunea cu contorul și butoanele */}
      <div className="card" style={{ margin: '1rem 0' }}>
        <p><strong>Contor:</strong> {count}</p>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => setCount(count + 1)}>Incrementează</button>
          <button onClick={() => setCount(0)} className="button-danger">Resetează</button>
        </div>
      </div>

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
    </section>
  );
}