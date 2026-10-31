import { ChevronLeft, Circle, Square } from 'lucide-react'
import StatusBar from './StatusBar'

export default function PhoneFrame({ children, footer, onBack, onHome }) {
  return (
    <div className="phone-frame">
      <div className="phone-display">
        <StatusBar />
        <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">{children}</div>
        {footer}
        <nav className="phone-navigation" aria-label="Practice phone navigation">
          <button onClick={onBack} aria-label="Android back"><ChevronLeft size={21} /></button>
          <button onClick={onHome} aria-label="Android home"><Circle size={18} /></button>
          <span aria-hidden="true"><Square size={16} /></span>
        </nav>
      </div>
    </div>
  )
}
