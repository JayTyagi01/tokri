import Banner from '../components/Banner'
import Categories from '../components/Categories'
import BestSellers from '../components/BestSellers'
import ShopOurRange from '../components/ShopOurRange'
import FruitHighlight from '../components/FruitHighlight'
import ImportedFruits from '../components/ImportedFruits'
import Reviews from '../components/Reviews'

export default function Home() {
  return (
    <main className="bg-slate-50 pb-16">
      <Banner />
      <Categories />
      <BestSellers />
      <ShopOurRange />
      <FruitHighlight />
      <ImportedFruits />
      <Reviews />
    </main>
  )
}
