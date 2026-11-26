import { useEffect, useRef, useState } from 'react'
import { getReviews, createReview, updateReview, deleteReview } from '../api.js'

const EMPTY_FORM = { author: '', rating: '5', comment: '' }

// Cheia din pagina produsului resetează componenta când se schimbă produsul.
export default function ReviewSection({ productId }) {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [retry, setRetry] = useState(0)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [form, setForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [success, setSuccess] = useState('')
  const successTimer = useRef(null)
  const authorInput = useRef(null)
  const busy = saving || deletingId !== null
  const average = reviews.length
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : null

  useEffect(() => {
    const controller = new AbortController()
    getReviews(productId, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setReviews(data)
      })
      .catch((err) => {
        if (!controller.signal.aborted) setLoadError(err.message)
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [productId, retry])

  useEffect(() => () => window.clearTimeout(successTimer.current), [])

  function resetForm() {
    setForm(EMPTY_FORM)
    setEditingId(null)
    setFieldErrors({})
    setError('')
  }

  function showSuccess(message) {
    window.clearTimeout(successTimer.current)
    setSuccess(message)
    successTimer.current = window.setTimeout(() => setSuccess(''), 3000)
  }

  function handleChange(event) {
    const { name, value } = event.target
    setForm((previous) => ({ ...previous, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (busy || loading || loadError) return
    setSaving(true)
    setError('')
    setFieldErrors({})
    setSuccess('')
    const data = {
      author: form.author,
      rating: Number(form.rating),
      comment: form.comment,
      productId: Number(productId),
    }
    try {
      if (editingId !== null) {
        const updated = await updateReview(editingId, data)
        setReviews((list) => list.map((review) => review.id === editingId ? updated : review))
        showSuccess('Recenzia a fost actualizată.')
      } else {
        const created = await createReview(data)
        setReviews((list) => [created, ...list])
        showSuccess('Mulțumim pentru recenzie!')
      }
      resetForm()
    } catch (err) {
      setError(err.message)
      setFieldErrors(err.fields || {})
    } finally {
      setSaving(false)
    }
  }

  function handleEdit(review) {
    setEditingId(review.id)
    setForm({ author: review.author, rating: String(review.rating), comment: review.comment || '' })
    setFieldErrors({})
    setError('')
    setSuccess('')
    authorInput.current?.focus()
  }

  async function handleDelete(id) {
    if (busy || !window.confirm('Sigur ștergeți această recenzie?')) return
    setDeletingId(id)
    setError('')
    try {
      await deleteReview(id)
      setReviews((list) => list.filter((review) => review.id !== id))
      if (editingId === id) resetForm()
      showSuccess('Recenzia a fost ștearsă.')
    } catch (err) {
      setError(err.message)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <section className="reviews card" aria-labelledby="reviews-heading">
      <h2 id="reviews-heading">Recenzii{!loading && !loadError && ` (${reviews.length})`}</h2>
      {loading && <p role="status">Se încarcă recenziile…</p>}
      {loadError && (
        <div className="status status-error" role="alert">
          <p>{loadError}</p>
          <button type="button" onClick={() => {
            setLoadError('')
            setLoading(true)
            setRetry((value) => value + 1)
          }}>Reîncearcă</button>
        </div>
      )}
      {error && <p className="error" role="alert">{error}</p>}
      <div role="status" aria-live="polite">
        {success && <p className="review-success">{success}</p>}
      </div>
      {!loading && !loadError && (
        <>
          <p>{average === null ? 'Nu există încă recenzii.' : `Nota medie: ${average} din 5`}</p>
          <ul className="review-list">
            {reviews.map((review) => (
              <li key={review.id}>
                <strong>{review.author}</strong>{' '}
                <span className="stars" role="img" aria-label={`${review.rating} din 5 stele`}>
                  {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                </span>
                <small className="muted"> · {review.createdAt}</small>
                {review.comment && <p className="review-comment">{review.comment}</p>}
                <div className="review-actions">
                  <button type="button" disabled={busy} onClick={() => handleEdit(review)}
                    aria-label={`Editează recenzia de la ${review.author}`}>Editează</button>
                  <button type="button" className="button-danger" disabled={busy} onClick={() => handleDelete(review.id)}
                    aria-label={`Șterge recenzia de la ${review.author}`}>
                    {deletingId === review.id ? 'Se șterge…' : 'Șterge'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
      <form className="review-form" onSubmit={handleSubmit} noValidate>
        <h3>{editingId === null ? 'Adăugați o recenzie' : 'Editați recenzia'}</h3>
        <fieldset disabled={busy || loading || Boolean(loadError)}>
          <legend className="sr-only">Datele recenziei</legend>
          <label htmlFor="review-author">Numele vostru (2–100 de caractere)</label>
          <input ref={authorInput} id="review-author" name="author" autoComplete="name" required
            value={form.author} onChange={handleChange} aria-invalid={Boolean(fieldErrors.author)}
            aria-describedby={fieldErrors.author ? 'review-author-error' : undefined} />
          {fieldErrors.author && <span id="review-author-error" className="error">{fieldErrors.author}</span>}
          <label htmlFor="review-rating">Nota</label>
          <select id="review-rating" name="rating" value={form.rating} onChange={handleChange}
            aria-invalid={Boolean(fieldErrors.rating)}
            aria-describedby={fieldErrors.rating ? 'review-rating-error' : undefined}>
            {[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{rating} din 5</option>)}
          </select>
          {fieldErrors.rating && <span id="review-rating-error" className="error">{fieldErrors.rating}</span>}
          <label htmlFor="review-comment">Comentariu (opțional, cel mult 1000 de caractere)</label>
          <textarea id="review-comment" name="comment" rows="4" value={form.comment} onChange={handleChange}
            aria-invalid={Boolean(fieldErrors.comment)}
            aria-describedby={`review-comment-count${fieldErrors.comment ? ' review-comment-error' : ''}`} />
          <small id="review-comment-count" className="muted">{form.comment.length} / 1000 caractere</small>
          {fieldErrors.comment && <span id="review-comment-error" className="error">{fieldErrors.comment}</span>}
          <div className="review-actions">
            <button type="submit">{saving ? 'Se trimite…' : editingId === null ? 'Trimite recenzia' : 'Salvează modificările'}</button>
            {editingId !== null && <button type="button" onClick={resetForm}>Renunță la editare</button>}
          </div>
        </fieldset>
      </form>
    </section>
  )
}
