import { useEffect, useState } from 'react'
import { getReviews, createReview, updateReview, deleteReview } from '../api'

const EMPTY_FORM = { author: '', rating: '5', comment: '' }

export default function ReviewSection({ productId }) {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')
    getReviews(productId)
      .then(setReviews)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [productId])

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    setFieldErrors({})
    setSuccessMessage('')
    try {
      const data = {
        author: form.author,
        rating: Number(form.rating),
        comment: form.comment,
        productId: Number(productId),
      }
      if (editingId !== null) {
        const updated = await updateReview(editingId, data)
        setReviews((list) => list.map((review) =>
          review.id === editingId ? updated : review
        ))
        setEditingId(null)
      } else {
        const created = await createReview(data)
        setReviews((list) => [created, ...list])
        setSuccessMessage('Mulțumim pentru recenzie!')
        window.setTimeout(() => setSuccessMessage(''), 3000)
      }
      setForm(EMPTY_FORM)
    } catch (err) {
      setError(err.message)
      setFieldErrors(err.fields || {})
    } finally {
      setSaving(false)
    }
  }

  function handleEdit(review) {
    setEditingId(review.id)
    setForm({
      author: review.author,
      rating: String(review.rating),
      comment: review.comment || '',
    })
  }

  async function handleDelete(id) {
    if (!window.confirm('Sigur ștergeți această recenzie?')) return
    try {
      await deleteReview(id)
      setReviews((list) => list.filter((review) => review.id !== id))
      if (editingId === id) {
        setEditingId(null)
        setForm(EMPTY_FORM)
      }
    } catch (err) {
      setError(err.message)
    }
  }

  const average = reviews.length === 0
    ? null
    : (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)

  return (
    <section className="reviews">
      <h2>Recenzii ({reviews.length})</h2>
      {average !== null && <p>Nota medie: {average} din 5</p>}
      {loading && <p>Se încarcă recenziile...</p>}
      {error && <p className="error">{error}</p>}
      {successMessage && <p className="success">{successMessage}</p>}
      {!loading && reviews.length === 0 && <p>Nu există încă recenzii.</p>}

      <ul className="review-list">
        {reviews.map((r) => (
          <li key={r.id}>
            <strong>{r.author}</strong>{' '}
            <span
              className="stars"
              role="img"
              aria-label={`${r.rating} din 5 stele`}
            >
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
        <h3>{editingId === null ? 'Adăugați o recenzie' : 'Editați recenzia'}</h3>
        <label>
          Numele vostru
          <input
            name="author"
            value={form.author}
            onChange={handleChange}
            required
            aria-invalid={Boolean(fieldErrors.author)}
          />
          {fieldErrors.author && <span className="error">{fieldErrors.author}</span>}
        </label>
        <label>
          Nota
          <select
            name="rating"
            value={form.rating}
            onChange={handleChange}
            aria-invalid={Boolean(fieldErrors.rating)}
          >
            {[5, 4, 3, 2, 1].map((n) =>
              <option key={n} value={n}>{n}</option>
            )}
          </select>
          {fieldErrors.rating && <span className="error">{fieldErrors.rating}</span>}
        </label>
        <label>
          Comentariu (opțional)
          <textarea
            name="comment"
            value={form.comment}
            onChange={handleChange}
            rows={3}
            aria-invalid={Boolean(fieldErrors.comment)}
          />
          {fieldErrors.comment && <span className="error">{fieldErrors.comment}</span>}
        </label>
        <button type="submit" disabled={saving}>
          {saving ? 'Se trimite...' : (editingId === null ? 'Trimite recenzia' : 'Salvează')}
        </button>
      </form>
    </section>
  )
}
