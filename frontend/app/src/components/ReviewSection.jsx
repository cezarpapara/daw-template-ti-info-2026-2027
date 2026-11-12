import { useEffect, useState } from 'react';
import { getReviews, createReview, deleteReview, updateReview } from '../api';

// Laboratorul 09: recenziile unui produs (citire, adaugare, stergere, editare).
const EMPTY_FORM = { author: '', rating: '5', comment: '' };

export default function ReviewSection({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  // Exercitiul 2: mesajul de multumire, afisat 3 secunde
  const [thanks, setThanks] = useState('');
  // Exercitiul 4 (optional): id-ul recenziei editate (null = adaugam una noua)
  const [editingId, setEditingId] = useState(null);

  // Se execută la afișare și ori de câte ori se schimbă productId.
  useEffect(() => {
    setLoading(true);
    setError('');
    getReviews(productId)
      .then(setReviews)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [productId]);

  // Exercitiul 2: mesajul dispare singur dupa 3 secunde.
  // Functia intoarsa opreste cronometrul daca mesajul se schimba sau componenta dispare.
  useEffect(() => {
    if (!thanks) return undefined;
    const timer = setTimeout(() => setThanks(''), 3000);
    return () => clearTimeout(timer);
  }, [thanks]);

  // Exercitiul 1: nota medie, cu o zecimala (null pentru lista goala)
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
    const data = {
      author: form.author,
      rating: Number(form.rating),
      comment: form.comment,
      productId: Number(productId),
    };
    try {
      if (editingId === null) {
        const created = await createReview(data);
        setReviews((list) => [created, ...list]); // recenzia nouă apare prima
        setThanks('Mulțumim pentru recenzie!');
      } else {
        const updated = await updateReview(editingId, data);
        setReviews((list) => list.map((r) => (r.id === updated.id ? updated : r)));
        setThanks('Recenzia a fost actualizată.');
        setEditingId(null);
      }
      setForm(EMPTY_FORM);
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
      if (id === editingId) cancelEdit();
    } catch (err) {
      setError(err.message);
    }
  }

  // Exercitiul 4: incarca recenzia in formular
  function startEdit(review) {
    setEditingId(review.id);
    setForm({
      author: review.author,
      rating: String(review.rating),
      comment: review.comment || '',
    });
    setError('');
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  return (
    <section className="reviews">
      <h2>Recenzii ({reviews.length})</h2>
      {/* Exercitiul 1: nota medie deasupra listei */}
      {average !== null && <p className="reviews-average">Nota medie: {average} din 5</p>}
      {loading && <p>Se încarcă recenziile...</p>}
      {error && <p className="error">{error}</p>}
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
            <div className="review-actions">
              <button type="button" onClick={() => startEdit(r)}>Editează</button>
              <button type="button" className="button-danger" onClick={() => handleDelete(r.id)}>Șterge</button>
            </div>
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit} className="review-form">
        <h3>{editingId === null ? 'Adăugați o recenzie' : 'Editați recenzia'}</h3>
        {/* Exercitiul 2: mesajul de multumire */}
        {thanks && <p className="form-success" role="status">{thanks}</p>}
        <label>
          Numele vostru
          <input name="author" value={form.author} onChange={handleChange}
            required />
        </label>
        <label>
          Nota
          <select name="rating" value={form.rating} onChange={handleChange}>
            {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
        <label>
          Comentariu (opțional)
          <textarea name="comment" value={form.comment} onChange={handleChange}
            rows={3} />
        </label>
        <div className="review-actions">
          <button type="submit" disabled={saving}>
            {saving
              ? 'Se trimite...'
              : editingId === null ? 'Trimite recenzia' : 'Salvează modificările'}
          </button>
          {editingId !== null && (
            <button type="button" className="button-secondary" onClick={cancelEdit}>Renunță</button>
          )}
        </div>
      </form>
    </section>
  );
}
