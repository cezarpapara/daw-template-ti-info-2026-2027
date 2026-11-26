
import { useEffect, useState } from 'react';
import { getReviews, createReview, deleteReview } from '../api';

const EMPTY_FORM = {
  author: '',
  rating: '5',
  comment: ''
};

export default function ReviewSection({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError('');

    getReviews(productId)
      .then(setReviews)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [productId]);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
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
        productId: Number(productId)
      });

      setReviews((list) => [created, ...list]);
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
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="reviews">
      <h2>Recenzii ({reviews.length})</h2>

      {loading && <p>Se încarcă recenziile...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && reviews.length === 0 && (
        <p>Nu există încă recenzii.</p>
      )}

      <ul className="review-list">
        {reviews.map((r) => (
          <li key={r.id}>
            <strong>{r.author}</strong>{' '}

            <span className="stars" role="img"
              aria-label={`${r.rating} din 5 stele`}>
              {'★'.repeat(r.rating)}
              {'☆'.repeat(5 - r.rating)}
            </span>

            <small> · {r.createdAt}</small>

            {r.comment && <p>{r.comment}</p>}

            <button
              type="button"
              onClick={() => handleDelete(r.id)}
            >
              Șterge
            </button>
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit}>
        <h3>Adăugați o recenzie</h3>

        <label>
          Numele vostru
          <input
            name="author"
            value={form.author}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Nota
          <select
            name="rating"
            value={form.rating}
            onChange={handleChange}
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </label>

        <label>
          Comentariu (opțional)
          <textarea
            name="comment"
            value={form.comment}
            onChange={handleChange}
            rows={3}
          />
        </label>

        <button type="submit" disabled={saving}>
          {saving ? 'Se trimite...' : 'Trimite recenzia'}
        </button>
      </form>
    </section>
  );
}
