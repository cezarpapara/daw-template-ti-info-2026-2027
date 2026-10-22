export default function PageTitle({ title, subtitle }) {
  return (
    <header className="lab-page-title">
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </header>
  );
}
