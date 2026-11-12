
function Card({ title, text, image, imageAlt, children }) {
  return (
    <div className="info-card-image">
      {image && <img src={image} alt={imageAlt || title} />}

      <h2 className="info-card-titled" >{title}</h2>
      <p>{text}</p>

      {children}
    </div>
  );
}

export default Card;
