import { useState } from 'react';
import Card from '../components/Card';
import PageTitle from '../components/PageTitle';
import '../labs.css';

// Datele sunt separate de componenta care desenează fiecare card.
const sections = [
  {
    id: 'backend',
    title: 'Backend',
    text: 'În template-ul cursului, Symfony 8 și PHP 8.5 expun un API JSON.',
  },
  {
    id: 'frontend',
    title: 'Frontend',
    text: 'React 19 construiește interfața din componente și afișează datele.',
    image: '/images/flux-aplicatie.svg',
    imageAlt: 'Fluxul aplicației: interfața React comunică cu API-ul, iar API-ul cu baza de date.',
  },
  {
    id: 'database',
    title: 'Baza de date',
    text: 'În template-ul cursului, PostgreSQL 18 păstrează datele aplicației.',
  },
  {
    id: 'docker',
    title: 'Docker',
    text: 'Docker pornește serviciile în containere separate, astfel încât proiectul să aibă un mediu de lucru ușor de reprodus.',
  },
];

export default function AboutPage() {
  const [count, setCount] = useState(0);

  return (
    <section className="lab-page">
      <PageTitle
        title="Despre proiect"
        subtitle="Exerciții pentru laboratoarele PW/DAW, anul universitar 2026–2027."
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
      <section className="lab-counter" aria-labelledby="counter-title">
        <h2 id="counter-title">Un exemplu de stare în React</h2>
        <p aria-live="polite">Număr de apăsări: {count}</p>
        <div className="lab-actions">
          <button type="button" onClick={() => setCount((previous) => previous + 1)}>
            Adaugă o apăsare
          </button>
          <button type="button" className="lab-secondary" onClick={() => setCount(0)}>
            Resetează
          </button>
        </div>
      </section>
    </section>
  );
}
