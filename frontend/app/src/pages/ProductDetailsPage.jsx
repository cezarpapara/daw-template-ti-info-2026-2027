import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { api } from '../api.js'

// Pagina de detalii pentru un produs: /produse/:id
function ProductDetailsPage() {
  const { id } = useParams() // id-ul din adresa (URL)
  const [product, setProduct] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.getProduct(id)
      .then((data) => setProduct(data))
      .catch((err) => setError(err.message))
  }, [id])

  return (
    <>
      <p><Link to="/produse">&larr; Inapoi la produse</Link></p>

      {error && <div className="status status-error">{error}</div>}
      {!product && !error && <p>Se incarca...</p>}

      {product && (
        <section className="card">
          <h1>{product.name}</h1>
          <p><strong>Categorie:</strong> {product.category.name}</p>
          <p><strong>Pret:</strong> {product.price} lei</p>
          <p><strong>Descriere:</strong> {product.description || '-'}</p>
          <p className="muted">Date primite de la <code>GET {api.url}/api/products/{product.id}</code></p>
        </section>
      )}
    </>
  )
}

export default ProductDetailsPage
