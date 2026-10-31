import { motion } from 'framer-motion'
import { ArrowRight, HeartHandshake, ShieldCheck } from 'lucide-react'
import AppShell from '../components/layout/AppShell'
import PhonePreview from '../components/brand/PhonePreview'
import Button from '../components/ui/Button'

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.12 * i, duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function WelcomeScreen({ onStart }) {
  return (
    <AppShell showBrand={false}>
      <section className="grid flex-1 items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
        <div className="order-2 lg:order-1">
          <motion.p
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mb-4 inline-flex items-center gap-2 rounded-full bg-sage px-4 py-2 text-sm font-medium text-forest"
          >
            <HeartHandshake className="h-4 w-4 text-teal" aria-hidden="true" />
            Built for Pakistani families
          </motion.p>

          <motion.h1
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="font-display max-w-xl text-5xl leading-[1.05] font-semibold tracking-tight text-forest sm:text-6xl lg:text-7xl"
          >
            Digital Ustaad
          </motion.h1>

          <motion.p
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-5 max-w-lg text-lg leading-relaxed text-ink/85 sm:text-xl"
          >
            A calm smartphone practice space for parents and grandparents —
            learn everyday tasks independently, one clear step at a time.
          </motion.p>

          <motion.div
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Button onClick={onStart} className="w-full sm:w-auto">
              Start learning
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Button>
            <p className="flex items-center gap-2 text-base text-forest-muted sm:pl-2">
              <ShieldCheck className="h-5 w-5 shrink-0 text-teal" aria-hidden="true" />
              No account needed. Practice stays on this device.
            </p>
          </motion.div>
        </div>

        <div className="order-1 lg:order-2">
          <PhonePreview />
        </div>
      </section>
    </AppShell>
  )
}
