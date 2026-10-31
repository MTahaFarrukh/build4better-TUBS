import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, HelpCircle, Pause, Play, RotateCcw } from 'lucide-react'
import AppShell from '../components/layout/AppShell'
import Button from '../components/ui/Button'
import CoachPanel from '../components/simulator/CoachPanel'
import PhoneWorkspace from '../components/simulator/PhoneWorkspace'
import PracticeBadge from '../components/simulator/PracticeBadge'
import { PRACTICE_MODES, SCREENS, usePracticePhone } from '../hooks/usePracticePhone'
import { useSpeechCoach } from '../hooks/useSpeechCoach'
import ResultsScreen from './ResultsScreen'

function tipForScreen(lesson, state) {
  if (!lesson) return null
  const steps = lesson.steps
  if (state.screen === SCREENS.home) return steps[0]
  if (state.screen === SCREENS.gallery) return steps[1]
  if (state.screen === SCREENS.preview) return steps[2]
  if (state.screen === SCREENS.share) {
    return state.selectedRecipientId ? steps[4] : steps[3]
  }
  if (state.screen === SCREENS.whatsappList) return steps[1]
  if (state.screen === SCREENS.whatsappChat) {
    return state.isRecording ? steps[3] : steps[2]
  }
  return steps[0]
}

