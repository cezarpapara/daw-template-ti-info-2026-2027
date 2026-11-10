function PageTitle({ title, subtitle }) {
  return (
    <header className="page-title">
      <h1>{title}</h1>
      <p className="subtitle">{subtitle}</p>
    </header>
  )
}

export default PageTitle
