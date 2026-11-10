import Card from '../components/Card.jsx'
import PageTitle from '../components/PageTitle.jsx'

const sections = [
  {
    title: 'HTML și CSS',
    text: 'Structurăm pagini accesibile și le stilizăm pentru ecrane de toate dimensiunile.',
  },
  {
    title: 'JavaScript',
    text: 'Adăugăm interactivitate și conectăm interfața la date și servicii web.',
  },
  {
    title: 'React',
    text: 'Construim interfețe reutilizabile din componente și gestionăm navigarea între pagini.',
    image: '/echipa.svg',
    imageAlt: 'Ilustrație cu trei membri ai unei echipe care lucrează împreună la un proiect.',
  },
  {
    title: 'Docker',
    text: 'Rulăm aplicația și serviciile sale în containere reproductibile, astfel încât mediul de dezvoltare să fie ușor de configurat și partajat.',
  },
]

function AboutPage() {
  return (
    <>
      <PageTitle
        title="Despre proiect"
        subtitle="O prezentare a tehnologiilor și instrumentelor folosite în acest proiect."
      />

      <p className="muted">Proiectul cuprinde {sections.length} secțiuni.</p>

      <section className="sections-grid" aria-label="Secțiunile proiectului">
        {sections.map((section) => (
          <Card key={section.title} {...section}>
            <button type="button">Detalii</button>
          </Card>
        ))}
      </section>
    </>
  )
}

export default AboutPage
