import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, HelpCircle, RotateCcw, Volume2, Pause, Play } from 'lucide-react'
import PhoneWorkspace from '../components/simulator/PhoneWorkspace'
import { PRACTICE_MODES, usePracticePhone } from '../hooks/usePracticePhone'
import { useSpeechCoach } from '../hooks/useSpeechCoach'
import { useLocalStorage } from '../hooks/useLocalStorage'
import ResultsScreen from './ResultsScreen'

export default function PracticeLabScreen({ lessonId, mode = PRACTICE_MODES.guided, onBack, onCompleted, onIndependent }) {
  const phone = usePracticePhone(lessonId, mode)
  const { state, lesson } = phone
  const { supported, speaking, speak, stop } = useSpeechCoach()
  const [language, setLanguage] = useLocalStorage('digital-ustaad:language', 'en')
  const [minimized, setMinimized] = useState(false)
  const [paused, setPaused] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const completionSent = useRef(false)
  const ur = language === 'ur'
  const independent = mode === PRACTICE_MODES.independent
  const step = lesson?.steps.find(item => item.id === state.guidedStep)
  const completed = state.completedStepIds.length

  useEffect(() => {
    if (!state.resultSummary || completionSent.current) return
    completionSent.current = true
    onCompleted?.(state.resultSummary)
    stop()
  }, [state.resultSummary, onCompleted, stop])

  const reset = () => {
    stop()
    completionSent.current = false
    setShowResults(false)
    setPaused(false)
    phone.reset(mode, lessonId)
  }
  if (showResults && state.resultSummary) return <ResultsScreen result={state.resultSummary} mode={mode} onPracticeAgain={reset} onBackToDashboard={onBack} />

  const instruction = independent
    ? (ur ? lesson?.titleUr : lesson?.titleEn)
    : (ur ? step?.textUr : step?.textEn)
  return (
    <main className="practice-stage">
      <header className="practice-toolbar">
        <button onClick={() => { stop(); onBack() }} className="lab-action"><ArrowLeft size={20} />{ur ? 'واپس' : 'Lessons'}</button>
        <span className="font-semibold text-forest">Digital Ustaad</span>
        <button className="lab-action" onClick={() => { stop(); setLanguage(ur ? 'en' : 'ur') }} aria-label="Change instruction language">{ur ? 'English' : 'اردو'}</button>
      </header>
      <div className="practice-layout">
        <section className={`practice-context ${minimized ? 'coach-minimized' : ''}`} aria-label="Lesson instructions">
          <div className="flex items-center justify-between gap-2 text-sm text-forest-muted">
            <span>{independent ? (ur ? 'خود مشق کریں' : 'Try it yourself') : (ur ? 'قدم بہ قدم' : 'Step by step')}</span>
            <span>{Math.min(completed, lesson?.steps.length ?? 1)} / {lesson?.steps.length}</span>
          </div>
          <div className="lesson-progress" role="progressbar" aria-label="Lesson progress" aria-valuemin={0} aria-valuemax={lesson?.steps.length} aria-valuenow={Math.min(completed, lesson?.steps.length ?? 1)}>
            {lesson?.steps.map((item, i) => <span key={item.id} className={i < completed ? 'done' : ''} />)}
          </div>
          <button className="coach-toggle" onClick={() => setMinimized(!minimized)}>{minimized ? (ur ? 'استاد کی مدد کھولیں' : 'Open Ustaad coach') : (ur ? 'مدد سمیٹیں' : 'Minimize coach')}</button>
          <h1 className="mt-3 text-xl font-semibold leading-relaxed text-forest" lang={language} dir={ur ? 'rtl' : 'ltr'} aria-live="polite">{state.resultSummary ? (ur ? 'بہت خوب! مشق مکمل ہوئی۔' : 'Well done! You did it.') : instruction}</h1>
          <div className="mt-3 flex flex-wrap gap-2">
            {!state.resultSummary && <button className="lab-action" onClick={phone.showHelp}><HelpCircle size={19} />{ur ? 'مدد لیں' : 'Help me'}</button>}
            {supported && !state.resultSummary && <button className="lab-action" onClick={() => {
              if (speaking) { stop(); return }
              // Reading the task is not a hint; detailed help is always counted separately.
              speak(instruction, ur ? 'ur-PK' : 'en-US')
            }}><Volume2 size={19} />{speaking ? (ur ? 'روکیں' : 'Stop') : (ur ? 'سنیں' : 'Listen')}</button>}
            <button className="lab-action" onClick={reset} aria-label="Restart attempt"><RotateCcw size={18} />{ur ? 'دوبارہ' : 'Restart'}</button>
            {!state.resultSummary && <button className="lab-action" aria-label={paused ? 'Resume practice' : 'Pause practice'} onClick={() => { stop(); phone.cancelRecording(); setPaused(!paused) }}>{paused ? <Play size={18} /> : <Pause size={18} />}</button>}
          </div>
          {state.hint && <div className="context-hint mt-3" role="status" lang={language} dir={ur ? 'rtl' : 'ltr'}>
            <p>{ur ? state.hint.ur : state.hint.en}</p>
            <button className="lab-action mt-1" onClick={phone.clearHint}>{ur ? 'ٹھیک ہے' : 'Got it'}</button>
          </div>}
          {state.incorrectAttempts >= 2 && !state.hint && !state.resultSummary && <p className="mt-2 text-sm text-forest-muted">{ur ? 'جلدی نہیں۔ مدد کسی بھی وقت لے سکتے ہیں۔' : 'Take your time. Help is here whenever you need it.'}</p>}
          {state.resultSummary && !independent && <button className="lab-primary mt-4" onClick={onIndependent}>{ur ? 'اب خود کوشش کریں' : 'Now try it yourself'} →</button>}
          {state.resultSummary && <button className="lab-primary mt-4" onClick={() => setShowResults(true)}>{ur ? 'اپنی پیش رفت دیکھیں' : 'See my progress'} →</button>}
          <p className="practice-safety">{ur ? 'محفوظ مشق • کوئی اصلی پیغام یا ریکارڈنگ نہیں' : 'Safe practice • No real messages or audio recorded'}</p>
        </section>
        <section className="practice-device" aria-label="Interactive practice phone">
          <div inert={paused ? '' : undefined}><PhoneWorkspace phone={{ ...phone, reset, goHome: state.resultSummary ? reset : phone.goHome, goBack: state.resultSummary ? reset : phone.goBack }} /></div>
          {paused && <div className="pause-overlay"><p className="text-2xl font-semibold">{ur ? 'وقفہ' : 'Take a breath'}</p><button className="lab-primary mt-4" onClick={() => setPaused(false)}>{ur ? 'جاری رکھیں' : 'Resume practice'}</button></div>}
        </section>
      </div>
    </main>
  )
}
