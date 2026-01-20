import { useEffect, useState } from 'react'
import { X, Search, ArrowLeft } from 'lucide-react'
import { search } from '../../api/products'
import { Link } from 'react-router-dom'
import ImageWithFallback from '../ui/ImageWithFallback'
import { motion, AnimatePresence } from 'framer-motion'

const TRENDING = ['wide leg', 'minimal', 'preto', 'alfaiataria']

type Props = {
  open: boolean
  onClose: () => void
}

export default function SearchModal({ open, onClose }: Props) {
  const [query, setQuery] = useState('')
  const [debounced, setDebounced] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim()), 300)
    return () => clearTimeout(t)
  }, [query])

  useEffect(() => {
    const searchProducts = async () => {
      if (!debounced) {
        setResults([])
        return
      }
      try {
        setLoading(true)
        const data = await search(debounced)
        setResults(Array.isArray(data) ? data.slice(0, 6) : [])
      } catch (error) {
        console.error('Search error:', error)
        setResults([])
      } finally {
        setLoading(false)
      }
    }
    searchProducts()
  }, [debounced])

  const handleCancel = () => {
    setQuery('')
    setDebounced('')
    onClose()
  }

  // Auto-focus input when opened
  useEffect(() => {
    if (open) {
      setQuery('')
      setDebounced('')
    }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Full-Screen Overlay with Fade Animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-white md:bg-black/60"
            onClick={handleCancel}
          />

          {/* Native App-Like Search View */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed inset-0 md:inset-x-4 md:top-20 md:bottom-auto z-50 bg-white md:rounded-2xl md:shadow-2xl md:border md:border-neutral-200 overflow-hidden md:max-w-3xl md:mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Native Header with Cancel Button */}
            <div className="sticky top-0 bg-white border-b border-neutral-200 z-10">
              <div className="flex items-center gap-3 px-4 py-3">
                <Search className="h-5 w-5 text-neutral-400 flex-shrink-0" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar produtos, categorias..."
                  className="flex-1 outline-none text-base placeholder:text-neutral-400"
                />
                <button
                  onClick={handleCancel}
                  className="text-sm font-medium text-neutral-900 hover:text-neutral-600 transition px-3 py-1.5 -mr-2"
                >
                  Cancelar
                </button>
              </div>
            </div>

            {/* Search Content - Scrollable */}
            <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 64px)' }}>
              {!debounced && (
                <div className="px-4 py-6 space-y-6">
                  {/* Trending */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
                      Em Alta
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {TRENDING.map((r) => (
                        <button
                          key={r}
                          onClick={() => setQuery(r)}
                          className="rounded-full bg-neutral-100 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-200 transition"
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {debounced && (
                <div className="min-h-[50vh]">
                  {results.length === 0 && (
                    <div className="px-4 py-12 text-center">
                      <p className="text-sm text-neutral-500">Nenhum resultado encontrado para</p>
                      <p className="text-base font-medium text-neutral-900 mt-1">"{debounced}"</p>
                    </div>
                  )}
                  <div className="divide-y divide-neutral-100">
                    {results.map((p) => (
                      <Link
                        key={p.id}
                        to={`/products/${p.id}`}
                        onClick={handleCancel}
                        className="flex items-center gap-4 px-4 py-4 hover:bg-neutral-50 active:bg-neutral-100 transition"
                      >
                        <div className="h-20 w-16 overflow-hidden rounded-lg bg-neutral-100 flex-shrink-0">
                          <ImageWithFallback
                            src={p.images[0]}
                            alt={p.name}
                            className="h-full w-full"
                            imgClassName="object-cover w-full h-full"
                            sizes="64px"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-neutral-900 line-clamp-2">{p.name}</div>
                          <div className="text-sm text-neutral-500 mt-1">R$ {p.price.toFixed(2)}</div>
                        </div>
                        <div className="text-xs text-neutral-400 flex-shrink-0">Ver →</div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
