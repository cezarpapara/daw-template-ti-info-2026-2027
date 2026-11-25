
import { NavLink, Route, Routes, useLocation } from 'react-router'
import HomePage from './pages/HomePage.jsx'
import CategoriesPage from './pages/CategoriesPage.jsx'
import ProductsPage from './pages/ProductsPage.jsx'
import ProductDetailsPage from './pages/ProductDetailsPage.jsx'
import AboutPage from './pages/AboutPage.jsx'
import ContactPage from './pages/ContactPage.jsx'
import './App.css'

const navigation = [
  { to: '/', label: 'Acasa', icon: '⌂', end: true },
  { to: '/categorii', label: 'Categorii', icon: '◈' },
  { to: '/produse', label: 'Produse', icon: '◇' },
  { to: '/despre', label: 'Despre', icon: 'ⓘ' },
  { to: '/contact', label: 'Contact', icon: '✉' },
]

function App() {
  const location = useLocation()

  let page = 'default'

  if (location.pathname === '/') {
    page = 'home'
  } else if (location.pathname === '/categorii') {
    page = 'categories'
  } else if (location.pathname.startsWith('/produse')) {
    page = 'products'
  } else if (location.pathname === '/despre') {
    page = 'about'
  } else if (location.pathname === '/contact') {
    page = 'contact'
  }

  return (
    <>
      <header className="header">
        <span className="logo">PW / DAW</span>
      </header>

      <aside className="sidebar-nav" aria-label="Navigare principala">
        {navigation.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            title={item.label}
            className={({ isActive }) =>
              `sidebar-link${isActive ? ' active' : ''}`
            }
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </NavLink>
        ))}
      </aside>

      <main className={`container page-${page}`}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/categorii" element={<CategoriesPage />} />
          <Route path="/produse" element={<ProductsPage />} />
          <Route path="/produse/:id" element={<ProductDetailsPage />} />
          <Route path="/despre" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<p>Pagina nu exista.</p>} />
        </Routes>
      </main>
    </>
  )
}

export default App
