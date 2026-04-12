import React from "react";
import kiwi from "../assets/kiwi.png";

export default function FruitHighlight() {
  return (
    <section className="bg-lime-300 py-6 px-6 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
              The Small Fruit <br />
              with a <span className="text-black">Big Punch</span>
            </h1>

            <p className="text-lg text-slate-600 leading-relaxed">
              Kiwi is a nutrient-rich fruit known for its vibrant green flesh,
              refreshing sweet-tangy flavor, and high vitamin C content. It's a
              great addition to a healthy, balanced diet.
            </p>

            <ul className="space-y-3 text-slate-700">
              <li className="flex items-start gap-3">
                <span className="text-black font-bold">✓</span>
                <span>Boosts immunity with high vitamin C</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-black font-bold">✓</span>
                <span>Aids digestion due to natural enzymes</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-black font-bold">✓</span>
                <span>Supports heart health with antioxidants</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-black font-bold">✓</span>
                <span>Low in calories, ideal for weight management</span>
              </li>
            </ul>

            <button className="inline-flex items-center justify-center rounded-full bg-white cursor-pointer text-black px-8 py-3 font-semibold shadow-lg hover:bg-black hover:text-white transition">
              Shop Now
            </button>
          </div>

          {/* Right Image */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative w-full max-w-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-200 to-lime-100 rounded-[2rem] blur-2xl opacity-40" />
              <div className="relative rounded-[2rem] overflow-hidden bg-white/50 backdrop-blur p-8 shadow-xl">
                <img
                  src={kiwi}
                  alt="Kiwi slices"
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}