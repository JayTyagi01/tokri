import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AccountSidebar from '../components/account/AccountSidebar'
import SavedAddresses from '../components/account/SavedAddresses'
import MyOrders from '../components/account/MyOrders'

export default function MyAccount() {
  const { isLoggedIn } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const section = searchParams.get('section') || 'orders'

  if (!isLoggedIn) {
    return (
      <main className="account-detail min-h-screen bg-slate-100 py-10">
        <div className="mx-auto max-w-lg px-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-slate-900">My Account</h1>
            <div className="mt-4 text-sm text-slate-600">
              Sign in to manage your orders and saved delivery addresses.
            </div>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="mt-6 inline-flex rounded-full bg-emerald-950 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
            >
              Back to Home
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="account-detail min-h-screen bg-slate-100 py-8 sm:py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col lg:flex-row">
            <AccountSidebar activeSection={section} />

            <div className="min-w-0 flex-1 p-5 sm:p-8">
              {section === 'orders' && <MyOrders />}
              {section === 'addresses' && <SavedAddresses />}
              {!['orders', 'addresses'].includes(section) && <MyOrders />}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
