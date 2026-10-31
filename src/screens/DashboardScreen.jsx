import { motion } from 'framer-motion'
import {
  ArrowLeft, Award, BookOpen, Camera, Check, ChevronRight, Flame, Gamepad2,
  Link2, MessageSquare, Mic2, Phone, Play, RotateCcw, ShieldCheck, Sparkles, Star, Target,
  Trophy, Video, Wallet, Zap,
} from 'lucide-react'
import Language from '../components/journey/Language'
import ThemeToggle from '../components/journey/ThemeToggle'
import Install from '../components/journey/Install'
import { useLanguage } from '../hooks/useLanguage'
import { computeStreak, todayKey } from '../hooks/usePreference'
import { STAGE_SIZE, totalPoints } from '../data/progress'

const activities = [
  { id: 'share-family-photo', icon: Camera, color: 'cyan', title: 'Share a family photo', ur: 'گھر والوں کو تصویر بھیجیں', text: 'Open Gallery, pick a photo, share it with Ammi', textUr: 'گیلری کھولیں، تصویر چنیں، امی کو بھیجیں', points: 100, badge: 'Photo', badgeUr: 'تصویر' },
  { id: 'whatsapp-voice-message', icon: Mic2, color: 'violet', title: 'Send a voice message', ur: 'آواز کا پیغام بھیجیں', text: 'Hold the mic and send a WhatsApp voice note', textUr: 'مائیک دبا کر واٹس ایپ پر آواز بھیجیں', points: 120, badge: 'Voice', badgeUr: 'آواز' },
  { id: 'one-line-reply', icon: MessageSquare, color: 'green', title: 'Send a short reply', ur: 'مختصر جواب بھیجیں', text: 'Open Ammi’s chat and send “جی، ٹھیک ہے”', textUr: 'امی کی چیٹ کھول کر «جی، ٹھیک ہے» بھیجیں', points: 100, badge: 'Reply', badgeUr: 'جواب' },
  { id: 'video-call-home', icon: Video, color: 'blue', title: 'Make a video call', ur: 'ویڈیو کال کریں', text: 'Call Beti, see her face, then hang up', textUr: 'بیٹی کو کال کریں، چہرہ دیکھیں، پھر بند کریں', points: 120, badge: 'Call', badgeUr: 'کال' },
  { id: 'scam-safety', icon: ShieldCheck, color: 'orange', title: 'Spot a fake message', ur: 'جعلی پیغام پہچانیں', text: 'Learn to pause, check and stay safe', textUr: 'رکنا، جانچنا اور محفوظ رہنا سیکھیں', points: 150, badge: 'Safety', badgeUr: 'حفاظت' },
  { id: 'call-saved-number', icon: Phone, color: 'rose', title: 'Call the saved number', ur: 'محفوظ نمبر پر کال کریں', text: 'If a new number asks for money, call the saved one', textUr: 'نیا نمبر پیسے مانگے تو محفوظ نمبر پر کال کریں', points: 130, badge: 'Saved', badgeUr: 'محفوظ' },
  { id: 'spot-suspicious-link', icon: Link2, color: 'blue', title: 'Leave a suspicious link', ur: 'مشکوک لنک چھوڑ دیں', text: 'Do not open a link that arrives in a message', textUr: 'پیغام میں آیا لنک نہ کھولیں', points: 130, badge: 'Link', badgeUr: 'لنک' },
  { id: 'pay-bill-safely', icon: Wallet, color: 'green', title: 'Pay a bill safely', ur: 'محفوظ طریقے سے بل ادا کریں', text: 'Check the name and amount. Never share the PIN', textUr: 'نام اور رقم دیکھیں۔ پن کوڈ کسی کو نہ دیں', points: 140, badge: 'Bill', badgeUr: 'بل' },
]

const toUrduDigits = (value) => String(value).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d])

