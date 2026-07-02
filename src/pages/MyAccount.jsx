import { Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const sections = {
  orders: {
    title: 'My Orders',
    description: 'View your past orders and track upcoming fruit deliveries.',
  },
  addresses: {
    title: 'Saved Addresses',
    description: 'Manage delivery addresses for your morning fruit orders.',
  },
}

export default function MyAccount() {
  const { user, isLoggedIn } = useAuth()
  const [searchParams] = useSearchParams()
  const section = searchParams.get('section')
  const activeSection = sections[section]

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-slate-50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-10 shadow-sm">
            <h1 className="text-4xl font-bold text-slate-900">My Account</h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Sign in to see your orders, saved addresses, and delivery details.
            </p>
            <Link
              to="/"
              className="mt-8 inline-flex rounded-full bg-emerald-950 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 py-16">
      <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-600">My Account</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            {activeSection?.title || 'Account Overview'}
          </h1>
          <p className="mt-2 text-slate-500">{user.mobile}</p>

          <p className="mt-6 leading-7 text-slate-600">
            {activeSection?.description ||
              'Manage your Tokri account, orders, and saved delivery addresses.'}
          </p>

          {!activeSection && (
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/account?section=orders"
                className="inline-flex rounded-full bg-emerald-950 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
              >
                My Orders
              </Link>
              <Link
                to="/account?section=addresses"
                className="inline-flex rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
              >
                Saved Addresses
              </Link>
            </div>
          )}

          {activeSection && (
            <div className="mt-8 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
              {section === 'orders'
                ? 'No orders yet. Your order history will appear here after your first purchase.'
                : 'No saved addresses yet. Add a delivery address during checkout.'}
            </div>
          )}

          <Link
            to="/"
            className="mt-8 inline-flex text-sm font-semibold text-emerald-800 hover:underline"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </main>
  )
}
