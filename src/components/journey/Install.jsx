import { useEffect, useState } from 'react'
export default function Install() {
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
  return <div>{update && <p role="status">An update is ready. Close all Ustaad windows and reopen when your practice is finished. · نئی تبدیلی کے لیے مشق کے بعد ایپ بند کر کے دوبارہ کھولیں۔</p>}<button className="journey-link" onClick={async () => { if (prompt) { await prompt.prompt(); setPrompt(null) } else setHelp(!help) }}>{installed ? 'Installed · انسٹال ہے' : 'Keep Ustaad on your phone · انسٹال کریں'}</button>{help && <p className="install-help">iPhone / iPad: Safari → Share → Add to Home Screen.<br/>Android: Chrome menu → Install app / Add to Home screen.<br/>Open once online to prepare offline practice. · پہلے ایک بار انٹرنیٹ کے ساتھ کھولیں۔</p>}</div>
}
