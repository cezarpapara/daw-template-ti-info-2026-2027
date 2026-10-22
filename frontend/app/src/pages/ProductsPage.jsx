import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { api } from '../api.js'

const emptyForm = { name: '', description: '', price: '', categoryId: '' }

// Pagina Produse: lista produselor, adaugare si stergere
function ProductsPage() {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState(null)
  const [productsError, setProductsError] = useState(null)

  // Filtrarea foloseste datele deja incarcate; tastarea nu cheama API-ul.
  const term = search.trim().toLowerCase()
  const visibleProducts = products.filter((product) =>
    product.name.toLowerCase().includes(term)
  )

  function loadProducts() {
    api.getProducts()
      .then((data) => {
        setProducts(data)
        setProductsError(null)
      })
      .catch((err) => setProductsError(err.message))
      .finally(() => setLoading(false))
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
      setLoading(true)
      loadProducts()
    } catch (err) {
      setError(err.message)
    }
  }

  // DELETE /api/products/{id}
  async function handleDelete(id) {
    try {
      await api.deleteProduct(id)
      setLoading(true)
      loadProducts()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <>
      <h1>Produse</h1>

      {error && <div className="status status-error">{error}</div>}
      {productsError && <div className="status status-error">{productsError}</div>}

      <section className="card">
        <h2>Adauga un produs</h2>
        <form onSubmit={handleSubmit} className="form form-grid">
          <input name="name" value={form.name} onChange={handleChange} placeholder="Nume" required />
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
          <input name="description" value={form.description} onChange={handleChange} placeholder="Descriere (optional)" />
          <button type="submit">Adauga</button>
        </form>
      </section>

      <section className="card">
        <h2>Lista produselor</h2>
        <div className="product-search">
          <label htmlFor="product-search">Caută după nume</label>
          <input
            id="product-search"
            type="search"
            placeholder="Caută după nume…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          {search !== '' && (
            <button type="button" onClick={() => setSearch('')}>Șterge căutarea</button>
          )}
        </div>
        {loading && <p role="status">Se încarcă produsele…</p>}
        <div className="product-table-container">
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
              {visibleProducts.map((product) => (
                <tr key={product.id}>
                  <td><Link to={`/produse/${product.id}`}>{product.name}</Link></td>
                  <td>{product.category.name}</td>
                  <td>{product.price}</td>
                  <td>
                    <button className="button-danger" onClick={() => handleDelete(product.id)}>Sterge</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!loading && !productsError && (
          <div role="status">
            <p>{visibleProducts.length} din {products.length} produse.</p>
            {visibleProducts.length === 0 && (
              <p>{term ? 'Niciun produs nu corespunde căutării.' : 'Nu există produse.'}</p>
            )}
          </div>
        )}
      </section>
    </>
  )
}

export default ProductsPage
