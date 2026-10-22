import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { api } from '../api.js'
import { useAuth } from '../AuthContext.jsx'

const emptyForm = { name: '', description: '', price: '', categoryId: '' }

// Pagina Produse: lista produselor, adaugare (utilizatori autentificati)
// si stergere (proprietarul produsului sau un admin)
function ProductsPage() {
  const { user, canManageProduct } = useAuth()
  const [products, setProducts] = useState(null) // null = inca se incarca
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState(null)
  const [violations, setViolations] = useState({})

  function loadProducts() {
    api.getProducts()
      .then((data) => setProducts(data))
      .catch((err) => setError(err.message))
  }

  useEffect(() => {
    loadProducts()
    // categoriile sunt necesare pentru lista de selectie din formular
    api.getCategories()
      .then((data) => setCategories(data))
      .catch((err) => setError(err.message))
  }, [])

  // Actualizeaza campul modificat din formular
  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  // POST /api/products
  async function handleSubmit(event) {
    event.preventDefault()
    try {
      await api.createProduct({
        name: form.name,
        description: form.description,
        price: form.price,
        categoryId: Number(form.categoryId),
      })
      setForm(emptyForm)
      setError(null)
      setViolations({})
      loadProducts()
    } catch (err) {
      setError(err.message)
      setViolations(err.violations ?? {})
    }
  }

  // DELETE /api/products/{id}
  async function handleDelete(product) {
    if (!window.confirm(`Stergeti produsul "${product.name}"?`)) {
      return
    }
    try {
      await api.deleteProduct(product.id)
      loadProducts()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <>
      <h1>Produse</h1>

      {error && <div className="status status-error">{error}</div>}

      {user ? (
        <section className="card">
          <h2>Adauga un produs</h2>
          <form onSubmit={handleSubmit} className="form form-grid">
            <input name="name" value={form.name} onChange={handleChange} placeholder="Nume" maxLength={150} required />
            <input
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="Pret (ex: 49.99)"
              type="number"
              step="0.01"
              min="0"
              required
            />
            <select name="categoryId" value={form.categoryId} onChange={handleChange} required>
              <option value="">Alege categoria</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
            <input
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Descriere (optional)"
              maxLength={2000}
            />
            <button type="submit">Adauga</button>
          </form>
          {Object.entries(violations).map(([field, message]) => (
            <p key={field} className="field-error">{message}</p>
          ))}
        </section>
      ) : (
        <p className="muted">
          <Link to="/autentificare">Autentificati-va</Link> pentru a adauga produse.
        </p>
      )}

      <section className="card">
        <h2>Lista produselor</h2>
        <table>
          <thead>
            <tr>
              <th>Nume</th>
              <th>Categorie</th>
              <th>Pret (lei)</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products?.map((product) => (
              <tr key={product.id}>
                <td><Link to={`/produse/${product.id}`}>{product.name}</Link></td>
                <td>{product.category.name}</td>
                <td>{product.price}</td>
                <td>
                  {canManageProduct(product) && (
                    <button className="button-danger" onClick={() => handleDelete(product)}>Sterge</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products === null && !error && <p>Se incarca...</p>}
        {products?.length === 0 && <p>Nu exista produse.</p>}
      </section>
    </>
  )
}

export default ProductsPage
