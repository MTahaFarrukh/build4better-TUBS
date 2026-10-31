import { motion } from 'framer-motion'
import { Image as ImageIcon, Share2 } from 'lucide-react'

export default function PhonePreview() {
  return (
    <div className="relative mx-auto w-full max-w-[280px] sm:max-w-[300px]">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-[2.25rem] border-[10px] border-forest bg-ivory shadow-lift"
        aria-hidden="true"
      >
        <div className="absolute inset-x-0 top-0 z-10 flex justify-center pt-3">
          <div className="h-5 w-24 rounded-full bg-forest/90" />
        </div>

        <div className="relative aspect-[9/17] bg-gradient-to-b from-sage via-ivory to-teal-soft p-5 pt-12">
          <div className="mb-4">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-teal">Gallery</p>
            <p className="font-display text-2xl font-semibold text-forest">Family album</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="aspect-square rounded-2xl bg-gradient-to-br from-teal/30 to-forest/20"
            />
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-forest/15 to-sage" />
            <div className="col-span-2 flex aspect-[2/1] items-center justify-center rounded-2xl border border-dashed border-teal/40 bg-ivory/70">
              <div className="flex flex-col items-center gap-2 text-teal">
                <ImageIcon className="h-8 w-8" />
                <span className="text-sm font-medium">Practice photo</span>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="absolute bottom-5 left-5 right-5 flex items-center justify-between rounded-2xl bg-forest px-4 py-3 text-ivory shadow-soft"
          >
            <span className="text-sm font-medium">Share this photo</span>
            <Share2 className="h-5 w-5" />
          </motion.div>
        </div>
      </motion.div>

      <div
        aria-hidden="true"
        className="absolute -bottom-6 left-1/2 h-10 w-3/4 -translate-x-1/2 rounded-full bg-forest/15 blur-2xl"
      />
    </div>
  )
}
