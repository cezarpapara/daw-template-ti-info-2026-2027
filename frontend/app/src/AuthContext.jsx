import { createContext, useContext, useEffect, useState } from 'react'
import { api } from './api.js'

// Utilizatorul autentificat, disponibil in orice componenta prin useAuth()
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // La pornire intrebam backend-ul cine suntem: token-ul este in cookie-ul httpOnly,
  // deci nu il putem citi din JavaScript (si nici nu il pastram in localStorage).
  useEffect(() => {
    api.getMe()
      .then((data) => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  async function login(email, password) {
    const data = await api.login(email, password)
    setUser(data.user)
  }

  async function logout() {
    await api.logout().catch(() => {})
    setUser(null)
  }

  const isAdmin = user?.roles.includes('ROLE_ADMIN') ?? false

  // Atentie: aceste verificari doar ascund butoane in interfata.
  // Protectia reala este in backend (#[IsGranted] si ProductVoter).
  function canManageProduct(product) {
    return user !== null && (isAdmin || product.ownerId === user.id)
  }

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, login, logout, canManageProduct }}>
      {children}
    </AuthContext.Provider>
  )
}

// oxlint-disable-next-line react/only-export-components
export function useAuth() {
  return useContext(AuthContext)
}
