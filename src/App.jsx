import { useEffect, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header'
import LoginPopup from './components/LoginPopup'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import CategoryPage from './pages/CategoryPage'
import CartPage from './pages/CartPage'
import About from './pages/About'
import Careers from './pages/Careers'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsConditions from './pages/TermsConditions'
import MyAccount from './pages/MyAccount'
import HelpFaqs from './pages/HelpFaqs'
import ReturnsPolicy from './pages/ReturnsPolicy'
import SupportCenter from './pages/SupportCenter'
import CartDrawer from './components/CartDrawer'
import { CartProvider } from './context/CartContext'
import Footer from './components/Footer'

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
    <CartProvider>
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <ScrollToTop />
        <Header onLoginClick={() => setShowLogin(true)} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:productId" element={<ProductDetail />} />
          <Route path="/category/:categoryId" element={<CategoryPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-and-conditions" element={<TermsConditions />} />
          <Route path="/account" element={<MyAccount />} />
          <Route path="/help-faqs" element={<HelpFaqs />} />
          <Route path="/returns-policy" element={<ReturnsPolicy />} />
          <Route path="/support-center" element={<SupportCenter />} />
        </Routes>
        <CartDrawer />
        <Footer />
        {showLogin && <LoginPopup onClose={() => setShowLogin(false)} />}
      </div>
    </CartProvider>
  )
}

export default App
