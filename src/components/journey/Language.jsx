import { useLocalStorage } from '../../hooks/useLocalStorage'
export default function Language() {
  const [language, setLanguage] = useLocalStorage('digital-ustaad:language', 'en')
  return <button className="journey-language" onClick={() => { setLanguage(language === 'en' ? 'ur' : 'en'); window.dispatchEvent(new Event('ustaad-language')) }}>{language === 'en' ? 'اردو' : 'English'}</button>
}
