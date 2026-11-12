import { useEffect, useState } from 'react';
import Card from '../components/Card';
import PageTitle from '../components/PageTitle';
import { api } from '../api';

const sections = [
  { id: 1, title: 'Backend', text: 'Symfony 8 și PHP 8.5 expun un API JSON.' },
  { id: 2, title: 'Frontend', text: 'React 19 afișează datele primite de la API.' },
  { id: 3, title: 'Baza de date', text: 'PostgreSQL 18 păstrează datele.' },
  {
    id: 4,
    title: 'Docker',
    text: 'Docker facilitează rularea tuturor serviciilor în containere, astfel încât proiectul poate fi pornit rapid și identic pe orice calculator.',
    image: '/echipa.jpg',
    imageAlt: 'Echipa proiectului',
  },
];

export default function AboutPage() {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    api
      .getHello('Ana')
      .then((data) => setMessage(data.message))
      .catch(() => setMessage('Nu am putut încărca mesajul de la server.'));
  }, []);

  return (
    <section className="container">
      <PageTitle
        title="Despre proiect"
        subtitle={`Acest proiect are ${sections.length} secțiuni principale.`}
      />

      <p>{message}</p>

      <div className="counter-box">
        <p>Ați apăsat de {count} ori.</p>
        <div className="counter-actions">
          <button type="button" onClick={() => setCount((current) => current + 1)}>
            +1
          </button>
          <button type="button" className="button-secondary" onClick={() => setCount(0)}>
            Resetează
          </button>
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