export default function PracticeLabScreen({
  lessonId,
  mode = PRACTICE_MODES.guided,
  onBack,
  onCompleted,
}) {
  const phone = usePracticePhone(lessonId, mode)
  const { state, lesson, reset, exitGuided, setGuidedStep, clearHint } = phone
  const { supported, speaking, speak, stop } = useSpeechCoach()
  const completionSent = useRef(false)
  const [showResults, setShowResults] = useState(false)
  const [paused, setPaused] = useState(false)
  const isIndependent = mode === PRACTICE_MODES.independent
  const currentStep = lesson?.steps.find((step) => step.id === state.guidedStep)
  const contextTip = tipForScreen(lesson, state)

  useEffect(() => {
    if (!state.resultSummary || completionSent.current) return
    completionSent.current = true
    setShowResults(true)
    onCompleted?.(state.resultSummary)
  }, [state.resultSummary, onCompleted])

  const handleReset = () => {
    completionSent.current = false
    setShowResults(false)
    setPaused(false)
    stop()
    reset(mode, lessonId)
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
            className="touch-target mb-4 inline-flex items-center gap-2 rounded-xl px-2 text-base font-medium text-forest-muted hover:text-forest"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
            Back to dashboard
          </button>

          <div className="mb-3 flex flex-wrap items-center gap-3">
            <PracticeBadge />
            <span className="rounded-full bg-sage px-3 py-1.5 text-sm font-semibold text-forest">
              {isIndependent ? 'Independent practice' : 'Guided practice'}
            </span>
          </div>

          <h1 className="font-display text-3xl font-semibold tracking-tight text-forest sm:text-4xl">
            {lesson?.titleEn}
          </h1>
          <p className="mt-1 text-lg text-forest" lang="ur" dir="auto">
            {lesson?.titleUr}
          </p>
          <p className="mt-3 text-lg leading-relaxed text-ink/80">
            {lesson?.descriptionEn}
          </p>
          <p className="mt-2 text-base text-forest-muted">
            Learn by doing inside the practice phone. English and Urdu are shown together.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={handleReset} className="px-4">
            <RotateCcw className="h-5 w-5" aria-hidden="true" />
            Reset attempt
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              if (paused) {
                setPaused(false)
              } else {
                setPaused(true)
                stop()
              }
            }}
            className="px-4"
          >
            {paused ? <Play className="h-5 w-5" aria-hidden="true" /> : <Pause className="h-5 w-5" aria-hidden="true" />}
            {paused ? 'Resume' : 'Pause'}
          </Button>
        </div>
      </div>

      {paused ? (
        <div className="rounded-[var(--radius-card)] bg-sage p-6 shadow-soft">
          <p className="font-display text-2xl font-semibold text-forest">Paused</p>
          <p className="mt-2 text-lg text-ink/80">
            Take a break. Your practice phone is waiting. Tap Resume when ready.
          </p>
          <Button className="mt-4" onClick={() => setPaused(false)}>
            <Play className="h-5 w-5" aria-hidden="true" />
            Resume
          </Button>
        </div>
      ) : (
        <div
          className={`grid flex-1 items-start gap-8 ${
            !isIndependent && state.guidedEnabled
              ? 'xl:grid-cols-[minmax(0,1fr)_380px]'
              : ''
          }`}
        >
          {!isIndependent && (
            <div className="order-2 xl:order-1">
              <CoachPanel
                enabled={state.guidedEnabled}
                step={state.guidedStep}
                totalSteps={lesson?.steps.length ?? 1}
                maxReachedStep={state.maxReachedStep}
                current={currentStep}
                hint={state.hint}
                speechSupported={supported}
                speaking={speaking}
                onSpeak={speak}
                onStopSpeak={stop}
                onPrevious={() => setGuidedStep(state.guidedStep - 1)}
                onNext={() => setGuidedStep(state.guidedStep + 1)}
                onExit={exitGuided}
                onDismissHint={clearHint}
                onHelp={() => {
                  phone.showHelp()
                  if (currentStep) speak(currentStep.helpEn, 'en-US')
                }}
              />

              {!state.guidedEnabled && state.hint && (
                <div className="mt-4 rounded-[var(--radius-card)] bg-teal-soft/80 p-4 shadow-soft" role="status">
                  <p className="font-semibold text-forest">Gentle tip</p>
                  <p className="mt-1 text-ink">{state.hint.en}</p>
                  <p className="mt-1 text-forest" lang="ur" dir="auto">{state.hint.ur}</p>
                  <button type="button" className="mt-2 text-teal underline" onClick={clearHint}>
                    Dismiss
                  </button>
                </div>
              )}

              {!state.guidedEnabled && !state.resultSummary && (
                <Button className="mt-4" variant="secondary" onClick={() => reset(PRACTICE_MODES.guided, lessonId)}>
                  Restart guided help
                </Button>
              )}
            </div>
          )}

          <div className={!isIndependent ? 'order-1 xl:order-2' : ''}>
            <div className="mb-4 rounded-[var(--radius-card)] bg-sage/80 px-4 py-3 text-base text-forest shadow-soft">
              <p>Practice Mode — fictional contacts and photos only. Nothing leaves this practice phone.</p>
              <p className="mt-1" lang="ur" dir="auto">
                مشق موڈ — صرف فرضی رابطے اور تصاویر۔ حقیقی پیغام نہیں جاتا۔
              </p>
            </div>
            {isIndependent && (
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <Button
                  variant="secondary"
                  className="px-4"
                  onClick={() => {
                    phone.showHelp()
                    if (contextTip) speak(contextTip.helpEn, 'en-US')
                  }}
                >
                  <HelpCircle className="h-5 w-5" aria-hidden="true" />
                  I need help
                </Button>
                {supported && (
                  <Button
                    variant="ghost"
                    className="px-4"
                    onClick={() => {
                      if (contextTip) {
                        speak(`${contextTip.textEn}. ${contextTip.helpEn}`, 'en-US')
                      }
                    }}
                  >
                    Hear a tip
                  </Button>
                )}
              </div>
            )}
            {isIndependent && state.hint && (
              <div className="mb-4 rounded-[var(--radius-card)] bg-teal-soft/80 p-4" role="status">
                <p className="font-semibold text-forest">Gentle tip</p>
                <p className="mt-1 text-base text-ink">{state.hint.en}</p>
                <p className="mt-1 text-base text-forest" lang="ur" dir="auto">
                  {state.hint.ur}
                </p>
                <button type="button" className="mt-2 text-teal underline" onClick={clearHint}>
                  Dismiss
                </button>
              </div>
            )}
            <PhoneWorkspace phone={phone} />
          </div>
        </div>
      )}
    </AppShell>
  )
}
