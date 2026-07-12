import mangoImg from '../assets/mango.png'
import freshFruitsImg from '../assets/fresh-fruits.png'
import exoticFruitsImg from '../assets/exotic-fruits.png'
import importedFruitsImg from '../assets/imported-fruits.png'

const ROW_ONE = [
  mangoImg,
  'https://www.bbassets.com/media/uploads/p/l/40113536_7-fresho-dragon-fruit-red-flesh.jpg',
  freshFruitsImg,
  'https://www.bbassets.com/media/uploads/p/l/40083980_9-fresho-blueberry.jpg',
  exoticFruitsImg,
  'https://www.bbassets.com/media/uploads/p/l/10000013_26-fresho-avocado.jpg',
]

const ROW_TWO = [
  'https://www.bbassets.com/media/uploads/p/l/40204133_5-fresho-apple-washington-economy.jpg',
  importedFruitsImg,
  'https://www.bbassets.com/media/uploads/p/l/40019777_6-fresho-grapes-red-globe-indian.jpg',
  mangoImg,
  'https://www.bbassets.com/media/uploads/p/l/20001175_18-fresho-litchi.jpg',
  freshFruitsImg,
]

const ROW_THREE = [
  exoticFruitsImg,
  'https://www.bbassets.com/media/uploads/p/l/40083980_9-fresho-blueberry.jpg',
  importedFruitsImg,
  'https://www.bbassets.com/media/uploads/p/l/40113536_7-fresho-dragon-fruit-red-flesh.jpg',
  'https://www.bbassets.com/media/uploads/p/l/10000013_26-fresho-avocado.jpg',
  'https://www.bbassets.com/media/uploads/p/l/40204133_5-fresho-apple-washington-economy.jpg',
]

function MarqueeRow({ images, duration, reverse = false }) {
  const track = [...images, ...images]

  return (
    <div className="login-marquee-row">
      <div
        className={`login-marquee-track${reverse ? ' is-reverse' : ''}`}
        style={{ animationDuration: duration }}
      >
        {track.map((image, index) => (
          <div key={`${image}-${index}`} className="login-marquee-cell">
            <img src={image} alt="" className="h-full w-full object-contain" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function LoginImageMarquee() {
  return (
    <div className="login-marquee" aria-hidden="true">
      <MarqueeRow images={ROW_ONE} duration="26s" />
      <MarqueeRow images={ROW_TWO} duration="34s" reverse />
      <MarqueeRow images={ROW_THREE} duration="22s" />
    </div>
  )
}
