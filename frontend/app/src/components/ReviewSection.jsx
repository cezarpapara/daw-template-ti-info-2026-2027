import { useEffect, useState } from 'react';
import { getReviews, createReview, updateReview, deleteReview } from '../api';
const EMPTY_FORM = { author: '', rating: '5', comment: '' };
export default function ReviewSection({ productId }) {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [editingReviewId, setEditingReviewId] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});
    // Se execută la afișare și ori de câte ori se schimbă productId.
    useEffect(() => {
        setLoading(true);
        setError('');
        getReviews(productId)
            .then(setReviews)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [productId]);
    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
        setFieldErrors((errors) => {
            const nextErrors = { ...errors };
            delete nextErrors[e.target.name];
            return nextErrors;
        });
    }
    function handleEdit(review) {
        setEditingReviewId(review.id);
        setForm({
            author: review.author,
            rating: String(review.rating),
            comment: review.comment ?? '',
        });
        setError('');
        setFieldErrors({});
        setSuccessMessage('');
    }
    async function handleSubmit(e) {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            const data = {
                author: form.author,
                rating: Number(form.rating),
                comment: form.comment,
                productId: Number(productId),
            };
            if (editingReviewId !== null) {
                const updated = await updateReview(editingReviewId, data);
                setReviews((list) => list.map((review) =>
                    review.id === editingReviewId ? updated : review
                ));
            } else {
                const created = await createReview(data);
                setReviews((list) => [created, ...list]); // recenzia nouă apare prima
            }
            setForm(EMPTY_FORM);
            setEditingReviewId(null);
            setFieldErrors({});
            setSuccessMessage(editingReviewId !== null
                ? 'Recenzia a fost actualizată!'
                : 'Mulțumim pentru recenzie!');
            setTimeout(() => setSuccessMessage(''), 3000);
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
        } catch (err) {
            setError(err.message);
        }
    }
    const average = reviews.length > 0
        ? reviews.reduce((total, review) => total + Number(Math.max(0, Math.min(5, Number(review.rating) || 0))), 0) / reviews.length
        : 0;

    return (
        <section className="reviews">
            <h2>Recenzii ({reviews.length})</h2>
            {loading && <p>Se încarcă recenziile...</p>}
            {error && <p className="error">{error}</p>}
            {successMessage && <p>{successMessage}</p>}
            {!loading && reviews.length === 0 && <p>Nu există încă recenzii.</p>}
            <p>Nota medie: {Math.max(0, Math.min(5, average))} din 5</p>
            <ul className="review-list">
                {reviews.map((r) => (
                    <li key={r.id}>
                        <strong>{r.author}</strong>{' '}
                        <span className="stars" role="img"
                            aria-label={`${r.rating} din 5 stele`}>
                            {(() => {
                                const rating = Math.max(0, Math.min(5, Math.trunc(Number(r.rating) || 0)));
                                return '★'.repeat(rating) + '☆'.repeat(5 - rating) + ' ' + rating + "/5";
                            })()}
                        </span>
                        <small> · {r.createdAt}</small>
                        {r.comment && <p>{r.comment}</p>}
                        <button type="button" onClick={() => handleEdit(r)}>Editează</button>{' '}
                        <button type="button" onClick={() => handleDelete(r.id)}>Șterge</button>
                    </li>
                ))}
            </ul>
            <form onSubmit={handleSubmit} noValidate>
                <h3>{editingReviewId !== null ? 'Editați recenzia' : 'Adăugați o recenzie'}</h3>
                <label>
                    Numele vostru
                    <input name="author" value={form.author} onChange={handleChange}
                        required aria-invalid={Boolean(fieldErrors.author)}
                        className={fieldErrors.author ? 'field-error' : ''} />
                    {fieldErrors.author && <span className="error">{fieldErrors.author}</span>}
                </label>
                <label>
                    Nota
                    <select name="rating" value={form.rating} onChange={handleChange}
                        aria-invalid={Boolean(fieldErrors.rating)}
                        className={fieldErrors.rating ? 'field-error' : ''}>
                        {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n}</option>)}
                    </select>
                    {fieldErrors.rating && <span className="error">{fieldErrors.rating}</span>}
                </label>
                <label>
                    Comentariu (opțional)
                    <textarea name="comment" value={form.comment} onChange={handleChange}
                        rows={3} aria-invalid={Boolean(fieldErrors.comment)}
                        className={fieldErrors.comment ? 'field-error' : ''} />
                    {fieldErrors.comment && <span className="error">{fieldErrors.comment}</span>}
                </label>
                <button type="submit" disabled={saving}>
                    {saving ? 'Se trimite...' : editingReviewId !== null ? 'Salvează modificările' : 'Trimite recenzia'}
                </button>
                {editingReviewId !== null && (
                    <button type="button" onClick={() => {
                        setEditingReviewId(null);
                        setForm(EMPTY_FORM);
                    }}>
                        Anulează
                    </button>
                )}
            </form>
        </section>
    );
}