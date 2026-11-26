
// Toate cererile catre backend sunt grupate aici, intr-un singur loc.
// Adresa backend-ului vine din fisierul .env (VITE_API_URL).
const API_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:8080')
  .replace(/\/+$/, '')

// Functie generala: trimite cererea si intoarce raspunsul JSON.
async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (response.status === 204) {
    return null
  }

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    const fields = data.errors || {}
    const message = Object.values(fields).join(' ')
      || data.error
      || `Eroare ${response.status}`

    const error = new Error(message)
    error.fields = fields
    throw error
  }

  return data
}

export const api = {
  url: API_URL,

  // GET /api/health
  getHealth: () => request('/api/health'),

  // GET /api/hello/{name}
  getHello: (name) => request(`/api/hello/${encodeURIComponent(name)}`),

  // GET /api/categories
  getCategories: () => request('/api/categories'),

  // POST /api/categories
  createCategory: (category) =>
    request('/api/categories', {
      method: 'POST',
      body: JSON.stringify(category),
    }),

  // GET /api/products
  getProducts: () => request('/api/products'),

  // GET /api/products/{id}
  getProduct: (id) => request(`/api/products/${id}`),

  // POST /api/products
  createProduct: (product) =>
    request('/api/products', {
      method: 'POST',
      body: JSON.stringify(product),
    }),

  // DELETE /api/products/{id}
  deleteProduct: (id) =>
    request(`/api/products/${id}`, {
      method: 'DELETE',
    }),

  // GET /api/products/{id}/reviews
  getReviews: (productId) =>
    request(`/api/products/${productId}/reviews`),

  // POST /api/reviews
  createReview: (review) =>
    request('/api/reviews', {
      method: 'POST',
      body: JSON.stringify(review),
    }),

  // DELETE /api/reviews/{id}
  deleteReview: (id) =>
    request(`/api/reviews/${id}`, {
      method: 'DELETE',
    }),
}
