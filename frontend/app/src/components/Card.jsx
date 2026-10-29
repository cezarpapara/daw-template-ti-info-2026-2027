export default function Card({ title, text, image, imageAlt = "", children }) {
  return (
    <article className="info-card">
      {image && <img className="info-card-image" src={image} alt={imageAlt} />}
      <h2 className="info-card-title">{title}</h2>
      <p>{text}</p>
      {children}
    </article>
  );
}
