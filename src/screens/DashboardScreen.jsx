import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Compass,
  ImagePlus,
  Lock,
  Mic,
  RotateCcw,
  Smartphone,
} from 'lucide-react'
import AppShell from '../components/layout/AppShell'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { INTERACTIVE_LESSONS, LESSON_IDS } from '../data/interactiveLessons'
import { COMING_SOON_LESSONS } from '../data/lessons'
import {
  formatDuration,
  getProgressLabel,
  getProgressPercent,
} from '../data/progress'
import { PRACTICE_MODES } from '../hooks/usePracticePhone'

export default function DashboardScreen({
  onBack,
  progress,
  onStartLesson,
  onStartFollowAlong,
  onResetProgress,
}) {
  const progressPercent = getProgressPercent(progress)
  const progressLabel = getProgressLabel(progress)
  const latest = progress?.latestResult || progress?.latestIndependentResult
  const latestDuration = formatDuration(latest?.durationMs)

  const handleResetProgress = () => {
    const confirmed = window.confirm(
      'Clear the practice progress saved on this device?\n\nYou can still open every lesson afterwards.',
    )
    if (confirmed) onResetProgress?.()
  }

  const lessonMeta = [
    {
      ...INTERACTIVE_LESSONS.find((item) => item.id === LESSON_IDS.sharePhoto),
      icon: ImagePlus,
      accent: 'from-forest via-forest-muted to-teal',
    },
    {
      ...INTERACTIVE_LESSONS.find((item) => item.id === LESSON_IDS.voiceMessage),
      icon: Mic,
      accent: 'from-teal to-forest',
    },
  ]

  return (
    <AppShell onBrandClick={onBack}>
      <div className="mb-8">
        <button
          type="button"
          onClick={onBack}
          className="touch-target mb-4 inline-flex items-center gap-2 rounded-xl px-2 text-base font-medium text-forest-muted hover:text-forest"
        >
          <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          Back to welcome
        </button>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-forest sm:text-4xl">
          Your learning space
        </h1>
        <p className="mt-2 max-w-3xl text-lg leading-relaxed text-ink/80">
          Learn by doing on a safe practice phone. Complete Guided Practice, then try Independent Practice.
        </p>
        <p className="mt-1 text-lg text-forest-muted" lang="ur" dir="auto">
          محفوظ مشق والے فون پر خود کر کے سیکھیں — پہلے رہنمائی، پھر خود۔
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.35fr_0.85fr]">
        <div className="space-y-6">
          {lessonMeta.map((lesson) => {
            const Icon = lesson.icon
            const guidedDone = progress.guidedCompletedIds?.includes(lesson.id)
            const independentDone = progress.independentCompletedIds?.includes(lesson.id)

            return (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
              >
                <Card className="overflow-hidden p-0">
                  <div className="grid md:grid-cols-[0.85fr_1.15fr]">
                    <div className={`bg-gradient-to-br ${lesson.accent} p-6 text-ivory`}>
                      <Icon className="h-8 w-8" aria-hidden="true" />
                      <h2 className="font-display mt-5 text-3xl font-semibold leading-tight">
                        {lesson.titleEn}
                      </h2>
                      <p className="mt-2 text-lg text-ivory/90" lang="ur" dir="auto">
                        {lesson.titleUr}
                      </p>
                      <p className="mt-4 text-sm text-ivory/80">
                        About {lesson.durationMinutes} minutes · Practice Mode
                      </p>
                    </div>
                    <div className="flex flex-col justify-between gap-5 p-6 sm:p-8">
                      <p className="text-base leading-relaxed text-ink/85 sm:text-lg">
                        {lesson.descriptionEn}
                      </p>
                      <div className="flex flex-col gap-3">
                        <Button
                          onClick={() => onStartLesson(lesson.id, PRACTICE_MODES.guided)}
                          className="w-full sm:w-fit"
                        >
                          <ImagePlus className="h-5 w-5" aria-hidden="true" />
                          {guidedDone ? 'Replay guided practice' : 'Start guided practice'}
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() => onStartLesson(lesson.id, PRACTICE_MODES.independent)}
                          className="w-full sm:w-fit"
                        >
                          <Compass className="h-5 w-5" aria-hidden="true" />
                          {independentDone ? 'Replay independent practice' : 'Independent Practice'}
                        </Button>
                        <p className="text-sm text-forest-muted">
                          You perform every tap inside the practice phone. Nothing real is sent.
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          })}

          <Card className="overflow-hidden p-0">
            <div className="grid md:grid-cols-[0.85fr_1.15fr]">
              <div className="bg-forest p-6 text-ivory">
                <Smartphone className="h-7 w-7" aria-hidden="true" />
                <h2 className="font-display mt-4 text-2xl font-semibold">
                  Optional: real-phone checklist
                </h2>
              </div>
              <div className="flex flex-col justify-between gap-4 p-6">
                <p className="text-base text-ink/85">
                  A simple Follow-Along checklist if you also want reminders while using your real phone. The interactive lessons above are the main way to learn by doing.
                </p>
                <Button variant="secondary" onClick={onStartFollowAlong} className="w-full sm:w-fit">
                  Open Follow-Along checklist
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <aside className="space-y-4">
          <Card className="p-6">
            <h2 className="font-display text-xl font-semibold text-forest">Your progress</h2>
            <p className="mt-2 text-base text-ink/75">
              Guided lessons done: {progress.guidedCompletedIds?.length ?? 0} · Independent:{' '}
              {progress.independentCompletedIds?.length ?? 0}
            </p>
            <p className="mt-2 text-sm text-forest-muted">
              Progress tracks practice on this device — not real-world phone skill.
            </p>
            <div className="mt-5 h-3 overflow-hidden rounded-full bg-sage">
              <div
                className="h-full rounded-full bg-teal transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
                aria-hidden="true"
              />
            </div>
            <p className="mt-2 text-sm font-medium text-forest-muted">
              {progressPercent}% — {progressLabel}
            </p>
            <button
              type="button"
              onClick={handleResetProgress}
              className="touch-target mt-5 inline-flex items-center gap-2 rounded-xl px-2 text-base font-medium text-forest-muted hover:text-forest"
            >
              <RotateCcw className="h-5 w-5" aria-hidden="true" />
              Reset saved progress
            </button>
          </Card>

          {latest?.completed && (
            <Card className="p-6">
              <h2 className="font-display text-xl font-semibold text-forest">
                Latest practice attempt
              </h2>
              <ul className="mt-4 space-y-2 text-base text-ink/85">
                <li>Mode: {latest.mode}</li>
                <li>Helpful actions: {latest.successfulActions}</li>
                <li>Extra tries: {latest.incorrectAttempts}</li>
                <li>Time: {latestDuration ?? 'Not recorded'}</li>
              </ul>
            </Card>
          )}

          <Card className="p-6">
            <h2 className="font-display text-xl font-semibold text-forest">Coming soon</h2>
            <ul className="mt-4 space-y-3">
              {COMING_SOON_LESSONS.map((item) => (
                <li key={item.id} className="flex items-start gap-3 rounded-2xl bg-sage/60 px-4 py-3">
                  <Lock className="mt-0.5 h-4 w-4 shrink-0 text-forest-muted" aria-hidden="true" />
                  <div>
                    <p className="font-medium text-forest">{item.title}</p>
                    <p className="text-sm text-forest-muted">{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </aside>
      </div>
    </AppShell>
  )
}
