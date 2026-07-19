import { useNavigate, Link } from 'react-router-dom'
import { UserRound, ShoppingBag as ShoppingBagIcon } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import SearchBox from './SearchBox'
import AccountMenu from './AccountMenu'
import DeliveryAddressBar from './DeliveryAddressBar'
import tokriLogo from '../assets/tokri-logo.png'

export default function Header({ onLoginClick }) {
  const navigate = useNavigate()
  const { totalCount, openDrawer } = useCart()
  const { isLoggedIn } = useAuth()

  const handleProfileClick = () => {
    if (isLoggedIn) {
      navigate('/profile')
      return
    }
    navigate('/login')
  }

  const handleDesktopLogin = () => {
    onLoginClick()
  }

  return (
    <header className="sticky top-0 z-50 bg-panel shadow-sm shadow-black/20">
      <div className="hidden bg-canvas text-mint lg:block">
        <div className="mx-auto px-4 py-2 text-center text-xs font-medium sm:text-sm sm:px-6 lg:px-8">
          <p className="lg:text-base">
            Get 10% OFF Your First Order - Use Code:{' '}
            <span className="font-semibold text-white">WELCOME10</span>
          </p>
        </div>
      </div>

      {/* Mobile header */}
      <div className="border-b border-line lg:hidden">
        <div className="px-4 pb-3 pt-3">
          <div className="flex items-center justify-between gap-3">
            <Link to="/" className="block shrink-0">
              <img
                src={tokriLogo}
                alt="tokriii - Selling Premium / Exotic Fruits"
                className="h-9 w-auto object-contain"
              />
            </Link>
            <button
              type="button"
              onClick={handleProfileClick}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line text-white"
              aria-label={isLoggedIn ? 'Open profile' : 'Log in'}
            >
              <UserRound size={20} />
            </button>
          </div>

          <div className="mt-3">
            <DeliveryAddressBar className="min-w-0 w-full" />
          </div>

          <div className="mt-3">
            <SearchBox variant="mobile" />
          </div>
        </div>
      </div>

      {/* Desktop header */}
      <div className="hidden border-b border-line bg-panel lg:block">
        <div className="mx-auto flex flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex items-center justify-between lg:flex-col lg:items-start lg:gap-4">
            <Link to="/" className="block shrink-0">
              <img
                src={tokriLogo}
                alt="tokriii - Selling Premium / Exotic Fruits"
                className="h-12 w-auto object-contain sm:h-14"
              />
            </Link>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <DeliveryAddressBar variant="desktop" />
          </div>

          <div className="flex flex-1 flex-col gap-4 lg:max-w-3xl">
            <SearchBox variant="desktop" />
          </div>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:self-auto">
            {isLoggedIn ? (
              <AccountMenu />
            ) : (
              <button
                onClick={handleDesktopLogin}
                className="h-12 w-full rounded-full bg-brand px-10 py-3 text-[16px] font-semibold text-black shadow-sm transition hover:bg-brand-hover sm:w-auto"
              >
                Login
              </button>
            )}
            <button onClick={openDrawer} className="relative text-white" type="button">
              <ShoppingBagIcon size={30} />
              <span className="absolute -right-2 -top-1 h-[20px] w-[20px] rounded-full bg-brand text-[13px] font-semibold text-black">
                {totalCount}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
