import React from "react";
import kiwi from "../assets/flying-kiwis.png";

export default function FruitHighlight() {
  return (
    <section className="bg-lime-300 py-10 px-6 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Left Content */}
          <div className="">
            <h1 className="my-0 text-4xl md:text-5xl text-black leading-tight" style={{margin: 0}}>
              The Small Fruit <br />
              with a <span className="font-bold">Big Punch</span>
            </h1>

            <p className="text-lg text-black leading-relaxed">
              Kiwi is a nutrient-rich fruit known for its vibrant green flesh,
              refreshing sweet-tangy flavor, and high vitamin C content. It's a
              great addition to a healthy, balanced diet.
            </p>

            <ul className="space-y-3 text-black my-6">
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

            <button className="inline-flex items-center justify-center rounded-full bg-white cursor-pointer text-black px-8 py-3 font-semibold shadow-lg hover:bg-black hover:text-white transition">
              Shop Now
            </button>
          </div>

          {/* Right Image */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative w-full max-w-sm">
                <img
                  src={kiwi}
                  alt="Kiwi slices"
                  className="w-full h-auto object-contain"
                />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}