import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { categories as fallbackCategories } from '../data/categories'
import { fetchJson, resolveAssetUrl } from '../lib/api'

export default function Categories() {
  const [categories, setCategories] = useState(fallbackCategories)

  useEffect(() => {
    let ignore = false

    fetchJson('/categories')
      .then((items) => {
        if (!ignore && items.length) {
          setCategories(
            items.map((item) => ({
              ...item,
              id: item.slug || item.id,
              image: resolveAssetUrl(item.image),
            })),
          )
        }
      })
      .catch(() => {})

    return () => {
      ignore = true
    }
  }, [])

  return (
    <section className="my-8 bg-white lg:my-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="text-2xl font-bold text-black sm:text-3xl lg:text-4xl">
          <span className="font-light">Shop By </span>Categories
        </h2>

        <div className="mt-5 grid grid-cols-4 gap-3 sm:gap-4 lg:hidden">
          {categories.map((category) => (
            <Link key={category.id} to={`/category/${category.id}`} className="min-w-0">
              <article className="text-center">
                <div className="mx-auto flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-sky-50 p-2">
                  <img
                    src={category.image}
                    alt={category.label}
                    className="h-full w-full object-contain"
                  />
                </div>
                <h3 className="mt-2 line-clamp-2 text-[11px] font-semibold leading-tight text-slate-900 sm:text-xs">
                  {category.label}
                </h3>
              </article>
            </Link>
          ))}
        </div>

        <div className="group relative mt-6 hidden overflow-hidden lg:block">
          <div className="-mx-4 flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 pb-4 scrollbar-hide sm:-mx-6 sm:px-6">
            {categories.map((category) => (
              <Link key={category.id} to={`/category/${category.id}`} className="min-w-[120px] snap-center">
                <article className="rounded-[2rem] bg-white text-center transition duration-300">
                  <div className="mx-auto flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-emerald-100 shadow-inner">
                    <img src={category.image} alt={category.label} className="h-full w-full object-cover" />
                  </div>
                  <h3 className="mt-3 px-1 text-sm font-semibold leading-tight text-slate-900 break-words">
                    {category.label}
                  </h3>
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
