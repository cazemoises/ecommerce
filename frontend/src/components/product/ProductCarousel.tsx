import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ImageWithFallback from '../ui/ImageWithFallback'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Props {
  images: string[]
  name: string
}

export default function ProductCarousel({ images, name }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [zoom, setZoom] = useState<string | null>(null)
  const [direction, setDirection] = useState(0)

  const handlePrev = () => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setDirection(1)
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      zIndex: 0,
      x: dir < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  }

  return (
    <div className="space-y-4">
      {/* Desktop: Large main image with thumbnails */}
      <div className="hidden md:space-y-4">
        <div className="relative w-full rounded-xl overflow-hidden bg-neutral-100 cursor-zoom-in" style={{ aspectRatio: '3/4' }} onClick={() => setZoom(images[currentIndex])}>
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute inset-0 w-full h-full"
            >
              <ImageWithFallback
                src={images[currentIndex]}
                alt={`${name}-${currentIndex}`}
                className="w-full h-full"
                imgClassName="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Thumbnail Row */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`min-w-[80px] h-20 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                i === currentIndex ? 'border-neutral-900' : 'border-neutral-200 hover:border-neutral-400'
              }`}
            >
              <ImageWithFallback
                src={src}
                alt={`${name}-thumb-${i}`}
                className="w-full h-full"
                imgClassName="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Mobile: Swipeable Carousel */}
      <div className="md:hidden space-y-4">
        <div className="relative w-full rounded-xl overflow-hidden bg-neutral-100 h-[55vh] md:h-auto" style={{ aspectRatio: '3/4' }}>
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute inset-0 w-full h-full"
            >
              <ImageWithFallback
                src={images[currentIndex]}
                alt={`${name}-${currentIndex}`}
                className="w-full h-full"
                imgClassName="object-cover"
                sizes="100vw"
              />
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition"
                aria-label="Previous image"
              >
                <ChevronLeft size={20} className="text-neutral-900" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition"
                aria-label="Next image"
              >
                <ChevronRight size={20} className="text-neutral-900" />
              </button>
            </>
          )}

          {/* Pagination Dots */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`transition ${
                    i === currentIndex
                      ? 'bg-neutral-900 w-2 h-2 rounded-full'
                      : 'bg-white/50 w-1.5 h-1.5 rounded-full hover:bg-white/70'
                  }`}
                  aria-label={`Go to image ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Thumbnail Row for Mobile */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`min-w-[60px] h-16 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                i === currentIndex ? 'border-neutral-900' : 'border-neutral-200'
              }`}
            >
              <ImageWithFallback
                src={src}
                alt={`${name}-thumb-${i}`}
                className="w-full h-full"
                imgClassName="object-cover"
                sizes="60px"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Zoom Modal */}
      {zoom && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4" onClick={() => setZoom(null)}>
          <div className="max-w-3xl w-full">
            <ImageWithFallback src={zoom} alt={name} className="w-full max-h-[80vh]" imgClassName="object-contain" />
          </div>
        </div>
      )}
    </div>
  )
}
