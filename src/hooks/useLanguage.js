import { useEffect, useState } from 'react'
export function useLanguage() {
  const read = () => { try { return JSON.parse(localStorage.getItem('digital-ustaad:language')) === 'ur' } catch { return false } }
  const [ur, setUr] = useState(read)
  useEffect(() => {
    const update = () => setTimeout(() => setUr(read()), 0)
    window.addEventListener('ustaad-language', update)
    return () => window.removeEventListener('ustaad-language', update)
  }, [])
  return { ur, t: (en, urdu) => ur ? urdu : en }
}
