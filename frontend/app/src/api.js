const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

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

const REVIEWS_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8080')
  .replace(/\/+$/, '')
  .replace(/\/api$/, '')

async function reviewError(res) {
  const body = await res.json().catch(() => ({}))
  const fields = body.errors || {}
  const message =
    Object.values(fields).join(' ')
    || body.error || `Eroare ${res.status}`
  const error = new Error(message)
  error.fields = fields
  return error
}

export async function getReviews(productId) {
  const res = await fetch(`${REVIEWS_BASE}/api/products/${productId}/reviews`)
  if (!res.ok) throw await reviewError(res)
  return res.json()
}

export async function createReview(data) {
  const res = await fetch(`${REVIEWS_BASE}/api/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw await reviewError(res)
  return res.json()
}

export async function updateReview(id, data) {
  const res = await fetch(`${REVIEWS_BASE}/api/reviews/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw await reviewError(res)
  return res.json()
}

export async function deleteReview(id) {
  const url = `${REVIEWS_BASE}/api/reviews/${id}`
  const res = await fetch(url, { method: 'DELETE' })
  if (!res.ok) throw await reviewError(res)
}