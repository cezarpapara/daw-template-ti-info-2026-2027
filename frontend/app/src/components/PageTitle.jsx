// Laboratorul 04, exercitiul 3: titlul paginii, cu un subtitlu.
export default function PageTitle({ title, subtitle }) {
  return (
    <>
      <h1>{title}</h1>
      {subtitle && <p className="subtitle">{subtitle}</p>}
    </>
  );
}
