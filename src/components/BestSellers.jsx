import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { bestSellers } from '../data/bestSellers'
import { fetchJson, normalizeProducts } from '../lib/api'
import CartControl from './CartControl'

const discountPercent = (product) => {
  const price = Number(product.priceValue)
  const oldPrice = Number(product.oldPriceValue)
  if (!oldPrice || !price || oldPrice <= price) return 0
  return Math.round((1 - price / oldPrice) * 100)
}

export default function BestSellers() {
  const navigate = useNavigate()
  const [products, setProducts] = useState(bestSellers)

  useEffect(() => {
    let ignore = false

    fetchJson('/products?flag=bestSeller&limit=12')
      .then((items) => {
        if (!ignore && items.length) setProducts(normalizeProducts(items))
      })
      .catch(() => {})

    return () => {
      ignore = true
    }
  }, [])

  return (
    <section className="bg-canvas py-8 lg:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="m-0 text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
            <span className="font-light">Shop Our </span>Bestsellers
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
          {products.slice(0, 12).map((product) => {
            const off = discountPercent(product)
            const target = `/product/${product.slug || product.id}`

            return (
              <article
                key={product.id}
                onClick={() => navigate(target)}
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
          })}
        </div>
      </div>
    </section>
  )
}
