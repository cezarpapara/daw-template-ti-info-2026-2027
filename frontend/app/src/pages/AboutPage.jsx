import Card from '../components/Card';
import PageTitle from '../components/PageTitle';
import { api } from '../api.js';
import { useEffect, useState } from 'react';

const sections = [
    { id: 1, title: 'Backend', text: 'Symfony 8 și PHP 8.5 expun un API JSON.' },
    { id: 2, title: 'Frontend', text: 'React 19 afișează datele primite de la API.' },
    { id: 3, title: 'Baza de date', text: 'PostgreSQL 18 păstrează datele.' },
    { id: 4, title: 'Docker', text: 'Toate componentele rulează în containere Docker.' },
    { id: 5, title: 'pisic', text: 'matz', image: '/maxwellcar.jpg', imageAlt: 'pisic' },
    { id: 6, title: 'Contor', text: 'ContorNumar' },
];
export default function AboutPage() {
    const [count, setCount] = useState(0);
    const [hello, setHello] = useState(null);
    const [helloError, setHelloError] = useState(null);

    useEffect(() => {
        api.getHello('Vizitator')
            .then((data) => setHello(data))
            .catch((error) => setHelloError(error.message));
    }, []);

    return (
        <section>
            <PageTitle
                title="Despre proiect"
                subtitle="Informații despre proiect și tehnologiile utilizate."
            />
            <section className="card">
                {!hello && !helloError && <p>Se încarcă...</p>}
                {helloError && <p className="status-error">{helloError}</p>}
                <h2>{hello && <p>{hello.message}</p>}</h2>
            </section>
            <div className="info-card-grid">
                {sections.map((section) => (
                    <Card
                        key={section.id}
                        title={section.title}
                        text={section.text}
                        image={section.image}
                        imageAlt={section.imageAlt}
                    >
                        {section.title === 'Contor' && (
                            <>
                                <p>Valoare: {count}</p>
                                <button type="button" onClick={() => setCount((value) => value + 1)}>
                                    Incrementează
                                </button>
                                <p></p>
                                <button type="button" onClick={() => setCount(0)}>
                                    Resetează
                                </button>
                            </>
                        )}
                    </Card>
                ))}
            </div>
        </section>
    );
}