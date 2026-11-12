
import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { api } from '../api.js'

const emptyForm = {
  name: '',
  description: '',
  price: '',
  categoryId: ''
}

// Pagina Produse: lista, adaugare, stergere si cautare
function ProductsPage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState(null)

  // LABORATOR 5 - Starea cautarii
  const [search, setSearch] = useState('')

  // Filtrarea produselor dupa nume
  const term = search.trim().toLowerCase()

  const visibleProducts = products.filter((product) =>
    product.name.toLowerCase().includes(term)
  )

  // Incarcarea produselor din API
  function loadProducts() {
    api.getProducts()
      .then((data) => setProducts(data))
      .catch((err) => setError(err.message))
  }

  useEffect(() => {
    loadProducts()

    // Incarcarea categoriilor
    api.getCategories()
      .then((data) => setCategories(data))
      .catch((err) => setError(err.message))
  }, [])

  // Actualizarea formularului
  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    })
  }

  // Adaugarea unui produs
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

  // Stergerea unui produs
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

      {error && (
        <div className="status status-error">
          {error}
        </div>
      )}

      {/* FORMULAR ADAUGARE PRODUSE */}
      <section className="card">
        <h2>Adauga un produs</h2>

        <form
          onSubmit={handleSubmit}
          className="form form-grid"
        >
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Nume"
            required
          />

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

          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            required
          >
            <option value="">Alege categoria</option>

            {categories.map((category) => (
              <option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>
            ))}
          </select>

          <input
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Descriere (optional)"
          />

          <button type="submit">
            Adauga
          </button>
        </form>
      </section>

      {/* LISTA PRODUSELOR */}
      <section className="card">
        <h2>Lista produselor</h2>

        {/* LABORATOR 5 - CAUTARE */}
        <div className="form-field">
          <label htmlFor="search">
            Cauta un produs
          </label>

          <input
            id="search"
            type="search"
            placeholder="Cauta dupa nume..."
            aria-label="Cauta produse"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />
        </div>

        {/* EXERCITIUL OPTIONAL 4 */}
        {search !== '' && (
          <button
            type="button"
            onClick={() => setSearch('')}
          >
            Sterge cautarea
          </button>
        )}

        {/* EXERCITIUL OPTIONAL 5 */}
        <p>
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
                <td>
                  <Link to={`/produse/${product.id}`}>
                    {product.name}
                  </Link>
                </td>

                <td>{product.category.name}</td>

                <td>{product.price}</td>

                <td>
                  <button
                    className="button-danger"
                    onClick={() =>
                      handleDelete(product.id)
                    }
                  >
                    Sterge
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* MESAJ PENTRU LISTA GOALA */}
        {visibleProducts.length === 0 && (
          <p>
            Niciun produs nu corespunde cautarii.
          </p>
        )}
      </section>
    </>
  )
}

export default ProductsPage
