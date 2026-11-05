import Card from '../components/Card';
export default function AboutPage() {
 return (
 <section>
 <h1>Despre proiect</h1>
 <p>Aplicație realizată la laboratorul de PW/DAW, 2026–2027.</p>
 <div className="info-card-grid">
 <Card title="Backend" text="Symfony 8 și PHP 8.5 expun un API JSON." />
 <Card title="Frontend" text="React 19 afișează datele primite de la API." />
 <Card title="Baza de date" text="PostgreSQL 18 păstrează datele." />
 </div>
 </section>
 );
}
import Card from '../components/Card';
const sections = [
 { id: 1, title: 'Backend', text: 'Symfony 8 și PHP 8.5 expun un API JSON.' },
 { id: 2, title: 'Frontend', text: 'React 19 afișează datele primite de la API.' },
 { id: 3, title: 'Baza de date', text: 'PostgreSQL 18 păstrează datele.' },
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
