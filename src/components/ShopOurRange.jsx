import { useState } from 'react'
import { useCart } from '../context/CartContext'
import kiwiImg from '../assets/kiwi.png'
import Exoticfruits from '../assets/exotic-fruits.png'
import importedFruitsImg from '../assets/imported-fruits.png'
import freshFruitsImg from '../assets/fresh-fruits.png'
import mangoImg from '../assets/mango.png'


export default function ShopOurRange() {
  const categories = [
    {
      title: 'Exotic Fruits',
      label: 'Premium',
      description: 'Handpicked tropical selections for fresh flavor.',
      buttonText: 'Shop Now',
      textColor: 'text-white',
      glow: 'radial-gradient(circle at top left, rgba(236, 253, 245, 0.55), transparent 35%)',
      image: Exoticfruits,
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
          image: 'https://www.bbassets.com/media/uploads/p/l/40113536_7-fresho-dragon-fruit-red-flesh.jpg',
          description: 'Perfect for snacking, salads, and fresh desserts.',
        },
        {
          id: 'exotic-3',
          name: 'Malta Orange Imported',
          price: 'Rs. 280.00',
          accent: 'bg-orange-500',
          image: 'https://www.bbassets.com/media/uploads/p/l/40204133_5-fresho-apple-washington-economy.jpg',
          description: 'Zesty citrus with a juicy, refreshing bite.',
        },
      ],
    },
    {
      title: 'Imported Fruits',
      label: 'Flat 20% Off',
      description: 'Seasonal imports with bright aroma and sweetness.',
      buttonText: 'Shop Now',
      textColor: 'text-slate-950',
      glow: 'radial-gradient(circle at top right, rgba(255, 247, 205, 0.9), transparent 40%)',
      image: importedFruitsImg,
      imageLabel: 'Dragon Fruit',
      products: [
        {
          id: 'imported-1',
          name: 'Mango Slices',
          price: 'Rs. 220.00',
          accent: 'bg-orange-500',
          image: 'https://www.bbassets.com/media/uploads/p/l/40204133_5-fresho-apple-washington-economy.jpg',
          description: 'Fresh mango with rich tropical sweetness.',
        },
        {
          id: 'imported-2',
          name: 'Kiwi Imported',
          price: 'Rs. 199.00',
          accent: 'bg-green-600',
          image: 'https://www.bbassets.com/media/uploads/p/l/40204133_5-fresho-apple-washington-economy.jpg',
          description: 'Tart and juicy, perfect for morning salads.',
        },
        {
          id: 'imported-3',
          name: 'Berry Mix',
          price: 'Rs. 340.00',
          accent: 'bg-fuchsia-500',
          image: 'https://www.bbassets.com/media/uploads/p/l/40204133_5-fresho-apple-washington-economy.jpg',
          description: 'Assorted berries for smoothies and snacks.',
        },
      ],
    },
    {
      title: 'Fresh Fruits',
      label: 'Big Season Sale',
      description: 'Locally sourced favorites ready to enjoy today.',
      buttonText: 'Shop Now',
      textColor: 'text-white',
      glow: 'radial-gradient(circle at bottom right, rgba(255, 236, 179, 0.55), transparent 45%)',
      image: freshFruitsImg,
      imageLabel: 'Ripe Mango',
      products: [
        {
          id: 'fresh-1',
          name: 'Plums Imported',
          price: 'Rs. 149.00',
          accent: 'bg-slate-950',
          image: 'https://www.bbassets.com/media/uploads/p/l/40204133_5-fresho-apple-washington-economy.jpg',
          description: 'Sweet, smooth texture with a rich purple hue.',
        },
        {
          id: 'fresh-2',
          name: 'Red Grapes Globe',
          price: 'Rs. 600.00',
          accent: 'bg-rose-500',
          image: 'https://www.bbassets.com/media/uploads/p/l/40204133_5-fresho-apple-washington-economy.jpg',
          description: 'Perfect for snacking, salads, and fresh desserts.',
        },
        {
          id: 'fresh-3',
          name: 'Malta Orange Imported',
          price: 'Rs. 280.00',
          accent: 'bg-orange-500',
          image: 'https://www.bbassets.com/media/uploads/p/l/40204133_5-fresho-apple-washington-economy.jpg',
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
    <section className="my-14">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-[52px] font-bold text-black">
            <span className="font-light">Shop By </span>Range
          </h2>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {categories.map((card, index) => {
            const isSelected = index === activeCategoryIndex
            return (
              <article
                key={card.title}
                style={{
                  backgroundImage: `url(${card.image})`,
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no-repeat'
                }}
                className={`relative h-[460px] overflow-hidden rounded-xl border p-6 shadow-xl transition ${isSelected
                  ? 'shadow-[0_28px_60px_rgba(16,185,129,0.18)]'
                  : 'border-white/40'
                  } ${card.bg} ${card.textColor}`}
              >
                <div
                  className="pointer-events-none absolute inset-0 opacity-60"
                  style={{ background: card.glow }}
                />
                <div className="relative flex h-full flex-col">
                  <div>
                    <p className="text-md">
                      {card.label}
                    </p>
                    <h3 className="text-4xl font-bold leading-tight">
                      {card.title}
                    </h3>
                    <p className="mt-3 max-w-xs text-sm opacity-90">
                      {card.description}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCategoryClick(index)}
                    className="mt-4 inline-flex w-max items-center justify-center rounded-full border border-white/70 bg-white/10 px-5 py-2 text-sm font-semibold transition hover:bg-white/20"
                  >
                    {card.buttonText}
                  </button>
                </div>
              </article>
            )
          })}
        </div>

        <div className="my-20 flex items-center justify-center gap-10">
          <div className="flex w-full max-w-[500px] items-center justify-center rounded-xl overflow-hidden">
            <img src={mangoImg} alt={activeCategory.imageLabel} className="h-full w-full object-cover" />
          </div>

          <div className="space-y-5 w-full">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-[52px] font-bold text-black">
                  <span className="font-light">Fresh </span>Fruits
                </h2>
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
                    className={`cursor-pointer rounded-xl border p-3 text-left transition ${isActive
                      ? 'shadow-sm'
                      : 'relative rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition'
                      }`}
                  >
                    <div className="flex items-center justify-center rounded-md overflow-hidden shadow-sm w-full" style={{ backgroundColor: 'rgba(243,244,246,0.9)' }}>
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
                      className="rounded-full w-full mt-3 border border-emerald-900 bg-white px-4 py-3 text-sm font-semibold text-emerald-800 hover:text-white transition hover:bg-emerald-800"
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
