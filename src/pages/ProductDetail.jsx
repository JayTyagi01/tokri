import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Clock, Leaf, ShieldCheck } from 'lucide-react'
import { fetchJson, normalizeProduct, normalizeProducts } from '../lib/api'
import CartControl from '../components/CartControl'

const discountPercent = (product) => {
  const price = Number(product.priceValue)
  const oldPrice = Number(product.oldPriceValue)
  if (!oldPrice || !price || oldPrice <= price) return 0
  return Math.round((1 - price / oldPrice) * 100)
}

function RelatedProductCard({ product, onNavigate }) {
  const off = discountPercent(product)
  const target = `/product/${product.slug || product.id}`

  return (
    <article
      onClick={() => onNavigate(target)}
      className="group flex h-full cursor-pointer flex-col rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition hover:shadow-md"
    >
      <div className="relative mb-2 h-36 overflow-hidden rounded-lg bg-slate-50">
        {off > 0 && (
          <span className="absolute left-2 top-2 z-10 rounded-md bg-emerald-600 px-2 py-1 text-[11px] font-bold leading-none text-white shadow">
            {off}% OFF
          </span>
        )}
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-medium leading-tight text-slate-900">
        {product.name}
      </h3>
      {product.weight && <p className="mt-1 text-xs text-slate-500">{product.weight}</p>}
      <div className="mt-auto flex items-center justify-between gap-2 pt-2">
        <div className="leading-tight">
          <span className="block text-sm font-semibold text-slate-900 whitespace-nowrap">
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
}

export default function ProductDetail() {
  const navigate = useNavigate()
  const { productId } = useParams()
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let ignore = false

    setLoading(true)
    fetchJson(`/products/${productId}`)
      .then(async (item) => {
        if (ignore) return
        const normalized = normalizeProduct(item)
        setProduct(normalized)

        try {
          const categoryQuery = normalized.categoryId ? `&category=${normalized.categoryId}` : ''
          const items = await fetchJson(`/products?limit=12${categoryQuery}`)
          const seen = new Set([productId])
          const merged = []
          for (const related of normalizeProducts(items)) {
            if (seen.has(related.id)) continue
            seen.add(related.id)
            merged.push(related)
            if (merged.length >= 10) break
          }
          if (!ignore) setRelatedProducts(merged)
        } catch {
          if (!ignore) setRelatedProducts([])
        }
      })
      .catch(() => {
        if (!ignore) setProduct(null)
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [productId])

  if (loading) {
    return (
      <main className="product-detail min-h-screen bg-canvas pb-16 pt-6">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-6 h-4 w-40 animate-pulse rounded bg-panel-2" />
          <div className="flex flex-col gap-8 md:flex-row">
            <div className="aspect-square w-full animate-pulse rounded-2xl bg-panel-2 md:w-[360px]" />
            <div className="flex-1 space-y-4 py-2">
              <div className="h-4 w-20 animate-pulse rounded bg-panel-2" />
              <div className="h-8 w-2/3 animate-pulse rounded bg-panel-2" />
              <div className="h-6 w-24 animate-pulse rounded bg-panel-2" />
              <div className="h-12 w-full max-w-xs animate-pulse rounded-xl bg-panel-2" />
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (!product) {
    return (
      <main className="product-detail min-h-screen bg-canvas py-20">
        <div className="mx-auto max-w-lg px-4 text-center">
          <h1 className="text-2xl font-bold text-white">Product not found</h1>
          <p className="mt-3 text-muted">We could not find the product you were looking for.</p>
          <Link
            to="/"
            className="mt-8 inline-flex rounded-full bg-brand px-6 py-3 text-sm font-semibold text-black hover:bg-brand-hover"
          >
            Back to shop
          </Link>
        </div>
      </main>
    )
  }

  const off = discountPercent(product)
  const categorySlug = product.category?.slug || product.categoryId

  return (
    <main className="product-detail bg-canvas pb-16 pt-6">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <nav className="mb-6 text-sm text-muted">
          <Link to="/" className="text-mint hover:underline">
            Home
          </Link>
          {categorySlug && product.category?.label && (
            <>
              <span className="mx-2">/</span>
              <Link to={`/category/${categorySlug}`} className="text-mint hover:underline">
                {product.category.label}
              </Link>
            </>
          )}
          <span className="mx-2">/</span>
          <span className="text-white/80">{product.name}</span>
        </nav>

        <div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-12">
          <div className="relative mx-auto w-full max-w-[360px] shrink-0 md:mx-0">
            {off > 0 && (
              <span className="absolute left-3 top-3 z-10 rounded-md bg-emerald-600 px-2.5 py-1 text-xs font-bold text-white shadow">
                {off}% OFF
              </span>
            )}
            <div className="overflow-hidden rounded-2xl bg-slate-50">
              <img
                src={product.image}
                alt={product.name}
                className="aspect-square w-full object-cover"
              />
            </div>
          </div>

          <div className="flex-1 md:pt-2">
            {product.category?.label && (
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
                {product.category.label}
              </p>
            )}

            <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">{product.name}</h1>

            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
              {product.weight && <span>{product.weight}</span>}
              {product.weight && product.badge && <span>·</span>}
              {product.badge && <span>{product.badge}</span>}
            </div>

            <div className="mt-5 flex flex-wrap items-baseline gap-3">
              <span className="text-2xl font-bold text-white">{product.price}</span>
              {off > 0 && product.oldPrice && (
                <span className="text-base text-muted line-through">{product.oldPrice}</span>
              )}
            </div>

            <div className="mt-6 max-w-sm">
              <CartControl product={product} variant="block" />
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="flex items-center gap-2.5 rounded-xl border border-line bg-panel px-3 py-2.5">
                <Clock size={16} className="shrink-0 text-emerald-400" />
                <span className="text-xs leading-snug text-muted">Delivery before 7 AM</span>
              </div>
              <div className="flex items-center gap-2.5 rounded-xl border border-line bg-panel px-3 py-2.5">
                <Leaf size={16} className="shrink-0 text-emerald-400" />
                <span className="text-xs leading-snug text-muted">Premium handpicked</span>
              </div>
              <div className="flex items-center gap-2.5 rounded-xl border border-line bg-panel px-3 py-2.5">
                <ShieldCheck size={16} className="shrink-0 text-emerald-400" />
                <span className="text-xs leading-snug text-muted">Secure checkout</span>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-12 border-t border-line pt-10">
          <h2 className="text-lg font-bold text-white">Product details</h2>
          {product.description ? (
            <div
              className="cms-page-content mt-4 max-w-3xl"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          ) : (
            <p className="mt-4 max-w-3xl leading-7 text-muted">
              Enjoy premium quality and fresh flavour with this handpicked fruit. Sourced with care
              and delivered early, so every bite stays naturally sweet and ripe.
            </p>
          )}
        </section>

        {relatedProducts.length > 0 && (
          <section className="mt-14">
            <div className="mb-5 flex items-end justify-between gap-4">
              <h2 className="text-xl font-bold text-white sm:text-2xl">
                More from {product.category?.label || 'this category'}
              </h2>
              {categorySlug && (
                <Link
                  to={`/category/${categorySlug}`}
                  className="shrink-0 text-sm font-semibold text-mint hover:underline"
                >
                  View all
                </Link>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {relatedProducts.map((item) => (
                <RelatedProductCard key={item.id} product={item} onNavigate={navigate} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
