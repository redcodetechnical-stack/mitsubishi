"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

export interface CarouselSlide {
  id?: string
  title: string
  desc1: string
  desc2: string
  image: string
}

interface AutoScrollHeroCarouselProps {
  mainTitle: string
  mainSubtitle: string
  slides?: CarouselSlide[]
  autoScrollInterval?: number
}

const defaultSlides: CarouselSlide[] = [
  {
    id: "s1",
    title: "Stay connected with what matters",
    desc1: "Organizational announcements, business updates, leadership messages, and strategic news - all in one unified feed built for the group.",
    desc2: "Empowering every employee with transparent access to key announcements, policy updates, and corporate brand assets.",
    image: "/event-townhall.png",
  },
  {
    id: "s2",
    title: "Everything you need to represent the brand",
    desc1: "Access approved logos, templates, colors, and guidelines. All assets are production-ready and kept up to date by the Corporate Communications team.",
    desc2: "Maintaining brand consistency across all channels, regions, and external marketing touchpoints.",
    image: "/news-innovation.png",
  },
  {
    id: "s3",
    title: "Campaigns that move as one",
    desc1: "Everything you need to bring our campaigns to life - overviews, objectives, creative assets, toolkits & timelines.",
    desc2: "Unifying global and regional teams around a shared narrative for maximum audience impact.",
    image: "/campaign-sustainability.png",
  },
]

export function AutoScrollHeroCarousel({
  mainTitle,
  mainSubtitle,
  slides = defaultSlides,
  autoScrollInterval = 4000,
}: AutoScrollHeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length)
  }, [slides.length])

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)
  }, [slides.length])

  // Auto Scroll Effect
  useEffect(() => {
    if (isHovered) return
    const timer = setInterval(() => {
      handleNext()
    }, autoScrollInterval)

    return () => clearInterval(timer)
  }, [handleNext, isHovered, autoScrollInterval])

  const currentSlide = slides[currentIndex] || slides[0]

  return (
    <div
      className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden bg-[#1a1a1a] text-white p-8 sm:p-10 shadow-xl rounded-2xl border border-gray-800">
        {/* Red Quotation Marks Background Watermarks */}
        <div className="absolute left-6 top-4 text-[100px] font-black text-[#cc0000] leading-none select-none pointer-events-none opacity-90">
          &ldquo;
        </div>
        <div className="absolute right-6 bottom-4 text-[100px] font-black text-[#cc0000] leading-none select-none pointer-events-none opacity-90">
          &rdquo;
        </div>

        {/* Header Text */}
        <div className="relative text-center max-w-2xl mx-auto mb-8 z-10">
          <h1 className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight">
            {mainTitle}
          </h1>
          <p className="mt-2 text-xs text-gray-300 leading-relaxed font-medium">
            {mainSubtitle}
          </p>
        </div>

        {/* Inner White Carousel Card */}
        <div className="relative bg-white text-gray-900 rounded-2xl p-6 sm:p-8 max-w-4xl mx-auto shadow-2xl z-10 border border-gray-100 transition-all duration-500">
          <div className="grid gap-6 lg:grid-cols-12 items-center">
            {/* Photo on Left */}
            <div className="lg:col-span-5 relative aspect-[4/3] rounded-xl overflow-hidden border-l-4 border-l-[#cc0000] shadow-md group">
              <Image
                key={currentSlide.image}
                src={currentSlide.image}
                alt={currentSlide.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>

            {/* Info Text on Right */}
            <div className="lg:col-span-7 space-y-3">
              <h3 className="font-display text-base sm:text-lg font-black text-gray-900 leading-snug transition-all duration-300">
                {currentSlide.title}
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed transition-all duration-300">
                {currentSlide.desc1}
              </p>
              <p className="text-xs text-gray-500 leading-relaxed transition-all duration-300">
                {currentSlide.desc2}
              </p>

              {/* Bottom Controls Row: Indicator Dots on Left + Arrow Buttons on Right */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                {/* Active Red Indicator Dots */}
                <div className="flex items-center gap-1.5">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-2 transition-all duration-300 rounded-full cursor-pointer ${
                        currentIndex === idx
                          ? "w-6 bg-[#cc0000]"
                          : "w-2 bg-gray-300 hover:bg-gray-400"
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>

                {/* Carousel Arrow Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrev}
                    className="size-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-[#1a1a1a] transition-colors cursor-pointer border border-gray-200 shadow-xs"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="size-4" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="size-7 rounded-full bg-[#cc0000] hover:bg-[#a80000] flex items-center justify-center text-white transition-colors cursor-pointer shadow-xs"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
