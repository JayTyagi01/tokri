import { Link, useParams } from 'react-router-dom'
import { bestSellers } from '../data/bestSellers'
import { useCart } from '../context/CartContext'

export default function ProductDetail() {
  const { addItem, openDrawer } = useCart()
  const { productId } = useParams()
  const product = bestSellers.find((item) => item.id === productId)

  if (!product) {
    return (
      <main className="min-h-screen bg-slate-50 py-20">
        <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-10 shadow-xl">
          <h1 className="text-3xl font-bold text-slate-900">Product not found</h1>
          <p className="mt-4 text-slate-600">We could not find the product you were looking for.</p>
          <Link
            to="/"
            className="mt-8 inline-flex rounded-full bg-emerald-950 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
          >
            Back to shop
          </Link>
        </div>
      </main>
    )
  }

  const similarProducts = bestSellers.filter((item) => item.id !== productId).slice(0, 6)
  const topProducts = bestSellers.filter((item) => item.id !== productId).slice(0, 10)

  return (
    <main className="bg-slate-50 pb-16 pt-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="mb-8 text-sm text-slate-500">
          <Link to="/" className="font-medium text-emerald-900 hover:underline">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-slate-500">{product.name}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="overflow-hidden rounded-[2rem] bg-slate-100">
              <img src={product.image} alt={product.name} className="h-[420px] w-full object-cover" />
            </div>
            <div className="mt-6 space-y-6">
              <div>
                <h1 className="text-4xl font-bold text-slate-950">{product.name}</h1>
                <p className="mt-3 text-sm uppercase tracking-[0.25em] text-emerald-600">{product.description}</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">Available weight</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">250 g</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">Category</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">Fresh Fruit</p>
                </div>
              </div>
              <div className="text-slate-600">
                <h2 className="mb-3 text-xl font-semibold text-slate-900">Product description</h2>
                <p className="leading-7">
                  Enjoy premium quality and fresh flavor with this handpicked product. Our supply chain guarantees freshness and fast delivery from local stores to your doorstep.
                </p>
              </div>
            </div>
          </section>

          <aside className="space-y-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="rounded-3xl bg-slate-50 p-6 text-center">
              <p className="text-sm text-slate-500">Best price</p>
              <p className="mt-3 text-3xl font-bold text-slate-950">{product.price}</p>
            </div>
            <div className="space-y-4">
              <button
                onClick={() => {
                  addItem(product)
                  openDrawer()
                }}
                className="w-full rounded-3xl bg-emerald-950 px-6 py-4 text-sm font-semibold text-white transition hover:bg-emerald-800"
              >
                Add to cart
              </button>
              <button className="w-full rounded-3xl border border-slate-200 bg-white px-6 py-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-50">
                Buy now
              </button>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
              <p className="font-semibold text-slate-900">Why shop from blinkit?</p>
              <ul className="mt-3 space-y-3">
                <li>• Round the clock delivery</li>
                <li>• Fresh quality products</li>
                <li>• Easy checkout and fast service</li>
              </ul>
            </div>
          </aside>
        </div>

        <div className="mt-16 space-y-14">
          <section>
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.32em] text-emerald-600">Similar products</p>
                <h2 className="text-3xl font-bold tracking-tight text-slate-950">Similar products</h2>
              </div>
              <Link to="/" className="text-sm font-semibold text-emerald-900 hover:underline">
                View all products
              </Link>
            </div>

            <div className="flex gap-6 overflow-x-auto pb-3 scrollbar-hide">
              {similarProducts.map((item) => (
                <article key={item.id} className="min-w-[260px] shrink-0 rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="overflow-hidden rounded-[1.5rem] bg-slate-100">
                    <img src={item.image} alt={item.name} className="h-40 w-full object-cover" />
                  </div>
                  <div className="mt-4 space-y-2">
                    <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-emerald-600">12 mins</p>
                    <h3 className="text-sm font-semibold text-slate-900">{item.name}</h3>
                    <p className="text-sm text-slate-500">{item.price}</p>
                    <button className="mt-3 w-full rounded-full bg-emerald-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800">
                      Add
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section>
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.32em] text-emerald-600">Top 10 products in this category</p>
                <h2 className="text-3xl font-bold tracking-tight text-slate-950">Top 10 products in this category</h2>
              </div>
              <Link to="/" className="text-sm font-semibold text-emerald-900 hover:underline">
                Browse category
              </Link>
            </div>

            <div className="flex gap-6 overflow-x-auto pb-3 scrollbar-hide">
              {topProducts.map((item) => (
                <article key={item.id} className="min-w-[260px] shrink-0 rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                    <span>Top pick</span>
                    <span className="rounded-full bg-emerald-100 px-2 py-1 text-emerald-800">{Math.floor(Math.random() * 10) + 5}% OFF</span>
                  </div>
                  <div className="mt-4 overflow-hidden rounded-[1.5rem] bg-slate-100">
                    <img src={item.image} alt={item.name} className="h-40 w-full object-cover" />
                  </div>
                  <div className="mt-4 space-y-2">
                    <h3 className="text-sm font-semibold text-slate-900">{item.name}</h3>
                    <p className="text-sm text-slate-500">{item.price}</p>
                    <button className="mt-3 w-full rounded-full bg-emerald-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800">
                      Add
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
