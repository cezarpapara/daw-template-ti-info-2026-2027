import { useEffect, useState } from 'react';
import { api } from '../api.js';
import Card from '../components/Card';
import PageTitle from '../components/PageTitle';

const sections = [
 { id: 1, title: 'Backend', text: 'Symfony 8 și PHP 8.5 expun un API JSON.' },
 {
  id: 2,
  title: 'Frontend',
  text: 'React 19 afișează datele primite de la API.',
  image: '/echipa.svg',
  imageAlt: 'Echipă care lucrează împreună la un proiect web',
 },
 { id: 3, title: 'Baza de date', text: 'PostgreSQL 18 păstrează datele.' },
 { id: 4, title: 'Docker', text: 'Docker pornește aplicația și serviciile ei într-un mediu reproductibil.' },
];

export default function AboutPage() {
  const [counter, setCounter] = useState(0);
  const [helloMessage, setHelloMessage] = useState('');

  useEffect(() => {
    api.getHello('Ana')
      .then((data) => setHelloMessage(data.message))
      .catch((error) => setHelloMessage(error.message));
  }, []);

  return (
    <section>
      <PageTitle
        title="Despre proiect"
        subtitle="Componentele și tehnologiile care alcătuiesc aplicația."
      />
      <p>Număr de secțiuni: {sections.length}</p>
      <p>{helloMessage}</p>
      <div className="info-card-grid">
        {sections.map((section) => (
          <Card
            key={section.id}
            title={section.title}
            text={section.text}
            image={section.image}
            imageAlt={section.imageAlt}
          >
            {section.id === 2 && (
              <>
                <p>Contor: {counter}</p>
                <div className="button-row">
                  <button type="button" onClick={() => setCounter((current) => current + 1)}>
                    +1
                  </button>
                  <button type="button" onClick={() => setCounter(0)}>
                    Resetează
                  </button>
                </div>
              </>
            )}
          </Card>
        ))}
      </div>
    </section>
  );
}