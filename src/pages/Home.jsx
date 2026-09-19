import { useEffect, useState } from 'react'
import Banner from '../components/Banner'
import Categories from '../components/Categories'
import BestSellers from '../components/BestSellers'
import SeasonalFruits from '../components/SeasonalFruits'
import FruitHighlight from '../components/FruitHighlight'
import HomeCategoryFeed from '../components/HomeCategoryFeed'
import Reviews from '../components/Reviews'
import { fetchJson } from '../lib/api'

export default function Home() {
  const [home, setHome] = useState({
    bannerImage: null,
    highlightImage: null,
    featuredCategorySlugs: [],
  })

  useEffect(() => {
    let ignore = false

    fetchJson('/settings/public')
      .then((data) => {
        if (ignore) return
        const next = data?.home || {}
        setHome({
          bannerImage: next.bannerImage || null,
          highlightImage: next.highlightImage || null,
          featuredCategorySlugs: Array.isArray(next.featuredCategorySlugs)
            ? next.featuredCategorySlugs
            : [],
        })
      })
      .catch(() => {})

    return () => {
      ignore = true
    }
  }, [])

  return (
    <main>
      <Banner image={home.bannerImage} />
      <Categories />
      <BestSellers />
      <SeasonalFruits />
      <FruitHighlight image={home.highlightImage} />
      <HomeCategoryFeed slugs={home.featuredCategorySlugs} />
      <Reviews />
    </main>
  )
}
