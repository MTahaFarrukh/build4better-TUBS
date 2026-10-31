import {
  Clock3,
  Image,
  MessageCircle,
  Phone,
  Settings,
} from 'lucide-react'
import { LESSON_IDS } from '../../data/interactiveLessons'
import GuideHighlight from './GuideHighlight'

export default function HomeScreen({
  lessonId,
  onOpenGallery,
  onOpenWhatsApp,
  onWrongApp,
  onGoHome,
  isHighlighted,
}) {
  const apps = [
    { id: 'phone', label: 'Phone', icon: Phone, role: 'decor' },
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      icon: MessageCircle,
      role: 'whatsapp',
      guideId: 'whatsapp-app',
    },
    {
      id: 'gallery',
      label: 'Gallery',
      icon: Image,
      role: 'gallery',
      guideId: 'gallery-app',
    },
    { id: 'clock', label: 'Clock', icon: Clock3, role: 'decor' },
    { id: 'settings', label: 'Settings', icon: Settings, role: 'decor' },
  ]

  const handleOpen = (app) => {
    if (app.role === 'gallery') {
      onOpenGallery()
      return
    }
    if (app.role === 'whatsapp') {
      onOpenWhatsApp()
      return
    }
    onWrongApp(app.label)
  }

  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-sage via-ivory to-teal-soft px-5 pt-6 pb-4">
      <div className="mb-8">
        <p className="text-xs font-semibold tracking-[0.16em] text-teal uppercase">Home</p>
        <h2 className="font-display mt-1 text-2xl font-semibold text-forest">Practice phone</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink/75">
          Safe Practice Mode — tap apps here to learn by doing. Nothing real is sent.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {apps.map((app) => {
          const Icon = app.icon
          const primary =
            (lessonId === LESSON_IDS.sharePhoto && app.role === 'gallery') ||
            (lessonId === LESSON_IDS.voiceMessage && app.role === 'whatsapp')
          const highlight = app.guideId ? isHighlighted(app.guideId) : false

          const button = (
            <button
              type="button"
              onClick={() => handleOpen(app)}
              className="flex flex-col items-center gap-2 rounded-2xl p-2 text-center focus-visible:outline-offset-4"
              aria-label={`Open ${app.label} practice app`}
            >
              <span
                className={`flex h-16 w-16 items-center justify-center rounded-[1.35rem] shadow-soft ${
                  primary || app.role !== 'decor'
                    ? app.role === 'whatsapp'
                      ? 'bg-[#25D366] text-ivory'
                      : 'bg-teal text-ivory'
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
        <span className="text-xs font-medium opacity-80" aria-hidden="true">
          Recents
        </span>
        <button
          type="button"
          onClick={onGoHome}
          className="rounded-full bg-ivory/15 px-4 py-2 text-sm font-semibold focus-visible:outline-offset-4"
          aria-label="Stay on practice home screen"
        >
          Home
        </button>
        <span className="text-xs font-medium opacity-80" aria-hidden="true">
          Back
        </span>
      </div>
    </div>
  )
}
