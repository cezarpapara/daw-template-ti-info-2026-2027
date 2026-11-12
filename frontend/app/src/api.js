// Toate cererile catre backend sunt grupate aici, intr-un singur loc.
// Adresa backend-ului vine din fisierul .env (VITE_API_URL).
const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

// Functie generala: trimite cererea si intoarce raspunsul JSON (sau arunca o eroare)
async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  // 204 = "No Content" (de exemplu dupa stergere): nu exista JSON in raspuns
  if (response.status === 204) {
    return null
  }

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.error ?? `Eroare ${response.status}`)
  }
  return data
}

export const api = {
  url: API_URL,

  // GET /api/health
  getHealth: () => request('/api/health'),

  // GET /api/categories
  getCategories: () => request('/api/categories'),

  // POST /api/categories
  createCategory: (category) =>
    request('/api/categories', { method: 'POST', body: JSON.stringify(category) }),

  // GET /api/products
  getProducts: () => request('/api/products'),

  // GET /api/products/{id}
  getProduct: (id) => request(`/api/products/${id}`),

  // POST /api/products
  createProduct: (product) =>
    request('/api/products', { method: 'POST', body: JSON.stringify(product) }),

  // DELETE /api/products/{id}
  deleteProduct: (id) => request(`/api/products/${id}`, { method: 'DELETE' }),

  // GET /api/hello/{name} (laboratorul 06, exercitiul 5)
  getHello: (name) => request(`/api/hello/${encodeURIComponent(name)}`),
}

// --- Recenzii (laboratorul 09) ---
// Adresa backend-ului fără „/api” la final, oricum ar fi scrisă în .env.
const REVIEWS_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8080')
  .replace(/\/+$/, '')
  .replace(/\/api$/, '');

// Transformă un răspuns cu eroare într-un obiect Error cu mesaj citibil.
async function reviewError(res) {
  const body = await res.json().catch(() => ({}));
  const fields = body.errors || {};
  const message = Object.values(fields).join(' ')
    || body.error || `Eroare ${res.status}`;
  const error = new Error(message);
  error.fields = fields; // erorile pe câmpuri (le folosim în laboratorul 10)
  return error;
}

export async function getReviews(productId) {
  const res = await fetch(`${REVIEWS_BASE}/api/products/${productId}/reviews`);
  if (!res.ok) throw await reviewError(res);
  return res.json();
}

export async function createReview(data) {
  const res = await fetch(`${REVIEWS_BASE}/api/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw await reviewError(res);
  return res.json();
}

export async function deleteReview(id) {
  const url = `${REVIEWS_BASE}/api/reviews/${id}`;
  const res = await fetch(url, { method: 'DELETE' });
  if (!res.ok) throw await reviewError(res);
}

// Exercițiul 4 (opțional): PUT /api/reviews/{id} înlocuiește toate câmpurile recenziei.
export async function updateReview(id, data) {
  const res = await fetch(`${REVIEWS_BASE}/api/reviews/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw await reviewError(res);
  return res.json();
}
