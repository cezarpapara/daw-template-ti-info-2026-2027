import { useEffect, useState } from 'react';
import { getReviews, createReview, updateReview, deleteReview } from '../api';

const EMPTY_FORM = { author: '', rating: '5', comment: '' };

// Recenziile unui produs: lista, nota medie, adaugare, editare si stergere
export default function ReviewSection({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');        // Ex. 2: mesajul de multumire
  const [editingId, setEditingId] = useState(null); // Ex. 4: id-ul recenziei editate

  // Se execută la afișare și ori de câte ori se schimbă productId.
  useEffect(() => {
    setLoading(true);
    setError('');
    getReviews(productId)
      .then(setReviews)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [productId]);

  // Ex. 2: mesajul dispare dupa 3 secunde.
  // Functia intoarsa opreste cronometrul daca pagina se inchide mai devreme.
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(''), 3000);
    return () => clearTimeout(timer);
  }, [notice]);

  // Ex. 1: nota medie, cu o zecimala; pentru lista goala nu exista medie
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
      if (editingId) {
        // Ex. 4: PUT inlocuieste recenzia; in lista punem varianta primita de la server
        const updated = await updateReview(editingId, data);
        setReviews((list) => list.map((r) => (r.id === updated.id ? updated : r)));
        setNotice('Recenzia a fost actualizată.');
      } else {
        const created = await createReview(data);
        setReviews((list) => [created, ...list]); // recenzia nouă apare prima
        setNotice('Mulțumim pentru recenzie!');
      }
      setForm(EMPTY_FORM);
      setEditingId(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  // Ex. 4: incarca recenzia in formular
  function handleEdit(r) {
    setEditingId(r.id);
    setForm({ author: r.author, rating: String(r.rating), comment: r.comment ?? '' });
    setError('');
  }

  function handleCancelEdit() {
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  async function handleDelete(id) {
    if (!window.confirm('Sigur ștergeți această recenzie?')) return;
    try {
      await deleteReview(id);
      setReviews((list) => list.filter((r) => r.id !== id));
      if (id === editingId) handleCancelEdit(); // nu mai putem edita o recenzie stearsa
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="reviews">
      <h2>Recenzii ({reviews.length})</h2>
      {average && <p className="review-average">Nota medie: {average} din 5</p>}
      {loading && <p>Se încarcă recenziile...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && reviews.length === 0 && <p>Nu există încă recenzii.</p>}

      <ul className="review-list">
        {reviews.map((r) => (
          <li key={r.id} className={r.id === editingId ? 'editing' : undefined}>
            <strong>{r.author}</strong>{' '}
            <span className="stars" role="img"
              aria-label={`${r.rating} din 5 stele`}>
              {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
            </span>
            <small> · {r.createdAt}</small>
            {r.comment && <p>{r.comment}</p>}
            <div className="review-actions">
              <button type="button" onClick={() => handleEdit(r)}>Editează</button>
              <button type="button" className="button-danger"
                onClick={() => handleDelete(r.id)}>Șterge</button>
            </div>
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit} className="review-form">
        <h3>{editingId ? 'Editați recenzia' : 'Adăugați o recenzie'}</h3>
        {notice && <p className="success" role="status">{notice}</p>}
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
            {saving ? 'Se trimite...' : editingId ? 'Salvează modificările' : 'Trimite recenzia'}
          </button>
          {editingId && (
            <button type="button" className="button-secondary" onClick={handleCancelEdit}>
              Renunță
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
