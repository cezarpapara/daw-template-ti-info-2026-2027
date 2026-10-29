import { NavLink, Route, Routes } from 'react-router'
import HomePage from './pages/HomePage.jsx'
import CategoriesPage from './pages/CategoriesPage.jsx'
import ProductsPage from './pages/ProductsPage.jsx'
import ProductDetailsPage from './pages/ProductDetailsPage.jsx'
import AboutPage from './pages/AboutPage.jsx' 
import ContactPage from './pages/ContactPage.jsx' // Adăugat pentru Laboratorul 05
import './App.css'

// Structura comuna a tuturor paginilor: meniul de sus + pagina curenta
function App() {
  return (
    <>
      <header className="header">
        <span className="logo">PW / DAW</span>
        <nav>
          <NavLink to="/" end>Acasa</NavLink>
          <NavLink to="/categorii">Categorii</NavLink>
          <NavLink to="/produse">Produse</NavLink>
          <NavLink to="/despre">Despre</NavLink> 
          <NavLink to="/contact">Contact</NavLink> {/* Legătura nouă din meniu */}
        </nav>
      </header>

      <main className="container">
        {/* Fiecare adresa (URL) afiseaza o alta pagina */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/categorii" element={<CategoriesPage />} />
          <Route path="/produse" element={<ProductsPage />} />
          <Route path="/produse/:id" element={<ProductDetailsPage />} />
          <Route path="/despre" element={<AboutPage />} /> 
          <Route path="/contact" element={<ContactPage />} /> {/* Ruta nouă pentru contact */}
          <Route path="*" element={<p>Pagina nu exista.</p>} />
        </Routes>
      </main>
    </>
  )
}

export default App