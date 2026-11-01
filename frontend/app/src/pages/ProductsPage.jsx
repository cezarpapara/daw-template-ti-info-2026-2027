import { useState, useEffect } from 'react';
import { Link } from 'react-router'; // Importăm Link pentru navigare
import { api } from '../api.js'; // Importăm obiectul api configurat

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    // Folosim api.getProducts() pentru a face cererea corect la portul 8080
    api.getProducts()
      .then(setProducts)
      .catch(err => console.error(err));
  }, []);

  const term = search.trim().toLowerCase();
  const visibleProducts = products.filter((product) =>
    product.name.toLowerCase().includes(term)
  );

  return (
    <section>
      {/* Eticheta title pentru scorul maxim SEO în Lighthouse[cite: 15] */}
      <title>Produse - Magazinul nostru</title>

      <h1>Produse</h1>
      
      <div className="form-field" style={{ flexDirection: 'row', alignItems: 'center', maxWidth: '600px' }}>
        <input
          type="search"
          placeholder="Caută după nume..."
          aria-label="Caută produse"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          style={{ flex: 1 }}
        />
        {search && (
          <button onClick={() => setSearch('')} className="button-danger">
            Șterge căutarea
          </button>
        )}
      </div>

      <p className="subtitle">
        {visibleProducts.length} din {products.length} produse corespund căutării.
      </p>

      {visibleProducts.length === 0 && (
        <p>Niciun produs nu corespunde căutării.</p>
      )}

      <ul>
        {visibleProducts.map(product => (
          <li key={product.id}>
            {/* Transformăm numele într-un link către pagina de detalii */}
            <Link to={`/produse/${product.id}`}>{product.name}</Link> - {product.price} lei
          </li>
        ))}
      </ul>
    </section>
  );
}