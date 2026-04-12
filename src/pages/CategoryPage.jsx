import { Link, useParams } from 'react-router-dom'
import { categoryDetails } from '../data/categories'
import { useCart } from '../context/CartContext'

export default function CategoryPage() {
  const { addItem, openDrawer } = useCart()
  const { categoryId } = useParams()
  const category = categoryDetails[categoryId]

  if (!category) {
    return (
      <main className="min-h-screen bg-slate-50 py-20">
        <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-10 shadow-xl">
          <h1 className="text-3xl font-bold text-slate-900">Category not found</h1>
          <p className="mt-4 text-slate-600">The category you are looking for does not exist.</p>
          <Link
            to="/"
            className="mt-8 inline-flex rounded-full bg-emerald-950 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
          >
            Back to home
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="bg-slate-50 pb-16 pt-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="mb-6 text-sm text-slate-500">
          <Link to="/" className="font-medium text-emerald-900 hover:underline">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="font-medium text-slate-900">{category.title}</span>
        </nav>

        <div className="mb-10 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.32em] text-emerald-600">Category</p>
              <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                {category.title}
              </h1>
              <p className="mt-5 text-lg leading-8 text-slate-600">{category.subtitle}</p>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 text-center shadow-sm">
              <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Products</p>
              <p className="mt-3 text-5xl font-bold text-slate-950">{category.products.length}</p>
              <p className="mt-2 text-sm text-slate-500">Available in this category</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {category.products.map((product) => (
            <article
              key={product.id}
              className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative overflow-hidden rounded-[1.75rem] bg-slate-100">
                <img src={product.image} alt={product.name} className="h-52 w-full object-cover" />
                <span className="absolute left-4 top-4 inline-flex rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-slate-700 shadow-sm">
                  12 mins
                </span>
              </div>
              <div className="mt-4 space-y-3">
                <h2 className="text-base font-semibold text-slate-900">{product.name}</h2>
                <p className="text-sm text-slate-500">{product.weight}</p>
                <div className="flex items-center gap-3">
                  <p className="text-xl font-bold text-slate-950">{product.price}</p>
                  {product.oldPrice && product.oldPrice !== product.price ? (
                    <p className="text-sm text-slate-400 line-through">{product.oldPrice}</p>
                  ) : null}
                </div>
                <button
                  onClick={() => {
                    addItem(product)
                    openDrawer()
                  }}
                  className="inline-flex w-full items-center justify-center rounded-full bg-emerald-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
                >
                  Add
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}
