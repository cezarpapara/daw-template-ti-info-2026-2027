import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { api } from '../api.js'

const emptyForm = { name: '', description: '', price: '', categoryId: '' }

// Pagina Produse: lista produselor, adaugare si stergere
function ProductsPage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')

  // Căutarea și filtrarea în client (Laborator 05, Secțiunea 5)
  const term = search.trim().toLowerCase()
  const visibleProducts = products.filter((product) =>
    product.name.toLowerCase().includes(term),
  )

  function loadProducts() {
    api.getProducts()
      .then((data) => setProducts(data))
      .catch((err) => setError(err.message))
  }

  // useEffect rulează o singură dată la prima afișare datorită vectorului de dependențe gol [] (Laborator 05, Secțiunea 5)
  useEffect(() => {
    loadProducts()
    api.getCategories()
      .then((data) => setCategories(data))
      .catch((err) => setError(err.message))
  }, [])

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

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
      loadProducts()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDelete(id) {
    try {
      await api.deleteProduct(id)
      loadProducts()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <>
      <h1>Produse</h1>

      {error && <div className="status status-error">{error}</div>}

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

        {/* Câmpul de căutare și opțiunea de resetare (Exercițiul 4) */}
        <div className="search-row">
          <input
            type="search"
            placeholder="Caută după nume…"
            aria-label="Caută produse"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          {search && (
            <button type="button" className="button-secondary" onClick={() => setSearch('')}>
              Șterge căutarea
            </button>
          )}
        </div>

        {/* Contorul de produse filtrate (Exercițiul 5) */}
        <p className="search-count">
          {visibleProducts.length} din {products.length} produse
        </p>

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

        {/* Mesajul pentru căutări fără rezultat (Laborator 05, Secțiunea 5)[cite: 5] */}
        {visibleProducts.length === 0 && <p>Niciun produs nu corespunde căutării.</p>}
      </section>
    </>
  )
}

export default ProductsPage