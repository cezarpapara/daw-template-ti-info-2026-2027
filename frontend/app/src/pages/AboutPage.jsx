import { useEffect, useState } from 'react';
import Card from '../components/Card';
import PageTitle from '../components/PageTitle';
import { api } from '../api.js';

const sections = [
  {
    id: 1,
    title: 'Backend',
    text: 'Symfony 8 și PHP 8.5 expun un API JSON.'
  },
  {
    id: 2,
    title: 'Frontend',
    text: 'React 19 afișează datele primite de la API.',
    image: '/calculator.jpg',
    imageAlt: 'Calculator folosit pentru dezvoltarea interfeței web'
  },
  {
    id: 3,
    title: 'Baza de date',
    text: 'PostgreSQL 18 păstrează datele aplicației.'
  },
  {
    id: 4,
    title: 'Docker',
    text: 'Docker rulează serviciile aplicației în containere, cu un mediu de lucru comun pentru proiect.'
  }
];

export default function AboutPage() {
  const [count, setCount] = useState(0);
  const [hello, setHello] = useState('');
  const [helloError, setHelloError] = useState('');

  // Cerem salutul când pagina este montată.
  useEffect(() => {
    let active = true;

    api.getHello('Bogdan')
      .then((data) => {
        if (active) {
          setHello(data.message);
        }
      })
      .catch((error) => {
        if (active) {
          setHelloError(error.message);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <section>
      <PageTitle
        title="Despre proiect"
        subtitle="Aplicație realizată de Musat Bogdan la laboratorul PW/DAW, 2026–2027."
      />

      {helloError ? (
        <p className="form-error" role="alert">
          Nu am putut încărca salutul: {helloError}
        </p>
      ) : (
        <p role="status">
          {hello || 'Se încarcă salutul…'}
        </p>
      )}

      <p>Număr de secțiuni: {sections.length}</p>

      <div className="about-counter">
        <button
          type="button"
          onClick={() => setCount((previous) => previous + 1)}
        >
          Ați apăsat de {count} ori
        </button>

        <button
          type="button"
          onClick={() => setCount(0)}
        >
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
            <button
              type="button"
              onClick={() => window.alert(section.text)}
            >
              Detalii
            </button>
          </Card>
        ))}
      </div>
    </section>
  );
}