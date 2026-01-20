type Props = {
  colors: string[]
  value?: string
  onChange: (c: string) => void
  unavailable?: string[]
}

export default function ColorSelector({ colors, value, onChange, unavailable = [] }: Props) {
  return (
    <div className="flex flex-wrap gap-3 md:gap-4">
      {colors.map((c) => {
        const disabled = unavailable.includes(c)
        const isSelected = value === c
        return (
          <button
            key={c}
            className={`relative h-9 w-9 md:h-11 md:w-11 rounded-full border-3 transition-all ${
              disabled
                ? 'border-neutral-200 opacity-40 cursor-not-allowed ring-0'
                : isSelected
                ? 'border-neutral-900 ring-2 ring-neutral-900 ring-offset-2 shadow-md'
                : 'border-neutral-300 hover:border-neutral-600 hover:ring-1 hover:ring-neutral-300'
            }`}
            style={{ backgroundColor: c }}
            onClick={() => !disabled && onChange(c)}
            disabled={disabled}
            aria-label={`Cor ${c}`}
            title={disabled ? 'Cor indisponível' : `Selecionar cor ${c}`}
          />
        )
      })}
    </div>
  )
}
