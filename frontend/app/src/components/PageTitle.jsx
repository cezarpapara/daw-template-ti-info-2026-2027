// Titlul unei pagini, cu un subtitlu sub el
export default function PageTitle({ title, subtitle }) {
  return (
    <>
      <h1>{title}</h1>
      {subtitle && <p className="subtitle">{subtitle}</p>}
    </>
  )
}
