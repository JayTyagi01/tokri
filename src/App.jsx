import { useEffect, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header'
import LoginPopup from './components/LoginPopup'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import CategoryPage from './pages/CategoryPage'
import CartPage from './pages/CartPage'
import CmsPage from './pages/CmsPage'
import MyAccount from './pages/MyAccount'
import CartDrawer from './components/CartDrawer'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import Footer from './components/Footer'

const CMS_PAGE_PATHS = [
  '/about',
  '/careers',
  '/privacy-policy',
  '/terms-and-conditions',
  '/help-faqs',
  '/returns-policy',
  '/support-center',
]

function ScrollToTop() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [location])

  return null
}

function App() {
  const [showLogin, setShowLogin] = useState(false)

  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen">
          <ScrollToTop />
          <Header onLoginClick={() => setShowLogin(true)} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:productId" element={<ProductDetail />} />
            <Route path="/category/:categoryId" element={<CategoryPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/account" element={<MyAccount />} />
            <Route path="/p/:slug" element={<CmsPage />} />
            {CMS_PAGE_PATHS.map((path) => (
              <Route key={path} path={path} element={<CmsPage />} />
            ))}
          </Routes>
          <CartDrawer />
          <Footer />
          {showLogin && <LoginPopup onClose={() => setShowLogin(false)} />}
        </div>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
