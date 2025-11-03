'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export interface BannerSlide {
  id: string;
  image: string;
  title: string;
  subtitle?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  textPosition?: 'left' | 'center' | 'right';
  textColor?: 'light' | 'dark';
  overlay?: boolean;
}

interface HeroBannerCarouselProps {
  slides: BannerSlide[];
  autoPlayInterval?: number;
}

export default function HeroBannerCarousel({
  slides,
  autoPlayInterval = 5000,
}: HeroBannerCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying || slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [currentSlide, isAutoPlaying, slides.length, autoPlayInterval]);

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  if (slides.length === 0) return null;

  const slide = slides[currentSlide];
  const textColorClass = slide.textColor === 'dark' ? 'text-slate-900' : 'text-white';
  const subtitleColorClass = slide.textColor === 'dark' ? 'text-slate-500' : 'text-white/80';
  const descriptionColorClass = slide.textColor === 'dark' ? 'text-slate-600' : 'text-white/90';

  const getTextAlignmentClasses = () => {
    switch (slide.textPosition) {
      case 'center':
        return 'text-center items-center justify-center';
      case 'right':
        return 'text-right items-end justify-end';
      default:
        return 'text-left items-start justify-start';
    }
  };

  return (
    <section className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden bg-slate-100">
      {/* Slides */}
      <div className="relative w-full h-full">
        {slides.map((slideItem, index) => (
          <div
            key={slideItem.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Background Image */}
            <Image
              src={slideItem.image}
              alt={slideItem.title}
              fill
              className="object-cover"
              priority={index === 0}
            />

            {/* Overlay */}
            {slideItem.overlay && (
              <div className="absolute inset-0 bg-black/30 z-10" />
            )}
          </div>
        ))}
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 z-20 flex items-center">
        <div className="container mx-auto px-4">
          <div className={`flex flex-col ${getTextAlignmentClasses()} max-w-3xl ${
            slide.textPosition === 'right' ? 'ml-auto' : 
            slide.textPosition === 'center' ? 'mx-auto' : ''
          }`}>
            {/* Subtitle */}
            {slide.subtitle && (
              <p className={`text-sm md:text-base uppercase tracking-[0.3em] mb-4 ${subtitleColorClass} font-medium`}>
                {slide.subtitle}
              </p>
            )}

            {/* Title */}
            <h1 className={`text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 ${textColorClass} leading-tight`}>
              {slide.title}
            </h1>

            {/* Description */}
            {slide.description && (
              <p className={`text-lg md:text-xl mb-8 ${descriptionColorClass} max-w-2xl`}>
                {slide.description}
              </p>
            )}

            {/* CTA Button */}
            {slide.ctaText && slide.ctaLink && (
              <div>
                <Link
                  href={slide.ctaLink}
                  className={`inline-block px-8 py-4 rounded-none font-semibold text-base md:text-lg transition-all duration-300 ${
                    slide.textColor === 'dark'
                      ? 'bg-slate-900 text-white hover:bg-slate-800'
                      : 'bg-white text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {slide.ctaText}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/80 hover:bg-white text-slate-900 p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
            aria-label="Previous slide"
          >
            <FiChevronLeft size={24} />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/80 hover:bg-white text-slate-900 p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
            aria-label="Next slide"
          >
            <FiChevronRight size={24} />
          </button>
        </>
      )}

      {/* Dots Navigation */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-white w-8'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
