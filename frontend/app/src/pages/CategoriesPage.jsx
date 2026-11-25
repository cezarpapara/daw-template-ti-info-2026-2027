
import { useEffect, useState } from 'react'
import { api } from '../api.js'

function CategoriesPage() {
  const [categories, setCategories] = useState([])
  const [name, setName] = useState('')
  const [error, setError] = useState(null)

  function loadCategories() {
    api.getCategories()
      .then((data) => setCategories(data))
      .catch((err) => setError(err.message))
  }

  useEffect(() => {
    loadCategories()
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()

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
    <div className="categories-layout">
      <div className="page-heading">
        <h1>Categorii</h1>
        <p>Organizeaza produsele in colectii.</p>
      </div>

      {error && <div className="status status-error">{error}</div>}

      <section className="glass-panel category-form">
        <h2><span className="panel-icon">◇</span> Adauga o categorie</h2>

        <form onSubmit={handleSubmit} className="form category-input-form">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Numele categoriei"
            required
          />
          <button type="submit">Adauga +</button>
        </form>
      </section>

      <section className="glass-panel category-list">
        <h2><span className="panel-icon">▤</span> Lista categoriilor</h2>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nume</th>
                <th>Numar produse</th>
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

        {categories.length === 0 && (
          <p className="empty-message">Nu exista categorii.</p>
        )}
      </section>
    </div>
  )
}

export default CategoriesPage
