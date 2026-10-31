import { Eye, Sparkles } from 'lucide-react'
import { useLanguage } from '../../hooks/useLanguage'
import { useTheme } from '../../hooks/usePreference'

// "Easy mode" = light, high-contrast, larger text. Default "Glass" keeps the animated dark look.
export default function ThemeToggle() {
  const { easy, toggle } = useTheme()
  const { t } = useLanguage()
  return (
    <button
      className="journey-language theme-toggle"
      onClick={toggle}
      aria-pressed={easy}
      aria-label={easy ? t('Switch to dark glass look', 'گہرا انداز') : t('Switch to Easy mode: light, larger text', 'آسان انداز: روشن اور بڑا متن')}
    >
      {easy ? <Sparkles size={18} /> : <Eye size={18} />}
      <span>{easy ? t('Glass', 'گہرا') : t('Easy', 'آسان')}</span>
    </button>
  )
}
