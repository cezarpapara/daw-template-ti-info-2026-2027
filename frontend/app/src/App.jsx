import { Routes, Route, Link } from 'react-router'
import ContactPage from './pages/ContactPage'
import ProductsPage from './pages/ProductsPage'
import ProductDetailsPage from './pages/ProductDetailsPage'
import CategoriesPage from './pages/CategoriesPage' // Asigură-te că importul corespunde fișierului tău de categorii
import AboutPage from './pages/AboutPage'
import './App.css'

function App() {
  return (
    <div className="app-container">
      {/* Bara de navigare unificată sus */}
      <header>
        <nav className="nav-menu" style={{ display: 'flex', gap: '1.5rem', padding: '1rem', background: '#f5f5f5', marginBottom: '1rem', alignItems: 'center' }}>
          <Link to="/">Acasă</Link>
          <Link to="/produse">Produse</Link>
          <Link to="/categorii">Categorii</Link> {/* <-- Adăugat aici sus */}
          <Link to="/despre">Despre</Link>
          <Link to="/contact">Contact</Link>
        </nav>
      </header>

      {/* Rutele aplicației */}
      <main style={{ padding: '0 1rem' }}>
        <Routes>
          <Route path="/" element={<h1>Bun venit la aplicația DAW!</h1>} />
          <Route path="/produse" element={<ProductsPage />} />
          <Route path="/produse/:id" element={<ProductDetailsPage />} />
          <Route path="/categorii" element={<CategoriesPage />} /> {/* Ruta pentru categorii */}
          <Route path="/despre" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App