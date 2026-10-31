import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Phone, Volume2 } from 'lucide-react'
import { getChoiceLesson } from '../data/choiceLessons'
import { useLanguage } from '../hooks/useLanguage'
import Language from '../components/journey/Language'
import ThemeToggle from '../components/journey/ThemeToggle'
import VoiceToggle from '../components/journey/VoiceToggle'
import { useSpeechCoach } from '../hooks/useSpeechCoach'
import { useVoicePreference } from '../hooks/usePreference'
import ResultsScreen from './ResultsScreen'

export default function ChoiceLessonScreen({ lessonId, mode, onBack, onCompleted }) {
  const lesson = getChoiceLesson(lessonId)
  const { ur, t } = useLanguage()
  const [round, setRound] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [errors, setErrors] = useState(0)
  const [help, setHelp] = useState(0)
  const [safe, setSafe] = useState(false)
  const [calling, setCalling] = useState(false)
  const [done, setDone] = useState(false)
  const [summary, setSummary] = useState(null)
  const started = useRef(Date.now())
  const { supported, speak, speakLines, stop } = useSpeechCoach()
  const { voice } = useVoicePreference()
  const scene = lesson?.rounds[round]
  const text = scene ? (ur ? scene.ur : scene.text) : ''
  const lang = ur ? 'ur-PK' : 'en-US'
  const Arrow = ur ? ArrowLeft : ArrowRight
  const last = lesson ? round === lesson.rounds.length - 1 : true

  useEffect(() => {
    if (!voice || !supported || done || !scene) return
    speakLines([
      ur ? 'نیا پیغام۔' : 'New message.',
      text,
      ur ? 'آپ کیا کریں گے؟' : 'What will you do?',
    ], lang)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round, ur, voice, supported, lessonId])

  useEffect(() => {
    if (!voice || !supported || !feedback) return
    speak(feedback, lang)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedback])

  if (!lesson || !scene) {
    return (
      <main className="game-world journey">
        <button className="lab-action" onClick={onBack}><ArrowLeft size={20} />{t('Lessons', 'اسباق')}</button>
      </main>
    )
  }

  const act = (choice) => {
    if (safe) return
    if (choice.correct) {
      setSafe(true)
      setCalling(choice.id === 'saved')
      setFeedback(ur ? scene.successUr : scene.successEn)
      return
    }
    setErrors(errors + 1)
    setFeedback(ur ? choice.wrongUr : choice.wrongEn)
  }

  const next = () => {
    if (!last) {
      setRound(round + 1)
      setSafe(false)
      setCalling(false)
      setFeedback('')
      return
    }
    const result = {
      lessonId,
      mode,
      completed: true,
      incorrectAttempts: errors,
      assistanceCount: help,
      completedWithoutAssistance: mode === 'independent' && help === 0 && errors === 0,
      successfulActions: lesson.rounds.length,
      durationMs: Date.now() - started.current,
      completedSteps: lesson.rounds.map((_, index) => `round-${index + 1}`),
      finishedAt: new Date().toISOString(),
    }
    stop()
    onCompleted(result)
    setSummary(result)
    setDone(true)
  }

  const restart = () => {
    setRound(0)
    setFeedback('')
    setErrors(0)
    setHelp(0)
    setSafe(false)
    setCalling(false)
    setDone(false)
    setSummary(null)
    started.current = Date.now()
  }

  if (done && summary) {
    return <ResultsScreen result={summary} onPracticeAgain={restart} onBackToDashboard={onBack} />
  }

  const n = (value) => (ur ? String(value).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]) : String(value))

  return (
    <main className="game-world journey safety-mission" dir={ur ? 'rtl' : 'ltr'}>
      <div className="aurora aurora-one" /><div className="aurora aurora-three" /><div className="game-grid" />
      <header className="journey-header">
        <button className="lab-action" onClick={() => { stop(); onBack() }}><ArrowLeft size={20} />{t('Lessons', 'اسباق')}</button>
        <div className="toolbar-group"><ThemeToggle /><Language /></div>
      </header>
      <p className="eyebrow"><span className="sim-badge">{t('PRACTICE ONLY', 'صرف مشق')}</span> {t('These messages are fictional. No real links, payments or codes.', 'یہ پیغامات فرضی ہیں۔ کوئی اصلی لنک، ادائیگی یا کوڈ نہیں۔')}</p>
      <h1>{ur ? lesson.titleUr : lesson.titleEn}</h1>
      <div className="safety-layout">
        <section className="message-device">
          {calling ? (
            <div className="suspicious-message">
              <Phone size={28} />
              <p>{t('Calling Beta…', 'بیٹا کو کال ہو رہی ہے…')}</p>
              <small>{t('This is the number already saved in the practice phone. No real call is made.', 'یہ مشق والے فون میں پہلے سے محفوظ نمبر ہے۔ اصل کال نہیں ہوتی۔')}</small>
            </div>
          ) : (
            <>
              <div className="message-top">{ur ? scene.senderUr : scene.sender}<span>{t('Unknown sender', 'نامعلوم بھیجنے والا')}</span></div>
              <div className="suspicious-message">{text}<small>10:10 · {t('Fictional message', 'فرضی پیغام')}</small></div>
            </>
          )}
          <p className="message-caption">{t('Message', 'پیغام')} {n(round + 1)} / {n(lesson.rounds.length)}</p>
        </section>
        <section className="safety-decisions">
          <h2>{t('What will you do?', 'آپ کیا کریں گے؟')}</h2>
          {mode === 'guided' && <p className="context-hint">{ur ? lesson.ruleUr : lesson.ruleEn}</p>}
          <div className="decision-list">
            {scene.choices.map((choice) => (
              <button key={choice.id} disabled={safe} onClick={() => act(choice)}>
                {ur ? choice.ur : choice.en}
              </button>
            ))}
          </div>
          {feedback && <p className={`safety-feedback ${safe ? 'is-good' : ''}`} role="status">{feedback}</p>}
          <div className="mission-actions">
            {safe
              ? <button className="journey-primary" onClick={next}>{last ? t('Finish lesson', 'سبق مکمل کریں') : t('Next message', 'اگلا پیغام')} <Arrow size={18} /></button>
              : <button className="lab-action" onClick={() => { setHelp(help + 1); setFeedback(ur ? scene.clueUr : scene.clueEn) }}>{t('Help me spot the warning sign', 'خطرے کی نشانی بتائیں')}</button>}
            {supported && <button className="lab-action" onClick={() => speak(text, lang)}><Volume2 size={18} />{t('Read message aloud', 'پیغام سنائیں')}</button>}
            <VoiceToggle />
          </div>
        </section>
      </div>
    </main>
  )
}
