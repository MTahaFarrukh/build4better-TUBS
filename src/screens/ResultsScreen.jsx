import { motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, CheckCircle2, Clock3, RotateCcw, Sparkles } from 'lucide-react'
import AppShell from '../components/layout/AppShell'
import PracticeBadge from '../components/simulator/PracticeBadge'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { COMPLETED_STEPS, formatDuration } from '../data/progress'

function ConfettiBurst({ enabled }) {
  if (!enabled) return null

  const pieces = [
    { left: '12%', delay: 0, color: '#167D68' },
    { left: '28%', delay: 0.08, color: '#183B35' },
    { left: '46%', delay: 0.04, color: '#F3C15A' },
    { left: '64%', delay: 0.12, color: '#167D68' },
    { left: '80%', delay: 0.06, color: '#2A524A' },
  ]

  return (
    <div className="pointer-events-none absolute inset-x-0 top-8 h-24 overflow-hidden" aria-hidden="true">
      {pieces.map((piece) => (
        <motion.span
          key={piece.left}
          className="absolute top-0 h-2.5 w-2.5 rounded-sm"
          style={{ left: piece.left, backgroundColor: piece.color }}
          initial={{ y: -8, opacity: 0, rotate: 0 }}
          animate={{ y: 72, opacity: [0, 1, 0], rotate: 120 }}
          transition={{ duration: 1.4, delay: piece.delay, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}

export default function ResultsScreen({ result, onPracticeAgain, onBackToDashboard }) {
  const reduceMotion = useReducedMotion()
  const durationLabel = formatDuration(result?.durationMs)
  const incorrect = result?.incorrectAttempts ?? 0
  const successful = result?.successfulActions ?? 0

  const confidenceEn =
    incorrect === 0
      ? "You're getting more confident!"
      : incorrect <= 2
        ? 'Nice work — practice is making this easier.'
        : 'You finished it. Every try builds confidence.'

  const confidenceUr =
    incorrect === 0
      ? 'آپ زیادہ پراعتماد ہو رہے ہیں!'
      : incorrect <= 2
        ? 'اچھا کیا — مشق سے آسان ہوتا جا رہا ہے۔'
        : 'آپ نے مکمل کر لیا۔ ہر کوشش اعتماد بڑھاتی ہے۔'

  return (
    <AppShell onBrandClick={onBackToDashboard}>
      <div className="relative mx-auto w-full max-w-3xl">
        <ConfettiBurst enabled={!reduceMotion} />

        <button
          type="button"
          onClick={onBackToDashboard}
          className="mb-4 inline-flex items-center gap-2 rounded-xl text-sm font-medium text-forest-muted transition-colors hover:text-forest"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to dashboard
        </button>

        <div className="mb-5 flex flex-wrap items-center gap-3">
          <PracticeBadge />
          <span className="rounded-full bg-sage px-3 py-1.5 text-xs font-semibold tracking-wide text-forest uppercase">
            Independent practice result
          </span>
        </div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <Card className="overflow-hidden p-0">
            <div className="bg-gradient-to-br from-forest via-forest-muted to-teal px-6 py-8 text-ivory sm:px-8">
              <div className="flex items-start gap-4">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-ivory/15">
                  <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold tracking-[0.14em] text-ivory/80 uppercase">
                    Well done
                  </p>
                  <h1 className="font-display mt-2 text-3xl font-semibold sm:text-4xl">
                    Mashallah — you did it!
                  </h1>
                  <p className="mt-3 max-w-xl text-base leading-relaxed text-ivory/90 sm:text-lg">
                    You shared the photo successfully in practice!
                  </p>
                  <p className="mt-2 text-base text-ivory/80" lang="ur" dir="auto">
                    مشق میں تصویر کامیابی سے شیئر ہو گئی!
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6 p-6 sm:p-8">
              <div>
                <h2 className="font-display text-xl font-semibold text-forest">
                  What you completed
                </h2>
                <ul className="mt-4 space-y-3">
                  {COMPLETED_STEPS.map((step) => {
                    const done = result?.completedSteps?.includes(step.id)
                    return (
                      <li
                        key={step.id}
                        className="flex items-start gap-3 rounded-2xl bg-sage/70 px-4 py-3"
                      >
                        <CheckCircle2
                          className={`mt-0.5 h-5 w-5 shrink-0 ${done ? 'text-teal' : 'text-forest-muted'}`}
                          aria-hidden="true"
                        />
                        <div>
                          <p className="font-medium text-forest">{step.labelEn}</p>
                          <p className="text-sm text-forest-muted" lang="ur" dir="auto">
                            {step.labelUr}
                          </p>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-ivory px-4 py-4 shadow-soft ring-1 ring-forest/5">
                  <p className="text-xs font-semibold tracking-wide text-forest-muted uppercase">
                    Successful taps
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-forest">{successful}</p>
                </div>
                <div className="rounded-2xl bg-ivory px-4 py-4 shadow-soft ring-1 ring-forest/5">
                  <p className="text-xs font-semibold tracking-wide text-forest-muted uppercase">
                    Extra tries
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-forest">{incorrect}</p>
                  <p className="mt-1 text-sm text-forest-muted">
                    {incorrect === 0 ? 'No mistaken taps' : 'Normal while learning'}
                  </p>
                </div>
                <div className="rounded-2xl bg-ivory px-4 py-4 shadow-soft ring-1 ring-forest/5">
                  <p className="text-xs font-semibold tracking-wide text-forest-muted uppercase">
                    Time taken
                  </p>
                  <p className="mt-2 flex items-center gap-2 text-2xl font-semibold text-forest">
                    <Clock3 className="h-5 w-5 text-teal" aria-hidden="true" />
                    {durationLabel ?? 'Not recorded'}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl bg-teal-soft/80 px-5 py-4">
                <p className="inline-flex items-center gap-2 text-base font-semibold text-forest">
                  <Sparkles className="h-5 w-5 text-teal" aria-hidden="true" />
                  {confidenceEn}
                </p>
                <p className="mt-1 text-base text-forest" lang="ur" dir="auto">
                  {confidenceUr}
                </p>
                {result?.completedWithoutAssistance && (
                  <p className="mt-3 text-sm text-forest-muted">
                    Completed without guided help — practice only, nothing was sent.
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button onClick={onPracticeAgain} className="w-full sm:w-auto">
                  <RotateCcw className="h-5 w-5" aria-hidden="true" />
                  Practise Again
                </Button>
                <Button
                  variant="secondary"
                  onClick={onBackToDashboard}
                  className="w-full sm:w-auto"
                >
                  Back to Dashboard
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </AppShell>
  )
}
