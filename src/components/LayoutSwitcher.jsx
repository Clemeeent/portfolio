import { LAYOUTS } from '../lib/layout'

/**
 * <LayoutSwitcher /> — a scratch control for trying the variants side by side.
 *
 * Not part of the design. It's here so the looks can be compared in a real
 * browser instead of from screenshots; delete this file and its use in
 * StackedWorks once a direction is settled.
 *
 * Styled after the outlined pills in the NN/G reference, mostly so it doesn't
 * pretend to be part of the page.
 */
export default function LayoutSwitcher({ variant, onChange }) {
  return (
    <div className="fixed right-4 bottom-4 z-50 print:hidden">
      <div
        className="flex flex-col gap-2 rounded-2xl border border-hairline bg-paper/80 p-2 opacity-45 backdrop-blur-md transition-opacity hover:opacity-100 focus-within:opacity-100"
        role="group"
        aria-label="Preview layout"
      >
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(LAYOUTS).map(([key, def]) => {
            const active = key === variant
            return (
              <button
                key={key}
                type="button"
                onClick={() => onChange(key)}
                aria-pressed={active}
                title={def.note}
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
        <p className="max-w-[15rem] px-1 pb-0.5 text-[11px] leading-snug text-muted">
          {LAYOUTS[variant].note}
        </p>
      </div>
    </div>
  )
}
