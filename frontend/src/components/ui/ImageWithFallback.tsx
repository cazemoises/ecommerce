import * as React from 'react'

type Props = {
  src: string
  srcSet?: string
  sizes?: string
  alt: string
  className?: string
  imgClassName?: string
  style?: React.CSSProperties
}

export default function ImageWithFallback({ src, srcSet, sizes, alt, className, imgClassName, style }: Props) {
  const [error, setError] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(true)

  const wrapperClass = `${className?.match(/absolute|fixed|relative|sticky/) ? '' : 'relative'} overflow-hidden ${className ?? ''}`

  if (error) {
    return (
      <div className={wrapperClass} style={style} aria-label={alt}>
        <div className="flex h-full w-full items-center justify-center bg-neutral-200 text-neutral-500">
          <span className="text-xs">Imagem indisponível</span>
        </div>
      </div>
    )
  }

  return (
    <div className={wrapperClass} style={style}>
      {isLoading && (
        <div
          className="absolute inset-0 bg-neutral-200 animate-pulse pointer-events-none"
          aria-hidden="true"
        />
      )}
      <img
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        loading="lazy"
        className={`h-full w-full object-cover transition-opacity duration-500 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        } ${imgClassName ?? ''}`}
        onError={() => setError(true)}
        onLoad={() => setIsLoading(false)}
      />
    </div>
  )
}
