type Props = { lines?: number }

export default function SkeletonCard({ lines = 2 }: Props) {
  return (
    <div className="animate-pulse rounded-xl p-3 bg-white/60 border border-neutral-100">
      <div className="aspect-[3/4] rounded-lg bg-neutral-200" />
      <div className="mt-3 space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className={`h-3 rounded bg-neutral-200 ${i === 0 ? 'w-3/4' : 'w-1/2'}`} />
        ))}
      </div>
    </div>
  )
}
