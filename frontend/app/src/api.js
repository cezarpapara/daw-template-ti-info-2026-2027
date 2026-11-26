// Adresa backend-ului vine din fisierul .env (VITE_API_URL).
const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

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

  getHealth: () => request('/api/health'),

  getCategories: () => request('/api/categories'),

  createCategory: (category) =>
    request('/api/categories', { method: 'POST', body: JSON.stringify(category) }),

  getProducts: () => request('/api/products'),

  getProduct: (id) => request(`/api/products/${id}`),

  createProduct: (product) =>
    request('/api/products', { method: 'POST', body: JSON.stringify(product) }),

  deleteProduct: (id) => request(`/api/products/${id}`, { method: 'DELETE' }),
}

// Recenzii (laboratoarele 09–10). Erorile de validare sunt păstrate pe câmpuri.
const REVIEWS_BASE = API_URL.replace(/\/+$/, '').replace(/\/api$/, '')

async function reviewRequest(path, options = {}) {
  let response
  try {
    response = await fetch(`${REVIEWS_BASE}${path}`, options)
  } catch (error) {
    if (error.name === 'AbortError') throw error
    throw new Error('Nu se poate contacta API-ul. Verificați conexiunea și dacă backend-ul este pornit.')
  }
  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    const fields = body.errors || {}
    const error = new Error(Object.values(fields).join(' ') || body.error || `Eroare ${response.status}`)
    error.fields = fields
    throw error
  }
  return response.status === 204 ? null : response.json()
}

export function getReviews(productId, signal) {
  return reviewRequest(`/api/products/${encodeURIComponent(productId)}/reviews`, { signal })
}

export function createReview(data) {
  return reviewRequest('/api/reviews', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export function updateReview(id, data) {
  return reviewRequest(`/api/reviews/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export function deleteReview(id) {
  return reviewRequest(`/api/reviews/${encodeURIComponent(id)}`, { method: 'DELETE' })
}
