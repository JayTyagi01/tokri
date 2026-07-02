import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react'
import { fetchJson, resolveAssetUrl } from '../lib/api'

const MAX_REVIEWS = 9

const fallbackReviews = [
  {
    id: 1,
    title: 'Super fresh fruits',
    content: 'Super fresh fruits. Always fresh and delivered right on time.',
    name: 'Tina McDonnell',
    image: 'https://i.imgur.com/1X4VR6f.png',
    rating: 5,
  },
  {
    id: 2,
    title: 'Excellent quality produce',
    content: 'Excellent quality produce. Clean packaging and great consistency.',
    name: 'Aarav Sharma',
    image: 'https://i.imgur.com/1X4VR6f.png',
    rating: 5,
  },
  {
    id: 3,
    title: 'Tasty and juicy fruits',
    content: 'Tasty and juicy fruits. Better taste than local market options.',
    name: 'Priya Nair',
    image: 'https://i.imgur.com/1X4VR6f.png',
    rating: 4,
  },
]

const initials = (name) =>
  String(name || '?')
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()

function Stars({ rating = 5 }) {
  return (
    <div className="flex items-center justify-center gap-0.5">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          size={18}
          className={
            index < rating ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'
          }
        />
      ))}
    </div>
  )
}

function ReviewCard({ review }) {
  const avatar = resolveAssetUrl(review.image)
  const hasImage = review.image && avatar

  return (
    <div className="flex h-full flex-col items-center rounded-3xl border border-slate-100 bg-white p-8 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <Quote className="mb-3 h-8 w-8 text-emerald-500/30" />
      <Stars rating={review.rating} />
      <h3 className="mt-4 text-lg font-semibold text-slate-900">{review.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{review.content}</p>
      <div className="mt-6 flex items-center gap-3">
        {hasImage ? (
          <img
            src={avatar}
            alt={review.name}
            className="h-12 w-12 rounded-full object-cover ring-2 ring-emerald-100"
          />
        ) : (
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700">
            {initials(review.name)}
          </span>
        )}
        <div className="text-left">
          <p className="text-sm font-semibold text-slate-900">{review.name}</p>
          <p className="text-xs text-emerald-600">Verified buyer</p>
        </div>
      </div>
    </div>
  )
}

export default function Reviews() {
  const [reviews, setReviews] = useState(fallbackReviews)
  const trackRef = useRef(null)

  useEffect(() => {
    let ignore = false

    fetchJson('/reviews')
      .then((items) => {
        if (!ignore && Array.isArray(items) && items.length) {
          setReviews(items.slice(0, MAX_REVIEWS))
        }
      })
      .catch(() => {})

    return () => {
      ignore = true
    }
  }, [])

  const isSlider = reviews.length > 3

  const scrollByCard = (direction) => {
    const track = trackRef.current
    if (!track) return
    const amount = track.clientWidth * 0.9
    track.scrollBy({ left: direction * amount, behavior: 'smooth' })
  }

  return (
    <section className="rounded-3xl bg-gradient-to-b from-emerald-50/60 to-white p-8 sm:p-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">
            What customers say
          </p>
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Verified, <span className="text-emerald-600">Honest Reviews</span>
          </h2>
        </div>

        <div className="relative">
          {isSlider && (
            <button
              type="button"
              onClick={() => scrollByCard(-1)}
              aria-label="Previous reviews"
              className="absolute -left-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-slate-200 bg-white p-2.5 text-slate-700 shadow-md transition hover:bg-emerald-600 hover:text-white sm:flex"
            >
              <ChevronLeft size={20} />
            </button>
          )}

          <div
            ref={trackRef}
            className={
              isSlider
                ? 'flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2 scrollbar-hide'
                : 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3'
            }
          >
            {reviews.map((review) => (
              <div
                key={review.id}
                className={
                  isSlider
                    ? 'w-[85%] shrink-0 snap-center sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)]'
                    : ''
                }
              >
                <ReviewCard review={review} />
              </div>
            ))}
          </div>

          {isSlider && (
            <button
              type="button"
              onClick={() => scrollByCard(1)}
              aria-label="Next reviews"
              className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-slate-200 bg-white p-2.5 text-slate-700 shadow-md transition hover:bg-emerald-600 hover:text-white sm:flex"
            >
              <ChevronRight size={20} />
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