export default function DashboardScreen({ progress, onStartLesson, onBack, onResetProgress, onStartFollowAlong }) {
  const { ur, t } = useLanguage()
  const n = (value) => (ur ? toUrduDigits(value) : String(value))
  const mastered = progress.masteredIds || []
  const practised = progress.guidedCompletedIds || []
  const next = activities.find(a => !mastered.includes(a.id)) || activities[0]
  const points = totalPoints(progress)
  const stage = Math.max(1, Math.floor(points / STAGE_SIZE) + 1)
  const stageProgress = points % STAGE_SIZE
  const streak = computeStreak(progress.practiceDays || [])
  const practisedToday = (progress.dailyBonusDays || []).includes(todayKey())
  const pathPercent = Math.round((activities.reduce((sum, activity) => sum + (mastered.includes(activity.id) ? 1 : practised.includes(activity.id) ? 0.45 : 0), 0) / activities.length) * 100)
  const allMastered = mastered.length >= activities.length

  return (
    <main className="game-world dashboard-game" dir={ur ? 'rtl' : 'ltr'}>
      <div className="aurora aurora-one" /><div className="aurora aurora-three" /><div className="game-grid" />
      <header className="game-nav dashboard-nav">
        <button className="game-brand" onClick={onBack}>
          <span className="brand-orbit"><Gamepad2 size={25} /></span>
          <span><b>Digital Ustaad</b><small>{t('Your learning home', 'آپ کا سیکھنے کا گھر')}</small></span>
        </button>
        <div className="nav-stats">
          <span className="nav-stat fire" title={t('Days practised in a row', 'لگاتار مشق کے دن')}><Flame size={19} fill="currentColor" /><b>{n(streak)}</b><small>{t('day streak', 'دن لگاتار')}</small></span>
          <span className="nav-stat xp" title={t('Points earned', 'حاصل کردہ پوائنٹس')}><Star size={18} fill="currentColor" /><b>{n(points)}</b><small>{t('points', 'پوائنٹس')}</small></span>
          <ThemeToggle />
          <Language />
        </div>
      </header>

      <section className="dashboard-wrap">
        <div className="dashboard-main">
          <motion.section className="player-banner" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
            <div className="player-avatar"><span>DU</span><i>{n(stage)}</i></div>
            <div className="player-copy">
              <p>{t('WELCOME BACK', 'خوش آمدید')}</p>
              <h1>{allMastered
                ? t('You can do every lesson on your own!', 'آپ یہ سارے کام خود کر سکتے ہیں!')
                : t('Ready to learn something new today?', 'آج کچھ نیا سیکھنے کے لیے تیار ہیں؟')}</h1>
              <div className="level-bar" role="progressbar" aria-valuemin={0} aria-valuemax={STAGE_SIZE} aria-valuenow={stageProgress}><i style={{ width: `${Math.max(points ? 8 : 0, (stageProgress / STAGE_SIZE) * 100)}%` }} /></div>
              <small>{points
                ? t(`${STAGE_SIZE - stageProgress} points to Stage ${stage + 1}`, `مرحلہ ${n(stage + 1)} تک ${n(STAGE_SIZE - stageProgress)} پوائنٹس باقی`)
                : t('Finish a lesson to earn your first points.', 'پہلے پوائنٹس کے لیے ایک سبق مکمل کریں۔')}</small>
              <small className="points-basis">{t('With Ustaad: 40% of the lesson. Alone with no hints or mistakes: full points. First finished lesson each day: +50.', 'استاد کے ساتھ: سبق کے ۴۰٪۔ خود، بغیر اشارہ یا غلطی: پورے پوائنٹس۔ ہر دن کا پہلا مکمل سبق: ۵۰ اضافی۔')}</small>
            </div>
            <div className="level-medallion"><Trophy size={26} /><b>{t('STAGE', 'مرحلہ')} {n(stage)}</b></div>
          </motion.section>

          <section className="section-heading">
            <div><span><Sparkles size={14} /> {t('YOUR LEARNING PATH', 'آپ کا سیکھنے کا راستہ')}</span><h2>{t('Choose what to practise', 'کیا مشق کرنی ہے، چنیں')}</h2></div>
            <span className="mission-count">{n(mastered.length)}/{n(activities.length)} {t('learned', 'سیکھ لیے')}</span>
          </section>

          <section className="skill-path" aria-label={t('Lessons', 'اسباق')}>
            <div className="path-line"><i style={{ height: `${pathPercent}%` }} /></div>
            {activities.map((activity, index) => {
              const Icon = activity.icon
              const done = mastered.includes(activity.id)
              const guided = practised.includes(activity.id)
              const isNext = activity.id === next.id
              return (
                <motion.article
                  className={`skill-node ${activity.color} ${done ? 'completed' : ''} ${isNext ? 'active' : ''}`}
                  key={activity.id}
                  initial={{ opacity: 0, x: ur ? 18 : -18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: .08 * index }}
                >
                  <div className="node-orb">{done ? <Check size={27} /> : <Icon size={27} />}</div>
                  <div className="mission-card">
                    <div className="mission-card-copy">
                      <span className="mission-label">
                        {done ? t('LEARNED — WELL DONE', 'سیکھ لیا — شاباش') : guided ? t('PRACTISED WITH USTAAD · NOW TRY ALONE', 'استاد کے ساتھ مشق ہوئی · اب خود کریں') : `${t('LESSON', 'سبق')} ${n(index + 1)}`}
                      </span>
                      <h3>{ur ? activity.ur : activity.title}</h3>
                      <p>{ur ? activity.textUr : activity.text}</p>
                      <div className="mission-reward"><Star size={15} fill="currentColor" /> +{n(activity.points)} {t('points', 'پوائنٹس')} <span>•</span> {done ? t('Badge earned', 'بیج مل گیا') : t('Earn a badge', 'بیج حاصل کریں')}</div>
                    </div>
                    <div className="mission-card-actions">
                      <button className="mission-play" onClick={() => onStartLesson(activity.id, guided ? 'independent' : 'guided')}>
                        {done ? <RotateCcw size={18} /> : <Play size={18} fill="currentColor" />}
                        {done ? t('Practise again', 'دوبارہ مشق') : guided ? t('Try on my own', 'خود کوشش کریں') : t('Learn with Ustaad', 'استاد کے ساتھ سیکھیں')}
                      </button>
                      {!done && !guided && (
                        <button className="solo-button" onClick={() => onStartLesson(activity.id, 'independent')}>
                          <Zap size={17} />{t('Try alone', 'خود کریں')}
                        </button>
                      )}
                    </div>
                  </div>
                </motion.article>
              )
            })}
          </section>
        </div>

        <aside className="game-sidebar">
          <section className="daily-quest-card">
            <div className="side-title"><span><Target size={20} /> {t('Today’s goal', 'آج کا ہدف')}</span><b>+{n(50)} {t('pts', 'پوائنٹس')}</b></div>
            <div className="quest-icon">🎯</div>
            <h3>{t('Practise once today', 'آج ایک بار مشق کریں')}</h3>
            <p>{t('A few minutes a day builds real confidence.', 'روز چند منٹ کی مشق سے اصل اعتماد بنتا ہے۔')}</p>
            <div className="daily-progress"><i style={{ width: practisedToday ? '100%' : '12%' }} /></div>
            <small>{practisedToday ? t('Done — 50 points added today', 'مکمل — آج ۵۰ پوائنٹس ملے') : t('Finish one lesson to collect them', 'لینے کے لیے ایک سبق مکمل کریں')}</small>
          </section>

          <section className="badges-card">
            <div className="side-title"><span><Award size={20} /> {t('My badges', 'میرے بیج')}</span><small>{n(mastered.length)}/{n(activities.length)}</small></div>
            <div className="badge-grid">
              {activities.map((activity) => {
                const Icon = activity.icon
                const unlocked = mastered.includes(activity.id)
                return <div className={unlocked ? 'badge unlocked' : 'badge'} key={activity.id} title={ur ? activity.ur : activity.title}><Icon size={22} /><small>{ur ? activity.badgeUr : activity.badge}</small></div>
              })}
            </div>
          </section>

          <button className="real-world-card" onClick={onStartFollowAlong}>
            <span className="real-icon"><BookOpen size={23} /></span>
            <span><small>{t('ON YOUR REAL PHONE', 'اصلی فون پر')}</small><b>{t('Step-by-step WhatsApp guide', 'واٹس ایپ کی قدم بہ قدم رہنمائی')}</b></span>
            {ur ? <ArrowLeft size={20} /> : <ChevronRight size={20} />}
          </button>

          <section className="safety-card"><ShieldCheck size={22} /><span><b>{t('Safe practice', 'محفوظ مشق')}</b><small>{t('Nothing here is sent for real', 'یہاں کچھ بھی اصل میں نہیں بھیجا جاتا')}</small></span></section>
        </aside>
      </section>

      <footer className="game-footer">
        <Install />
        <button onClick={() => { if (confirm(t('Clear all progress on this device?', 'کیا اس فون سے تمام پیش رفت مٹا دیں؟'))) onResetProgress() }}><RotateCcw size={15} /> {t('Start over', 'نئے سرے سے شروع کریں')}</button>
        <span>{t('Made with care for digital independence', 'ڈیجیٹل خود مختاری کے لیے محبت سے بنایا گیا')}</span>
      </footer>
    </main>
  )
}
