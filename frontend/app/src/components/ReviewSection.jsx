import { useEffect, useState } from "react";
import { getReviews, createReview, deleteReview, updateReview } from "../api";
const EMPTY_FORM = { author: "", rating: "5", comment: "" };
export default function ReviewSection({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  // Se execută la afișare și ori de câte ori se schimbă productId.
  useEffect(() => {
    setLoading(true);
    setError("");
    getReviews(productId)
      .then(setReviews)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [productId]);
  // Nota medie (0 dacă lista e goală)
  const average =
    reviews.length === 0
      ? 0
      : reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
  function handleEdit(r) {
    setEditingId(r.id);
    setForm({
      author: r.author,
      rating: String(r.rating),
      comment: r.comment ?? "",
    });
  }
  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setFieldErrors({});
    const data = {
      author: form.author,
      rating: Number(form.rating),
      comment: form.comment,
      productId: Number(productId),
    };
    try {
      if (editingId) {
        const updated = await updateReview(editingId, data);
        setReviews((list) =>
          list.map((r) => (r.id === editingId ? updated : r)),
        );
        setEditingId(null);
      } else {
        const created = await createReview(data);
        setReviews((list) => [created, ...list]); // recenzia nouă apare prima
      }
      setForm(EMPTY_FORM);
      setSuccess("Mulțumim pentru recenzie!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message);
      setFieldErrors(err.fields || {});
    } finally {
      setSaving(false);
    }
  }
  async function handleDelete(id) {
    if (!window.confirm("Sigur ștergeți această recenzie?")) return;
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
      {reviews.length > 0 && <p>Nota medie: {average.toFixed(1)} din 5</p>}
      {loading && <p>Se încarcă recenziile...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && reviews.length === 0 && <p>Nu există încă recenzii.</p>}
      <ul className="review-list">
        {reviews.map((r) => (
          <li key={r.id}>
            <strong>{r.author}</strong>{" "}
            <span
              className="stars"
              role="img"
              aria-label={`${r.rating} din 5 stele`}
            >
              {"★".repeat(r.rating)}
              {"☆".repeat(5 - r.rating)}
            </span>
            <small> · {r.createdAt}</small>
            {r.comment && <p>{r.comment}</p>}
            <button type="button" onClick={() => handleEdit(r)}>
              Editează
            </button>
            <button type="button" onClick={() => handleDelete(r.id)}>
              Șterge
            </button>
          </li>
        ))}
      </ul>
      {success && <p className="form-success">{success}</p>}
      <form onSubmit={handleSubmit} noValidate>
        <h3>{editingId ? "Editați recenzia" : "Adăugați o recenzie"}</h3>
        <label>
          Numele vostru
          <input
            name="author"
            aria-invalid={fieldErrors.author ? "true" : undefined}
            value={form.author}
            onChange={handleChange}
            required
          />
          {fieldErrors.author && (
            <span className="error">{fieldErrors.author}</span>
          )}
        </label>
        <label>
          Nota
          <select
            name="rating"
            value={form.rating}
            onChange={handleChange}
            aria-invalid={fieldErrors.rating ? "true" : undefined}
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          {fieldErrors.rating && (
            <span className="error">{fieldErrors.rating}</span>
          )}
        </label>
        <label>
          Comentariu (opțional)
          <textarea
            name="comment"
            aria-invalid={fieldErrors.comment ? "true" : undefined}
            value={form.comment}
            onChange={handleChange}
            rows={3}
          />
          {fieldErrors.comment && (
            <span className="error">{fieldErrors.comment}</span>
          )}
        </label>
        <button type="submit" disabled={saving}>
          {saving ? "Se trimite..." : "Trimite recenzia"}
        </button>
      </form>
    </section>
  );
}
