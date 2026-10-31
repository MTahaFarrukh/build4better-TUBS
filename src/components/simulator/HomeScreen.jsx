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
      <div className="mb-8 pt-4 text-center">
        <p className="text-5xl font-light tracking-tight text-forest">10:10</p>
        <p className="mt-2 text-base text-forest-muted">A little practice, every day</p>
        <p className="mt-1 text-sm text-forest-muted" lang="ur" dir="rtl">ہر روز تھوڑی سی مشق</p>
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

      <button onClick={onGoHome} className="mt-auto rounded-3xl bg-white/60 py-4 text-sm text-forest-muted">Practice phone · مشق کا فون</button>
    </div>
  )
}
