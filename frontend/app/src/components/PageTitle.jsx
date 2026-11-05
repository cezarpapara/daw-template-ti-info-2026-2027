// Exercitiul 3: titlul unei pagini (<h1>) si un subtitlu, primite prin props
function PageTitle({ title, subtitle }) {
  return (
    <>
      <h1>{title}</h1>
      {subtitle && <p className="subtitle">{subtitle}</p>}
    </>
  )
}

export default PageTitle
