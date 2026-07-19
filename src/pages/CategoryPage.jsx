import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { categoryDetails } from '../data/categories'
import { fetchJson, normalizeProducts, resolveAssetUrl } from '../lib/api'
import CartControl from '../components/CartControl'

const discountPercent = (product) => {
  const price = Number(product.priceValue)
  const oldPrice = Number(product.oldPriceValue)
  if (!oldPrice || !price || oldPrice <= price) return 0
  return Math.round((1 - price / oldPrice) * 100)
}

export default function CategoryPage() {
  const navigate = useNavigate()
  const { categoryId } = useParams()
  const fallbackCategory = categoryDetails[categoryId]
  const [category, setCategory] = useState(fallbackCategory)
  const [loading, setLoading] = useState(!fallbackCategory)

  useEffect(() => {
    let ignore = false

    setLoading(!fallbackCategory)
    fetchJson(`/categories/${categoryId}`)
      .then((item) => {
        if (!ignore) {
          setCategory({
            ...item,
            products: normalizeProducts(item.products || []),
          })
        }
      })
      .catch(() => {
        if (!ignore) setCategory(fallbackCategory)
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [categoryId, fallbackCategory])

  if (loading) {
    return (
      <main className="min-h-screen bg-canvas py-20">
        <div className="mx-auto max-w-3xl rounded-3xl border border-line bg-panel p-10">
          <h1 className="text-3xl font-bold text-white">Loading category...</h1>
        </div>
      </main>
    )
  }

  if (!category) {
    return (
      <main className="min-h-screen bg-canvas py-20">
        <div className="mx-auto max-w-3xl rounded-3xl border border-line bg-panel p-10">
          <h1 className="text-3xl font-bold text-white">Category not found</h1>
          <p className="mt-4 text-muted">The category you are looking for does not exist.</p>
          <Link
            to="/"
            className="mt-8 inline-flex rounded-full bg-brand px-6 py-3 text-sm font-semibold text-black hover:bg-brand-hover"
          >
            Back to home
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="bg-canvas pb-16 pt-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="mb-6 text-sm text-muted">
          <Link to="/" className="font-medium text-mint hover:underline">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="font-medium text-white">{category.title}</span>
        </nav>

        {category.bannerImage ? (
          <div className="mb-10 overflow-hidden rounded-[2rem] shadow-sm">
            <img
              src={resolveAssetUrl(category.bannerImage)}
              alt={category.title || category.label}
              className="h-48 w-full object-cover sm:h-64 lg:h-72"
            />
          </div>
        ) : (
          <div className="mb-10 overflow-hidden rounded-[2rem] border border-line bg-panel p-8 sm:p-10">
            <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-center">
              <div className="shrink-0">
                <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-panel-2 shadow-inner sm:h-40 sm:w-40">
                  <img
                    src={resolveAssetUrl(category.image)}
                    alt={category.title || category.label}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-emerald-400">
                  Category
                </p>
                <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  {category.title}
                </h1>
                {category.subtitle && (
                  <p className="mt-3 max-w-xl text-base leading-7 text-muted">
                    {category.subtitle}
                  </p>
                )}
                <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand/15 px-4 py-1.5 text-sm font-medium text-mint">
                  <span className="font-bold">{category.products.length}</span> products available
                </p>
              </div>
            </div>
          </div>
        )}

        {category.products.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-line bg-panel p-12 text-center">
            <p className="text-lg font-semibold text-white">No products yet</p>
            <p className="mt-2 text-sm text-muted">
              We&apos;re adding fresh picks to this category soon. Check back shortly.
            </p>
            <Link
              to="/"
              className="mt-6 inline-flex rounded-full bg-brand px-6 py-3 text-sm font-semibold text-black transition hover:bg-brand-hover"
            >
              Continue shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {category.products.map((product) => {
              const off = discountPercent(product)
              const target = `/product/${product.slug || product.id}`

              return (
                <article
                  key={product.id}
                  onClick={() => navigate(target)}
                  className="group relative flex h-full cursor-pointer flex-col rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg"
                >
                  <div className="relative mb-3 h-44 overflow-hidden rounded-xl bg-slate-50">
                    {off > 0 && (
                      <span className="absolute left-2 top-2 z-10 rounded-md bg-emerald-600 px-2 py-1 text-[11px] font-bold leading-none text-white shadow">
                        {off}% OFF
                      </span>
                    )}
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-tight text-slate-900">
                    {product.name}
                  </h3>
                  {product.weight && (
                    <p className="mt-1 text-xs text-slate-500">{product.weight}</p>
                  )}
                  <div className="mt-auto flex items-center justify-between gap-2 pt-3">
                    <div className="leading-tight">
                      <span className="block text-sm font-bold text-slate-900 whitespace-nowrap">
                        {product.price}
                      </span>
                      {off > 0 && product.oldPrice && (
                        <span className="block text-xs text-slate-400 line-through whitespace-nowrap">
                          {product.oldPrice}
                        </span>
                      )}
                    </div>
                    <span onClick={(event) => event.stopPropagation()}>
                      <CartControl product={product} />
                    </span>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
