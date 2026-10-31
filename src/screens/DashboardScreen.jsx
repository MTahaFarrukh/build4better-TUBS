import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Clock3,
  Compass,
  ImagePlus,
  Lock,
  RotateCcw,
  Sparkles,
} from 'lucide-react'
import AppShell from '../components/layout/AppShell'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { COMING_SOON_LESSONS, FLAGSHIP_LESSON } from '../data/lessons'
import {
  formatDuration,
  getProgressLabel,
  getProgressPercent,
} from '../data/progress'

export default function DashboardScreen({
  onBack,
  progress,
  onStartGuided,
  onStartIndependent,
  onResetProgress,
}) {
  const progressPercent = getProgressPercent(progress)
  const progressLabel = getProgressLabel(progress)
  const latest = progress?.latestIndependentResult
  const latestDuration = formatDuration(latest?.durationMs)

  const handleResetProgress = () => {
    const confirmed = window.confirm(
      'Reset saved practice progress on this device? This does not affect Guided or Independent lesson content.',
    )
    if (confirmed) onResetProgress?.()
  }

  return (
    <AppShell onBrandClick={onBack}>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <button
            type="button"
            onClick={onBack}
            className="mb-4 inline-flex items-center gap-2 rounded-xl text-sm font-medium text-forest-muted transition-colors hover:text-forest"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to welcome
          </button>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-forest sm:text-4xl">
            Your learning space
          </h1>
          <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink/80 sm:text-lg">
            Learn with guidance first, then try Independent Practice on the same safe phone.
          </p>
          <p className="mt-1 text-base text-forest-muted" lang="ur" dir="auto">
            پہلے رہنمائی کے ساتھ سیکھیں، پھر خود مشق کریں۔
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.35fr_0.85fr]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <Card className="overflow-hidden p-0">
            <div className="grid md:grid-cols-[0.9fr_1.1fr]">
              <div className="relative min-h-[220px] bg-gradient-to-br from-forest via-forest-muted to-teal p-6 text-ivory md:min-h-full">
                <div className="absolute inset-0 opacity-30">
                  <div className="absolute top-8 left-8 h-24 w-24 rounded-3xl border border-ivory/30" />
                  <div className="absolute right-6 bottom-10 h-32 w-32 rounded-full border border-ivory/20" />
                </div>
                <div className="relative flex h-full flex-col justify-between gap-8">
                  <div>
                    <span className="inline-flex items-center gap-2 rounded-full bg-ivory/15 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.14em]">
                      <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                      Flagship lesson
                    </span>
                    <h2 className="font-display mt-5 text-3xl leading-tight font-semibold">
                      {FLAGSHIP_LESSON.title}
                    </h2>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-ivory/85">
                    <Clock3 className="h-4 w-4" aria-hidden="true" />
                    About {FLAGSHIP_LESSON.durationMinutes} minutes · {FLAGSHIP_LESSON.difficulty}
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between gap-6 p-6 sm:p-8">
                <div>
                  <p className="text-base leading-relaxed text-ink/85 sm:text-lg">
                    {FLAGSHIP_LESSON.description}
                  </p>

                  <ol className="mt-6 space-y-3">
                    {FLAGSHIP_LESSON.stepsPreview.map((step, index) => (
                      <li key={step} className="flex items-start gap-3 text-sm sm:text-base">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sage text-sm font-semibold text-forest">
                          {index + 1}
                        </span>
                        <span className="pt-1 text-ink/90">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="flex flex-col gap-3">
                  <Button onClick={onStartGuided} className="w-full sm:w-fit">
                    <ImagePlus className="h-5 w-5" aria-hidden="true" />
                    {progress.guidedCompleted ? 'Replay guided practice' : 'Start guided practice'}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={onStartIndependent}
                    className="w-full sm:w-fit"
                  >
                    <Compass className="h-5 w-5" aria-hidden="true" />
                    Independent Practice
                  </Button>
                  <p className="text-sm text-forest-muted">
                    Guided mode shows Urdu + English steps. Independent mode hides the guide so you can practise freely. Nothing real is sent.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.aside
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-4"
        >
          <Card className="p-6">
            <h2 className="font-display text-xl font-semibold text-forest">Your progress</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink/75">
              {progress.independentCompleted
                ? 'You completed Independent Practice. You can replay either mode anytime.'
                : progress.guidedCompleted
                  ? 'Guided practice is done. Try Independent Practice when you feel ready.'
                  : progress.shareFamilyPhotoStarted
                    ? 'You started the photo-sharing lesson. Continue whenever you like.'
                    : 'No lessons completed yet. Start with Guided Practice.'}
            </p>
            <div className="mt-5 h-3 overflow-hidden rounded-full bg-sage">
              <div
                className="h-full rounded-full bg-teal transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
                aria-hidden="true"
              />
            </div>
            <p className="mt-2 text-xs font-medium tracking-wide text-forest-muted uppercase">
              {progressPercent}% — {progressLabel}
            </p>

            <button
              type="button"
              onClick={handleResetProgress}
              className="mt-5 inline-flex items-center gap-2 rounded-xl text-sm font-medium text-forest-muted transition-colors hover:text-forest"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Reset saved progress
            </button>
          </Card>

          {latest?.completed && (
            <Card className="p-6">
              <h2 className="font-display text-xl font-semibold text-forest">
                Latest independent result
              </h2>
              <ul className="mt-4 space-y-2 text-sm text-ink/85">
                <li>Successful taps: {latest.successfulActions}</li>
                <li>Extra tries: {latest.incorrectAttempts}</li>
                <li>Time: {latestDuration ?? 'Not recorded'}</li>
                <li>
                  {latest.completedWithoutAssistance
                    ? 'Finished without guided help'
                    : 'Completed with assistance'}
                </li>
              </ul>
              <p className="mt-3 text-sm text-forest-muted" lang="ur" dir="auto">
                آخری خود مشق کا نتیجہ اسی آلے پر محفوظ ہے۔
              </p>
            </Card>
          )}

          <Card className="p-6">
            <h2 className="font-display text-xl font-semibold text-forest">Coming soon</h2>
            <ul className="mt-4 space-y-3">
              {COMING_SOON_LESSONS.map((lesson) => (
                <li
                  key={lesson.id}
                  className="flex items-start gap-3 rounded-2xl bg-sage/60 px-4 py-3"
                >
                  <Lock className="mt-0.5 h-4 w-4 shrink-0 text-forest-muted" aria-hidden="true" />
                  <div>
                    <p className="font-medium text-forest">{lesson.title}</p>
                    <p className="text-sm text-forest-muted">{lesson.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </motion.aside>
      </div>
    </AppShell>
  )
}
