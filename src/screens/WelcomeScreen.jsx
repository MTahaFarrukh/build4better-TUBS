import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, Flame, Gamepad2, ShieldCheck, Sparkles, Star, Trophy, Volume2 } from 'lucide-react'
import Language from '../components/journey/Language'
import ThemeToggle from '../components/journey/ThemeToggle'
import { useLanguage } from '../hooks/useLanguage'
import { useSpeechCoach } from '../hooks/useSpeechCoach'
import { computeStreak } from '../hooks/usePreference'
import { totalPoints } from '../data/progress'

const MINI_STEPS = [
  { icon: '👆', en: 'Tap', ur: 'دبائیں' },
  { icon: '🎯', en: 'Practise', ur: 'مشق کریں' },
  { icon: '🏆', en: 'Learn it', ur: 'سیکھ لیں' },
]

const hasChosenLanguage = () => {
  try { return localStorage.getItem('digital-ustaad:language') !== null } catch { return true }
}

// First-run: a big, spoken language choice. A corner toggle is easy for seniors to miss.
function LanguageGate({ onChoose }) {
  const { supported, speak } = useSpeechCoach()
  const choose = (lang) => {
    try { localStorage.setItem('digital-ustaad:language', JSON.stringify(lang)) } catch { /* ignore */ }
    window.dispatchEvent(new Event('ustaad-language'))
    if (supported) speak(lang === 'ur' ? 'خوش آمدید۔ آئیے مل کر فون چلانا سیکھتے ہیں۔' : 'Welcome. Let us learn your phone together.', lang === 'ur' ? 'ur-PK' : 'en-US')
    onChoose()
  }
  return (
    <motion.div className="language-gate" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true" aria-label="Choose language / زبان چنیں">
      <div className="language-gate-card">
        <span className="brand-orbit large"><Gamepad2 size={34} /></span>
        <h1>Digital Ustaad</h1>
        <p>Choose your language<br /><span lang="ur" dir="rtl">اپنی زبان چنیں</span></p>
        <div className="language-gate-options">
          <button onClick={() => choose('ur')} lang="ur" dir="rtl"><b>اردو</b><small>اردو میں سیکھیں</small></button>
          <button onClick={() => choose('en')}><b>English</b><small>Learn in English</small></button>
        </div>
        {supported && <p className="language-gate-note"><Volume2 size={16} /> Ustaad will speak to you · استاد آپ سے بات کرے گا</p>}
      </div>
    </motion.div>
  )
}

const toUrduDigits = (value) => String(value).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d])

