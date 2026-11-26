import ReviewSection from '../components/ReviewSection';
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

  if (error) return <div className="status status-error">{error}</div>
  if (!product) return <p>Se incarca...</p>

  return (
    <>
      <Link to="/produse">← Inapoi la produse</Link>

      <section className="card">
        <h1>{product.name}</h1>
        <p><strong>Categorie:</strong> {product.category.name}</p>
        <p><strong>Pret:</strong> {product.price} lei</p>
        {product.description && <p><strong>Descriere:</strong> {product.description}</p>}
        <p className="endpoint">
          Date primite de la <code>GET http://localhost:8080/api/products/{id}</code>
        </p>
      </section>

      <ReviewSection productId={id} />
    </>
  )
}

export default ProductDetailsPage