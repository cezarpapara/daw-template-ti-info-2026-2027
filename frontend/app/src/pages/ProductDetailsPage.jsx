import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import ReviewSection from '../components/ReviewSection';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    fetch(`http://localhost:8080/api/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Nu s-a putut încărca produsul.');
        return res.json();
      })
      .then(setProduct)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Se încarcă produsul...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!product) return <p>Produsul nu a fost găsit.</p>;

  return (
    <div className="product-details">
      <h1>{product.name}</h1>
      {product.description && <p>{product.description}</p>}
      {product.price !== undefined && <p>Preț: {product.price}</p>}

      {/* Secțiunea de recenzii legată de produsul curent */}
      <ReviewSection productId={id} />
    </div>
  );
}
