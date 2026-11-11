import { useEffect, useState } from 'react';
import { getReviews, createReview, deleteReview } from '../api';

const EMPTY_FORM = { author: '', rating: '5', comment: '' };

export default function ReviewSection({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  
  // Exercițiul 2: stare pentru mesajul de succes
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    getReviews(productId)
      .then(setReviews)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [productId]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccessMsg('');
    setFieldErrors({}); // Resetează erorile vechi

    try {
      // Am pus inapoi codul pentru crearea recenziei
      const created = await createReview({
        author: form.author,
        rating: Number(form.rating),
        comment: form.comment,
        productId: Number(productId),
      });
      setReviews((list) => [created, ...list]);
      setForm(EMPTY_FORM);
      
      setSuccessMsg('Mulțumim pentru recenzie!');
      setTimeout(() => setSuccessMsg(''), 3000);
      
    } catch (err) {
        setError(err.message);
        setFieldErrors(err.fields || {}); // Salvează noile erori pe câmpuri
    } finally {
        setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Sigur ștergeți această recenzie?')) return;
    try {
      await deleteReview(id);
      setReviews((list) => list.filter((r) => r.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  // Exercițiul 1: Calcularea notei medii
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <section className="reviews" style={{ marginTop: '2rem', borderTop: '1px solid #ccc', paddingTop: '1rem' }}>
      <h2>Recenzii ({reviews.length})</h2>
      
      {/* Exercițiul 1: Afișare nota medie */}
      {reviews.length > 0 && <p><strong>Nota medie: {averageRating} din 5</strong></p>}
      
      {loading && <p>Se încarcă recenziile...</p>}
      {error && <p className="status-error" style={{ color: 'red' }}>{error}</p>}
      {!loading && reviews.length === 0 && <p>Nu există încă recenzii.</p>}

      <ul className="review-list" style={{ listStyleType: 'none', padding: 0 }}>
        {reviews.map((r) => (
          <li key={r.id} style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #eee', borderRadius: '5px' }}>
            <strong>{r.author}</strong>{' '}
            <span className="stars" role="img" aria-label={`${r.rating} din 5 stele`}>
              {'⭐'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
            </span>
            <br />
            <small>{r.createdAt}</small>
            {r.comment && <p>{r.comment}</p>}
            <button type="button" className="button-danger" onClick={() => handleDelete(r.id)}>
              Șterge
            </button>
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', maxWidth: '400px', gap: '10px' }}>
        <h3>Adăugați o recenzie</h3>
        
        {/* Exercițiul 2: Afișarea mesajului temporar */}
        {successMsg && <p style={{ color: 'green', fontWeight: 'bold' }}>{successMsg}</p>}
        
        <label>
          Numele vostru:
          <br />
          <input 
            name="author" 
            value={form.author} 
            onChange={handleChange} 
            style={{ width: '100%', borderColor: fieldErrors.author ? 'red' : '' }}
          />
          {fieldErrors.author && <span className="status-error" style={{ color: 'red', fontSize: '0.8rem', display: 'block', marginTop: '4px' }}>{fieldErrors.author}</span>}
        </label>
        
        <label>
          Nota:
          <br />
          <select 
            name="rating" 
            value={form.rating} 
            onChange={handleChange} 
            style={{ width: '100%', borderColor: fieldErrors.rating ? 'red' : '' }}
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
          {fieldErrors.rating && <span className="status-error" style={{ color: 'red', fontSize: '0.8rem', display: 'block', marginTop: '4px' }}>{fieldErrors.rating}</span>}
        </label>
        
        <label>
          Comentariu (opțional):
          <br />
          <textarea 
            name="comment" 
            value={form.comment} 
            onChange={handleChange} 
            rows={3} 
            style={{ width: '100%', borderColor: fieldErrors.comment ? 'red' : '' }}
          />
          {fieldErrors.comment && <span className="status-error" style={{ color: 'red', fontSize: '0.8rem', display: 'block', marginTop: '4px' }}>{fieldErrors.comment}</span>}
        </label>
        
        <button type="submit" disabled={saving}>
          {saving ? 'Se trimite...' : 'Trimite recenzia'}
        </button>
      </form>
    </section>
  );
}