/**
 * The image slot used by cards, feature blocks and case-study figures.
 *
 * Drop a real image in by setting `src` (public/ path or an import). Until then
 * it renders a soft accent gradient with a faint grid so the layout reads as
 * finished rather than broken.
 */
export default function PreviewSurface({
  src,
  alt = '',
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
