import heroImg from '../assets/hero-banner.png'

export default function Banner() {
  return (
    <section className="relative overflow-hidden mt-6 text-white" >
      <div className="container max-w-7xl m-auto rounded-xl" style={{ backgroundImage: `url(${heroImg})`, backgroundSize: 'cover' }}>
          <div className='p-6'>
            <span className="inline-flex rounded-full bg-white/10 px-4 py-2 font-medium text-sm uppercase text-emerald-100">
              Get 10% OFF your first order
            </span>
            <h1 className="m-0 text-4xl text-white font-bold tracking-tight sm:text-5xl">
              Fresh Fruits,<br/> Delivered Daily
            </h1>
            <p className="mt-5 max-w-xl text-base leading-tight text-emerald-100 sm:text-lg">
              Enjoy a wide range of fresh, juicy, and nutrient-rich fruits sourced with care and delivered with freshness guaranteed.
            </p>
            <button className="mt-4 inline-flex rounded-full bg-white px-7 py-3 text-sm font-semibold text-emerald-950 shadow-xl transition hover:bg-slate-100">
              Shop Fresh Fruits
            </button>
          </div>
        </div>
    </section>
  )
}
