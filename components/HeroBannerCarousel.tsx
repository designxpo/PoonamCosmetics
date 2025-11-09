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
  textColor?: string;
  buttonColor?: string;
  buttonTextColor?: string;
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
  const textColor = slide.textColor || '#ffffff';
  const buttonColor = slide.buttonColor || '#7C3AED';
  const buttonTextColor = slide.buttonTextColor || '#ffffff';

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
    <section className="relative w-full h-[70vh] md:h-[75vh] lg:h-[80vh] overflow-hidden bg-gray-100">
      {/* Slides */}
      <div className="relative w-full h-full">
        {slides.map((slideItem, index) => (
          <div
            key={slideItem.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
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

            {/* Subtle Overlay */}
            {slideItem.overlay && (
              <div className="absolute inset-0 bg-black/20 z-10" />
            )}
          </div>
        ))}
      </div>

      {/* Content Overlay - Centered */}
      <div className="absolute inset-0 z-20 flex items-center justify-center">
        <div className="text-center px-4 max-w-4xl">
          {/* Subtitle (Label) */}
          {slide.subtitle && (
            <p 
              className="text-xs md:text-sm uppercase tracking-[0.3em] mb-3 font-medium"
              style={{ color: textColor }}
            >
              {slide.subtitle}
            </p>
          )}

          {/* Title */}
          <h1 
            className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-light mb-8 leading-tight tracking-wide"
            style={{ color: textColor }}
          >
            {slide.title}
          </h1>

          {/* CTA Button */}
          {slide.ctaText && slide.ctaLink && (
            <div>
              <Link
                href={slide.ctaLink}
                className="inline-block px-10 py-3 text-sm font-medium tracking-wider uppercase transition-all duration-300 hover:scale-105 border-2"
                style={{
                  backgroundColor: buttonColor,
                  color: buttonTextColor,
                  borderColor: buttonTextColor
                }}
              >
                {slide.ctaText}
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Arrows - Minimal */}
      {slides.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 text-white hover:text-gray-300 transition-colors"
            aria-label="Previous slide"
          >
            <FiChevronLeft size={32} strokeWidth={1} />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 text-white hover:text-gray-300 transition-colors"
            aria-label="Next slide"
          >
            <FiChevronRight size={32} strokeWidth={1} />
          </button>
        </>
      )}

      {/* Dots Navigation - Minimal */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 ${
                index === currentSlide
                  ? 'w-8 h-1.5 bg-white'
                  : 'w-8 h-0.5 bg-white/60 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
