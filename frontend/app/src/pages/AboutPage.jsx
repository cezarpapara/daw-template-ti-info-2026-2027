import Card from "../components/Card";
import PageTitle from "../components/PageTitle";
import { useState } from "react";

const sections = [
  { id: 1, title: "Backend", text: "Symfony 8 și PHP 8.5 expun un API JSON." },
  {
    id: 2,
    title: "Frontend",
    text: "React 19 afișează datele primite de la API.",
  },
  { id: 3, title: "Baza de date", text: "PostgreSQL 18 păstrează datele." },
  {
    id: 4,
    title: "Docker",
    text: "Folosim Docker pentru containerizare.",
    image: "/team.jpg",
    imageAlt: "Logo Docker",
    children: <button>Vezi mai mult</button>,
  },
];
export default function AboutPage() {
  const [count, setCount] = useState(0);

  return (
    <section>
      <PageTitle
        title="Despre proiect"
        subtitle="Află mai multe despre acest proiect."
      />
      <div>
        <p>Sunt de afisat {sections.length} secțiuni.</p>
      </div>
      <div className="info-card-grid">
        {sections.map((section) => (
          <Card
            key={section.id}
            title={section.title}
            text={section.text}
            image={section.image}
            imageAlt={section.imageAlt}
            children={section.children}
          />
        ))}
      </div>
      <button type="button" onClick={() => setCount(count + 1)}>
        Ați apăsat de {count} ori
      </button>
      <button type="button" onClick={() => setCount(0)}>
        Resetează
      </button>
    </section>
  );
}
