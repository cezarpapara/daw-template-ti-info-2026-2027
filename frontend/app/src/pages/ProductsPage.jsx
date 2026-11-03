import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { api } from '../api.js'

const emptyForm = {
  name: '',
  description: '',
  price: '',
  categoryId: '',
}

function ProductsPage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const term = search.trim().toLowerCase()

  const visibleProducts = products.filter((product) =>
    product.name.toLowerCase().includes(term)
  )

  function loadProducts() {
    setLoading(true)

    return api.getProducts()
      .then((data) => setProducts(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadProducts()

    // Categoriile sunt necesare formularului de adăugare.
    api.getCategories()
      .then((data) => setCategories(data))
      .catch((err) => setError(err.message))
  }, [])

  function handleChange(event) {
    const { name, value } = event.target

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }))
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
      await loadProducts()
    } catch (err) {
      setError(err.message)
    }
  }

  // DELETE /api/products/{id}
  async function handleDelete(id) {
    try {
      await api.deleteProduct(id)
      setError(null)
      await loadProducts()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <>
      <h1>Produse</h1>

      {error && (
        <div className="status status-error" role="alert">
          {error}
        </div>
      )}

      <section className="card">
        <h2>Adaugă un produs</h2>

        <form onSubmit={handleSubmit} className="form form-grid">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Nume"
            aria-label="Numele produsului"
            required
          />

          <input
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="Preț (ex: 49.99)"
            aria-label="Prețul produsului"
            type="number"
            step="0.01"
            min="0"
            required
          />

          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            aria-label="Categoria produsului"
            required
          >
            <option value="">Alege categoria</option>

            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <input
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Descriere (opțional)"
            aria-label="Descrierea produsului"
          />

          <button type="submit">Adaugă</button>
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
            <button
              type="button"
              onClick={() => setSearch('')}
            >
              Șterge căutarea
            </button>
          )}
        </div>

        {loading ? (
          <p role="status">Se încarcă produsele…</p>
        ) : (
          <>
            <p role="status">
              {visibleProducts.length} din {products.length} produse
            </p>

            <table>
              <thead>
                <tr>
                  <th>Nume</th>
                  <th>Categorie</th>
                  <th>Preț (lei)</th>
                  <th>Acțiuni</th>
                </tr>
              </thead>

              <tbody>
                {visibleProducts.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <Link to={`/produse/${product.id}`}>
                        {product.name}
                      </Link>
                    </td>

                    <td>{product.category.name}</td>
                    <td>{product.price}</td>

                    <td>
                      <button
                        type="button"
                        className="button-danger"
                        onClick={() => handleDelete(product.id)}
                      >
                        Șterge
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {!error && products.length === 0 && (
              <p>Nu există produse.</p>
            )}

            {!error
              && products.length > 0
              && visibleProducts.length === 0 && (
                <p>Niciun produs nu corespunde căutării.</p>
              )}
          </>
        )}
      </section>
    </>
  )
}

export default ProductsPage