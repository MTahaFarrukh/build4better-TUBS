import { Volume2, VolumeX } from 'lucide-react'
import { useLanguage } from '../../hooks/useLanguage'
import { useVoicePreference } from '../../hooks/usePreference'
import { useSpeechCoach } from '../../hooks/useSpeechCoach'

// Ustaad reads every instruction aloud when on. Seniors often prefer hearing to reading.
export default function VoiceToggle({ className = 'lab-action' }) {
  const { voice, toggle } = useVoicePreference()
  const { supported, stop } = useSpeechCoach()
  const { t } = useLanguage()
  if (!supported) return null
  return (
    <button
      className={`${className} voice-toggle ${voice ? 'is-on' : ''}`}
      onClick={() => { if (voice) stop(); toggle() }}
      aria-pressed={voice}
    >
      {voice ? <Volume2 size={19} /> : <VolumeX size={19} />}
      {voice ? t('Ustaad voice: on', 'استاد کی آواز: آن') : t('Ustaad voice: off', 'استاد کی آواز: بند')}
    </button>
  )
}
