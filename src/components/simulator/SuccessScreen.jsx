import { motion } from 'framer-motion'
import { CheckCircle2, RotateCcw } from 'lucide-react'
import Button from '../ui/Button'

export default function SuccessScreen({
  photo,
  recipientName,
  onReset,
  onBackHome,
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center bg-gradient-to-b from-sage to-ivory px-6 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
        className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-teal text-ivory shadow-soft"
      >
        <CheckCircle2 className="h-10 w-10" aria-hidden="true" />
      </motion.div>

      <p className="text-xs font-semibold tracking-[0.16em] text-teal uppercase">
        Practice complete
      </p>
      <h2 className="font-display mt-2 text-3xl font-semibold text-forest">
        Photo shared!
      </h2>
      <p className="mt-3 max-w-xs text-base leading-relaxed text-ink/80">
        In practice mode, you shared{' '}
        <span className="font-semibold text-forest">{photo?.caption ?? 'a photo'}</span>
        {' '}with{' '}
        <span className="font-semibold text-forest">{recipientName}</span>.
        No real message was sent.
      </p>
      <p className="mt-2 text-sm text-forest-muted" lang="ur" dir="auto">
        مشق مکمل — حقیقی پیغام نہیں گیا۔
      </p>

      {photo && (
        <img
          src={photo.src}
          alt=""
          className="mt-6 h-28 w-28 rounded-2xl object-cover shadow-soft"
        />
      )}

      <div className="mt-8 flex w-full flex-col gap-3">
        <Button onClick={onReset} className="w-full">
          <RotateCcw className="h-5 w-5" aria-hidden="true" />
          Practice again
        </Button>
        <Button variant="secondary" onClick={onBackHome} className="w-full">
          Back to home screen
        </Button>
      </div>
    </div>
  )
}
