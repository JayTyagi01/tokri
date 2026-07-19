import { Link } from 'react-router-dom'
import kiwi from '../assets/flying-kiwis.png'

export default function FruitHighlight() {
  return (
    <section className="bg-panel-2 px-6 py-10 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Left Content */}
          <div className="">
            <p className="m-0 text-2xl leading-tight text-white sm:text-3xl md:text-5xl">
              The Small Fruit <br />
              with a <span className="font-bold text-mint">Big Punch</span>
            </p>

            <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base md:text-lg">
              Kiwi is a nutrient-rich fruit known for its vibrant green flesh,
              refreshing sweet-tangy flavor, and high vitamin C content. It's a
              great addition to a healthy, balanced diet.
            </p>

            <ul className="my-6 space-y-3 text-white">
              <li className="flex items-start gap-3">
                Boosts immunity with high vitamin C
              </li>
              <li className="flex items-start gap-3">
                Aids digestion due to natural enzymes
              </li>
              <li className="flex items-start gap-3">
                Supports heart health with antioxidants
              </li>
              <li className="flex items-start gap-3">
                Low in calories, ideal for weight management
              </li>
            </ul>

            <Link
              to="/shop"
              className="inline-flex items-center justify-center rounded-full bg-brand px-8 py-3 font-semibold text-black shadow-lg transition hover:bg-brand-hover"
            >
              Shop Now
            </Link>
          </div>

          {/* Right Image */}
          <div className="hidden items-center justify-center lg:flex">
            <div className="relative w-full max-w-sm">
                <img
                  src={kiwi}
                  alt="Kiwi slices"
                  className="h-auto w-full object-contain"
                />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
