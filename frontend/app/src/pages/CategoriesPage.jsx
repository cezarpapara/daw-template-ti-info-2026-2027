import { useEffect, useState } from 'react'
import { api } from '../api.js'

function CategoriesPage() {
  const [categories, setCategories] = useState([])
  const [name, setName] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  function loadCategories() {
    setLoading(true)
    setError(null)
    api.getCategories()
      .then((data) => setCategories(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadCategories()
  }, [])

  async function handleSubmit(event) {
    event.preventDefault() // opreste reincarcarea paginii
    try {
      await api.createCategory({ name })
      setName('')
      setError(null)
      loadCategories()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <>
      <title>Categorii – PW / DAW</title>
      <h1>Categorii</h1>

      {error && <div className="status status-error">{error}</div>}

      <section className="card">
        <h2>Adauga o categorie</h2>
        <form onSubmit={handleSubmit} className="form">
          <label className="field-label">
            Numele categoriei
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Numele categoriei"
              required
            />
          </label>
          <button type="submit">Adauga</button>
        </form>
      </section>

      <section className="card">
        <h2>Lista categoriilor</h2>
        {loading && <p role="status">Se încarcă categoriile…</p>}
        <div className="table-container" role="region" aria-label="Tabelul categoriilor" tabIndex={0}>
          <table>
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Nume</th>
                <th scope="col">Numar produse</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td>{category.id}</td>
                  <td>{category.name}</td>
                  <td>{category.productCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!loading && !error && categories.length === 0 && <p>Nu exista categorii.</p>}
      </section>
    </>
  )
}

export default CategoriesPage
