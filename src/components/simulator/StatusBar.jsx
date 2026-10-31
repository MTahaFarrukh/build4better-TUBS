import { Battery, Signal, Wifi } from 'lucide-react'

export default function StatusBar() {
  return (
    <div
      className="relative flex items-center justify-between px-5 pt-3 pb-1 text-[11px] font-medium text-forest"
      aria-hidden="true"
    >
      <span>9:41</span>
      <div className="absolute left-1/2 h-5 w-24 -translate-x-1/2 rounded-full bg-forest" />
      <div className="flex items-center gap-1.5">
        <Signal className="h-3 w-3" />
        <Wifi className="h-3 w-3" />
        <Battery className="h-3.5 w-3.5" />
      </div>
    </div>
  )
}
