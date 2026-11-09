import Card from '../components/Card';

const sections = [
  { id: 1, title: 'Backend', text: '...', image: '/images.jpeg', imageAlt: 'imagine backend' },
  { id: 2, title: 'Frontend', text: '...', image: '/images2.jpeg', imageAlt: 'imagine frontend' },
  { id: 3, title: 'Baza de date', text: '...', image: '/images3.jpeg', imageAlt: 'imagine baza de date' },
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