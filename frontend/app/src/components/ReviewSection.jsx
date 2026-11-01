import { useEffect, useState } from 'react';
import { getReviews, createReview, deleteReview, updateReview } from '../api';

const EMPTY_FORM = { author: '', rating: '5', comment: '' };

export default function ReviewSection({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({}); // Adăugat starea pentru erorile câmpurilor

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
    // Curățăm eroarea câmpului atunci când utilizatorul începe să scrie
    if (fieldErrors[e.target.name]) {
        setFieldErrors({ ...fieldErrors, [e.target.name]: undefined });
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setFieldErrors({}); // Resetăm erorile la trimitere

    try {
        if (editingId) {
            const updated = await updateReview(editingId, {
                author: form.author,
                rating: Number(form.rating),
                comment: form.comment,
                productId: Number(productId),
            });
            setReviews(reviews.map(r => r.id === editingId ? updated : r));
            setEditingId(null);
        } else {
            const created = await createReview({
                author: form.author,
                rating: Number(form.rating),
                comment: form.comment,
                productId: Number(productId),
            });
            setReviews([created, ...reviews]); 
        }

      setForm(EMPTY_FORM);
      setSuccessMsg('Mulțumim pentru recenzie!');
      setTimeout(() => setSuccessMsg(''), 3000);

    } catch (err) {
      setError(err.message);
      setFieldErrors(err.fields || {}); // Preluăm erorile de la server[cite: 17]
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

  function handleEdit(review) {
      setEditingId(review.id);
      setForm({ author: review.author, rating: String(review.rating), comment: review.comment || '' });
      setFieldErrors({}); // Resetăm erorile la editare
  }

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <section className="reviews card">
      <h2>Recenzii ({reviews.length})</h2>
      
      {reviews.length > 0 && <p><strong>Nota medie: {avgRating} din 5</strong></p>}

      {loading && <p>Se încarcă recenziile...</p>}
      {error && <p className="status status-error">{error}</p>}
      {successMsg && <p className="status status-ok">{successMsg}</p>}
      {!loading && reviews.length === 0 && <p>Nu există încă recenzii.</p>}

      <ul className="review-list" style={{ listStyleType: 'none', padding: 0 }}>
        {reviews.map((r) => (
          <li key={r.id} style={{ borderBottom: '1px solid #e4e7eb', padding: '10px 0' }}>
            <strong>{r.author}</strong> {' '}
            <span className="stars" role="img" aria-label={`${r.rating} din 5 stele`}>
              {'⭐'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
            </span>
            <br/>
            <small className="muted">{r.createdAt}</small>
            {r.comment && <p>{r.comment}</p>}
            
            <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                <button type="button" onClick={() => handleEdit(r)} style={{ background: '#e0e0e0', color: 'black' }}>Editează</button>
                <button type="button" onClick={() => handleDelete(r.id)} className="button-danger">Șterge</button>
            </div>
          </li>
        ))}
      </ul>

      {/* Adăugat noValidate pentru a bloca validarea implicită HTML și a testa backend-ul[cite: 17] */}
      <form onSubmit={handleSubmit} noValidate style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}>
        <h3>{editingId ? 'Editați recenzia' : 'Adăugați o recenzie'}</h3>
        
        <label>
          Numele vostru <br/>
          <input 
            name="author" 
            value={form.author} 
            onChange={handleChange} 
            required 
            style={{ width: '100%', borderColor: fieldErrors.author ? 'red' : undefined }} 
            aria-invalid={fieldErrors.author ? "true" : "false"} // Exercițiul 2[cite: 19]
          />
          {/* Afișarea erorii pentru autor[cite: 17] */}
          {fieldErrors.author && <span className="status-error" style={{ display: 'block', fontSize: '0.85em', marginTop: '4px', color: 'red' }}>{fieldErrors.author}</span>}
        </label>
        
        <label>
          Nota <br/>
          <select 
            name="rating" 
            value={form.rating} 
            onChange={handleChange} 
            style={{ width: '100%', borderColor: fieldErrors.rating ? 'red' : undefined }}
            aria-invalid={fieldErrors.rating ? "true" : "false"} // Exercițiul 2[cite: 19]
          >
            {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
          {/* Afișarea erorii pentru notă */}
          {fieldErrors.rating && <span className="status-error" style={{ display: 'block', fontSize: '0.85em', marginTop: '4px', color: 'red' }}>{fieldErrors.rating}</span>}
        </label>
        
        <label>
          Comentariu (opțional) <br/>
          <textarea 
            name="comment" 
            value={form.comment} 
            onChange={handleChange} 
            rows={3} 
            style={{ width: '100%', borderColor: fieldErrors.comment ? 'red' : undefined }}
            aria-invalid={fieldErrors.comment ? "true" : "false"} // Exercițiul 2[cite: 19]
          />
          {/* Afișarea erorii pentru comentariu[cite: 19] */}
          {fieldErrors.comment && <span className="status-error" style={{ display: 'block', fontSize: '0.85em', marginTop: '4px', color: 'red' }}>{fieldErrors.comment}</span>}
        </label>
        
        <button type="submit" disabled={saving}>
          {saving ? 'Se trimite...' : 'Trimite recenzia'}
        </button>
        {editingId && (
            <button type="button" onClick={() => { setEditingId(null); setForm(EMPTY_FORM); setFieldErrors({}); }} style={{ background: '#e0e0e0', color: 'black' }}>
                Anulează
            </button>
        )}
      </form>
    </section>
  );
}