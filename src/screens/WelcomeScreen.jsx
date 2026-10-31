import { useState } from 'react'
import Language from '../components/journey/Language'
import Artwork from '../components/journey/Artwork'
import { useLanguage } from '../hooks/useLanguage'
export default function WelcomeScreen({ onStart }) {
  const { ur, t } = useLanguage()
  const [tapped, setTapped] = useState(false)
  return <main className="welcome journey" dir={ur ? 'rtl' : 'ltr'}>
    <header className="journey-header"><span className="wordmark">du<span>Digital Ustaad</span></span><Language /></header>
    <section className="welcome-content"><div><p className="eyebrow">{t('A little practice. A little more freedom.', 'تھوڑی مشق۔ زیادہ خود اعتمادی۔')}</p><h1>{t('Your phone.\nYour confidence.', 'آپ کا فون۔\nآپ کا اعتماد۔')}</h1><p className="intro">{t('Send a photo. Say hello. Stay safe. Learn by doing, at your own pace.', 'تصویر بھیجیں، بات کریں، محفوظ رہیں۔ اپنی رفتار سے خود کر کے سیکھیں۔')}</p><button className="journey-primary" onClick={onStart}>{t('Let’s begin', 'شروع کریں')} <span>→</span></button><p className="safety-note">{t('Nothing real is sent. Every mistake is a fresh start.', 'کوئی اصلی پیغام نہیں جاتا۔ غلطی ہو تو دوبارہ کوشش کریں۔')}</p></div>
    <div className="welcome-play"><Artwork /><span className="eyebrow">{t('TRY A LITTLE TAP', 'ایک بار دبائیں')}</span><button className={tapped ? 'tap-demo tapped' : 'tap-demo'} onClick={() => setTapped(!tapped)}>{tapped ? t('Perfect. You’ve got this! ✓', 'بہت خوب! آپ کر سکتے ہیں۔ ✓') : t('Tap to say hello', 'سلام کرنے کے لیے دبائیں')}</button><p aria-live="polite">{tapped ? t('That’s how learning works here.', 'یہاں اسی طرح کر کے سیکھیں گے۔') : t('No pressure. Just a practice tap.', 'آرام سے۔ یہ صرف مشق ہے۔')}</p></div></section>
    <footer className="welcome-footer">{t('Made for everyday independence', 'روزمرہ خود مختاری کے لیے')} <span>01 — 03</span></footer>
  </main>
}
