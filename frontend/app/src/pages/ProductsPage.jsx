import { useState, useEffect } from 'react';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState(''); // Starea pentru căutare

  useEffect(() => {
    // Apelăm API-ul pentru produse
    fetch('/api/products')
      .then(res => res.json())
      .then(setProducts)
      .catch(err => console.error(err));
  }, []);

  // Logica de filtrare
  const term = search.trim().toLowerCase();
  const visibleProducts = products.filter((product) =>
    product.name.toLowerCase().includes(term)
  );

  return (
    <section>
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
        {/* Exercițiul 4: Buton Șterge căutarea */}
        {search && (
          <button onClick={() => setSearch('')} className="button-danger">
            Șterge căutarea
          </button>
        )}
      </div>

      {/* Exercițiul 5: Afișăm câte produse am găsit */}
      <p className="subtitle">
        {visibleProducts.length} din {products.length} produse corespund căutării.
      </p>

      {visibleProducts.length === 0 && (
        <p>Niciun produs nu corespunde căutării.</p>
      )}

      <ul>
        {visibleProducts.map(product => (
          <li key={product.id}>{product.name} - {product.price} lei</li>
        ))}
      </ul>
    </section>
  );
}