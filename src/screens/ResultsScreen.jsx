import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Award, Check, Gamepad2, Heart, RotateCcw, Share2, Sparkles } from 'lucide-react'
import Language from '../components/journey/Language'
import ThemeToggle from '../components/journey/ThemeToggle'
import { useLanguage } from '../hooks/useLanguage'
import { useVoicePreference } from '../hooks/usePreference'
import { useSpeechCoach } from '../hooks/useSpeechCoach'

const LESSON_NAMES = {
  'share-family-photo': { en: 'sharing a family photo', ur: 'گھر والوں کو تصویر بھیجنا' },
  'whatsapp-voice-message': { en: 'sending a WhatsApp voice message', ur: 'واٹس ایپ پر آواز کا پیغام بھیجنا' },
  'scam-safety': { en: 'spotting fake messages', ur: 'جعلی پیغام پہچاننا' },
}

// Confidence is explained in plain words, not a score: judges and learners both need to trust it.
function confidenceLevel(result) {
  const hints = result?.assistanceCount ?? 0
  const wrong = result?.incorrectAttempts ?? 0
  const alone = result?.mode === 'independent'
  if (alone && hints === 0 && wrong === 0) return 3
  if (alone || (hints <= 1 && wrong <= 1)) return 2
  return 1
}

export default function ResultsScreen({ result, onPracticeAgain, onBackToDashboard }) {
  const { ur, t } = useLanguage()
  const { voice } = useVoicePreference()
  const { supported, speakLines } = useSpeechCoach()
  const [shared, setShared] = useState(false)
  const Arrow = ur ? ArrowLeft : ArrowRight
  const n = (v) => ur ? String(v).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]) : String(v)
  const level = confidenceLevel(result)
  const lessonName = LESSON_NAMES[result?.lessonId] || LESSON_NAMES['share-family-photo']
  const mastered = level === 3

  const headline = mastered
    ? t('You did it all by yourself.', 'آپ نے سب کچھ خود کر دکھایا۔')
    : level === 2
      ? t('You are nearly there.', 'آپ بس تھوڑا سا دور ہیں۔')
      : t('A good first step.', 'ایک اچھا پہلا قدم۔')
  const advice = mastered
    ? t('You are ready to do this on your real phone. Ustaad is proud of you.', 'اب آپ یہ کام اصلی فون پر کرنے کے لیے تیار ہیں۔ استاد کو آپ پر فخر ہے۔')
    : level === 2
      ? t('One more try on your own and this will feel natural.', 'ایک بار اور خود کوشش کریں، پھر یہ بالکل آسان لگے گا۔')
      : t('Practise once more with Ustaad. Every try makes it easier.', 'استاد کے ساتھ ایک بار اور مشق کریں۔ ہر کوشش اسے آسان بناتی ہے۔')

  useEffect(() => {
    if (!voice || !supported) return
    speakLines([headline, advice], ur ? 'ur-PK' : 'en-US')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Family Link: the learner shows their progress to the people who usually get the "I'm stuck" call.
  const shareText = ur
    ? `میں نے Digital Ustaad پر "${lessonName.ur}" سیکھ لیا${mastered ? ' — وہ بھی بالکل خود!' : '۔'} 🎉`
    : `I just practised ${lessonName.en} on Digital Ustaad${mastered ? ' — all by myself!' : '.'} 🎉`
  const share = async () => {
    try {
      if (navigator.share) await navigator.share({ title: 'Digital Ustaad', text: shareText })
      else window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank', 'noopener')
      setShared(true)
    } catch { /* user cancelled */ }
  }

  return (
    <main className="game-world results-game" dir={ur ? 'rtl' : 'ltr'}>
      <div className="aurora aurora-one" /><div className="aurora aurora-two" /><div className="game-grid" />
      <header className="game-nav">
        <span className="game-brand"><span className="brand-orbit"><Gamepad2 size={25} /></span><span><b>Digital Ustaad</b><small>{t('Practice complete', 'مشق مکمل')}</small></span></span>
        <div className="nav-stats"><ThemeToggle /><Language /></div>
      </header>

      <motion.section className="results-card" initial={{ opacity: 0, y: 20, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: .5 }}>
        <motion.div className={`results-medal ${mastered ? 'gold' : ''}`} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: .2, type: 'spring', stiffness: 200 }}>
          {mastered ? <Award size={44} /> : <Check size={44} />}
        </motion.div>
        <p className="eyebrow">{mastered ? t('LEARNED ON YOUR OWN', 'خود سیکھ لیا') : t('ONE STEP CLOSER', 'ایک قدم اور قریب')}</p>
        <h1>{headline}</h1>
        <p className="results-lead">{advice}</p>

        <div className="confidence-meter" aria-label={t('Confidence', 'اعتماد')}>
          <span>{t('Confidence', 'اعتماد')}</span>
          <div className="confidence-dots">{[1, 2, 3].map(i => <i key={i} className={i <= level ? 'on' : ''} />)}</div>
          <b>{level === 3 ? t('Ready for the real phone', 'اصلی فون کے لیے تیار') : level === 2 ? t('Growing', 'بڑھ رہا ہے') : t('Starting', 'شروعات')}</b>
        </div>

        <dl className="completion-facts">
          <div><dt>{t('Wrong taps', 'غلط لمس')}</dt><dd>{n(result?.incorrectAttempts ?? 0)}</dd></div>
          <div><dt>{t('Hints used', 'اشارے لیے')}</dt><dd>{n(result?.assistanceCount ?? 0)}</dd></div>
          <div><dt>{t('Practised', 'مشق')}</dt><dd>{result?.mode === 'guided' ? t('With Ustaad', 'استاد کے ساتھ') : t('On my own', 'خود')}</dd></div>
        </dl>

        <div className="results-actions">
          <button className="game-cta" onClick={onBackToDashboard}><span>{t('Back to my lessons', 'اپنے اسباق پر واپس')}</span><Arrow size={20} /></button>
          <button className="lab-action" onClick={onPracticeAgain}><RotateCcw size={18} />{t('Practise once more', 'ایک بار پھر مشق')}</button>
        </div>

        <button className={`family-share ${shared ? 'is-shared' : ''}`} onClick={share}>
          <span className="family-share-icon">{shared ? <Check size={22} /> : <Heart size={22} fill="currentColor" />}</span>
          <span>
            <b>{shared ? t('Shared with family!', 'گھر والوں کو بھیج دیا!') : t('Tell your family', 'گھر والوں کو بتائیں')}</b>
            <small>{t('Send your progress to your children on WhatsApp', 'اپنی کامیابی بچوں کو واٹس ایپ پر بھیجیں')}</small>
          </span>
          <Share2 size={20} />
        </button>
        <p className="results-note"><Sparkles size={14} /> {t('This result describes practice on this device only, not a real-world test.', 'یہ نتیجہ صرف اس فون پر مشق کا ہے، اصل زندگی کا امتحان نہیں۔')}</p>
      </motion.section>
    </main>
  )
}
