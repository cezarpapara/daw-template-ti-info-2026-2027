function Card({ title, text, image, imageAlt, children }) {
  return (
    <article className="card section-card">
      {image && <img className="section-card-image" src={image} alt={imageAlt ?? ''} />}
      <h2>{title}</h2>
      <p>{text}</p>
      {children}
    </article>
  )
}

export default Card
