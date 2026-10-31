import { useEffect, useState } from 'react'
import { Download } from 'lucide-react'
import { useLanguage } from '../../hooks/useLanguage'
export default function Install() {
  const { t } = useLanguage()
  const [update, setUpdate] = useState(false)
  const [prompt, setPrompt] = useState(null)
  const [help, setHelp] = useState(false)
  const [installed, setInstalled] = useState(false)
  useEffect(() => {
    setInstalled(window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true)
    const ready = () => setUpdate(true)
    window.addEventListener('ustaad-update-ready', ready)
    const capture = e => { e.preventDefault(); setPrompt(e) }
    const done = () => { setInstalled(true); setPrompt(null) }
    window.addEventListener('beforeinstallprompt', capture); window.addEventListener('appinstalled', done)
    return () => { window.removeEventListener('ustaad-update-ready', ready); window.removeEventListener('beforeinstallprompt', capture); window.removeEventListener('appinstalled', done) }
  }, [])
  return <div className="install-control">
    {update && <p role="status">{t('An update is ready. Reopen the app after practice.', 'نئی تبدیلی تیار ہے۔ مشق کے بعد ایپ دوبارہ کھولیں۔')}</p>}
    <button onClick={async () => { if (prompt) { await prompt.prompt(); setPrompt(null) } else setHelp(!help) }}>
      <Download size={15} />{installed ? t('App installed', 'ایپ انسٹال ہے') : t('Install app', 'ایپ انسٹال کریں')}
    </button>
    {help && <p className="install-help">{t('iPhone: Safari → Share → Add to Home Screen. Android: Chrome menu → Install app.', 'آئی فون: سفاری → شیئر → ہوم اسکرین میں شامل کریں۔ اینڈرائیڈ: کروم مینیو → ایپ انسٹال کریں۔')}</p>}
  </div>
}
