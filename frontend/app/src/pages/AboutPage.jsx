import { useEffect, useState } from 'react';
import { api } from '../api.js';
import Card from '../components/Card';
import PageTitle from '../components/PageTitle';

// Laboratorul 04: cardurile sunt generate din lista de date, cu .map() si key.
const sections = [
  {
    id: 1,
    title: 'Backend',
    text: 'Symfony 8 și PHP 8.5 expun un API JSON.',
    // Exercitiul 2: imagine din folderul public/ (calea incepe cu /)
    image: '/echipa.svg',
    imageAlt: 'Desen cu trei membri ai echipei lucrând la același birou',
  },
  { id: 2, title: 'Frontend', text: 'React 19 afișează datele primite de la API.' },
  { id: 3, title: 'Baza de date', text: 'PostgreSQL 18 păstrează datele.' },
  // Exercitiul 1: al patrulea element
  {
    id: 4,
    title: 'Docker',
    text: 'Fiecare serviciu (Nginx, PHP, PostgreSQL, React) rulează în containerul lui, la fel pe orice calculator.',
  },
];

export default function AboutPage() {
  // Laboratorul 05, exercitiul 1: butonul-contor si butonul Reseteaza
  const [count, setCount] = useState(0);

  // Laboratorul 06, exercitiul 5: mesajul de la GET /api/hello/{name}
  const [hello, setHello] = useState('');
  useEffect(() => {
    api.getHello('Yanis')
      .then((data) => setHello(data.message))
      .catch(() => setHello('Backend-ul nu a răspuns la /api/hello.'));
  }, []);

  return (
    <section>
      {/* Exercitiul 3: componenta PageTitle */}
      <PageTitle
        title="Despre proiect"
        subtitle="Aplicație realizată la laboratorul de PW/DAW, 2026–2027."
      />
      {/* Exercitiul 5 (optional): numarul de sectiuni */}
      {hello && <p className="muted">Mesaj de la backend: <strong>{hello}</strong></p>}
      <p>Numărul de secțiuni: {sections.length}</p>
      <div className="form">
        <button type="button" onClick={() => setCount(count + 1)}>
          Ați apăsat de {count} ori
        </button>
        <button type="button" onClick={() => setCount(0)}>
          Resetează
        </button>
      </div>
      <div className="info-card-grid">
        {sections.map((section) => (
          <Card
            key={section.id}
            title={section.title}
            text={section.text}
            image={section.image}
            imageAlt={section.imageAlt}
          >
            {/* Exercitiul 4 (optional): continut transmis prin children */}
            {section.id === 4 && (
              <button type="button">Detalii</button>
            )}
          </Card>
        ))}
      </div>
    </section>
  );
}
