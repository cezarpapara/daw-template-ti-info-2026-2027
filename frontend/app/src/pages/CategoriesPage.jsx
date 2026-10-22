import { useEffect, useState } from 'react'
import { api } from '../api.js'
import { useAuth } from '../AuthContext.jsx'

// Pagina Categorii: lista categoriilor + formular de adaugare (doar pentru admin)
function CategoriesPage() {
  const { isAdmin } = useAuth()
  const [categories, setCategories] = useState(null) // null = inca se incarca
  const [name, setName] = useState('')
  const [error, setError] = useState(null)

  // Incarca lista de categorii de la backend
  function loadCategories() {
    api.getCategories()
      .then((data) => setCategories(data))
      .catch((err) => setError(err.message))
  }

  useEffect(() => {
    loadCategories()
  }, [])

  // Trimite formularul: POST /api/categories
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
      <h1>Categorii</h1>

      {error && <div className="status status-error">{error}</div>}

      {/* formularul este ascuns pentru ceilalti utilizatori, dar protectia reala este in backend */}
      {isAdmin && (
        <section className="card">
          <h2>Adauga o categorie</h2>
          <form onSubmit={handleSubmit} className="form">
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Numele categoriei"
              maxLength={100}
              required
            />
            <button type="submit">Adauga</button>
          </form>
        </section>
      )}

      <section className="card">
        <h2>Lista categoriilor</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nume</th>
              <th>Numar produse</th>
            </tr>
          </thead>
          <tbody>
            {categories?.map((category) => (
              <tr key={category.id}>
                <td>{category.id}</td>
                <td>{category.name}</td>
                <td>{category.productCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {categories === null && !error && <p>Se incarca...</p>}
        {categories?.length === 0 && <p>Nu exista categorii.</p>}
      </section>
    </>
  )
}

export default CategoriesPage
