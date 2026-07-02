import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, ShoppingBagIcon, X } from 'lucide-react'
import tokriLogo from '../assets/tokri-logo.png'
import SearchBox from './SearchBox'
import AccountMenu from './AccountMenu'

export default function Header({ onLoginClick }) {
  const { totalCount, openDrawer } = useCart()
  const { isLoggedIn } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 shadow-sm bg-white">
      <div className="bg-emerald-950 text-emerald-100">
        <div className="mx-auto px-4 py-2 text-center text-xs font-medium sm:text-sm sm:px-6 lg:px-8">
          <p className="lg:text-base">
            Get 10% OFF Your First Order - Use Code: <span className="font-semibold text-white">WELCOME10</span>
          </p>
        </div>
      </div>

      <div className="bg-white border-b border-slate-200">
        <div className="mx-auto flex flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex items-center justify-between lg:flex-col lg:gap-4 lg:items-start">
            <Link to="/" className="block shrink-0">
              <img
                src={tokriLogo}
                alt="tokriii - Selling Premium / Exotic Fruits"
                className="h-12 w-auto object-contain sm:h-14"
              />
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden inline-flex items-center justify-center p-2"
            >
              {mobileMenuOpen ? (
                <X size={24} className="text-slate-900" />
              ) : (
                <Menu size={24} className="text-slate-900" />
              )}
            </button>
          </div>

          {/* Desktop Layout - Hidden on Mobile */}
          <div className="hidden lg:flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <div className="text-sm text-slate-700 sm:flex sm:items-center sm:gap-2">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                  <path d="M12 2C8.1 2 5 5.1 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.9-3.1-7-7-7zm0 9.5c-1.4 0-2.5-1.1-2.5-2.5S10.6 6.5 12 6.5s2.5 1.1 2.5 2.5S13.4 11.5 12 11.5Z" />
                </svg>
              </span>
              <div>
                <div className="text-xs text-black font-medium">Deliver To</div>
                <p className="text-sm font-medium text-[#595959]">70 New Ln, Staten Island, New York</p>
              </div>
            </div>
          </div>

          {/* Desktop Search - Hidden on Mobile */}
          <div className="hidden lg:flex flex-1 flex-col gap-4 lg:max-w-3xl">
            <SearchBox variant="desktop" />
          </div>

          {/* Desktop Buttons - Hidden on Mobile */}
          <div className="hidden lg:flex flex-col gap-6 sm:flex-row sm:items-center sm:self-auto">
            {isLoggedIn ? (
              <AccountMenu />
            ) : (
              <button
                onClick={onLoginClick}
                className="h-12 w-full rounded-full bg-emerald-950 px-10 py-3 text-[16px] font-semibold text-white shadow-sm transition hover:bg-emerald-800 sm:w-auto"
              >
                Login
              </button>
            )}
            <button
              onClick={openDrawer}
              className="relative"
            >
              <ShoppingBagIcon width="30" height="30" />
              <span className="w-[20px] h-[20px] rounded-full bg-black text-[13px] font-semibold text-white absolute -top-1 -right-2">{totalCount}</span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-4">
            {/* Mobile Search */}
            <div>
              <SearchBox variant="mobile" />
            </div>

            {/* Mobile Location */}
            <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-3 flex items-center gap-2">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                  <path d="M12 2C8.1 2 5 5.1 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.9-3.1-7-7-7zm0 9.5c-1.4 0-2.5-1.1-2.5-2.5S10.6 6.5 12 6.5s2.5 1.1 2.5 2.5S13.4 11.5 12 11.5Z" />
                </svg>
              </span>
              <div>
                <div className="text-xs text-slate-500">Deliver To</div>
                <p className="text-sm font-medium text-slate-900">70 New Ln, Staten Island</p>
              </div>
            </div>

            {/* Mobile Buttons */}
            <div className="flex flex-col gap-3 pt-4">
              {isLoggedIn ? (
                <AccountMenu variant="mobile" onNavigate={() => setMobileMenuOpen(false)} />
              ) : (
                <button
                  onClick={() => {
                    onLoginClick()
                    setMobileMenuOpen(false)
                  }}
                  className="w-full rounded-full bg-emerald-950 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"
                >
                  Login
                </button>
              )}
              <button
                onClick={() => {
                  openDrawer()
                  setMobileMenuOpen(false)
                }}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"
              >
                <ShoppingBagIcon />
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">{totalCount}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
