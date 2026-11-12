import { useState } from "react";

function Produse() {
  const products = [
    { id: 1, name: "Laptop" },
    { id: 2, name: "Telefon" },
    { id: 3, name: "Cască" },
    { id: 4, name: "Tabletă" },
    { id: 5, name: "Monitor" },
  ];

  const [search, setSearch] = useState("");

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1>Produse</h1>

      <input
        type="text"
        placeholder="Caută produse..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Butonul apare doar când search nu e gol */}
      {search !== "" && (
        <button onClick={() => setSearch("")}>
          Șterge căutarea
        </button>
      )}
<p>
  {filteredProducts.length} din {products.length} produse
</p>
      <ul>
        {filteredProducts.map((p) => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default Produse;