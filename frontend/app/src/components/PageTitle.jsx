export default function PageTitle({ title, subtitle }) {
  return (
    <header>
      <h1>{title}</h1>
      {subtitle && <p className="subtitle">{subtitle}</p>}
    </header>
  );
}
