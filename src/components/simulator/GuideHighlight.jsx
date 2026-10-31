export default function GuideHighlight({ active, children, className = '' }) {
  return (
    <div
      className={`relative rounded-[1.35rem] transition-shadow duration-300 ${
        active
          ? 'z-10 ring-4 ring-teal ring-offset-2 ring-offset-ivory shadow-lift'
          : ''
      } ${className}`}
    >
      {children}
      {active && (
        <span className="pointer-events-none absolute -inset-1 animate-pulse rounded-[1.5rem] border-2 border-teal/40" aria-hidden="true" />
      )}
    </div>
  )
}
