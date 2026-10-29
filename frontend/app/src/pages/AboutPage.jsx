import Card from '../components/Card';
import PageTitle from '../components/PageTitle'; // Exercițiul 3

const sections = [
  { id: 1, title: 'Backend', text: 'Symfony 8 și PHP 8.5 expun un API JSON.' },
  { id: 2, title: 'Frontend', text: 'React 19 afișează datele primite de la API.' },
  { id: 3, title: 'Baza de date', text: 'PostgreSQL 18 păstrează datele.', image: '/echipa.jpg', imageAlt: 'Echipa' }, // Exercițiul 2 (asigură-te că pui o imagine echipa.jpg în folderul public/)
  { id: 4, title: 'Docker', text: 'Permite rularea aplicațiilor în containere izolate.' } // Exercițiul 1
];

export default function AboutPage() {
  return (
    <section>
      <PageTitle 
        title="Despre proiect" 
        subtitle="Aplicație realizată la laboratorul de PW/DAW, 2026-2027." 
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
    </section>
  );
}