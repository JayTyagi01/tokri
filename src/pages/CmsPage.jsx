import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { fetchJson } from '../lib/api'

export default function CmsPage() {
  const location = useLocation()
  const { slug: routeSlug } = useParams()

  const slug = useMemo(() => {
    if (routeSlug) return routeSlug
    return location.pathname.replace(/^\//, '').replace(/\/$/, '')
  }, [routeSlug, location.pathname])

  const [page, setPage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!slug) {
      setNotFound(true)
      setLoading(false)
      return undefined
    }

    let ignore = false
    setLoading(true)
    setNotFound(false)

    fetchJson(`/pages/${encodeURIComponent(slug)}`)
      .then((data) => {
        if (!ignore) setPage(data)
      })
      .catch(() => {
        if (!ignore) {
          setPage(null)
          setNotFound(true)
        }
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [slug])

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-10 shadow-sm">
            <h1 className="text-3xl font-bold text-slate-900">Loading page...</h1>
          </div>
        </div>
      </main>
    )
  }

  if (notFound || !page) {
    return (
      <main className="min-h-screen bg-slate-50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-10 shadow-sm">
            <h1 className="text-4xl font-bold text-slate-900">Page not found</h1>
            <p className="mt-4 text-slate-600">This page does not exist or is not published yet.</p>
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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-10 shadow-sm">
          <h1 className="text-4xl font-bold text-slate-900">{page.title}</h1>

          {page.body ? (
            <div className="cms-page-content mt-8 text-slate-700" dangerouslySetInnerHTML={{ __html: page.body }} />
          ) : (
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Content for this page has not been added yet. Edit it in the admin under Content → Pages.
            </p>
          )}

          <Link
            to="/"
            className="mt-10 inline-flex rounded-full bg-emerald-950 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  )
}
