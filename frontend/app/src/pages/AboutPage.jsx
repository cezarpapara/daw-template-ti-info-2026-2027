import Card from '../components/Card';
import PageTitle from '../components/PageTitle';
const sections = [
{ id: 1, title: 'Backend', text: 'Symfony 8 și PHP 8.5 expun un API JSON.' },
{ id: 2, title: 'Frontend', text: 'React 19 afișează datele primite de la API.' },
{ id: 3, title: 'Baza de date', text: 'PostgreSQL 18 păstrează datele.' },
{ id:4, title: 'Docker', text: 'Toate componentele rulează în containere Docker.' },
{ id:5, title: 'pisic', text: 'matz', image: '/maxwellcar.jpg', imageAlt: 'pisic' },
];
export default function AboutPage() {
return (
<section>
<PageTitle
title="Despre proiect"
subtitle="Informații despre proiect și tehnologiile utilizate."
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