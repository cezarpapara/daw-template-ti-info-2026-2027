
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
  const [fieldErrors, setFieldErrors] = useState({})
  const [form, setForm] = useState(EMPTY_FORM)

  useEffect(() => {
    let active = true

    setLoading(true)
    setError('')

    api.getReviews(productId)
      .then((data) => {
        if (active) {
          setReviews(data)
        }
      })
      .catch((err) => {
        if (active) {
          setError(err.message)
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false)
        }
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

    setFieldErrors((current) => ({
      ...current,
      [name]: '',
    }))

    setError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()

    setSaving(true)
    setError('')
    setFieldErrors({})

    try {
      const created = await api.createReview({
        author: form.author.trim(),
        rating: Number(form.rating),
        comment: form.comment.trim(),
        productId: Number(productId),
      })

      setReviews((current) => [created, ...current])
      setForm(EMPTY_FORM)
      setFieldErrors({})
    } catch (err) {
      const responseErrors = err.response?.errors

      if (responseErrors) {
        setFieldErrors(responseErrors)
      } else {
        setError(err.message)
      }
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      'Sigur dorești să ștergi această recenzie?'
    )

    if (!confirmed) {
      return
    }

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
      <h2>Părerile clienților ({reviews.length})</h2>

      {loading && (
        <p className="muted">Se încarcă recenziile...</p>
      )}

      {error && (
        <div className="status status-error" role="alert">
          {error}
        </div>
      )}

      {!loading && reviews.length === 0 && (
        <p className="muted">
          Nu există încă recenzii pentru acest produs.
        </p>
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
                className="button-danger"
                onClick={() => handleDelete(review.id)}
              >
                Șterge
              </button>
            </li>
          ))}
        </ul>
      )}

      <form
        className="review-form"
        onSubmit={handleSubmit}
        noValidate
      >
        <h3>Adaugă o recenzie</h3>

        <div className="form-field">
          <label htmlFor="review-author">Numele tău</label>

          <input
            id="review-author"
            type="text"
            name="author"
            value={form.author}
            onChange={handleChange}
            maxLength={100}
            className={fieldErrors.author ? 'input-invalid' : ''}
            aria-invalid={Boolean(fieldErrors.author)}
            aria-describedby={
              fieldErrors.author ? 'review-author-error' : undefined
            }
          />

          {fieldErrors.author && (
            <p id="review-author-error" className="form-error">
              {fieldErrors.author}
            </p>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="review-rating">Nota</label>

          <select
            id="review-rating"
            name="rating"
            value={form.rating}
            onChange={handleChange}
            className={fieldErrors.rating ? 'input-invalid' : ''}
            aria-invalid={Boolean(fieldErrors.rating)}
            aria-describedby={
              fieldErrors.rating ? 'review-rating-error' : undefined
            }
          >
            {[5, 4, 3, 2, 1].map((number) => (
              <option key={number} value={number}>
                {number} {number === 1 ? 'stea' : 'stele'}
              </option>
            ))}
          </select>

          {fieldErrors.rating && (
            <p id="review-rating-error" className="form-error">
              {fieldErrors.rating}
            </p>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="review-comment">
            Comentariu (opțional)
          </label>

          <textarea
            id="review-comment"
            name="comment"
            value={form.comment}
            onChange={handleChange}
            rows={3}
            maxLength={1000}
            className={fieldErrors.comment ? 'input-invalid' : ''}
            aria-invalid={Boolean(fieldErrors.comment)}
            aria-describedby={
              fieldErrors.comment ? 'review-comment-error' : undefined
            }
          />

          {fieldErrors.comment && (
            <p id="review-comment-error" className="form-error">
              {fieldErrors.comment}
            </p>
          )}
        </div>

        {fieldErrors.product && (
          <p className="form-error" role="alert">
            {fieldErrors.product}
          </p>
        )}

        <button type="submit" disabled={saving}>
          {saving ? 'Se trimite...' : 'Trimite recenzia'}
        </button>
      </form>
    </section>
  )
}

export default ReviewSection
