import { ShieldCheck } from 'lucide-react'

export default function PracticeBadge({ className = '' }) {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full bg-teal px-3 py-1.5 text-xs font-semibold tracking-wide text-ivory uppercase ${className}`}
      role="status"
    >
      <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
      Practice mode
    </div>
  )
}
