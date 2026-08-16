import Illustration from './Illustration'

/**
 * The image slot used by cards, the case-study hero and case-study figures.
 *
 * Three levels of fallback, in order:
 *
 *   1. `src`          a real image, once you have one
 *   2. `illustration` the project's flat graphic (see Illustration.jsx)
 *   3. accent gradient  a soft placeholder, so nothing ever looks broken
 */
export default function PreviewSurface({
  src,
  alt = '',
  illustration,
  accent = ['#eceaf6', '#cfcae4'],
  className = '',
  label,
}) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={`h-full w-full object-cover ${className}`}
      />
    )
  }

  if (illustration) {
    return (
      <div className={`h-full w-full ${className}`}>
        <Illustration name={illustration} />
      </div>
    )
  }

  return (
    <div
      aria-hidden="true"
      className={`relative h-full w-full overflow-hidden ${className}`}
      style={{
        backgroundImage: `linear-gradient(135deg, ${accent[0]} 0%, ${accent[1]} 100%)`,
      }}
    >
      {/* Faint grid so empty placeholders still have some texture. */}
      <div
        className="absolute inset-0 opacity-40 mix-blend-overlay"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.6) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      {label && (
        <span className="absolute bottom-3 left-4 text-[11px] font-medium tracking-[0.14em] text-ink/35 uppercase">
          {label}
        </span>
      )}
    </div>
  )
}
