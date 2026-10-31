import { Volume2, VolumeX, X, ChevronLeft, ChevronRight, Lightbulb } from 'lucide-react'
import Button from '../ui/Button'
import Card from '../ui/Card'

export default function CoachPanel({
  enabled,
  step,
  totalSteps,
  maxReachedStep,
  current,
  hint,
  speechSupported,
  speaking,
  onSpeak,
  onStopSpeak,
  onPrevious,
  onNext,
  onExit,
  onDismissHint,
  onHelp,
}) {
  if (!enabled || !current) return null

  return (
    <div className="space-y-3">
      <Card className="p-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold tracking-[0.14em] text-teal uppercase">
              Ustaad · Step {step} of {totalSteps}
            </p>
            <h2 className="font-display mt-1 text-xl font-semibold text-forest sm:text-2xl">
              {current.titleEn}
            </h2>
            <p className="mt-0.5 text-sm font-medium text-forest-muted" lang="ur" dir="auto">
              {current.titleUr}
            </p>
          </div>
          <button
            type="button"
            onClick={onExit}
            className="touch-target inline-flex items-center justify-center rounded-xl text-forest-muted hover:text-forest"
            aria-label="Hide guided help"
          >
            <X className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <div className="space-y-2 rounded-2xl bg-sage/70 px-4 py-3">
          <p className="text-base leading-relaxed text-ink">{current.textEn}</p>
          <p className="text-base leading-relaxed text-forest" lang="ur" dir="auto">
            {current.textUr}
          </p>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button
            variant="secondary"
            onClick={onPrevious}
            disabled={step <= 1}
            className="px-4"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            Previous
          </Button>
          <Button
            variant="secondary"
            onClick={onNext}
            disabled={step >= maxReachedStep}
            className="px-4"
          >
            Next
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </Button>
          <Button variant="secondary" onClick={onHelp} className="px-4">
            <Lightbulb className="h-5 w-5" aria-hidden="true" />
            I need help
          </Button>
          {speechSupported && (
            <Button
              variant="ghost"
              onClick={() => (speaking ? onStopSpeak() : onSpeak(current.textEn, 'en-US'))}
              className="px-4"
            >
              {speaking ? (
                <VolumeX className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Volume2 className="h-5 w-5" aria-hidden="true" />
              )}
              {speaking ? 'Stop voice' : 'Hear English'}
            </Button>
          )}
          {speechSupported && (
            <Button
              variant="ghost"
              onClick={() => (speaking ? onStopSpeak() : onSpeak(current.textUr, 'ur-PK'))}
              className="px-4"
            >
              <Volume2 className="h-5 w-5" aria-hidden="true" />
              اردو سنیں
            </Button>
          )}
        </div>
        <p className="mt-3 text-sm text-forest-muted">
          Teal ring on the phone shows where to tap. Learn by doing inside the practice phone.
        </p>
      </Card>

      {hint && (
        <Card className="border-teal/20 bg-teal-soft/80 p-4" role="status" aria-live="polite">
          <p className="text-sm font-semibold text-forest">Gentle tip</p>
          <p className="mt-1 text-sm text-ink">{hint.en}</p>
          <p className="mt-1 text-sm text-forest" lang="ur" dir="auto">
            {hint.ur}
          </p>
          <button
            type="button"
            onClick={onDismissHint}
            className="touch-target mt-2 text-sm font-medium text-teal underline-offset-2 hover:underline"
          >
            Dismiss tip
          </button>
        </Card>
      )}
    </div>
  )
}
