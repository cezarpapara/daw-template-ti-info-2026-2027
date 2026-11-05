import { useEffect, useState } from 'react';
import { getReviews, createReview, deleteReview } from '../api';

const EMPTY_FORM = { author: '', rating: '5', comment: '' };

export default function ReviewSection({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  
  // Exercițiul 2: Stare pentru mesajul de succes
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
    try {
      const created = await createReview({
        author: form.author,
        rating: Number(form.rating),
        comment: form.comment,
        productId: Number(productId),
      });
      setReviews((list) => [created, ...list]); // recenzia nouă apare prima
      setForm(EMPTY_FORM);
      
      // Exercițiul 2: Afișare mesaj 3 secunde
      setSuccessMsg('Mulțumim pentru recenzie!');
      setTimeout(() => setSuccessMsg(''), 3000);
      
    } catch (err) {
      setError(err.message);
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

  // Exercițiul 1: Calculul notei medii
  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, curr) => acc + curr.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  return (
    <section className="reviews" style={{ marginTop: '2rem', borderTop: '1px solid #ccc', paddingTop: '1rem' }}>
      <h2>Recenzii ({reviews.length})</h2>
      
      {/* Exercițiul 1: Afișarea mediei */}
      {reviews.length > 0 && <p><strong>Nota medie:</strong> {getAverageRating()} din 5</p>}
      
      {loading && <p>Se încarcă recenziile...</p>}
      {error && <p className="error" style={{ color: 'red' }}>{error}</p>}
      {!loading && reviews.length === 0 && <p>Nu există încă recenzii.</p>}
      
      <ul className="review-list" style={{ listStyle: 'none', padding: 0 }}>
        {reviews.map((r) => (
          <li key={r.id} style={{ marginBottom: '1rem', borderBottom: '1px dotted #aaa', paddingBottom: '0.5rem' }}>
            <strong>{r.author}</strong>{' '}
            <span className="stars" role="img" aria-label={`${r.rating} din 5 stele`}>
              {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
            </span>
            <small style={{ marginLeft: '1rem', color: '#666' }}>{r.createdAt}</small>
            {r.comment && <p style={{ margin: '0.5rem 0' }}>{r.comment}</p>}
            <button type="button" onClick={() => handleDelete(r.id)} style={{ cursor: 'pointer', background: '#fee', border: '1px solid #f99', borderRadius: '4px', padding: '0.2rem 0.5rem' }}>
              Șterge
            </button>
          </li>
        ))}
      </ul>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '400px', background: '#f9f9f9', padding: '1rem', borderRadius: '8px' }}>
        <h3>Adăugați o recenzie</h3>
        
        {/* Exercițiul 2: Mesajul de succes */}
        {successMsg && <p style={{ color: 'green', fontWeight: 'bold' }}>{successMsg}</p>}
        
        <label style={{ display: 'flex', flexDirection: 'column' }}>
          Numele vostru
          <input name="author" value={form.author} onChange={handleChange} required style={{ padding: '0.4rem' }} />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column' }}>
          Nota
          <select name="rating" value={form.rating} onChange={handleChange} style={{ padding: '0.4rem' }}>
            {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
        <label style={{ display: 'flex', flexDirection: 'column' }}>
          Comentariu (opțional)
          <textarea name="comment" value={form.comment} onChange={handleChange} rows={3} style={{ padding: '0.4rem' }} />
        </label>
        <button type="submit" disabled={saving} style={{ padding: '0.6rem', marginTop: '0.5rem', cursor: 'pointer', background: '#1f3a73', color: 'white', border: 'none', borderRadius: '4px' }}>
          {saving ? 'Se trimite...' : 'Trimite recenzia'}
        </button>
      </form>
    </section>
  );
}