import { useEffect, useState } from "react";
import { Link } from "react-router";
import { api } from "../api.js";

const emptyForm = { name: "", description: "", price: "", categoryId: "" };

// Pagina Produse: lista produselor, adaugare si stergere
function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const term = search.trim().toLowerCase();
  const visibleProducts = products.filter((product) =>
    product.name.toLowerCase().includes(term),
  );
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState(null);

  function loadProducts() {
    api
      .getProducts()
      .then((data) => setProducts(data))
      .catch((err) => setError(err.message));
  }

  useEffect(() => {
    loadProducts();
    // categoriile sunt necesare pentru lista de selectie din formular
    api
      .getCategories()
      .then((data) => setCategories(data))
      .catch((err) => setError(err.message));
  }, []);

  // Actualizeaza campul modificat din formular
  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  // POST /api/products
  async function handleSubmit(event) {
    event.preventDefault();
    try {
      await api.createProduct({
        name: form.name,
        description: form.description,
        price: form.price,
        categoryId: Number(form.categoryId),
      });
      setForm(emptyForm);
      setError(null);
      loadProducts();
    } catch (err) {
      setError(err.message);
    }
  }

  // DELETE /api/products/{id}
  async function handleDelete(id) {
    try {
      await api.deleteProduct(id);
      loadProducts();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <h1>Produse</h1>

      {error && <div className="status status-error">{error}</div>}

      <section className="card">
        <h2>Adauga un produs</h2>
        <form onSubmit={handleSubmit} className="form form-grid">
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
              <option key={category.id} value={category.id}>
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
          <button type="submit">Adauga</button>
        </form>
      </section>
      <input
        type="search"
        placeholder="Caută după nume…"
        aria-label="Caută produse"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
      {search && <button onClick={() => setSearch("")}>Sterge căutarea</button>}
      {search && visibleProducts.length > 0 && (
        <p>
          {visibleProducts.length} din {products.length} produse
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
            {visibleProducts.map((product) => (
              <tr key={product.id}>
                <td>
                  <Link to={`/produse/${product.id}`}>{product.name}</Link>
                </td>
                <td>{product.category.name}</td>
                <td>{product.price}</td>
                <td>
                  <button
                    className="button-danger"
                    onClick={() => handleDelete(product.id)}
                  >
                    Sterge
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {visibleProducts.length === 0 && (
          <p>Niciun produs nu corespunde căutării.</p>
        )}
      </section>
    </>
  );
}

export default ProductsPage;
