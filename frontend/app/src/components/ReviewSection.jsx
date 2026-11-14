import { useEffect, useState } from 'react'
import { getReviews, createReview, deleteReview } from '../api.js'

const EMPTY_FORM = { author: '', rating: '5', comment: '' }

export default function ReviewSection({ productId }) {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [actionError, setActionError] = useState('')
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [lastCreatedId, setLastCreatedId] = useState(null)

  useEffect(() => {
    let active = true

    getReviews(productId)
      .then((items) => {
        if (active) setReviews(items)
      })
      .catch((error) => {
        if (active) setLoadError(error.message)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [productId])

  useEffect(() => {
    if (lastCreatedId === null) return

    const timer = window.setTimeout(() => setLastCreatedId(null), 3000)
    return () => window.clearTimeout(timer)
  }, [lastCreatedId])

  const average = reviews.length > 0
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : null

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (loading || loadError || saving) return

    setSaving(true)
    setActionError('')
    setLastCreatedId(null)

    try {
      const created = await createReview({
        author: form.author,
        rating: Number(form.rating),
        comment: form.comment,
        productId: Number(productId),
      })
      setReviews((current) => [created, ...current])
      setForm(EMPTY_FORM)
      setLastCreatedId(created.id)
    } catch (error) {
      setActionError(error.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Sigur vrei să ștergi această recenzie?')) return

    setDeletingId(id)
    setActionError('')

    try {
      await deleteReview(id)
      setReviews((current) => current.filter((review) => review.id !== id))
    } catch (error) {
      setActionError(error.message)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <section className="card reviews">
      <h2>Recenzii ({reviews.length})</h2>

      {loading && <p role="status">Se încarcă recenziile…</p>}
      {loadError && <p className="status status-error" role="alert">{loadError}</p>}
      {actionError && <p className="status status-error" role="alert">{actionError}</p>}
      {lastCreatedId !== null && <p role="status">Mulțumim pentru recenzie!</p>}

      {!loading && !loadError && reviews.length === 0 && (
        <p>Nu există încă recenzii.</p>
      )}

      {average !== null && <p>Nota medie: {average} din 5</p>}

      {reviews.length > 0 && (
        <ul className="review-list">
          {reviews.map((review) => {
            const stars = Math.max(0, Math.min(5, review.rating))

            return (
              <li key={review.id}>
                <strong>{review.author}</strong>{' '}
                <span className="stars" role="img" aria-label={`${stars} din 5 stele`}>
                  {'★'.repeat(stars)}{'☆'.repeat(5 - stars)}
                </span>
                {review.createdAt && (
                  <small> · {new Date(review.createdAt).toLocaleString('ro-RO')}</small>
                )}
                {review.comment && <p>{review.comment}</p>}
                <button
                  type="button"
                  className="button-danger"
                  disabled={deletingId !== null}
                  onClick={() => handleDelete(review.id)}
                >
                  {deletingId === review.id ? 'Se șterge…' : 'Șterge'}
                </button>
              </li>
            )
          })}
        </ul>
      )}

      <h3>Adaugă o recenzie</h3>
      <form className="form" onSubmit={handleSubmit}>
        <label>
          Nume
          <input name="author" value={form.author} onChange={handleChange} maxLength={100} required />
        </label>
        <label>
          Nota
          <select name="rating" value={form.rating} onChange={handleChange}>
            {[5, 4, 3, 2, 1].map((rating) => (
              <option key={rating} value={rating}>{rating}</option>
            ))}
          </select>
        </label>
        <label>
          Comentariu (opțional)
          <textarea name="comment" value={form.comment} onChange={handleChange} rows={3} />
        </label>
        <button type="submit" disabled={loading || Boolean(loadError) || saving}>
          {saving ? 'Se trimite…' : 'Trimite recenzia'}
        </button>
      </form>
    </section>
  )
}