export default function WelcomeScreen({ onStart, progress, onHello }) {
  const { ur, t } = useLanguage()
  const points = totalPoints(progress || {})
  const streak = computeStreak(progress?.practiceDays || [])
  const n = (value) => (ur ? toUrduDigits(value) : String(value))
  const [questDone, setQuestDone] = useState(Boolean(progress?.helloBonus))
  const [gateOpen, setGateOpen] = useState(() => !hasChosenLanguage())
  const Arrow = ur ? ArrowLeft : ArrowRight

  return (
    <main className="game-world welcome-game" dir={ur ? 'rtl' : 'ltr'}>
      <AnimatePresence>{gateOpen && <LanguageGate onChoose={() => setGateOpen(false)} />}</AnimatePresence>
      <div className="aurora aurora-one" />
      <div className="aurora aurora-two" />
      <div className="game-grid" />

      <header className="game-nav">
        <button className="game-brand" type="button" aria-label="Digital Ustaad">
          <span className="brand-orbit"><Gamepad2 size={25} /></span>
          <span><b>Digital Ustaad</b><small>{t('Learn your phone, step by step', 'فون چلانا، قدم بہ قدم')}</small></span>
        </button>
        <div className="nav-stats"><ThemeToggle /><Language /></div>
      </header>

      <section className="welcome-hero">
        <motion.div
          className="welcome-copy"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .55 }}
        >
          <div className="live-pill"><Sparkles size={15} /> {t('A practice phone for parents and grandparents', 'والدین اور بزرگوں کے لیے مشق کا فون')}</div>
          <h1>
            {t('Learn your phone ', 'اپنا فون سیکھیں، ')}
            <span>{t('without fear.', 'بغیر کسی ڈر کے۔')}</span>
          </h1>
          <p className="hero-lead">
            {t(
              'Practise sending photos, voice messages and spotting fake messages on a safe practice phone. Ustaad shows you every step and speaks to you — nothing real is ever sent.',
              'محفوظ مشق کے فون پر تصویر بھیجنا، آواز کا پیغام بھیجنا اور جعلی پیغام پہچاننا سیکھیں۔ استاد ہر قدم دکھاتا اور بولتا ہے — کچھ بھی اصل میں نہیں بھیجا جاتا۔',
            )}
          </p>

          <div className="mini-steps">
            {MINI_STEPS.map((step, index) => (
              <div className="mini-step" key={step.en}>
                <span>{step.icon}</span>
                <div><small>{ur ? '۰' + '۱۲۳'[index] : '0' + (index + 1)}</small><b>{ur ? step.ur : step.en}</b></div>
              </div>
            ))}
          </div>

          <div className="hero-actions">
            <button className="game-cta" onClick={onStart}>
              <span>{t('Start learning', 'سیکھنا شروع کریں')}</span><Arrow size={20} />
            </button>
            <span className="safe-copy"><ShieldCheck size={17} /> {t('Mistakes are safe here. Try as many times as you like.', 'یہاں غلطی سے کچھ نہیں بگڑتا۔ جتنی بار چاہیں کوشش کریں۔')}</span>
          </div>
        </motion.div>

        <motion.div
          className="quest-showcase"
          initial={{ opacity: 0, scale: .92, rotate: 2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: .6, delay: .12 }}
        >
          <div className="floating-stat stat-xp"><Star size={16} fill="currentColor" /> {n(points)} {t('points so far', 'پوائنٹس اب تک')}</div>
          <div className="floating-stat stat-streak"><Flame size={17} fill="currentColor" /> {streak > 0 ? t(`${streak} days in a row`, `${n(streak)} دن لگاتار`) : t('No streak yet', 'ابھی سلسلہ نہیں')}</div>
          <div className="quest-card">
            <div className="quest-card-top">
              <span className="level-chip">{t('TRY IT', 'آزمائیں')}</span>
              <span className="heart-row" aria-hidden="true">♥ ♥ ♥</span>
            </div>
            <div className="mascot-wrap">
              <div className="mascot-glow" />
              <motion.div
                className="mascot"
                animate={questDone ? { y: [0, -12, 0], rotate: [0, -5, 5, 0] } : { y: [0, -7, 0] }}
                transition={{ duration: questDone ? .6 : 2.4, repeat: questDone ? 0 : Infinity }}
              >
                <span className="mascot-cap">★</span>
                <span className="mascot-face"><i>•</i><i>•</i><b>◡</b></span>
                <span className="mascot-body">DU</span>
              </motion.div>
            </div>
            <div className="quest-copy">
              <p>{t('YOUR FIRST TAP', 'آپ کا پہلا لمس')}</p>
              <h2>{questDone ? t('Well done! You earned 20 points', 'شاباش! آپ نے ۲۰ پوائنٹس کمائے') : t('Say hello to Ustaad', 'استاد کو سلام کریں')}</h2>
              <span>{questDone
                ? t('See? Nothing broke. That is how learning works here.', 'دیکھا؟ کچھ نہیں بگڑا۔ یہاں اسی طرح سیکھتے ہیں۔')
                : t('Tap the button below. It is only practice.', 'نیچے والا بٹن دبائیں۔ یہ صرف مشق ہے۔')}</span>
            </div>
            <button
              className={`power-button ${questDone ? 'is-complete' : ''}`}
              onClick={() => { setQuestDone(true); onHello?.() }}
              disabled={questDone}
            >
              <AnimatePresence mode="wait">
                <motion.span key={questDone ? 'done' : 'tap'} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {questDone ? <><Check size={20} /> {t('Done!', 'ہو گیا!')}</> : <><Sparkles size={19} /> {t('Tap here to say hello', 'سلام کرنے کے لیے یہاں دبائیں')}</>}
                </motion.span>
              </AnimatePresence>
            </button>
            <div className="quest-progress"><i className={questDone ? 'filled' : ''} /><i /><i /></div>
          </div>
          <div className="trophy-orb"><Trophy size={22} /></div>
        </motion.div>
      </section>

      <footer className="welcome-proof">
        <span>🛡️ {t('No real messages are sent', 'کوئی اصلی پیغام نہیں بھیجا جاتا')}</span>
        <span>🔊 {t('Ustaad speaks every step', 'استاد ہر قدم بول کر بتاتا ہے')}</span>
        <span>🌙 {t('Full Urdu and English', 'مکمل اردو اور انگریزی')}</span>
      </footer>
    </main>
  )
}
