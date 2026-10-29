export default function PageTitle({ title, subtitle }) {
  return (
    <article className="about-page">
      <h1> {title} </h1>
      <div className="subtitle">{subtitle}</div>
    </article>
  );
}
