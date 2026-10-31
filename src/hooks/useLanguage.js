import { useEffect, useState } from 'react'
export function useLanguage() {
  const read = () => { try { return JSON.parse(localStorage.getItem('digital-ustaad:language')) === 'ur' } catch { return false } }
  const [ur, setUr] = useState(read)
  useEffect(() => {
    const applyLanguage = () => {
      const isUrdu = read()
      setUr(isUrdu)
      document.documentElement.lang = isUrdu ? 'ur' : 'en'
      document.documentElement.dir = isUrdu ? 'rtl' : 'ltr'
    }
    const update = () => setTimeout(applyLanguage, 0)
    applyLanguage()
    window.addEventListener('ustaad-language', update)
    return () => window.removeEventListener('ustaad-language', update)
  }, [])
  return { ur, t: (en, urdu) => ur ? urdu : en }
}
