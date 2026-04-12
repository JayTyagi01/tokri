import { useState } from 'react'
import { useCart } from '../context/CartContext'
import kiwiImg from '../assets/kiwi.png'

export default function ShopOurRange() {
  const categories = [
    {
      title: 'Exotic Fruits',
      label: 'Premium',
      description: 'Handpicked tropical selections for fresh flavor.',
      buttonText: 'Shop Now',
      bg: 'bg-emerald-500',
      textColor: 'text-white',
      glow: 'radial-gradient(circle at top left, rgba(236, 253, 245, 0.55), transparent 35%)',
      image: kiwiImg,
      imageLabel: 'Exotic Avocado',
      products: [
        {
          id: 'exotic-1',
          name: 'Plums Imported',
          price: 'Rs. 149.00',
          accent: 'bg-slate-950',
          image: kiwiImg,
          description: 'Sweet, smooth texture with a rich purple hue.',
        },
        {
          id: 'exotic-2',
          name: 'Red Grapes Globe',
          price: 'Rs. 600.00',
          accent: 'bg-rose-500',
          image: kiwiImg,
          description: 'Perfect for snacking, salads, and fresh desserts.',
        },
        {
          id: 'exotic-3',
          name: 'Malta Orange Imported',
          price: 'Rs. 280.00',
          accent: 'bg-orange-500',
          image: kiwiImg,
          description: 'Zesty citrus with a juicy, refreshing bite.',
        },
      ],
    },
    {
      title: 'Imported Fruits',
      label: 'Flat 20% Off',
      description: 'Seasonal imports with bright aroma and sweetness.',
      buttonText: 'Shop Now',
      bg: 'bg-amber-300',
      textColor: 'text-slate-950',
      glow: 'radial-gradient(circle at top right, rgba(255, 247, 205, 0.9), transparent 40%)',
      image: kiwiImg,
      imageLabel: 'Dragon Fruit',
      products: [
        {
          id: 'imported-1',
          name: 'Mango Slices',
          price: 'Rs. 220.00',
          accent: 'bg-orange-500',
          image: kiwiImg,
          description: 'Fresh mango with rich tropical sweetness.',
        },
        {
          id: 'imported-2',
          name: 'Kiwi Imported',
          price: 'Rs. 199.00',
          accent: 'bg-green-600',
          image: kiwiImg,
          description: 'Tart and juicy, perfect for morning salads.',
        },
        {
          id: 'imported-3',
          name: 'Berry Mix',
          price: 'Rs. 340.00',
          accent: 'bg-fuchsia-500',
          image: kiwiImg,
          description: 'Assorted berries for smoothies and snacks.',
        },
      ],
    },
    {
      title: 'Fresh Fruits',
      label: 'Big Season Sale',
      description: 'Locally sourced favorites ready to enjoy today.',
      buttonText: 'Shop Now',
      bg: 'bg-orange-400',
      textColor: 'text-white',
      glow: 'radial-gradient(circle at bottom right, rgba(255, 236, 179, 0.55), transparent 45%)',
      image: kiwiImg,
      imageLabel: 'Ripe Mango',
      products: [
        {
          id: 'fresh-1',
          name: 'Plums Imported',
          price: 'Rs. 149.00',
          accent: 'bg-slate-950',
          image: kiwiImg,
          description: 'Sweet, smooth texture with a rich purple hue.',
        },
        {
          id: 'fresh-2',
          name: 'Red Grapes Globe',
          price: 'Rs. 600.00',
          accent: 'bg-rose-500',
          image: kiwiImg,
          description: 'Perfect for snacking, salads, and fresh desserts.',
        },
        {
          id: 'fresh-3',
          name: 'Malta Orange Imported',
          price: 'Rs. 280.00',
          accent: 'bg-orange-500',
          image: kiwiImg,
          description: 'Zesty citrus with a juicy, refreshing bite.',
        },
      ],
    },
  ]

  const { addItem, openDrawer } = useCart()
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0)
  const [activeProductIndex, setActiveProductIndex] = useState(0)

  const activeCategory = categories[activeCategoryIndex]
  const activeProducts = activeCategory.products

  const handleCategoryClick = (index) => {
    setActiveCategoryIndex(index)
    setActiveProductIndex(0)
  }

  const handlePrevious = () => {
    setActiveProductIndex((current) =>
      current === 0 ? activeProducts.length - 1 : current - 1,
    )
  }

  const handleNext = () => {
    setActiveProductIndex((current) =>
      current === activeProducts.length - 1 ? 0 : current + 1,
    )
  }

  return (
    <section className="px-6 py-6 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.36em] text-emerald-600">
              Shop Our
            </p>
            <h2 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              Range
            </h2>
          </div>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {categories.map((card, index) => {
            const isSelected = index === activeCategoryIndex
            return (
              <article
                key={card.title}
                className={`relative overflow-hidden rounded-[2rem] border p-6 shadow-xl transition ${isSelected
                    ? 'border-emerald-500 shadow-[0_28px_60px_rgba(16,185,129,0.18)]'
                    : 'border-white/40'
                  } ${card.bg} ${card.textColor}`}
              >
                <div
                  className="pointer-events-none absolute inset-0 opacity-60"
                  style={{ background: card.glow }}
                />
                <div className="relative flex h-full flex-col justify-between gap-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] opacity-90">
                      {card.label}
                    </p>
                    <h3 className="mt-4 text-4xl font-semibold leading-tight">
                      {card.title}
                    </h3>
                    <p className="mt-3 max-w-xs text-sm opacity-90">
                      {card.description}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCategoryClick(index)}
                    className="inline-flex w-max items-center justify-center rounded-full border border-white/70 bg-white/10 px-5 py-2 text-sm font-semibold transition hover:bg-white/20"
                  >
                    {card.buttonText}
                  </button>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex h-full w-[70%] items-center justify-center overflow-hidden">
                      <img src={card.image} alt={card.title} className="h-full w-full object-cover" />
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        <div className="mt-6 grid gap-8 xl:grid-cols-[1.3fr_1fr] xl:items-stretch">
            <div className="flex h-full w-full items-center justify-center rounded-[2rem] overflow-hidden">
              <img src={activeCategory.image} alt={activeCategory.imageLabel} className="h-full w-full object-cover" />
            </div>
          
          <div className="space-y-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Fresh Fruits</p>
                <h3 className="text-3xl font-semibold text-slate-900">Choose one</h3>
              </div>
              <button className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50">
                Shop All
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {activeProducts.map((product, index) => {
                const isActive = index === activeProductIndex
                return (
                  <div
                    key={product.name}
                    onClick={() => setActiveProductIndex(index)}
                    className={`cursor-pointer rounded-[1.75rem] border p-5 text-left transition ${
                      isActive
                        ? 'border-emerald-500 bg-emerald-50 shadow-[0_12px_30px_rgba(16,185,129,0.12)]'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-center rounded-[1.5rem] overflow-hidden shadow-sm h-24 w-full" style={{ backgroundColor: 'rgba(243,244,246,0.9)' }}>
                      <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="mt-5">
                      <h4 className="text-base font-semibold text-slate-900">{product.name}</h4>
                      <p className="mt-2 text-sm text-slate-500">{product.price}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        addItem(product)
                        openDrawer()
                      }}
                      className="mt-4 inline-flex w-full items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                    >
                      Add To Cart
                    </button>
                  </div>
                )
              })}
            </div>

            <div className="flex items-center justify-between gap-3 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-sm">
              <button
                type="button"
                onClick={handlePrevious}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-700 transition hover:bg-slate-100"
              >
                ←
              </button>
              <span className="text-sm font-semibold text-slate-700">{activeProducts[activeProductIndex].name}</span>
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-700 transition hover:bg-slate-100"
              >
                →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
