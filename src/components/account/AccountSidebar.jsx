import { Link, useNavigate } from 'react-router-dom'
import {
  Building2,
  Home,
  LogOut,
  MapPin,
  MapPinned,
  Package,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const navItems = [
  { key: 'orders', label: 'My Orders', icon: Package, href: '/account?section=orders' },
  { key: 'addresses', label: 'Saved Addresses', icon: MapPinned, href: '/account?section=addresses' },
]

export default function AccountSidebar({ activeSection }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const formattedMobile = user?.phone
    ? `+91 ${user.phone.replace(/(\d{5})(\d{5})/, '$1 $2')}`
    : ''

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <aside className="w-full shrink-0 border-b border-slate-200 bg-slate-50 lg:w-64 lg:border-b-0 lg:border-r lg:bg-white">
      <div className="border-b border-slate-200 px-5 py-4">
        <p className="text-sm font-semibold text-slate-900">{formattedMobile}</p>
      </div>

      <nav className="py-2">
        {navItems.map(({ key, label, icon: Icon, href }) => {
          const active = activeSection === key
          return (
            <Link
              key={key}
              to={href}
              className={`flex items-center gap-3 px-5 py-3 text-sm transition ${
                active
                  ? 'border-l-4 border-emerald-700 bg-slate-100 font-semibold text-slate-900'
                  : 'border-l-4 border-transparent text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Icon size={18} className={active ? 'text-emerald-700' : 'text-slate-500'} />
              {label}
            </Link>
          )
        })}

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 border-l-4 border-transparent px-5 py-3 text-left text-sm text-slate-600 transition hover:bg-slate-50"
        >
          <LogOut size={18} className="text-slate-500" />
          Log Out
        </button>
      </nav>
    </aside>
  )
}

export function addressLabelIcon(label) {
  if (label === 'Work') return Building2
  if (label === 'Home') return Home
  return MapPin
}
