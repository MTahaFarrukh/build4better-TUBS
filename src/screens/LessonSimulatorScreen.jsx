import { useEffect, useRef } from 'react'
import { ArrowLeft, RotateCcw } from 'lucide-react'
import AppShell from '../components/layout/AppShell'
import Button from '../components/ui/Button'
import GuidedOverlay from '../components/simulator/GuidedOverlay'
import PhoneWorkspace from '../components/simulator/PhoneWorkspace'
import PracticeBadge from '../components/simulator/PracticeBadge'
import { FLAGSHIP_LESSON } from '../data/lessons'
import { useSimulator } from '../hooks/useSimulator'

export default function LessonSimulatorScreen({
  onBack,
  startGuided = true,
  onLessonCompleted,
}) {
  const simulator = useSimulator(startGuided)
  const { state, reset, exitGuided, setGuidedStep, clearHint } = simulator
  const completionSent = useRef(false)

  useEffect(() => {
    if ((state.shareConfirmed || state.guidedComplete) && !completionSent.current) {
      completionSent.current = true
      onLessonCompleted?.()
    }
  }, [state.shareConfirmed, state.guidedComplete, onLessonCompleted])

  const handleReset = () => {
    completionSent.current = false
    reset(true)
  }

  const handleBackToDashboard = () => {
    onBack()
  }

  return (
    <AppShell onBrandClick={handleBackToDashboard}>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <button
            type="button"
            onClick={handleBackToDashboard}
            className="mb-4 inline-flex items-center gap-2 rounded-xl text-sm font-medium text-forest-muted transition-colors hover:text-forest"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to dashboard
          </button>

          <div className="mb-3 flex flex-wrap items-center gap-3">
            <PracticeBadge />
            <span className="rounded-full bg-sage px-3 py-1.5 text-xs font-semibold tracking-wide text-forest uppercase">
              {FLAGSHIP_LESSON.title}
            </span>
          </div>

          <h1 className="font-display text-3xl font-semibold tracking-tight text-forest sm:text-4xl">
            Practice on a safe phone
          </h1>
          <p className="mt-2 text-base leading-relaxed text-ink/80 sm:text-lg">
            Follow the guide, or explore freely. Nothing leaves this practice phone —
            no real photos, contacts, or messages.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={handleReset} className="px-4">
            <RotateCcw className="h-5 w-5" aria-hidden="true" />
            Reset lesson
          </Button>
          {!state.guidedEnabled && !state.guidedComplete && (
            <Button
              variant="ghost"
              onClick={() => reset(true)}
              className="px-4"
            >
              Restart guide
            </Button>
          )}
        </div>
      </div>

      <div className="grid flex-1 items-start gap-8 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="order-2 xl:order-1">
          <GuidedOverlay
            enabled={state.guidedEnabled}
            step={state.guidedStep}
            maxReachedStep={state.maxReachedStep}
            hint={state.hint}
            onPrevious={() => setGuidedStep(state.guidedStep - 1)}
            onNext={() => setGuidedStep(state.guidedStep + 1)}
            onExit={exitGuided}
            onDismissHint={clearHint}
          />

          {!state.guidedEnabled && state.hint && (
            <div
              className="mt-4 rounded-[var(--radius-card)] border border-teal/20 bg-teal-soft/80 p-4 shadow-soft"
              role="status"
              aria-live="polite"
            >
              <p className="text-sm font-semibold text-forest">Gentle hint</p>
              <p className="mt-1 text-sm text-ink">{state.hint.en}</p>
              <p className="mt-1 text-sm text-forest" lang="ur" dir="auto">
                {state.hint.ur}
              </p>
              <button
                type="button"
                onClick={clearHint}
                className="mt-3 text-sm font-medium text-teal underline-offset-2 hover:underline"
              >
                Dismiss
              </button>
            </div>
          )}

          {state.guidedComplete && (
            <div className="mt-4 rounded-[var(--radius-card)] bg-sage p-5 shadow-soft">
              <p className="font-display text-xl font-semibold text-forest">
                Well done
              </p>
              <p className="mt-2 text-base leading-relaxed text-ink/80">
                You practised sharing a family photo. Reset the lesson anytime, or return to the dashboard.
              </p>
              <p className="mt-1 text-sm text-forest-muted" lang="ur" dir="auto">
                بہت خوب — آپ نے تصویر شیئر کرنے کی مشق کر لی۔
              </p>
            </div>
          )}
        </div>

        <div className="order-1 xl:order-2">
          <PhoneWorkspace simulator={simulator} />
        </div>
      </div>
    </AppShell>
  )
}
