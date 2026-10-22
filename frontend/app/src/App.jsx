import { NavLink, Route, Routes } from 'react-router'
import HomePage from './pages/HomePage.jsx'
import CategoriesPage from './pages/CategoriesPage.jsx'
import ProductsPage from './pages/ProductsPage.jsx'
import ProductDetailsPage from './pages/ProductDetailsPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import { useAuth } from './AuthContext.jsx'
import './App.css'

// Structura comuna a tuturor paginilor: meniul de sus + pagina curenta
function App() {
  const { user, isAdmin, logout } = useAuth()

  return (
    <>
      <header className="header">
        <span className="logo">PW / DAW</span>
        <nav>
          <NavLink to="/" end>Acasa</NavLink>
          <NavLink to="/categorii">Categorii</NavLink>
          <NavLink to="/produse">Produse</NavLink>
        </nav>
        <div className="user">
          {user ? (
            <>
              <span>{user.email}{isAdmin && ' (admin)'}</span>
              <button onClick={logout}>Iesire</button>
            </>
          ) : (
            <>
              <NavLink to="/autentificare">Autentificare</NavLink>
              <NavLink to="/inregistrare">Cont nou</NavLink>
            </>
          )}
        </div>
      </header>

      <main className="container">
        {/* Fiecare adresa (URL) afiseaza o alta pagina */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/categorii" element={<CategoriesPage />} />
          <Route path="/produse" element={<ProductsPage />} />
          <Route path="/produse/:id" element={<ProductDetailsPage />} />
          <Route path="/autentificare" element={<LoginPage />} />
          <Route path="/inregistrare" element={<RegisterPage />} />
          <Route path="*" element={<p>Pagina nu exista.</p>} />
        </Routes>
      </main>
    </>
  )
}

export default App
