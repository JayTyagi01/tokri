import { Link } from 'react-router-dom'
import { categories } from '../data/categories'

export default function Categories() {
  return (
    <section className="bg-white my-14">
      <div className="mx-auto max-w-7xl">
          <h2 className="text-[52px] font-bold text-black">
            <span className="font-light">Shop By </span>Categories
          </h2>
        <div className="group relative overflow-hidden mt-6">
          <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 scrollbar-hide sm:-mx-6 sm:px-6">
            {categories.map((category) => (
              <Link key={category.id} to={`/category/${category.id}`} className="min-w-[180px] snap-center">
                <article className="rounded-[2rem] bg-white text-center transition duration-300 ">
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
