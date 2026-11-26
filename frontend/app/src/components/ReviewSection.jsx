
import { useEffect, useState } from 'react'
import { api } from '../api.js'

const EMPTY_FORM = {
  author: '',
  rating: '5',
  comment: '',
}

function ReviewSection({ productId }) {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState(EMPTY_FORM)

  useEffect(() => {
    let active = true

    setLoading(true)
    setError('')

    api.getReviews(productId)
      .then((data) => {
        if (active) setReviews(data)
      })
      .catch((err) => {
        if (active) setError(err.message)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [productId])

  function handleChange(event) {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    setSaving(true)
    setError('')

    try {
      const created = await api.createReview({
        author: form.author,
        rating: Number(form.rating),
        comment: form.comment,
        productId: Number(productId),
      })

      setReviews((current) => [created, ...current])
      setForm(EMPTY_FORM)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      'Sigur dorești să ștergi această recenzie?'
    )

    if (!confirmed) return

    setError('')

    try {
      await api.deleteReview(id)

      setReviews((current) =>
        current.filter((review) => review.id !== id)
      )
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <section className="reviews">
      <h2>Recenzii ({reviews.length})</h2>

      {loading && (
        <p className="muted">Se încarcă recenziile...</p>
      )}

      {error && (
        <div className="status status-error" role="alert">
          {error}
        </div>
      )}

      {!loading && reviews.length === 0 && (
        <p className="muted">Nu există încă recenzii pentru acest produs.</p>
      )}

      {!loading && reviews.length > 0 && (
        <ul className="review-list">
          {reviews.map((review) => (
            <li key={review.id} className="review-item">
              <div>
                <strong>{review.author}</strong>

                <span
                  className="stars"
                  role="img"
                  aria-label={`${review.rating} din 5 stele`}
                >
                  {'★'.repeat(review.rating)}
                  {'☆'.repeat(5 - review.rating)}
                </span>

                <small className="muted">
                  {' · '}{review.createdAt}
                </small>
              </div>

              {review.comment && <p>{review.comment}</p>}

              <button
                type="button"
                onClick={() => handleDelete(review.id)}
              >
                Șterge
              </button>
            </li>
          ))}
        </ul>
      )}

      <form className="review-form" onSubmit={handleSubmit}>
        <h3>Adaugă o recenzie</h3>

        <label>
          Numele tău
          <input
            type="text"
            name="author"
            value={form.author}
            onChange={handleChange}
            required
            maxLength={100}
          />
        </label>

        <label>
          Nota
          <select
            name="rating"
            value={form.rating}
            onChange={handleChange}
          >
            {[5, 4, 3, 2, 1].map((number) => (
              <option key={number} value={number}>
                {number} {number === 1 ? 'stea' : 'stele'}
              </option>
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
  )
}

export default ReviewSection
