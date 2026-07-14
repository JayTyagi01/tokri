import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { fetchJson, normalizeProducts, resolveAssetUrl } from '../lib/api'
import CartControl from '../components/CartControl'

const PAGE_SIZE = 24

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
      className="flex h-full cursor-pointer flex-col rounded-lg border border-slate-200/80 bg-white p-1.5 sm:p-2"
    >
      <div className="relative mb-1 aspect-square overflow-hidden rounded-md bg-white">
        {off > 0 && (
          <span className="absolute left-0 top-1.5 rounded-r bg-[#2563eb] px-1.5 py-0.5 text-[9px] font-bold leading-none text-white sm:text-[10px]">
            {off}% OFF
          </span>
        )}
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>

      <h3 className="line-clamp-2 text-[12px] font-bold leading-tight text-slate-900 sm:text-[13px]">
        {product.name}
      </h3>
      {product.weight && <p className="mt-0.5 text-[11px] text-slate-500">{product.weight}</p>}

      <div className="mt-auto flex items-end justify-between gap-1 pt-1.5">
        <div className="min-w-0 leading-tight">
          <span className="block whitespace-nowrap text-[13px] font-bold text-slate-900 sm:text-sm">
            {product.price}
          </span>
          {off > 0 && product.oldPrice && (
            <span className="block whitespace-nowrap text-[11px] text-slate-400 line-through">
              {product.oldPrice}
            </span>
          )}
        </div>
        <span className="shrink-0" onClick={(event) => event.stopPropagation()}>
          <CartControl product={product} variant="shop" addLabel="ADD" />
        </span>
      </div>
    </article>
  )
}

