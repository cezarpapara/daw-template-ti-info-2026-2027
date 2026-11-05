import Card from '../components/Card';

const sections = [
  { id: 1, title: 'Backend', text: '...', image: '/poza.jpg', imageAlt: 'Poza toamna' },
  { id: 2, title: 'Frontend', text: 'React 19 afișează datele primite de la API.' },
  { id: 3, title: 'Baza de date', text: 'PostgreSQL 18 păstrează datele.' },
  { id: 4, title: 'Docker', text: 'Containerizează aplicația pentru rulare facilă.' },
  ];

export default function AboutPage() {
  return (
    <section>
      <h1>Despre proiect</h1>
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