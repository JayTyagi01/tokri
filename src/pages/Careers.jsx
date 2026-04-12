import { Link } from 'react-router-dom'

export default function Careers() {
  return (
    <main className="min-h-screen bg-slate-50 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-10 shadow-sm">
          <h1 className="text-4xl font-bold text-slate-900">Careers</h1>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            Join our team and help build a smarter shopping experience for customers everywhere.
          </p>
          <p className="mt-4 text-slate-600">
            Explore open roles in operations, customer service, logistics, and product design.
          </p>
          <Link to="/" className="mt-8 inline-flex rounded-full bg-emerald-950 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-800">
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  )
}
