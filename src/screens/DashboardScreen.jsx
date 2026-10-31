import Language from '../components/journey/Language'
import Artwork from '../components/journey/Artwork'
import Install from '../components/journey/Install'
import { useLanguage } from '../hooks/useLanguage'
const activities = [
  { id: 'share-family-photo', kind: 'photo', title: 'A photo, a little closer', ur: 'تصویر سے اپنوں کے قریب', text: 'Share a family memory.', textUr: 'خاندان کی یادگار تصویر بھیجیں۔' },
  { id: 'whatsapp-voice-message', kind: 'voice', title: 'Let them hear you', ur: 'اپنی آواز پہنچائیں', text: 'Send a voice note to family.', textUr: 'خاندان کو وائس نوٹ بھیجیں۔' },
  { id: 'scam-safety', kind: 'safety', title: 'Pause. Check. Protect.', ur: 'رکیں۔ جانچیں۔ محفوظ رہیں۔', text: 'Practise spotting a suspicious message.', textUr: 'مشکوک پیغام پہچاننے کی مشق کریں۔' },
]
export default function DashboardScreen({ progress, onStartLesson, onBack, onResetProgress, onStartFollowAlong }) {
  const { ur, t } = useLanguage()
  const mastered = progress.masteredIds || []
  const next = activities.find(a => !mastered.includes(a.id)) || activities[0]
  return <main className="journey" dir={ur ? 'rtl' : 'ltr'}><header className="journey-header"><button className="wordmark" onClick={onBack}>du<span>Digital Ustaad</span></button><Language /></header>
    <section className="home-heading"><div><p className="eyebrow">{t('YOUR CONFIDENCE JOURNEY', 'آپ کے اعتماد کا سفر')}</p><h1>{t('Small steps.\nEveryday freedom.', 'چھوٹے قدم۔\nروزمرہ آزادی۔')}</h1></div><div className="journey-summary"><strong>{mastered.length}<small> / 3</small></strong><p>{t('skills demonstrated independently', 'مہارتیں خود مکمل کیں')}</p><button className="journey-primary" onClick={() => onStartLesson(next.id, progress.guidedCompletedIds.includes(next.id) ? 'independent' : 'guided')}>{t('Continue learning', 'سیکھنا جاری رکھیں')} →</button></div></section>
    <section className="activity-trail" aria-label={t('Learning activities', 'سیکھنے کی سرگرمیاں')}>
      {activities.map((a, i) => <article className={`mission mission-${a.kind}`} key={a.id}><div className="mission-number">0{i + 1}<span>{mastered.includes(a.id) ? '✓' : progress.guidedCompletedIds.includes(a.id) ? '◐' : '○'}</span></div><Artwork kind={a.kind}/><div className="mission-copy"><p className="eyebrow">{mastered.includes(a.id) ? t('INDEPENDENCE BADGE EARNED', 'خود مختاری کا نشان حاصل') : progress.guidedCompletedIds.includes(a.id) ? t('PRACTISED WITH GUIDANCE', 'رہنمائی کے ساتھ مشق مکمل') : t('YOUR NEXT POSSIBILITY', 'ایک نئی مہارت')}</p><h2>{ur ? a.ur : a.title}</h2><p>{ur ? a.textUr : a.text}</p><div className="mission-actions"><button className="journey-primary" onClick={() => onStartLesson(a.id, 'guided')}>{t('Learn with me', 'رہنمائی سے سیکھیں')} →</button><button className="journey-link" onClick={() => onStartLesson(a.id, 'independent')}>{t('Try on my own', 'خود کوشش کریں')}</button></div></div></article>)}
    </section><footer className="home-footer"><Install/><button className="journey-link" onClick={onStartFollowAlong}>{t('Real-phone checklist', 'اصلی فون کی چیک لسٹ')}</button><button className="journey-link" onClick={() => { if (confirm(t('Clear progress on this device?', 'اس آلے کی پیش رفت مٹائیں؟'))) onResetProgress() }}>{t('Reset progress', 'پیش رفت مٹائیں')}</button></footer>
  </main>
}
