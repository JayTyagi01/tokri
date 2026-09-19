import { Link } from 'react-router-dom'
import { resolveAssetUrl } from '../lib/api'

export default function FruitHighlight({ image }) {
  if (!image) return null

  return (
    <section className="mt-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Link
          to="/shop"
          aria-label="Shop all"
          className="group block cursor-pointer overflow-hidden rounded-xl"
        >
          <img
            src={resolveAssetUrl(image)}
            alt="Home highlight"
            className="block w-full object-cover transition duration-300 group-hover:scale-[1.015] group-hover:brightness-95"
            decoding="async"
          />
        </Link>
      </div>
    </section>
  )
}
