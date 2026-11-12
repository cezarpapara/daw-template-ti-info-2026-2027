import { useEffect, useState } from 'react';
import { getReviews, createReview, updateReview, deleteReview } from '../api';

const EMPTY_FORM = { author: '', rating: '5', comment: '' };

export default function ReviewSection({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [thanks, setThanks] = useState('');       // Ex. 2
  const [editingId, setEditingId] = useState(null); // Ex. 4

  // Se execută la afișare și ori de câte ori se schimbă productId.
  useEffect(() => {
    setLoading(true);
    setError('');
    getReviews(productId)
      .then(setReviews)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [productId]);

  // Ex. 2: mesajul dispare după 3 secunde
  useEffect(() => {
    if (!thanks) return;
    const timer = setTimeout(() => setThanks(''), 3000);
    return () => clearTimeout(timer);
  }, [thanks]);

  // Ex. 1: nota medie, cu grijă la lista goală
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
    setThanks('');
    try {
      const payload = {
        author: form.author,
        rating: Number(form.rating),
        comment: form.comment,
        productId: Number(productId),
      };

      if (editingId !== null) {
        // Ex. 4: PUT, apoi înlocuim recenzia în listă
        const updated = await updateReview(editingId, payload);
        setReviews((list) => list.map((r) => (r.id === editingId ? updated : r)));
        setEditingId(null);
        setThanks('Recenzia a fost actualizată.');
      } else {
        const created = await createReview(payload);
        setReviews((list) => [created, ...list]); // recenzia nouă apare prima
        setThanks('Mulțumim pentru recenzie!');
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
      if (editingId === id) {
        setEditingId(null);
        setForm(EMPTY_FORM);
      }
    } catch (err) {
      setError(err.message);
    }
  }

  // Ex. 4: încarcă recenzia în formular
  function handleEdit(r) {
    setEditingId(r.id);
    setForm({
      author: r.author,
      rating: String(r.rating),
      comment: r.comment ?? '',
    });
    setError('');
    setThanks('');
  }

  function handleCancelEdit() {
    setEditingId(null);
    setForm(EMPTY_FORM);
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

      <form onSubmit={handleSubmit}>
        <h3>{editingId !== null ? 'Editați recenzia' : 'Adăugați o recenzie'}</h3>
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