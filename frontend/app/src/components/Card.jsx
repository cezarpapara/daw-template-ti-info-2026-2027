// Componenta reutilizabila: un card cu titlu, text si, optional, o imagine.
// Props (proprietati) = datele primite de la componenta parinte, ca atributele unei etichete HTML.
// Acoladele din parametri scot props-urile din obiectul primit; imageAlt = '' este o valoare implicita.
// children = ce se scrie intre <Card> si </Card> (exercitiul 4), de exemplu un buton.
function Card({ title, text, image, imageAlt = '', children }) {
  return (
    <article className="info-card">
      {/* imaginea apare doar daca a fost transmisa */}
      {image && <img className="info-card-image" src={image} alt={imageAlt} />}
      <h2 className="info-card-title">{title}</h2>
      <p>{text}</p>
      {children}
    </article>
  )
}

export default Card
