export default function Card({ children, className = '', as: Tag = 'div', ...props }) {
  return (
    <Tag
      className={`rounded-[var(--radius-card)] border border-forest/8 bg-ivory/90 shadow-soft backdrop-blur-sm ${className}`}
      {...props}
    >
      {children}
    </Tag>
  )
}
