import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { fetchJson, normalizeProducts } from '../lib/api'
import CartControl from './CartControl'

const getSlidesPerView = (width) => {
  if (width >= 1280) return 6
  if (width >= 1024) return 4
  if (width >= 768) return 3
  return 2
}

function useSlidesPerView() {
  const [slidesPerView, setSlidesPerView] = useState(() =>
    typeof window !== 'undefined' ? getSlidesPerView(window.innerWidth) : 6,
  )

  useEffect(() => {
    const update = () => setSlidesPerView(getSlidesPerView(window.innerWidth))
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return slidesPerView
}

const discountPercent = (product) => {
  const price = Number(product.priceValue)
  const oldPrice = Number(product.oldPriceValue)
  if (!oldPrice || !price || oldPrice <= price) return 0
  return Math.round((1 - price / oldPrice) * 100)
}

function ProductCard({ product, onNavigate }) {
  const off = discountPercent(product)
  const target = `/product/${product.slug || product.id}`

  return (
    <article
      onClick={() => onNavigate(target)}
      className="group flex h-full cursor-pointer flex-col rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition hover:shadow-md"
    >
      <div className="relative mb-2 h-32 overflow-hidden rounded-lg bg-slate-50 sm:h-36">
        {off > 0 && (
          <span className="absolute left-2 top-2 rounded-md bg-emerald-600 px-2 py-1 text-[11px] font-bold leading-none text-white shadow">
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
          <span className="block whitespace-nowrap text-sm font-semibold text-slate-900">
            {product.price}
          </span>
          {off > 0 && product.oldPrice && (
            <span className="block whitespace-nowrap text-xs text-slate-400 line-through">
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

function CategoryProductRow({ slug, title, onSettled }) {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const trackRef = useRef(null)
  const settledRef = useRef(false)
  const slidesPerView = useSlidesPerView()
  const showArrows = products.length > slidesPerView
  const heading = title || slug.replace(/-/g, ' ')

  useEffect(() => {
    let ignore = false
    settledRef.current = false
    setLoading(true)

    fetchJson(`/products?category=${encodeURIComponent(slug)}&limit=12`)
      .then((items) => {
        if (!ignore) setProducts(normalizeProducts(Array.isArray(items) ? items : items.products || []))
      })
      .catch(() => {
        if (!ignore) setProducts([])
      })
      .finally(() => {
        if (ignore) return
        setLoading(false)
        if (!settledRef.current) {
          settledRef.current = true
          onSettled?.()
        }
      })

    return () => {
      ignore = true
    }
  }, [slug, onSettled])

  const scrollByCard = (direction) => {
    const track = trackRef.current
    if (!track) return
    const amount = track.clientWidth * 0.85
    track.scrollBy({ left: direction * amount, behavior: 'smooth' })
  }

  if (loading || products.length === 0) {
    return null
  }

  return (
    <section className="my-8 bg-canvas lg:my-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="m-0 text-2xl font-bold capitalize text-white sm:text-3xl lg:text-4xl">
            {heading}
          </h2>
          <Link
            to={`/category/${slug}`}
            className="text-sm font-medium text-mint transition hover:text-white"
          >
            View all
          </Link>
        </div>

        <div className="relative">
            {showArrows && (
              <button
                type="button"
                onClick={() => scrollByCard(-1)}
                aria-label={`Previous ${heading} products`}
                className="absolute -left-3 top-1/2 z-10 flex -translate-y-1/2 rounded-full border border-line bg-panel p-2.5 text-white shadow-md transition hover:bg-brand hover:text-black"
              >
                <ChevronLeft size={20} />
              </button>
            )}

            <div
              ref={trackRef}
              className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-2 scrollbar-hide sm:gap-4"
            >
              {products.map((product) => (
                <div
                  key={product.id}
                  className="w-[48%] shrink-0 snap-start sm:w-[calc((100%-1rem)/2)] md:w-[calc((100%-2rem)/3)] lg:w-[calc((100%-3rem)/4)] xl:w-[calc((100%-5*1rem)/6)]"
                >
                  <ProductCard product={product} onNavigate={navigate} />
                </div>
              ))}
            </div>

            {showArrows && (
              <button
                type="button"
                onClick={() => scrollByCard(1)}
                aria-label={`Next ${heading} products`}
                className="absolute -right-3 top-1/2 z-10 flex -translate-y-1/2 rounded-full border border-line bg-panel p-2.5 text-white shadow-md transition hover:bg-brand hover:text-black"
              >
                <ChevronRight size={20} />
              </button>
            )}
          </div>
      </div>
    </section>
  )
}

export default function HomeCategoryFeed({ slugs }) {
  const categorySlugs = useMemo(
    () => (Array.isArray(slugs) ? slugs.filter(Boolean) : []),
    [slugs],
  )
  const slugKey = categorySlugs.join('|')
  const [categories, setCategories] = useState([])
  const [visibleCount, setVisibleCount] = useState(0)
  const [rowReady, setRowReady] = useState(true)
  const sentinelRef = useRef(null)

  useEffect(() => {
    if (!categorySlugs.length) return undefined
    let ignore = false
    fetchJson('/categories')
      .then((items) => {
        if (!ignore && Array.isArray(items)) setCategories(items)
      })
      .catch(() => {
        if (!ignore) setCategories([])
      })
    return () => {
      ignore = true
    }
  }, [categorySlugs.length])

  useEffect(() => {
    setVisibleCount(0)
    setRowReady(true)
  }, [slugKey])

  const onRowSettled = useCallback(() => {
    setRowReady(true)
  }, [])

  useEffect(() => {
    if (!rowReady || visibleCount >= categorySlugs.length) return undefined
    const node = sentinelRef.current
    if (!node) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        observer.disconnect()
        setRowReady(false)
        setVisibleCount((count) => Math.min(count + 1, categorySlugs.length))
      },
      { root: null, rootMargin: '120px 0px', threshold: 0 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [rowReady, visibleCount, categorySlugs.length])

  if (!categorySlugs.length) return null

  const titleFor = (slug) => {
    const category = categories.find((item) => item.slug === slug)
    return category?.title || category?.label || slug.replace(/-/g, ' ')
  }

  return (
    <>
      {categorySlugs.slice(0, visibleCount).map((slug) => (
        <CategoryProductRow key={slug} slug={slug} title={titleFor(slug)} onSettled={onRowSettled} />
      ))}
      {rowReady && visibleCount < categorySlugs.length ? (
        <div ref={sentinelRef} aria-hidden className="h-px" />
      ) : null}
    </>
  )
}
