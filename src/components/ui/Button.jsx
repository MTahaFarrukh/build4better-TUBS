import { motion } from 'framer-motion'

const variants = {
  primary:
    'bg-teal text-ivory hover:bg-forest focus-visible:bg-forest shadow-soft',
  secondary:
    'bg-sage text-forest hover:bg-teal-soft focus-visible:bg-teal-soft',
  ghost:
    'bg-transparent text-forest hover:bg-sage/70 focus-visible:bg-sage/70',
}

export default function Button({
  children,
  variant = 'primary',
  className = '',
  type = 'button',
  ...props
}) {
  return (
    <motion.button
      type={type}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      className={`touch-target inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-base font-semibold transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  )
}
