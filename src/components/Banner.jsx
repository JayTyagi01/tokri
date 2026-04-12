import heroImg from '../assets/banner.jpg'

export default function Banner() {
  return (
    <section className="relative h-[68vh] overflow-hidden px-4 py-10 text-white sm:px-6 lg:px-8" style={{ backgroundImage: `url(${heroImg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative mx-auto flex max-w-7xl flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <span className="inline-flex rounded-full bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-emerald-100">
            Get 10% OFF your first order
          </span>
          <h1 className="mt-6 text-4xl text-white font-bold tracking-tight sm:text-5xl">
            Fresh Fruits, Delivered Daily
          </h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-emerald-100 sm:text-lg">
            Enjoy a wide range of fresh, juicy, and nutrient-rich fruits sourced with care and delivered with freshness guaranteed.
          </p>
          <button className="mt-8 inline-flex rounded-full bg-white px-7 py-3 text-sm font-semibold text-emerald-950 shadow-xl transition hover:bg-slate-100">
            Shop Fresh Fruits
          </button>
        </div>
      </div>
    </section>
  )
}
