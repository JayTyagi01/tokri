import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { fetchJson, normalizeProduct } from '../lib/api'
import CartControl from './CartControl'

const PAGE_SIZE = 12
const MIN_CHARS = 2
const DEBOUNCE_MS = 300

const SEARCH_HINTS = [
  'mango',
  'apple',
  'dragon fruit',
  'avocado',
  'blueberry',
  'coconut',
  'kiwi',
  'banana',
  'strawberry',
  'papaya',
  'grapes',
  'watermelon',
]

const discountPercent = (product) => {
  const price = Number(product.priceValue)
  const oldPrice = Number(product.oldPriceValue)
  if (!oldPrice || !price || oldPrice <= price) return 0
  return Math.round((1 - price / oldPrice) * 100)
}

function ResultCard({ product, onNavigate }) {
  const off = discountPercent(product)

  return (
    <div className="group relative flex h-full flex-col rounded-xl border border-slate-200 bg-white p-3 transition hover:shadow-md">
      <Link
        to={`/product/${product.slug || product.id}`}
        onClick={onNavigate}
        className="block"
      >
        <div className="relative mb-2 h-28 overflow-hidden rounded-lg bg-slate-50">
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
        <p className="line-clamp-2 min-h-[2.5rem] text-sm font-medium text-slate-900">
          {product.name}
        </p>
      </Link>
      {product.weight && (
        <p className="mt-1 text-xs text-slate-500">{product.weight}</p>
      )}
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
        <CartControl product={product} />
      </div>
    </div>
  )
}

export default function SearchBox({ variant = 'desktop' }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [products, setProducts] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [total, setTotal] = useState(0)
  const [resultQuery, setResultQuery] = useState('')
  const [focused, setFocused] = useState(false)

  const containerRef = useRef(null)
  const scrollRef = useRef(null)
  const debounceRef = useRef(null)
  const requestIdRef = useRef(0)

  const runSearch = useCallback(async (term, pageToLoad) => {
    const id = ++requestIdRef.current
    const isFirst = pageToLoad === 1
    if (isFirst) setLoading(true)
    else setLoadingMore(true)

    try {
      const data = await fetchJson(
        `/search?q=${encodeURIComponent(term)}&page=${pageToLoad}&limit=${PAGE_SIZE}`,
      )
      if (id !== requestIdRef.current) return

      const normalized = (data.products || []).map(normalizeProduct)
      setProducts((prev) => (isFirst ? normalized : [...prev, ...normalized]))
      if (isFirst) {
        setSuggestions((data.suggestions || []).map(normalizeProduct))
        setResultQuery(data.query || term)
        setTotal(data.total || 0)
      }
      setHasMore(Boolean(data.hasMore))
      setPage(pageToLoad)
    } catch {
      if (id === requestIdRef.current && isFirst) {
        setProducts([])
        setSuggestions([])
        setHasMore(false)
        setTotal(0)
      }
    } finally {
      if (id === requestIdRef.current) {
        setLoading(false)
        setLoadingMore(false)
      }
    }
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    const term = query.trim()

    if (term.length < MIN_CHARS) {
      setProducts([])
      setSuggestions([])
      setHasMore(false)
      setTotal(0)
      setResultQuery('')
      setOpen(false)
      return undefined
    }

    setOpen(true)
    debounceRef.current = setTimeout(() => runSearch(term, 1), DEBOUNCE_MS)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query, runSearch])

  useEffect(() => {
    const onClick = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    const onKey = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  const handleScroll = () => {
    const el = scrollRef.current
    if (!el || loading || loadingMore || !hasMore) return
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 140) {
      runSearch(resultQuery || query.trim(), page + 1)
    }
  }

  const clearSearch = () => {
    setQuery('')
    setOpen(false)
  }

  const isMobile = variant === 'mobile'
  const inputId = isMobile ? 'mobile-search' : 'site-search'
  const showAnimatedPlaceholder = !query && !focused
  const animatedHints = [...SEARCH_HINTS, SEARCH_HINTS[0]]

  const panelClass = isMobile
    ? 'absolute left-0 right-0 top-full z-50 mt-2'
    : 'absolute top-full z-50 mt-2 left-1/2 -translate-x-1/2 w-[min(1100px,92vw)]'

  return (
    <div ref={containerRef} className="relative w-full">
      <label className="sr-only" htmlFor={inputId}>
        Search products
      </label>
      <div className="relative w-full">
        <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400">
          <Search size={18} />
        </span>
        <input
          id={inputId}
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => {
            setFocused(true)
            if (query.trim().length >= MIN_CHARS) setOpen(true)
          }}
          onBlur={() => setFocused(false)}
          placeholder={showAnimatedPlaceholder ? '' : isMobile ? 'Search fruits...' : 'Search fruits, categories...'}
          className={
            isMobile
              ? 'h-12 w-full rounded-full border border-slate-200 bg-slate-50 px-12 text-sm text-slate-900 outline-none'
              : 'h-12 w-full rounded-full border border-slate-200 px-12 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100'
          }
        />
        {showAnimatedPlaceholder && (
          <div
            className="pointer-events-none absolute inset-y-0 left-12 right-4 overflow-hidden text-sm text-slate-400"
            aria-hidden="true"
          >
            <div className="search-placeholder-track">
              {animatedHints.map((hint, index) => (
                <div key={`${hint}-${index}`} className="search-placeholder-line">
                  Search &quot;{hint}&quot;
                </div>
              ))}
            </div>
          </div>
        )}
        {query && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-slate-600"
            aria-label="Clear search"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {open && (
        <div className={panelClass}>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
            {loading && products.length === 0 ? (
              <div className="p-6 text-center text-sm text-slate-500">Searching…</div>
            ) : (
              <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="max-h-[70vh] overflow-y-auto"
              >
                {suggestions.length > 0 && (
                  <ul className="divide-y divide-slate-100 border-b border-slate-100">
                    {suggestions.map((item) => (
                      <li key={`s-${item.id}`}>
                        <Link
                          to={`/product/${item.slug || item.id}`}
                          onClick={() => setOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 transition hover:bg-slate-50"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-7 w-7 rounded object-cover"
                            loading="lazy"
                          />
                          <span className="text-sm text-slate-700">{item.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="p-4">
                  <p className="mb-3 text-sm font-semibold text-slate-900">
                    {total > 0
                      ? `Showing results for "${resultQuery}"`
                      : `No products found for "${resultQuery}"`}
                  </p>

                  {products.length > 0 && (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                      {products.map((product) => (
                        <ResultCard
                          key={product.id}
                          product={product}
                          onNavigate={() => setOpen(false)}
                        />
                      ))}
                    </div>
                  )}

                  {loadingMore && (
                    <div className="py-4 text-center text-sm text-slate-500">Loading more…</div>
                  )}
                  {!hasMore && products.length > 0 && (
                    <div className="py-3 text-center text-xs text-slate-400">
                      You&apos;ve reached the end of the results.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
