import { useState, useRef } from 'react'
import { scamScenarios, evaluateSafety } from '../data/scamScenarios'
import { useLanguage } from '../hooks/useLanguage'
import Language from '../components/journey/Language'
import { useSpeechCoach } from '../hooks/useSpeechCoach'
export default function ScamScreen({ mode, onBack, onCompleted }) {
 const { ur, t } = useLanguage()
 const [round, setRound] = useState(0), [verified, setVerified] = useState(false), [feedback, setFeedback] = useState(''), [errors, setErrors] = useState(0), [help, setHelp] = useState(0), [done, setDone] = useState(false), [safe, setSafe] = useState(false)
 const started = useRef(Date.now())
 const { supported, speak } = useSpeechCoach()
 const s = scamScenarios[round]
 const text = ur ? s.ur : s.text
 const act = action => {
   const result = evaluateSafety(action, verified)
   if (result === 'verified') { setVerified(true); setFeedback(t('You checked through a trusted route. The request is not genuine. Now decide what to do with this message.', 'آپ نے معتبر ذریعے سے جانچ کی۔ درخواست اصلی نہیں۔ اب پیغام کے بارے میں فیصلہ کریں۔')) }
   else if (result === 'safe') { setSafe(true); setFeedback(ur ? s.whyUr : s.why) }
   else { setErrors(errors + 1); setFeedback(result === 'check-first' ? t('First check through a trusted route. Then decide.', 'پہلے معتبر ذریعے سے جانچیں۔ پھر فیصلہ کریں۔') : t('Nothing happened — this is practice. Pause and check before acting.', 'کچھ نہیں ہوا، یہ مشق ہے۔ عمل سے پہلے رکیں اور جانچیں۔')) }
 }
 const next = () => {
   if (round < 2) { setRound(round + 1); setVerified(false); setSafe(false); setFeedback(''); return }
   const result = { lessonId: 'scam-safety', mode, completed: true, incorrectAttempts: errors, assistanceCount: help, completedWithoutAssistance: mode === 'independent' && help === 0, successfulActions: 6, durationMs: Date.now() - started.current, completedSteps: ['pause', 'verify', 'report'], finishedAt: new Date().toISOString() }
   onCompleted(result); setDone(true)
 }
 return <main className="journey safety-mission" dir={ur ? 'rtl' : 'ltr'}><header className="journey-header"><button className="journey-link" onClick={onBack}>← {t('My journey', 'میرا سفر')}</button><Language/></header><p className="eyebrow">{t('SCAM SAFETY • SIMULATION ONLY', 'دھوکے سے حفاظت • صرف مشق')}</p><h1>{done ? t('A safer next step.', 'ایک محفوظ اگلا قدم۔') : round === 2 ? t('Your final challenge', 'آپ کا آخری چیلنج') : t('Pause before you act.', 'عمل سے پہلے رکیں۔')}</h1>
 {done ? <section className="safety-finish"><strong>✓</strong><h2>{t('You checked all three messages.', 'آپ نے تینوں پیغامات جانچے۔')}</h2><p>{t(`${errors} extra tries · ${help} hints used`, `${errors} اضافی کوششیں · ${help} مدد`)}</p><button className="journey-primary" onClick={onBack}>{t('Back to my journey', 'اپنے سفر پر واپس')} →</button></section> : <div className="safety-layout"><section className="message-device"><div className="message-top">{ur ? s.senderUr : s.sender}<span>{t('Unknown sender', 'نامعلوم بھیجنے والا')}</span></div><div className="suspicious-message">{text}<small>10:10 · {t('Fictional message', 'فرضی پیغام')}</small></div><p className="message-caption">{round + 1} / 3 · {t('No real links, payments or codes', 'کوئی اصلی لنک، ادائیگی یا کوڈ نہیں')}</p></section><section className="safety-decisions"><h2>{t('What will you do?', 'آپ کیا کریں گے؟')}</h2>{mode === 'guided' && round < 2 && <p>{t('Pause → verify through a trusted route → block the suspicious sender.', 'رکیں ← معتبر ذریعے سے جانچیں ← مشکوک بھیجنے والے کو بلاک کریں۔')}</p>}
 <div className="decision-list"><button disabled={safe} onClick={() => act('trust')}>{t('Follow the message’s request', 'پیغام کی درخواست پر عمل کریں')}</button><button disabled={safe} onClick={() => act('verify')}>{verified ? '✓ ' : ''}{t('Verify using a saved contact or official app', 'محفوظ رابطے یا اصل ایپ سے تصدیق کریں')}</button><button disabled={safe} onClick={() => act('report')}>{t('Block and report this sender', 'بھیجنے والے کو بلاک اور رپورٹ کریں')}</button></div>
 {feedback && <p className="safety-feedback" role="status">{feedback}</p>}<div className="mission-actions">{safe ? <button className="journey-primary" onClick={next}>{round === 2 ? t('Finish mission', 'مشق مکمل کریں') : t('Next message', 'اگلا پیغام')} →</button> : <button className="journey-link" onClick={() => { setHelp(help + 1); setFeedback(ur ? s.clueUr : s.clue) }}>{t('Help me spot the warning', 'خطرے کی نشانی بتائیں')}</button>}{supported && <button className="journey-link" onClick={() => speak(text, ur ? 'ur-PK' : 'en-US')}>{t('Read message aloud', 'پیغام سنائیں')}</button>}</div></section></div>}
 </main>
}
