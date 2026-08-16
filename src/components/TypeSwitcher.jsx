import { TYPE_VARIANTS } from '../lib/typeVariants'

/**
 * <TypeSwitcher /> — scratch control for comparing the three type proposals.
 *
 * Not part of the design. Delete this file and its use in StackedWorks once a
 * direction is settled.
 */
export default function TypeSwitcher({ variant, onChange }) {
  return (
    <div className="fixed right-4 bottom-4 z-50 print:hidden">
      <div
        className="flex flex-col gap-2 rounded-2xl border border-hairline bg-paper/85 p-2 opacity-45 backdrop-blur-md transition-opacity focus-within:opacity-100 hover:opacity-100"
        role="group"
        aria-label="Preview typography"
      >
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(TYPE_VARIANTS).map(([key, def]) => {
            const active = key === variant
            return (
              <button
                key={key}
                type="button"
                onClick={() => onChange(key)}
                aria-pressed={active}
                className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  active
                    ? 'border-ink bg-ink text-paper'
                    : 'border-hairline bg-card text-muted hover:text-ink'
                }`}
              >
                {def.label}
              </button>
            )
          })}
        </div>
        <p className="max-w-[16rem] px-1 pb-0.5 text-[11px] leading-snug text-muted">
          {TYPE_VARIANTS[variant].note}
        </p>
      </div>
    </div>
  )
}
