type Props = {
  sizes: Array<'XS' | 'S' | 'M' | 'L' | 'XL'>
  value?: 'XS' | 'S' | 'M' | 'L' | 'XL'
  onChange: (s: 'XS' | 'S' | 'M' | 'L' | 'XL') => void
  unavailable?: Array<'XS' | 'S' | 'M' | 'L' | 'XL'>
}

export default function SizeSelector({ sizes, value, onChange, unavailable = [] }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {sizes.map((s) => {
        const disabled = unavailable.includes(s)
        const isSelected = value === s
        return (
          <button
            key={s}
            className={`h-9 w-9 rounded-lg border-2 font-medium text-sm flex items-center justify-center md:h-11 md:w-auto md:px-4 md:text-sm transition-all ${
              disabled
                ? 'border-neutral-200 text-neutral-300 bg-neutral-50 cursor-not-allowed'
                : isSelected
                ? 'border-neutral-900 bg-neutral-900 text-white shadow-md'
                : 'border-neutral-200 text-neutral-900 hover:border-neutral-400 hover:bg-neutral-50'
            }`}
            onClick={() => !disabled && onChange(s)}
            disabled={disabled}
            aria-pressed={isSelected}
          >
            {s}
          </button>
        )
      })}
    </div>
  )
}
