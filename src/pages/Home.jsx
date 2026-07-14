import Banner from '../components/Banner'
import Categories from '../components/Categories'
import BestSellers from '../components/BestSellers'
import SeasonalFruits from '../components/SeasonalFruits'
import FruitHighlight from '../components/FruitHighlight'
import ImportedFruits from '../components/ImportedFruits'
import Reviews from '../components/Reviews'

export default function Home() {
  return (
    <main>
      <Banner />
      <Categories />
      <BestSellers />
      <SeasonalFruits />
      <FruitHighlight />
      <ImportedFruits />
      <Reviews />
    </main>
  )
}
