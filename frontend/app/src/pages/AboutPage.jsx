import Card from '../components/Card';
import { useState } from 'react';
const sections = [
    { id: 1, title: 'Backend', text: 'Symfony 8 și PHP 8.5 expun un API JSON.' },
    { id: 2, title: 'Frontend', text: 'React 19 afișează datele primite de la API.' },
    { id: 3, title: 'Baza de date', text: 'PostgreSQL 18 păstrează datele.' },
    {
        id: 4,
        title: 'Docker',
        text: 'Docker permite rularea aplicațiilor în containere izolate.',
        image: '/symfony.svg',
        imageAlt: 'Imagine reprezentativă pentru Docker'
    }
];
export default function AboutPage() {
    const [count, setCount] = useState(0);
    return (
        <section>
            <h1>Despre proiect</h1>
            <p>Contor: {count}</p>

            <button type="button" onClick={() => setCount(count + 1)}>
                Incrementare
            </button>

            <button type="button" onClick={() => setCount(0)}>
                Resetează
            </button>
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
