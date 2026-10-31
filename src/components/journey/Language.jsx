import { Languages } from 'lucide-react'
import { useLocalStorage } from '../../hooks/useLocalStorage'
export default function Language() {
  const [language, setLanguage] = useLocalStorage('digital-ustaad:language', 'en')
  const switchLanguage = () => {
    const next = language === 'en' ? 'ur' : 'en'
    setLanguage(next)
    document.documentElement.lang = next
    document.documentElement.dir = next === 'ur' ? 'rtl' : 'ltr'
    window.dispatchEvent(new Event('ustaad-language'))
  }
  return (
    <button
      className="journey-language"
      onClick={switchLanguage}
      aria-label={language === 'en' ? 'اردو میں تبدیل کریں' : 'Switch to English'}
    >
      <Languages size={18} />
      <span>{language === 'en' ? 'اردو' : 'English'}</span>
    </button>
  )
}
