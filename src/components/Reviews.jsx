import React from 'react';

const reviews = [
  {
    id: 1,
    title: "Super fresh fruits",
    content: "Super fresh fruits. Always fresh and delivered right on time.",
    name: "Tina McDonnell",
    image: "https://i.imgur.com/1X4VR6f.png",
    rating: 5,
  },
  {
    id: 2,
    title: "Excellent quality produce",
    content: "Excellent quality produce. Clean packaging and great consistency.",
    name: "Tina McDonnell",
    image: "https://i.imgur.com/1X4VR6f.png",
    rating: 5,
  },
  {
    id: 3,
    title: "Tasty and juicy fruits",
    content: "Tasty and juicy fruits. Better taste than local market options.",
    name: "Tina McDonnell",
    image: "https://i.imgur.com/1X4VR6f.png",
    rating: 5,
  },
];

const ReviewCard = ({ review }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 text-center w-[300px]">
      <div className="text-yellow-500 text-lg mb-2">
        {Array.from({ length: review.rating }).map((_, index) => (
          <span key={index}>⭐</span>
        ))}
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{review.title}</h3>
      <p className="text-sm text-gray-600 mb-4">{review.content}</p>
      <div className="flex items-center justify-center gap-3">
        <img
          src={review.image}
          alt={review.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <p className="text-sm font-medium text-gray-700">{review.name}</p>
      </div>
    </div>
  );
};

export default function Reviews() {
  return (
    <section className="p-10 bg-gray-50 rounded-3xl">
      <h2 className="text-3xl font-bold text-center mb-8">
        Verified, <span className="text-emerald-600">Honest Reviews</span>
      </h2>
      <div className="flex flex-wrap justify-center gap-6">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </section>
  );
}