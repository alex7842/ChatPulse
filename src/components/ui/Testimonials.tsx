import React from 'react';
import Image from 'next/image';
// import { Tilt } from 'react-tilt'


const testimonials = [
  {
    name: 'Olivia Turner',
    text: 'ChatWithPDF has transformed how I study. I can ask my textbooks questions and get instant answers. It&apos;s like having a personal tutor available 24/7!',
    image: '/girl-1.png',
  },
  {
    name: 'Eva Williams',
    text: 'I often work with documents in PDF format usually, and the functionality offered by ChatWithPDF not only made my daily life a lot easier but also prompted by to write this review. I like how convenient this tool is and how quickly I can find the necessary information even inside huge files.',
    image: '/girl-2.png',
  },
  {
    name: 'Ethan Brooks',
    text: 'I deal with extensive documents daily as a researcher. ChatWithPDF allows me to extract key information and insights better. It&apos;s an invaluable tool for my research.',
    image: '/girl-2.png',
  },
];

const Testimonials: React.FC = () => {
  return (
    <div className="bg-gray-900 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600 mb-12">
          Trusted by People like You
        </h2>
        <p className="text-center text-gray-300 mb-12">
          Don&apos;t just take our word for it. Here&apos;s what some of our users have to say about their experience with ChatWithPDF
        </p>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
  {testimonials.map((testimonial, index) => (
    <div key={index} className="bg-gray-800 rounded-lg p-6 h-full border-2 border-green-500">
      <p className="text-gray-300 mb-4">{testimonial.text}</p>
      <div className="flex items-center">
        <Image
          src={testimonial.image}
          alt={testimonial.name}
          width={48}
          height={48}
          className="rounded-full mr-4"
        />
        <span className="text-white font-medium">{testimonial.name}</span>
      </div>
    </div>
  ))}
</div>
      </div>
    </div>
  );
};

export default Testimonials;