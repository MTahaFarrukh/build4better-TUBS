import {
  Clock3,
  Image,
  MessageCircle,
  Phone,
  Settings,
} from 'lucide-react'
import GuideHighlight from './GuideHighlight'

const APPS = [
  { id: 'phone', label: 'Phone', icon: Phone, actionable: false },
  { id: 'messages', label: 'Messages', icon: MessageCircle, actionable: false },
  { id: 'gallery', label: 'Gallery', icon: Image, actionable: true, guideId: 'gallery-app' },
  { id: 'clock', label: 'Clock', icon: Clock3, actionable: false },
  { id: 'settings', label: 'Settings', icon: Settings, actionable: false },
]

export default function HomeScreen({
  onOpenGallery,
  onWrongApp,
  isHighlighted,
}) {
  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-sage via-ivory to-teal-soft px-5 pt-6 pb-4">
      <div className="mb-8">
        <p className="text-xs font-semibold tracking-[0.16em] text-teal uppercase">Home</p>
        <h2 className="font-display mt-1 text-2xl font-semibold text-forest">Practice phone</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink/75">
          This is a safe practice screen. Real apps on your phone are not opened.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {APPS.map((app) => {
          const Icon = app.icon
          const highlight = app.guideId ? isHighlighted(app.guideId) : false

          const button = (
            <button
              type="button"
              onClick={() => {
                if (app.actionable) onOpenGallery()
                else onWrongApp(app.label)
              }}
              className="flex flex-col items-center gap-2 rounded-2xl p-2 text-center focus-visible:outline-offset-4"
              aria-label={
                app.actionable
                  ? 'Open Gallery practice app'
                  : `${app.label} practice icon (not needed for this lesson)`
              }
            >
              <span
                className={`flex h-16 w-16 items-center justify-center rounded-[1.35rem] shadow-soft ${
                  app.actionable
                    ? 'bg-teal text-ivory'
                    : 'bg-ivory text-forest'
                }`}
              >
                <Icon className="h-7 w-7" aria-hidden="true" />
              </span>
              <span className="text-sm font-medium text-forest">{app.label}</span>
            </button>
          )

          if (app.guideId) {
            return (
              <GuideHighlight key={app.id} active={highlight} className="rounded-[1.5rem]">
                {button}
              </GuideHighlight>
            )
          }

          return <div key={app.id}>{button}</div>
        })}
      </div>

      <div className="mt-auto flex items-center justify-around rounded-[1.5rem] bg-forest/90 px-3 py-3 text-ivory">
        <span className="text-xs font-medium opacity-80">Recents</span>
        <span className="rounded-full bg-ivory/15 px-4 py-2 text-sm font-semibold">Home</span>
        <span className="text-xs font-medium opacity-80">Back</span>
      </div>
    </div>
  )
}
