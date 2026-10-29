import { useState } from 'react';
import Card from '../components/Card';
import PageTitle from '../components/PageTitle';

const sections = [
  { id: 1, title: 'Backend', text: 'Symfony 8 și PHP 8.5 expun un API JSON.' },
  { id: 2, title: 'Frontend', text: 'React 19 afișează datele primite de la API.' },
  { id: 3, title: 'Baza de date', text: 'PostgreSQL 18 păstrează datele.' },
  { id: 4, title: 'Docker', text: 'Permite rularea aplicațiilor în containere izolate.' }
];

export default function AboutPage() {
  const [count, setCount] = useState(0); // Exercițiul 1

  return (
    <section>
      <PageTitle title="Despre proiect" subtitle="Aplicație realizată la laboratorul de PW/DAW, 2026-2027." />
      
      {/* Exercițiul 1: Butoanele pentru contor */}
      <div style={{ margin: '1rem 0', display: 'flex', gap: '1rem' }}>
        <button type="button" onClick={() => setCount(count + 1)}>
          Ați apăsat de {count} ori
        </button>
        <button type="button" onClick={() => setCount(0)} className="button-danger">
          Resetează
        </button>
      </div>

      <div className="info-card-grid">
        {sections.map((section) => (
          <Card key={section.id} title={section.title} text={section.text} />
        ))}
      </div>
    </section>
  );
}