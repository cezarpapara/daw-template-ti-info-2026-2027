import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { api } from '../api.js'
import ReviewSection from '../components/ReviewSection.jsx'

// Pagina de detalii pentru un produs: /produse/:id
function ProductDetailsPage() {
  const { id } = useParams() // id-ul din adresa (URL)
  return <ProductDetails key={id} id={id} />
}

function ProductDetails({ id }) {
  const [product, setProduct] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true
    api.getProduct(id)
      .then((data) => { if (active) setProduct(data) })
      .catch((err) => { if (active) setError(err.message) })
    return () => { active = false }
  }, [id])

  return (
    <>
      <title>{product ? `${product.name} – Produse · PW / DAW` : error ? 'Produs indisponibil – PW / DAW' : 'Se încarcă produsul – PW / DAW'}</title>
      <p><Link to="/produse">&larr; Inapoi la produse</Link></p>

      {error && <div className="status status-error" role="alert">{error}</div>}
      {!product && !error && <p role="status">Se încarcă…</p>}

      {product && (
        <>
        <section className="card">
          <h1>{product.name}</h1>
          <p><strong>Categorie:</strong> {product.category.name}</p>
          <p><strong>Pret:</strong> {product.price} lei</p>
          <p><strong>Descriere:</strong> {product.description || '-'}</p>
          <p className="muted">Date primite de la <code>GET {api.url}/api/products/{product.id}</code></p>
        </section>
        <ReviewSection key={product.id} productId={product.id} />
        </>
      )}
    </>
  )
}

export default ProductDetailsPage
