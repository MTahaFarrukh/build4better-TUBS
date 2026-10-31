import { useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft,
  CheckCircle2,
  CircleHelp,
  ExternalLink,
  Pause,
  Play,
  RotateCcw,
  ShieldCheck,
  Smartphone,
  X,
} from 'lucide-react'
import AppShell from '../components/layout/AppShell'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import PracticeBadge from '../components/simulator/PracticeBadge'
import { getFollowAlongLesson } from '../data/followAlong'
import {
  checkWhatsAppApps,
  isNativeAndroid,
  openWhatsAppApp,
} from '../native/whatsappLauncher'

export default function FollowAlongScreen({
  lessonId,
  onBack,
  onLessonCompleted,
}) {
  const lesson = useMemo(() => getFollowAlongLesson(lessonId), [lessonId])
  const [stepIndex, setStepIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [launchStatus, setLaunchStatus] = useState(null)
  const [appAvailability, setAppAvailability] = useState(null)
  const [launching, setLaunching] = useState(false)

  useEffect(() => {
    let active = true
    checkWhatsAppApps().then((status) => {
      if (active) setAppAvailability(status)
    })
    return () => {
      active = false
    }
  }, [])

  if (!lesson) {
    return (
      <AppShell onBrandClick={onBack}>
        <p className="text-lg text-ink">This Follow-Along lesson was not found.</p>
        <Button className="mt-4" onClick={onBack}>
          Back to dashboard
        </Button>
      </AppShell>
    )
  }

  const totalSteps = lesson.steps.length
  const step = lesson.steps[stepIndex]
  const progressPercent = Math.round(((stepIndex + 1) / totalSteps) * 100)
  const isLastStep = stepIndex >= totalSteps - 1
  const canLaunch = step?.action === 'launch-whatsapp'

  const handleOpenWhatsApp = async () => {
    setLaunching(true)
    const result = await openWhatsAppApp()
    setLaunchStatus(result)
    setLaunching(false)
  }

  const handleDone = () => {
    setCompleted(true)
    onLessonCompleted?.(lesson.id)
  }

  const handleRepeat = () => {
    setShowHelp(false)
  }

  if (completed) {
    return (
      <AppShell onBrandClick={onBack}>
        <div className="mx-auto w-full max-w-3xl">
          <PracticeBadge />
          <Card className="mt-5 p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal text-ivory">
                <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
              </span>
              <div>
                <h1 className="font-display text-3xl font-semibold text-forest">
                  Practice marked complete
                </h1>
                <p className="mt-3 text-lg leading-relaxed text-ink/85">
                  {lesson.completionMessage.en}
                </p>
                <p className="mt-2 text-lg text-forest" lang="ur" dir="auto">
                  {lesson.completionMessage.ur}
                </p>
                <p className="mt-4 text-base text-forest-muted">
                  Ustaad guides you, but you control your phone. No message content was collected.
                </p>
              </div>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                onClick={() => {
                  setCompleted(false)
                  setStepIndex(0)
                  setPaused(false)
                  setShowHelp(false)
                  setLaunchStatus(null)
                }}
              >
                <RotateCcw className="h-5 w-5" aria-hidden="true" />
                Practise this lesson again
              </Button>
              <Button variant="secondary" onClick={onBack}>
                Back to Dashboard
              </Button>
            </div>
          </Card>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell onBrandClick={onBack}>
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
        <div>
          <button
            type="button"
            onClick={onBack}
            className="touch-target mb-4 inline-flex items-center gap-2 rounded-xl px-2 text-base font-medium text-forest-muted hover:text-forest"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
            Exit Follow-Along
          </button>

          <div className="mb-3 flex flex-wrap items-center gap-3">
            <PracticeBadge />
            <span className="rounded-full bg-sage px-3 py-1.5 text-sm font-semibold text-forest">
              Practise on My Phone
            </span>
          </div>

          <h1 className="font-display text-3xl font-semibold tracking-tight text-forest sm:text-4xl">
            {lesson.title.en}
          </h1>
          <p className="mt-2 text-lg text-forest" lang="ur" dir="auto">
            {lesson.title.ur}
          </p>
          <p className="mt-3 text-lg leading-relaxed text-ink/85">
            {lesson.description.en}
          </p>
          <p className="mt-1 text-lg text-forest-muted" lang="ur" dir="auto">
            {lesson.description.ur}
          </p>
        </div>

        <Card className="border-teal/20 bg-teal-soft/70 p-5">
          <p className="flex items-start gap-3 text-lg font-semibold text-forest">
            <ShieldCheck className="mt-1 h-6 w-6 shrink-0 text-teal" aria-hidden="true" />
            Ustaad guides you, but you control your phone.
          </p>
          <p className="mt-2 text-base text-forest" lang="ur" dir="auto">
            استاد رہنمائی کرتا ہے، فون آپ چلاتے ہیں۔
          </p>
        </Card>

        <Card className="p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-base font-semibold text-forest">
              Step {stepIndex + 1} of {totalSteps}
            </p>
            <p className="text-sm font-medium text-forest-muted">{progressPercent}%</p>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-sage" aria-hidden="true">
            <div
              className="h-full rounded-full bg-teal transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {paused ? (
            <div className="mt-6 rounded-2xl bg-sage/80 px-5 py-6">
              <p className="font-display text-2xl font-semibold text-forest">Paused</p>
              <p className="mt-2 text-lg text-ink/85">{lesson.pauseMessage.en}</p>
              <p className="mt-1 text-lg text-forest" lang="ur" dir="auto">
                {lesson.pauseMessage.ur}
              </p>
              <Button className="mt-5" onClick={() => setPaused(false)}>
                <Play className="h-5 w-5" aria-hidden="true" />
                Continue
              </Button>
            </div>
          ) : (
            <div className="mt-6">
              <h2 className="font-display text-2xl font-semibold text-forest sm:text-3xl">
                {step.title.en}
              </h2>
              <p className="mt-1 text-xl text-forest" lang="ur" dir="auto">
                {step.title.ur}
              </p>
              <p className="mt-4 text-lg leading-relaxed text-ink/90">
                {step.instruction.en}
              </p>
              <p className="mt-2 text-lg leading-relaxed text-forest" lang="ur" dir="auto">
                {step.instruction.ur}
              </p>

              {canLaunch && (
                <div className="mt-5 space-y-3 rounded-2xl bg-ivory px-4 py-4 shadow-soft ring-1 ring-forest/5">
                  <p className="flex items-center gap-2 text-base font-semibold text-forest">
                    <Smartphone className="h-5 w-5 text-teal" aria-hidden="true" />
                    {isNativeAndroid()
                      ? 'Open WhatsApp on this phone'
                      : 'Open WhatsApp yourself'}
                  </p>
                  {appAvailability && !appAvailability.native && (
                    <p className="text-base text-forest-muted">
                      Browser preview cannot launch WhatsApp. On your Android phone app, a button can open it for you. For now, open WhatsApp manually.
                    </p>
                  )}
                  {appAvailability?.native &&
                    !appAvailability.whatsapp &&
                    !appAvailability.whatsappBusiness && (
                      <p className="text-base text-forest-muted">
                        WhatsApp does not appear to be installed. Install WhatsApp or WhatsApp Business, then try again.
                      </p>
                    )}
                  <Button
                    onClick={handleOpenWhatsApp}
                    disabled={launching}
                    className="w-full sm:w-auto"
                  >
                    <ExternalLink className="h-5 w-5" aria-hidden="true" />
                    {launching ? 'Opening…' : 'Open WhatsApp'}
                  </Button>
                  {launchStatus && (
                    <p className="text-base text-forest-muted" role="status">
                      {launchStatus.opened
                        ? `Opened ${launchStatus.app === 'com.whatsapp.w4b' ? 'WhatsApp Business' : 'WhatsApp'}. Continue the steps there, then return here.`
                        : launchStatus.reason}
                    </p>
                  )}
                </div>
              )}

              {showHelp && (
                <div
                  className="mt-5 rounded-2xl bg-teal-soft/80 px-4 py-4"
                  role="region"
                  aria-label="Help"
                >
                  <p className="text-base font-semibold text-forest">I need help</p>
                  <p className="mt-2 text-base text-ink">{step.help.en}</p>
                  <p className="mt-1 text-base text-forest" lang="ur" dir="auto">
                    {step.help.ur}
                  </p>
                  <p className="mt-3 text-sm text-forest-muted">{lesson.helpIntro.en}</p>
                </div>
              )}
            </div>
          )}
        </Card>

        {!paused && (
          <div className="grid gap-3 sm:grid-cols-2">
            <Button
              variant="secondary"
              onClick={() => setStepIndex((value) => Math.max(0, value - 1))}
              disabled={stepIndex === 0}
            >
              Previous
            </Button>
            {isLastStep ? (
              <Button onClick={handleDone}>
                <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                Done — I confirmed myself
              </Button>
            ) : (
              <Button onClick={() => setStepIndex((value) => Math.min(totalSteps - 1, value + 1))}>
                Continue
              </Button>
            )}
            <Button variant="secondary" onClick={handleRepeat}>
              <RotateCcw className="h-5 w-5" aria-hidden="true" />
              Repeat this step
            </Button>
            <Button variant="secondary" onClick={() => setShowHelp((value) => !value)}>
              <CircleHelp className="h-5 w-5" aria-hidden="true" />
              {showHelp ? 'Hide help' : 'I need help'}
            </Button>
            <Button variant="ghost" onClick={() => setPaused(true)}>
              <Pause className="h-5 w-5" aria-hidden="true" />
              Pause
            </Button>
            <Button variant="ghost" onClick={onBack}>
              <X className="h-5 w-5" aria-hidden="true" />
              Exit
            </Button>
          </div>
        )}

        <Card className="p-5">
          <h2 className="font-display text-xl font-semibold text-forest">Safety reminders</h2>
          <ul className="mt-3 space-y-3">
            {lesson.safetyNotes.map((note) => (
              <li key={note.en} className="rounded-2xl bg-sage/70 px-4 py-3">
                <p className="text-base text-forest">{note.en}</p>
                <p className="mt-1 text-base text-forest-muted" lang="ur" dir="auto">
                  {note.ur}
                </p>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </AppShell>
  )
}
