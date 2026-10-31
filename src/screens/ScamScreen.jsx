import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Volume2 } from 'lucide-react'
import { scamScenarios, evaluateSafety } from '../data/scamScenarios'
import { useLanguage } from '../hooks/useLanguage'
import Language from '../components/journey/Language'
import ThemeToggle from '../components/journey/ThemeToggle'
import VoiceToggle from '../components/journey/VoiceToggle'
import { useSpeechCoach } from '../hooks/useSpeechCoach'
import { useVoicePreference } from '../hooks/usePreference'
import ResultsScreen from './ResultsScreen'

export default function ScamScreen({ mode, onBack, onCompleted }) {
  const { ur, t } = useLanguage()
  const [round, setRound] = useState(0), [verified, setVerified] = useState(false), [feedback, setFeedback] = useState(''), [errors, setErrors] = useState(0), [help, setHelp] = useState(0), [done, setDone] = useState(false), [safe, setSafe] = useState(false), [summary, setSummary] = useState(null)
  const started = useRef(Date.now())
  const { supported, speak, speakLines, stop } = useSpeechCoach()
  const { voice } = useVoicePreference()
  const s = scamScenarios[round]
  const text = ur ? s.ur : s.text
  const lang = ur ? 'ur-PK' : 'en-US'
  const Arrow = ur ? ArrowLeft : ArrowRight

  // Ustaad reads the suspicious message, then each piece of feedback.
  useEffect(() => {
    if (!voice || !supported || done) return
    speakLines([
      ur ? 'نیا پیغام۔' : 'New message.',
      text,
      ur ? 'آپ کیا کریں گے؟' : 'What will you do?',
    ], lang)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round, ur, voice, supported])
  useEffect(() => {
    if (!voice || !supported || !feedback) return
    speak(feedback, lang)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedback])

  const act = action => {
    const result = evaluateSafety(action, verified)
    if (result === 'verified') { setVerified(true); setFeedback(t('Good. You checked through a trusted route and the request is not genuine. Now decide what to do with this message.', 'شاباش۔ آپ نے معتبر ذریعے سے جانچا اور درخواست اصلی نہیں۔ اب فیصلہ کریں کہ اس پیغام کا کیا کرنا ہے۔')) }
    else if (result === 'safe') { setSafe(true); setFeedback(ur ? s.whyUr : s.why) }
    else { setErrors(errors + 1); setFeedback(result === 'check-first' ? t('Almost. First check through a trusted route, then block.', 'قریب ہیں۔ پہلے معتبر ذریعے سے جانچیں، پھر بلاک کریں۔') : t('Nothing happened — this is only practice. In real life this would be risky. Pause and check first.', 'کچھ نہیں ہوا — یہ صرف مشق ہے۔ اصل زندگی میں یہ خطرناک ہوتا۔ پہلے رکیں اور جانچیں۔')) }
  }
  const next = () => {
    if (round < 2) { setRound(round + 1); setVerified(false); setSafe(false); setFeedback(''); return }
    const result = { lessonId: 'scam-safety', mode, completed: true, incorrectAttempts: errors, assistanceCount: help, completedWithoutAssistance: mode === 'independent' && help === 0, successfulActions: 6, durationMs: Date.now() - started.current, completedSteps: ['pause', 'verify', 'report'], finishedAt: new Date().toISOString() }
    stop(); onCompleted(result); setSummary(result); setDone(true)
  }
  const n = (v) => ur ? String(v).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]) : String(v)

  if (done && summary) {
    return (
      <ResultsScreen
        result={summary}
        onPracticeAgain={() => { setRound(0); setVerified(false); setSafe(false); setFeedback(''); setErrors(0); setHelp(0); setDone(false); setSummary(null); started.current = Date.now() }}
        onBackToDashboard={onBack}
      />
    )
  }

  return (
    <main className="game-world journey safety-mission" dir={ur ? 'rtl' : 'ltr'}>
      <div className="aurora aurora-one" /><div className="aurora aurora-three" /><div className="game-grid" />
      <header className="journey-header">
        <button className="lab-action" onClick={() => { stop(); onBack() }}><ArrowLeft size={20} />{t('Lessons', 'اسباق')}</button>
        <div className="toolbar-group"><ThemeToggle /><Language /></div>
      </header>
      <p className="eyebrow"><span className="sim-badge">{t('PRACTICE ONLY', 'صرف مشق')}</span> {t('These messages are fictional. No real links, payments or codes.', 'یہ پیغامات فرضی ہیں۔ کوئی اصلی لنک، ادائیگی یا کوڈ نہیں۔')}</p>
      <h1>{round === 2 ? t('Last message. You know what to do.', 'آخری پیغام۔ آپ جانتے ہیں کیا کرنا ہے۔') : t('Pause before you act.', 'عمل سے پہلے رکیں۔')}</h1>
      <div className="safety-layout">
          <section className="message-device">
            <div className="message-top">{ur ? s.senderUr : s.sender}<span>{t('Unknown sender', 'نامعلوم بھیجنے والا')}</span></div>
            <div className="suspicious-message">{text}<small>10:10 · {t('Fictional message', 'فرضی پیغام')}</small></div>
            <p className="message-caption">{t('Message', 'پیغام')} {n(round + 1)} / {n(3)}</p>
          </section>
          <section className="safety-decisions">
            <h2>{t('What will you do?', 'آپ کیا کریں گے؟')}</h2>
            {mode === 'guided' && round < 2 && <p className="context-hint">{t('Ustaad’s rule: Pause → check through someone you trust → block the sender.', 'استاد کا اصول: رکیں ← کسی بھروسے والے سے جانچیں ← بھیجنے والے کو بلاک کریں۔')}</p>}
            <div className="decision-list">
              <button disabled={safe} onClick={() => act('trust')}>{t('Do what the message says', 'جو پیغام کہتا ہے وہ کریں')}</button>
              <button disabled={safe} onClick={() => act('verify')}>{verified ? '✓ ' : ''}{t('Check with a saved contact or the official app', 'محفوظ رابطے یا اصل ایپ سے جانچیں')}</button>
              <button disabled={safe} onClick={() => act('report')}>{t('Block and report this sender', 'بھیجنے والے کو بلاک اور رپورٹ کریں')}</button>
            </div>
            {feedback && <p className={`safety-feedback ${safe || verified ? 'is-good' : ''}`} role="status">{feedback}</p>}
            <div className="mission-actions">
              {safe
                ? <button className="journey-primary" onClick={next}>{round === 2 ? t('Finish lesson', 'سبق مکمل کریں') : t('Next message', 'اگلا پیغام')} <Arrow size={18} /></button>
                : <button className="lab-action" onClick={() => { setHelp(help + 1); setFeedback(ur ? s.clueUr : s.clue) }}>{t('Help me spot the warning sign', 'خطرے کی نشانی بتائیں')}</button>}
              {supported && <button className="lab-action" onClick={() => speak(text, lang)}><Volume2 size={18} />{t('Read message aloud', 'پیغام سنائیں')}</button>}
              <VoiceToggle />
            </div>
          </section>
        </div>
    </main>
  )
}
