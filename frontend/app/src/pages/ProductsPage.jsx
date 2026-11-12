import { useState, useEffect } from 'react';
import { api } from '../api';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.getProducts().then(setProducts);
  }, []);

  const term = search.trim().toLowerCase();
  const visibleProducts = products.filter((product) =>
    product.name.toLowerCase().includes(term)
  );

  return (
    <section>
      <h1>Produse</h1>

      <div style={{ margin: '1rem 0' }}>
        <input
          type="search"
          placeholder="Caută după nume..."
          aria-label="Caută produse"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      <div className="info-card-grid">
        {visibleProducts.map((product) => (
          <article key={product.id} className="info-card">
            <h2 className="info-card-title">{product.name}</h2>
            <p>{product.description}</p>
            <p><strong>Preț:</strong> {product.price} lei</p>
          </article>
        ))}
      </div>

      {visibleProducts.length === 0 && (
        <p>Niciun produs nu corespunde căutării.</p>
      )}
    </section>
  );
}