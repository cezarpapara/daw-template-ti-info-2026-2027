import Card from "../components/Card";
import PageTitle from "../components/PageTitle";

const sections = [
  {
    id: 1,
    title: "Backend",
    text: "Symfony 8 și PHP 8.5 expun un API JSON.",
    image: "../../public/symfony-logos.png",
    imageAlt: "Logo backend",
  },
  {
    id: 2,
    title: "Frontend",
    text: "React 19 afișează datele primite de la API.",
    image: "../../public/echipa.png",
    imageAlt: "Echipa frontend",
  },
  { id: 3, title: "Baza de date", text: "PostgreSQL 18 păstrează datele." },
  { id: 4, title: "Docker", text: "Containere pentru rulare și distribuție." },
];

export default function AboutPage() {
  return (
    <section>
      <PageTitle
        title="Despre proiect"
        subtitle="Arhitectura și tehnologiile utilizate în dezvoltare."
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
