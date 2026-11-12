import { useEffect, useState } from 'react';
import { getReviews, createReview, updateReview, deleteReview } from '../api';

const EMPTY_FORM = { author: '', rating: '5', comment: '' };

export default function ReviewSection({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [thanks, setThanks] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError('');
    getReviews(productId)
      .then(setReviews)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [productId]);

  useEffect(() => {
    if (!thanks) return;
    const timer = setTimeout(() => setThanks(''), 3000);
    return () => clearTimeout(timer);
  }, [thanks]);

  const average = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setFieldErrors({});
    setThanks('');
    try {
      const payload = {
        author: form.author,
        rating: Number(form.rating),
        comment: form.comment,
        productId: Number(productId),
      };

      if (editingId !== null) {
        const updated = await updateReview(editingId, payload);
        setReviews((list) => list.map((r) => (r.id === editingId ? updated : r)));
        setEditingId(null);
        setThanks('Recenzia a fost actualizată.');
      } else {
        const created = await createReview(payload);
        setReviews((list) => [created, ...list]);
        setThanks('Mulțumim pentru recenzie!');
      }
      setForm(EMPTY_FORM);
    } catch (err) {
      setError(err.message);
      setFieldErrors(err.fields || {});
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Sigur ștergeți această recenzie?')) return;
    try {
      await deleteReview(id);
      setReviews((list) => list.filter((r) => r.id !== id));
      if (editingId === id) {
        setEditingId(null);
        setForm(EMPTY_FORM);
      }
    } catch (err) {
      setError(err.message);
    }
  }

  function handleEdit(r) {
    setEditingId(r.id);
    setForm({
      author: r.author,
      rating: String(r.rating),
      comment: r.comment ?? '',
    });
    setError('');
    setFieldErrors({});
    setThanks('');
  }

  function handleCancelEdit() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFieldErrors({});
    setError('');
  }

  return (
    <section className="reviews">
      <h2>Recenzii ({reviews.length})</h2>

      {average && <p className="average">Nota medie: {average} din 5</p>}

      {loading && <p>Se încarcă recenziile...</p>}
      {error && <p className="error">{error}</p>}
      {thanks && <p className="thanks">{thanks}</p>}
      {!loading && reviews.length === 0 && <p>Nu există încă recenzii.</p>}

      <ul className="review-list">
        {reviews.map((r) => (
          <li key={r.id}>
            <strong>{r.author}</strong>{' '}
            <span className="stars" role="img"
                  aria-label={`${r.rating} din 5 stele`}>
              {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
            </span>
            <small> · {r.createdAt}</small>
            {r.comment && <p>{r.comment}</p>}
            <button type="button" onClick={() => handleEdit(r)}>Editează</button>{' '}
            <button type="button" onClick={() => handleDelete(r.id)}>Șterge</button>
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit} noValidate>
        <h3>{editingId !== null ? 'Editați recenzia' : 'Adăugați o recenzie'}</h3>

        <label>
          Numele vostru
          <input name="author" value={form.author} onChange={handleChange}
                 aria-invalid={fieldErrors.author ? 'true' : 'false'} />
          {fieldErrors.author && (
            <span className="error field-error">{fieldErrors.author}</span>
          )}
        </label>

        <label>
          Nota
          <select name="rating" value={form.rating} onChange={handleChange}
                  aria-invalid={fieldErrors.rating ? 'true' : 'false'}>
            {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
          {fieldErrors.rating && (
            <span className="error field-error">{fieldErrors.rating}</span>
          )}
        </label>

        <label>
          Comentariu (opțional)
          <textarea name="comment" value={form.comment} onChange={handleChange}
                    rows={3}
                    aria-invalid={fieldErrors.comment ? 'true' : 'false'} />
          {fieldErrors.comment && (
            <span className="error field-error">{fieldErrors.comment}</span>
          )}
        </label>

        <button type="submit" disabled={saving}>
          {saving
            ? 'Se trimite...'
            : editingId !== null ? 'Salvează modificările' : 'Trimite recenzia'}
        </button>
        {editingId !== null && (
          <button type="button" onClick={handleCancelEdit}>Anulează</button>
        )}
      </form>
    </section>
  );
}