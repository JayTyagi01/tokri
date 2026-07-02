import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import importedFruitsImg from '../assets/imported-fruits.png'
import { fetchJson, normalizeProducts } from '../lib/api'
import CartControl from './CartControl'

const MAX_PRODUCTS = 9

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
      className="group relative flex h-full cursor-pointer flex-col rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition hover:shadow-md"
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
        <span onClick={(event) => event.stopPropagation()}>
          <CartControl product={product} />
        </span>
      </div>
    </article>
  )
}

export default function ImportedFruits() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const trackRef = useRef(null)

  const visibleProducts = products.slice(0, MAX_PRODUCTS)
  const isSlider = visibleProducts.length > 3

  useEffect(() => {
    let ignore = false

    fetchJson(`/products?flag=imported&limit=${MAX_PRODUCTS}`)
      .then((items) => {
        if (!ignore) setProducts(normalizeProducts(items))
      })
      .catch(() => {
        if (!ignore) setProducts([])
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [])

  const scrollByCard = (direction) => {
    const track = trackRef.current
    if (!track) return
    const amount = track.clientWidth * 0.85
    track.scrollBy({ left: direction * amount, behavior: 'smooth' })
  }

  return (
    <section className="px-6 py-12 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div className="min-w-0">
            <h2 className="mb-6 text-4xl font-semibold text-slate-900 sm:text-5xl">
              Imported <span className="font-bold">Fruits</span>
            </h2>

            {loading ? (
              <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-slate-500">
                Loading products...
              </div>
            ) : visibleProducts.length === 0 ? (
              <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-slate-500">
                No imported fruits available yet.
              </div>
            ) : (
              <div className="relative mb-6">
                {isSlider && (
                  <button
                    type="button"
                    onClick={() => scrollByCard(-1)}
                    aria-label="Previous products"
                    className="absolute -left-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-slate-200 bg-white p-2.5 text-slate-700 shadow-md transition hover:bg-emerald-600 hover:text-white sm:flex"
                  >
                    <ChevronLeft size={20} />
                  </button>
                )}

                <div
                  ref={trackRef}
                  className={
                    isSlider
                      ? 'flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 scrollbar-hide'
                      : 'grid gap-4 grid-cols-2 sm:grid-cols-3'
                  }
                >
                  {visibleProducts.map((product) => (
                    <div
                      key={product.id}
                      className={
                        isSlider
                          ? 'w-[72%] shrink-0 snap-start sm:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-2rem)/3)]'
                          : ''
                      }
                    >
                      <ProductCard product={product} onNavigate={navigate} />
                    </div>
                  ))}
                </div>

                {isSlider && (
                  <button
                    type="button"
                    onClick={() => scrollByCard(1)}
                    aria-label="Next products"
                    className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-slate-200 bg-white p-2.5 text-slate-700 shadow-md transition hover:bg-emerald-600 hover:text-white sm:flex"
                  >
                    <ChevronRight size={20} />
                  </button>
                )}
              </div>
            )}

            <Link
              to="/category/imported"
              className="inline-flex items-center justify-center rounded-full border border-slate-900 px-6 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-900 hover:text-white"
            >
              View Imported Fruits
            </Link>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-md overflow-hidden rounded-3xl shadow-lg">
              <img
                src={importedFruitsImg}
                alt="Imported Fruits"
                className="aspect-square w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
