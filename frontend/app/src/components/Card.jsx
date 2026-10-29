export default function Card({ title, text, image, imageAlt = '' }) {
  return (
    <article className="info-card">
      {image && (
        <img className="info-card-image" src={image} alt={imageAlt} />
      )}
      <h2 className="info-card-title">{title}</h2>
      <p>{text}</p>
    </article>
  );
}git status
git add .
git commit -m "Laboratorul 04: componenta Card si pagina Despre"
git push origin numele.tau