export default function ShopAllPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedSlug = searchParams.get('category') || ''
  const productsScrollRef = useRef(null)
  const loadMoreRef = useRef(null)

  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState(null)
  const [products, setProducts] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [total, setTotal] = useState(0)
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  useEffect(() => {
    let ignore = false
    setLoadingCategories(true)

    fetchJson('/categories')
      .then((items) => {
        if (ignore || !Array.isArray(items)) return
        const list = items.map((item) => ({
          ...item,
          id: item.slug || item.id,
          image: resolveAssetUrl(item.image),
        }))
        setCategories(list)
      })
      .catch(() => {
        if (!ignore) setCategories([])
      })
      .finally(() => {
        if (!ignore) setLoadingCategories(false)
      })

    return () => {
      ignore = true
    }
  }, [])

  useEffect(() => {
    if (!categories.length) return

    const match = categories.find((item) => item.slug === selectedSlug) || categories[0]
    setActiveCategory(match)

    if (match && match.slug !== selectedSlug) {
      setSearchParams({ category: match.slug }, { replace: true })
    }
  }, [categories, selectedSlug, setSearchParams])

  useEffect(() => {
    if (!activeCategory?.slug) return

    let ignore = false
    setLoadingProducts(true)
    setProducts([])
    setPage(1)
    setHasMore(false)
    setTotal(0)

    if (productsScrollRef.current) {
      productsScrollRef.current.scrollTop = 0
    }

    fetchJson(
      `/products?category=${encodeURIComponent(activeCategory.slug)}&page=1&limit=${PAGE_SIZE}`,
    )
      .then((data) => {
        if (ignore) return
        const list = normalizeProducts(data.products || [])
        setProducts(list)
        setTotal(Number(data.total) || list.length)
        setHasMore(Boolean(data.hasMore))
        setPage(1)
      })
      .catch(() => {
        if (!ignore) {
          setProducts([])
          setTotal(0)
          setHasMore(false)
        }
      })
      .finally(() => {
        if (!ignore) setLoadingProducts(false)
      })

    return () => {
      ignore = true
    }
  }, [activeCategory?.slug])

  useEffect(() => {
    if (!hasMore || loadingProducts || loadingMore || !activeCategory?.slug) return

    const node = loadMoreRef.current
    const root = productsScrollRef.current
    if (!node || !root) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return
        setLoadingMore(true)
        const nextPage = page + 1
        fetchJson(
          `/products?category=${encodeURIComponent(activeCategory.slug)}&page=${nextPage}&limit=${PAGE_SIZE}`,
        )
          .then((data) => {
            const list = normalizeProducts(data.products || [])
            setProducts((prev) => {
              const seen = new Set(prev.map((item) => item.id))
              const merged = [...prev]
              for (const item of list) {
                if (seen.has(item.id)) continue
                seen.add(item.id)
                merged.push(item)
              }
              return merged
            })
            setHasMore(Boolean(data.hasMore))
            setPage(nextPage)
            if (data.total != null) setTotal(Number(data.total))
          })
          .catch(() => setHasMore(false))
          .finally(() => setLoadingMore(false))
      },
      { root, rootMargin: '200px' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [hasMore, loadingProducts, loadingMore, activeCategory?.slug, page])

  const selectCategory = (slug) => {
    setSearchParams({ category: slug })
  }

  if (loadingCategories && !categories.length) {
    return (
      <main className="flex min-h-[50vh] items-center justify-center bg-[#f8f8f8]">
        <p className="text-slate-500">Loading shop...</p>
      </main>
    )
  }

  if (!activeCategory) {
    return (
      <main className="flex min-h-[50vh] items-center justify-center bg-[#f8f8f8]">
        <div className="px-4 text-center">
          <h1 className="text-2xl font-bold text-slate-900">No categories found</h1>
          <Link
            to="/"
            className="mt-6 inline-flex rounded-full bg-emerald-950 px-6 py-3 text-sm font-semibold text-white"
          >
            Back to home
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="bg-[#f8f8f8]">
      <div className="mx-auto max-w-7xl px-2 pt-5 sm:px-3 sm:pt-6 lg:px-4 lg:pt-8">
        <p className="mx-2.5 mb-5 text-xl capitalize text-slate-900">Shop all</p>

        <div className="my-5 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="flex min-h-[calc(100dvh-14rem)] lg:min-h-[calc(100dvh-12rem)]">
            {/* Category rail — aligned with product cards inside the box */}
            <aside className="flex w-[76px] shrink-0 flex-col border-r border-slate-200 bg-[#f3f4f6] sm:w-[92px] lg:w-[108px]">
              <nav className="min-h-0 flex-1 overflow-y-auto overscroll-contain scrollbar-hide">
                {categories.map((category) => {
                  const isActive = category.slug === activeCategory.slug
                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => selectCategory(category.slug)}
                      className={`relative flex w-full flex-col items-center gap-0.5 px-1 py-2 text-center transition sm:px-1.5 sm:py-2.5 ${
                        isActive ? 'bg-white' : 'hover:bg-white/70'
                      }`}
                    >
                      {isActive && (
                        <span className="absolute inset-y-2 right-0 w-[3px] rounded-l-full bg-emerald-600" />
                      )}
                      <span
                        className={`flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg border bg-white sm:h-11 sm:w-11 ${
                          isActive ? 'border-emerald-300' : 'border-slate-200'
                        }`}
                      >
                        <img
                          src={category.image}
                          alt=""
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </span>
                      <span
                        className={`line-clamp-2 px-0.5 text-[9px] leading-tight sm:text-[10px] ${
                          isActive ? 'font-bold text-emerald-700' : 'font-medium text-slate-600'
                        }`}
                      >
                        {category.label}
                      </span>
                    </button>
                  )
                })}
              </nav>
            </aside>

            {/* Products — only this panel scrolls */}
            <section
              ref={productsScrollRef}
              className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain bg-[#f8f8f8]"
            >
              <div className="px-1.5 pb-3 pt-1 sm:px-2 sm:pb-4">
            {loadingProducts ? (
              <div className="grid grid-cols-2 gap-2 sm:gap-2.5 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
                {Array.from({ length: 12 }).map((_, index) => (
                  <div
                    key={index}
                    className="aspect-[3/4] animate-pulse rounded-lg border border-slate-200 bg-white"
                  />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center">
                <p className="text-base font-semibold text-slate-900">No products yet</p>
                <p className="mt-2 text-sm text-slate-500">
                  We&apos;re adding fresh picks to this category soon.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-2 sm:gap-2.5 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onNavigate={(target) => navigate(target)}
                    />
                  ))}
                </div>

                <div ref={loadMoreRef} className="flex h-8 items-center justify-center py-3">
                  {loadingMore && (
                    <span className="text-sm font-medium text-slate-500">Loading more…</span>
                  )}
                </div>
              </>
            )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}
