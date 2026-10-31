import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, RotateCcw } from 'lucide-react'
import AppShell from '../components/layout/AppShell'
import Button from '../components/ui/Button'
import GuidedOverlay from '../components/simulator/GuidedOverlay'
import PhoneWorkspace from '../components/simulator/PhoneWorkspace'
import PracticeBadge from '../components/simulator/PracticeBadge'
import { FLAGSHIP_LESSON } from '../data/lessons'
import { PRACTICE_MODES, useSimulator } from '../hooks/useSimulator'
import ResultsScreen from './ResultsScreen'

export default function LessonSimulatorScreen({
  onBack,
  mode = PRACTICE_MODES.guided,
  onGuidedCompleted,
  onIndependentCompleted,
}) {
  const simulator = useSimulator(mode)
  const { state, reset, exitGuided, setGuidedStep, clearHint } = simulator
  const completionSent = useRef(false)
  const [showResults, setShowResults] = useState(false)
  const isIndependent = mode === PRACTICE_MODES.independent

  useEffect(() => {
    if (!state.shareConfirmed || !state.resultSummary || completionSent.current) {
      return
    }

    completionSent.current = true
    setShowResults(true)

    if (isIndependent) {
      onIndependentCompleted?.(state.resultSummary)
      return
    }

    onGuidedCompleted?.(state.resultSummary)
  }, [
    state.shareConfirmed,
    state.resultSummary,
    isIndependent,
    onGuidedCompleted,
    onIndependentCompleted,
  ])

  const handleReset = () => {
    completionSent.current = false
    setShowResults(false)
    reset(mode)
  }

  if (showResults && state.resultSummary) {
    return (
      <ResultsScreen
        result={state.resultSummary}
        mode={mode}
        onPracticeAgain={handleReset}
        onBackToDashboard={onBack}
      />
    )
  }

  return (
    <AppShell onBrandClick={onBack}>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <button
            type="button"
            onClick={onBack}
            className="touch-target mb-4 inline-flex items-center gap-2 rounded-xl px-2 text-base font-medium text-forest-muted transition-colors hover:text-forest"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
            Back to dashboard
          </button>

          <div className="mb-3 flex flex-wrap items-center gap-3">
            <PracticeBadge />
            <span className="rounded-full bg-sage px-3 py-1.5 text-sm font-semibold text-forest">
              {isIndependent ? 'Independent practice' : 'Guided practice'}
            </span>
            <span className="rounded-full bg-teal-soft px-3 py-1.5 text-sm font-semibold text-forest">
              {FLAGSHIP_LESSON.title}
            </span>
          </div>

          <h1 className="font-display text-3xl font-semibold tracking-tight text-forest sm:text-4xl">
            {isIndependent ? 'Try it on your own' : 'Practice on a safe phone'}
          </h1>
          <p className="mt-2 text-lg leading-relaxed text-ink/80">
            {isIndependent
              ? 'Open Gallery, choose a photo, share it with a practice contact, then confirm. No step-by-step guide this time.'
              : 'Follow the simple steps. Nothing leaves this practice phone — no real photos, contacts, or messages.'}
          </p>
          <p className="mt-2 text-lg text-forest-muted" lang="ur" dir="auto">
            {isIndependent
              ? 'یہ محفوظ مشق ہے — حقیقی پیغام نہیں جائے گا۔'
              : 'یہ محفوظ مشق والا فون ہے — حقیقی تصویر، رابطہ یا پیغام استعمال نہیں ہوتے۔'}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={handleReset} className="px-4">
            <RotateCcw className="h-5 w-5" aria-hidden="true" />
            Reset this attempt
          </Button>
          {!isIndependent && !state.guidedEnabled && !state.guidedComplete && (
            <Button
              variant="ghost"
              onClick={() => {
                completionSent.current = false
                setShowResults(false)
                reset(PRACTICE_MODES.guided)
              }}
              className="px-4"
            >
              Restart guide
            </Button>
          )}
        </div>
      </div>

      <div
        className={`grid flex-1 items-start gap-8 ${
          isIndependent ? '' : 'xl:grid-cols-[minmax(0,1fr)_380px]'
        }`}
      >
        {!isIndependent && (
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
                <p className="text-base font-semibold text-forest">Gentle tip</p>
                <p className="mt-1 text-base text-ink">{state.hint.en}</p>
                <p className="mt-1 text-base text-forest" lang="ur" dir="auto">
                  {state.hint.ur}
                </p>
                <button
                  type="button"
                  onClick={clearHint}
                  className="touch-target mt-3 inline-flex items-center rounded-xl text-base font-medium text-teal underline-offset-2 hover:underline"
                >
                  Dismiss tip
                </button>
              </div>
            )}
          </div>
        )}

        <div className={isIndependent ? '' : 'order-1 xl:order-2'}>
          <div className="mb-4 rounded-[var(--radius-card)] bg-sage/80 px-4 py-3 text-base text-forest shadow-soft">
            <p>Safe practice only — nothing will actually be sent.</p>
            <p className="mt-1" lang="ur" dir="auto">
              محفوظ مشق — کچھ بھی واقعی نہیں بھیجا جائے گا۔
            </p>
          </div>
          <PhoneWorkspace
            simulator={simulator}
            hideInPhoneSuccess
          />
        </div>
      </div>
    </AppShell>
  )
}
