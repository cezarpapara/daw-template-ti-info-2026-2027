// Toate cererile catre backend sunt grupate aici, intr-un singur loc.
// Adresa backend-ului vine din fisierul .env (VITE_API_URL).
const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

// Functie generala: trimite cererea si intoarce raspunsul JSON (sau arunca o eroare)
async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    // trimite si cookie-ul httpOnly cu token-ul JWT (JavaScript nu il poate citi, doar browserul il trimite)
    credentials: 'include',
    ...options,
  })

  // 204 = "No Content" (de exemplu dupa stergere): nu exista JSON in raspuns
  if (response.status === 204) {
    return null
  }

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    const error = new Error(data.error ?? `Eroare ${response.status}`)
    error.status = response.status
    error.violations = data.violations ?? {} // mesajele de validare pentru fiecare camp
    throw error
  }
  return data
}

export const api = {
  url: API_URL,

  // GET /api/health
  getHealth: () => request('/api/health'),

  // POST /api/auth/register
  register: (email, password) =>
    request('/api/auth/register', { method: 'POST', body: JSON.stringify({ email, password }) }),

  // POST /api/auth/login (raspunsul pune token-ul in cookie si intoarce { user })
  login: (email, password) =>
    request('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  // POST /api/auth/logout
  logout: () => request('/api/auth/logout', { method: 'POST' }),

  // GET /api/auth/me
  getMe: () => request('/api/auth/me'),

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
}
