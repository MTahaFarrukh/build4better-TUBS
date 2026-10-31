import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowLeft, ArrowRight, CheckCircle2, CircleHelp, ExternalLink, Gamepad2,
  Pause, Play, RotateCcw, ShieldCheck, Smartphone,
} from 'lucide-react'
import Language from '../components/journey/Language'
import ThemeToggle from '../components/journey/ThemeToggle'
import VoiceToggle from '../components/journey/VoiceToggle'
import { getFollowAlongLesson } from '../data/followAlong'
import { useLanguage } from '../hooks/useLanguage'
import { useVoicePreference } from '../hooks/usePreference'
import { useSpeechCoach } from '../hooks/useSpeechCoach'
import {
  checkWhatsAppApps,
  isNativeAndroid,
  openWhatsAppApp,
} from '../native/whatsappLauncher'

export default function FollowAlongScreen({ lessonId, onBack, onLessonCompleted }) {
  const lesson = useMemo(() => getFollowAlongLesson(lessonId), [lessonId])
  const { ur, t } = useLanguage()
  const { voice } = useVoicePreference()
  const { supported, speak, stop } = useSpeechCoach()
  const stepCardRef = useRef(null)
  const [stepIndex, setStepIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [launchStatus, setLaunchStatus] = useState(null)
  const [appAvailability, setAppAvailability] = useState(null)
  const [launching, setLaunching] = useState(false)
  const Arrow = ur ? ArrowLeft : ArrowRight
  const lang = ur ? 'ur-PK' : 'en-US'

  useEffect(() => {
    let active = true
    checkWhatsAppApps().then((status) => { if (active) setAppAvailability(status) })
    return () => { active = false }
  }, [])

  useEffect(() => {
    setShowHelp(false)
    setLaunchStatus(null)
  }, [stepIndex])

  const step = lesson?.steps[stepIndex]
  const spoken = paused
    ? (ur ? lesson?.pauseMessage.ur : lesson?.pauseMessage.en)
    : showHelp
      ? (ur ? step?.help.ur : step?.help.en)
      : (ur ? step?.instruction.ur : step?.instruction.en)

  useEffect(() => {
    if (!voice || !supported || completed || !spoken) return
    speak(spoken, lang)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIndex, paused, showHelp, voice, supported, ur, completed])

  if (!lesson) {
    return (
      <main className="game-world follow-game" dir={ur ? 'rtl' : 'ltr'}>
        <p className="follow-missing">{t('This real-phone lesson was not found.', 'یہ اصلی فون کا سبق نہیں ملا۔')}</p>
        <button className="game-cta" onClick={onBack}>{t('Back to lessons', 'اسباق پر واپس')}</button>
      </main>
    )
  }

  const totalSteps = lesson.steps.length
  const progressPercent = Math.round(((stepIndex + 1) / totalSteps) * 100)
  const isLastStep = stepIndex >= totalSteps - 1
  const canLaunch = step?.action === 'launch-whatsapp'
  const nativeAndroid = isNativeAndroid()
  const n = (v) => (ur ? String(v).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]) : String(v))

  const handleOpenWhatsApp = async () => {
    setLaunching(true)
    const result = await openWhatsAppApp()
    setLaunchStatus(result)
    setLaunching(false)
  }

  const handleDone = () => {
    stop()
    setCompleted(true)
    onLessonCompleted?.(lesson.id)
  }

  const goNext = () => setStepIndex((value) => Math.min(totalSteps - 1, value + 1))
  const goPrevious = () => setStepIndex((value) => Math.max(0, value - 1))

  return (
    <main className="game-world follow-game" dir={ur ? 'rtl' : 'ltr'}>
      <div className="aurora aurora-one" /><div className="aurora aurora-two" /><div className="game-grid" />
      <header className="game-nav dashboard-nav">
        <button className="game-brand" onClick={() => { stop(); onBack() }}>
          <span className="brand-orbit"><Gamepad2 size={25} /></span>
          <span><b>Digital Ustaad</b><small>{t('On your real phone', 'آپ کے اصلی فون پر')}</small></span>
        </button>
        <div className="nav-stats"><ThemeToggle /><Language /></div>
      </header>

      <div className="follow-wrap">
        <p className="eyebrow">
          <span className="real-badge">{t('REAL PHONE', 'اصلی فون')}</span>
          {t('Ustaad only guides. You tap. Nothing is read or sent by this app.', 'استاد صرف بتاتا ہے۔ دباتے آپ ہیں۔ یہ ایپ کچھ نہیں پڑھتی اور نہیں بھیجتی۔')}
        </p>
        <h1>{ur ? lesson.title.ur : lesson.title.en}</h1>
        <p className="follow-lead">{ur ? lesson.description.ur : lesson.description.en}</p>

        {completed ? (
          <section className="follow-card follow-done">
            <span className="results-medal gold"><CheckCircle2 size={44} /></span>
            <h2>{t('You marked this practice complete.', 'آپ نے اس مشق کو مکمل قرار دیا۔')}</h2>
            <p>{ur ? lesson.completionMessage.ur : lesson.completionMessage.en}</p>
            <div className="results-actions">
              <button className="game-cta" onClick={() => { stop(); onBack() }}>
                <span>{t('Back to my lessons', 'اپنے اسباق پر واپس')}</span><Arrow size={20} />
              </button>
              <button className="lab-action" onClick={() => { setCompleted(false); setStepIndex(0); setPaused(false); setShowHelp(false); setLaunchStatus(null) }}>
                <RotateCcw size={18} />{t('Practise this again', 'ایک بار پھر مشق')}
              </button>
            </div>
          </section>
        ) : (
          <>
            <section className="follow-card" ref={stepCardRef}>
              <div className="follow-progress-head">
                <b>{t('Step', 'قدم')} {n(stepIndex + 1)} {t('of', 'از')} {n(totalSteps)}</b>
                <span>{n(progressPercent)}%</span>
              </div>
              <div className="level-bar" role="progressbar" aria-valuemin={1} aria-valuemax={totalSteps} aria-valuenow={stepIndex + 1}>
                <i style={{ width: `${progressPercent}%` }} />
              </div>

              {paused ? (
                <div className="follow-pause">
                  <h2>{t('Paused. Take a breath.', 'وقفہ۔ آرام سے سانس لیں۔')}</h2>
                  <p>{ur ? lesson.pauseMessage.ur : lesson.pauseMessage.en}</p>
                  <button className="game-cta" onClick={() => setPaused(false)}><Play size={18} /><span>{t('Resume', 'جاری رکھیں')}</span></button>
                </div>
              ) : (
                <>
                  <h2>{ur ? step.title.ur : step.title.en}</h2>
                  <p className="follow-instruction">{ur ? step.instruction.ur : step.instruction.en}</p>

                  {canLaunch && (
                    <div className="follow-launch">
                      <p><Smartphone size={20} /> {nativeAndroid ? t('Open WhatsApp on this phone', 'اس فون پر واٹس ایپ کھولیں') : t('Open WhatsApp on your phone yourself', 'اپنے فون پر واٹس ایپ خود کھولیں')}</p>
                      {!nativeAndroid && (
                        <small>{t('This web version cannot open WhatsApp for you. Open it yourself, then come back and tap Continue.', 'یہ ویب ورژن واٹس ایپ خود نہیں کھول سکتا۔ خود کھولیں، پھر واپس آ کر آگے بڑھیں۔')}</small>
                      )}
                      {nativeAndroid && appAvailability && !appAvailability.whatsapp && !appAvailability.whatsappBusiness && (
                        <small>{t('WhatsApp does not appear to be installed. Install WhatsApp or WhatsApp Business, then try again.', 'واٹس ایپ نصب نہیں لگتی۔ واٹس ایپ یا واٹس ایپ بزنس انسٹال کر کے دوبارہ کوشش کریں۔')}</small>
                      )}
                      {nativeAndroid && (
                        <button className="game-cta" onClick={handleOpenWhatsApp} disabled={launching}>
                          <ExternalLink size={18} /><span>{launching ? t('Opening…', 'کھل رہا ہے…') : t('Open WhatsApp', 'واٹس ایپ کھولیں')}</span>
                        </button>
                      )}
                      {nativeAndroid && launchStatus && (
                        <small role="status">
                          {launchStatus.opened
                            ? t(`Opened ${launchStatus.app === 'com.whatsapp.w4b' ? 'WhatsApp Business' : 'WhatsApp'}. Continue the steps there, then return here.`, 'واٹس ایپ کھل گئی۔ وہاں قدم مکمل کر کے یہاں واپس آئیں۔')
                            : launchStatus.reason}
                        </small>
                      )}
                    </div>
                  )}

                  {showHelp && (
                    <div className="context-hint" role="region" aria-label={t('Help', 'مدد')}>
                      <p>{ur ? step.help.ur : step.help.en}</p>
                      <small>{ur ? lesson.helpIntro.ur : lesson.helpIntro.en}</small>
                    </div>
                  )}
                </>
              )}
            </section>

            {!paused && (
              <div className="follow-actions">
                <button className="lab-action" onClick={goPrevious} disabled={stepIndex === 0}>{t('Previous', 'پچھلا')}</button>
                {isLastStep
                  ? <button className="game-cta" onClick={handleDone}><CheckCircle2 size={20} /><span>{t('Done — I confirmed myself', 'مکمل — میں نے خود تصدیق کی')}</span></button>
                  : <button className="game-cta" onClick={goNext}><span>{t('Continue', 'آگے بڑھیں')}</span><Arrow size={18} /></button>}
                <button className="lab-action" onClick={() => { setShowHelp(false); stepCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }}><RotateCcw size={18} />{t('Repeat this step', 'یہ قدم دہرائیں')}</button>
                <button className="lab-action" onClick={() => setShowHelp((value) => !value)}><CircleHelp size={18} />{showHelp ? t('Hide help', 'مدد چھپائیں') : t('I need help', 'مدد چاہیے')}</button>
                <button className="lab-action" onClick={() => { stop(); setPaused(true) }}><Pause size={18} />{t('Pause', 'وقفہ')}</button>
                <VoiceToggle />
              </div>
            )}

            <section className="follow-safety">
              <h3><ShieldCheck size={20} /> {t('Safety reminders', 'حفاظتی یاد دہانی')}</h3>
              <ul>
                {lesson.safetyNotes.map((note) => (
                  <li key={note.en}>{ur ? note.ur : note.en}</li>
                ))}
              </ul>
            </section>
          </>
        )}
      </div>
    </main>
  )
}
