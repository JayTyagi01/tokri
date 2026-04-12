import { Link } from 'react-router-dom'
import { categories } from '../data/categories'

export default function Categories() {
  return (
    <section className="bg-white py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">
              Shop By
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Categories
            </h2>
          </div>
        </div>

        <div className="group relative overflow-hidden">
          <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 scrollbar-hide sm:-mx-6 sm:px-6">
            {categories.map((category) => (
              <Link key={category.id} to={`/category/${category.id}`} className="min-w-[180px] snap-center">
                <article className="rounded-[2rem] bg-white p-5 text-center transition duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <div className="mx-auto flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-emerald-100 shadow-inner">
                    <img src={category.image} alt={category.label} className="h-full w-full object-cover" />
                  </div>
                  <h3 className="mt-5 text-base font-semibold text-slate-900">{category.label}</h3>
                </article>
              </Link>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent opacity-90" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent opacity-90" />
        </div>
      </div>
    </section>
  )
}
