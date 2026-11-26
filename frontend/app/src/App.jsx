import { NavLink, Route, Routes } from 'react-router'
import HomePage from './pages/HomePage.jsx'
import CategoriesPage from './pages/CategoriesPage.jsx'
import ProductsPage from './pages/ProductsPage.jsx'
import ProductDetailsPage from './pages/ProductDetailsPage.jsx'
import AboutPage from './pages/AboutPage.jsx'
import ContactPage from './pages/ContactPage.jsx'
import './App.css'

function App() {
  return (
    <>
      <a className="skip-link" href="#continut">Sari la conținut</a>
      <header className="header">
        <span className="logo">PW / DAW</span>
        <nav aria-label="Meniul principal">
          <NavLink to="/" end>Acasa</NavLink>
          <NavLink to="/categorii">Categorii</NavLink>
          <NavLink to="/produse">Produse</NavLink>
          <NavLink to="/despre">Despre</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </nav>
      </header>

      <main className="container" id="continut" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/categorii" element={<CategoriesPage />} />
          <Route path="/produse" element={<ProductsPage />} />
          <Route path="/produse/:id" element={<ProductDetailsPage />} />
          <Route path="/despre" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<><title>Pagina nu există – PW / DAW</title><h1>Pagina nu există.</h1><p>Alegeți o pagină din meniu.</p></>} />
        </Routes>
      </main>
    </>
  )
}

export default App
