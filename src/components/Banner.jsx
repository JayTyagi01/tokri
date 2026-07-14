import { Link } from 'react-router-dom'
import heroImg from '../assets/hero-banner.png'

export default function Banner() {
  return (
    <section className="relative mt-6 overflow-hidden text-white">
      <div
        className="container m-auto max-w-7xl rounded-xl"
        style={{ backgroundImage: `url(${heroImg})`, backgroundSize: 'cover' }}
      >
        <div className="px-6 py-4">
          <span className="inline-flex rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium uppercase text-emerald-100">
            Get 10% OFF your first order
          </span>
          <h1 className="m-0 mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Fresh Fruits,
            <br /> Delivered Daily
          </h1>
          <p className="mt-3 max-w-xl text-base leading-tight text-emerald-100 sm:text-lg">
            Enjoy a wide range of fresh, juicy, and nutrient-rich fruits sourced with care and
            delivered with freshness guaranteed.
          </p>
          <Link
            to="/shop"
            className="mt-3 inline-flex rounded-full bg-white px-7 py-2.5 text-sm font-semibold text-emerald-950 shadow-xl transition hover:bg-slate-100"
          >
            Shop all
          </Link>
        </div>
      </div>
    </section>
  )
}
