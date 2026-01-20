import { useState } from 'react'
import ImageWithFallback from '../ui/ImageWithFallback'

interface Props {
  images: string[]
  name: string
}

export default function ProductGallery({ images, name }: Props) {
  const [active, setActive] = useState(0)
  const [zoom, setZoom] = useState<string | null>(null)

  const openZoom = (src: string) => setZoom(src)

  return (
    <div className="space-y-4">
      <div className="hidden md:grid grid-cols-2 gap-4">
        {images.map((src, i) => (
          <button key={src} onClick={() => openZoom(src)} className="rounded-xl overflow-hidden">
            <ImageWithFallback src={src} alt={`${name}-${i}`} className="aspect-[3/4] w-full" imgClassName="object-cover" />
          </button>
        ))}
      </div>
      <div className="md:hidden">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {images.map((src, i) => (
            <button key={src} onClick={() => { setActive(i); openZoom(src) }} className={`min-w-[70%] rounded-xl overflow-hidden border ${active === i ? 'border-neutral-800' : 'border-transparent'}`}>
              <ImageWithFallback src={src} alt={`${name}-${i}`} className="aspect-[3/4] w-full" imgClassName="object-cover" />
            </button>
          ))}
        </div>
      </div>

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
