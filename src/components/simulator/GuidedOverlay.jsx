import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Lightbulb, X } from 'lucide-react'
import { GUIDED_STEPS, TOTAL_GUIDED_STEPS } from '../../data/guidedSteps'
import Button from '../ui/Button'
import Card from '../ui/Card'

export default function GuidedOverlay({
  enabled,
  step,
  maxReachedStep,
  hint,
  onPrevious,
  onNext,
  onExit,
  onDismissHint,
}) {
  if (!enabled) return null

  const current = GUIDED_STEPS.find((item) => item.id === step) ?? GUIDED_STEPS[0]
  const canPrevious = step > 1
  const canNext = step < maxReachedStep && step < TOTAL_GUIDED_STEPS

  return (
    <div className="space-y-3">
      <Card className="p-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold tracking-[0.14em] text-teal uppercase">
              Guided step {step} of {TOTAL_GUIDED_STEPS}
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
            aria-label="Exit guided tutorial"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="space-y-2 rounded-2xl bg-sage/70 px-4 py-3">
          <p className="text-base leading-relaxed text-ink">{current.textEn}</p>
          <p className="text-base leading-relaxed text-forest" lang="ur" dir="auto">
            {current.textUr}
          </p>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={onPrevious}
              disabled={!canPrevious}
              className="px-4"
              aria-label="Previous guided step"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              Previous
            </Button>
            <Button
              variant="secondary"
              onClick={onNext}
              disabled={!canNext}
              className="px-4"
              aria-label="Next guided step"
            >
              Next
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </Button>
          </div>
          <p className="text-sm text-forest-muted">
            Tip: the teal ring shows where to tap.
          </p>
        </div>
      </Card>

      <AnimatePresence>
        {hint && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            role="status"
            aria-live="polite"
          >
            <Card className="border-teal/20 bg-teal-soft/80 p-4">
              <div className="flex items-start gap-3">
                <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-teal" aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-forest">Gentle hint</p>
                  <p className="mt-1 text-sm leading-relaxed text-ink">{hint.en}</p>
                  <p className="mt-1 text-sm leading-relaxed text-forest" lang="ur" dir="auto">
                    {hint.ur}
                  </p>
                  <p className="mt-2 text-xs text-forest-muted">
                    No worry — take your time. {current.hintEn}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onDismissHint}
                  className="rounded-lg p-1 text-forest-muted hover:text-forest"
                  aria-label="Dismiss hint"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
