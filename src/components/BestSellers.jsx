import { Link } from 'react-router-dom'
import { bestSellers } from '../data/bestSellers'
import { useCart } from '../context/CartContext'

export default function BestSellers() {
  const { addItem, openDrawer } = useCart()
  return (
    <section className="bg-slate-50 py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-emerald-600">
              Shop Our
            </p>
            <h2 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
              Bestsellers
            </h2>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {bestSellers.map((product) => (
            <article
              key={product.id}
              className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <span className="inline-flex rounded-full bg-emerald-900 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-white">
                {product.description}
              </span>
              <div className="mt-5 overflow-hidden rounded-[1.5rem] bg-slate-50">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-48 w-full object-cover"
                />
              </div>
              <div className="mt-5 text-center">
                <h3 className="text-lg font-semibold text-slate-900">{product.name}</h3>
                <p className="mt-2 text-sm text-slate-500">{product.price}</p>
                <div className="mt-5 flex flex-col gap-3">
                  <Link
                    to={`/product/${product.id}`}
                    className="rounded-full bg-emerald-950 px-4 py-3 text-sm font-semibold text-white text-center transition hover:bg-emerald-800"
                  >
                    View details
                  </Link>
                  <button
                    onClick={() => {
                      addItem(product)
                      openDrawer()
                    }}
                    className="rounded-full border border-emerald-900 bg-white px-4 py-3 text-sm font-semibold text-emerald-800 hover:text-white transition hover:bg-emerald-800"
                  >
                    Add To Cart
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
