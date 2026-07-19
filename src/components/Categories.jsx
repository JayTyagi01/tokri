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
    <section className="my-8 bg-canvas lg:my-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
          <span className="font-light">Shop By </span>Categories
        </h2>

        <div className="group relative mt-5 overflow-hidden">
          <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-3 scrollbar-hide sm:-mx-6 sm:gap-4 sm:px-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/category/${category.id}`}
                className="w-[22%] min-w-[78px] shrink-0 snap-start sm:w-[100px] sm:min-w-[100px] lg:min-w-[120px]"
              >
                <article className="text-center">
                  <div className="mx-auto aspect-square overflow-hidden rounded-xl bg-transparent">
                    <img
                      src={category.image}
                      alt={category.label}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <h3 className="mt-2 line-clamp-2 px-0.5 text-[11px] font-semibold leading-tight text-zinc-400 sm:text-xs lg:mt-3 lg:text-sm">
                    {category.label}
                  </h3>
                </article>
              </Link>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-16 bg-gradient-to-r from-canvas to-transparent opacity-90 lg:block" />
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-16 bg-gradient-to-l from-canvas to-transparent opacity-90 lg:block" />
        </div>
      </div>
    </section>
  )
}
