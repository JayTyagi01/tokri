import { useCart } from '../context/CartContext'
import { useState } from 'react'
import { Menu, ShoppingBagIcon, X } from 'lucide-react'

export default function Header({ onLoginClick }) {
  const { totalCount, openDrawer } = useCart()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="top-0 z-50 shadow-sm">
      <div className="bg-emerald-950 text-emerald-100">
        <div className="mx-auto flex flex-col gap-2 px-4 py-2 text-center text-xs font-medium sm:flex-row sm:items-center sm:justify-between sm:text-sm sm:px-6 lg:px-8">
          <p className="mx-auto sm:mx-0 lg:text-base">
            Get 10% OFF Your First Order - Use Code: <span className="font-semibold text-white">WELCOME10</span>
          </p>
          <div className="hidden items-center gap-3 lg:flex">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                <path d="M12 2.04c-5.52 0-9.96 4.44-9.96 9.96 0 4.41 2.87 8.16 6.84 9.44.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.71-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1.01.07 1.54 1.04 1.54 1.04.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.64-1.34-2.22-.25-4.55-1.11-4.55-4.95 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.03A9.56 9.56 0 0 1 12 6.8c.85.004 1.7.12 2.5.35 1.9-1.3 2.73-1.03 2.73-1.03.55 1.37.2 2.39.1 2.64.64.7 1.03 1.6 1.03 2.69 0 3.85-2.34 4.7-4.57 4.95.36.31.68.92.68 1.85 0 1.33-.01 2.4-.01 2.72 0 .26.18.58.69.48A9.96 9.96 0 0 0 21.96 12c0-5.52-4.44-9.96-9.96-9.96Z" />
              </svg>
            </span>
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                <path d="M12 2.163c-5.486 0-9.94 4.45-9.94 9.94 0 4.397 2.87 8.134 6.84 9.45.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.71-2.78.6-3.37-1.34-3.37-1.34-.45-1.156-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1.01.07 1.54 1.04 1.54 1.04.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.64-1.34-2.22-.25-4.55-1.11-4.55-4.95 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.03a9.58 9.58 0 0 1 5.01 0c1.91-1.3 2.75-1.03 2.75-1.03.55 1.37.2 2.39.1 2.64.64.7 1.03 1.6 1.03 2.69 0 3.85-2.34 4.7-4.57 4.95.36.31.68.92.68 1.85 0 1.33-.01 2.4-.01 2.72 0 .27.18.59.69.49 3.96-1.32 6.84-5.05 6.84-9.45 0-5.49-4.45-9.94-9.94-9.94Z" />
              </svg>
            </span>
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                <path d="M20 3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2Zm-8 15.5l-6-3.5V7.05l6 3.5 6-3.5V15l-6 3.5Z" />
              </svg>
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white border-b border-slate-200">
        <div className="mx-auto flex flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex items-center justify-between lg:flex-col lg:gap-4 lg:items-start">
            <div className="text-3xl font-bold tracking-tight">LOGO</div>

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
            <label className="sr-only" htmlFor="site-search">
              Search products
            </label>
            <div className="relative w-full">
              <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                  <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16a6.471 6.471 0 0 0 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5Zm-6 0C8.01 14 6 11.99 6 9.5S8.01 5 10.5 5 15 7.01 15 9.5 12.99 14 10.5 14Z" />
                </svg>
              </span>
              <input
                id="site-search"
                type="search"
                placeholder="Search for products, categories or brands..."
                className="h-12 w-full rounded-full border border-slate-200 px-14 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
              />
            </div>
          </div>

          {/* Desktop Buttons - Hidden on Mobile */}
          <div className="hidden lg:flex flex-col gap-6 sm:flex-row sm:items-center sm:self-auto">
            <button
              onClick={onLoginClick}
              className="h-12 w-full rounded-full bg-emerald-950 px-10 py-3 text-[16px] font-semibold text-white shadow-sm transition hover:bg-emerald-800 sm:w-auto"
            >
              Login
            </button>
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
              <label className="sr-only" htmlFor="mobile-search">
                Search products
              </label>
              <div className="relative w-full">
                <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                    <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16a6.471 6.471 0 0 0 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5Zm-6 0C8.01 14 6 11.99 6 9.5S8.01 5 10.5 5 15 7.01 15 9.5 12.99 14 10.5 14Z" />
                  </svg>
                </span>
                <input
                  id="mobile-search"
                  type="search"
                  placeholder="Search products..."
                  className="h-12 w-full rounded-full border border-slate-200 bg-slate-50 px-12 text-sm text-slate-900 outline-none"
                />
              </div>
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
              <button
                onClick={() => {
                  onLoginClick()
                  setMobileMenuOpen(false)
                }}
                className="w-full rounded-full bg-emerald-950 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"
              >
                Login
              </button>
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
