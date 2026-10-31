import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, X } from 'lucide-react'
import { PRACTICE_CONTACTS } from '../../data/gallery'
import GuideHighlight from './GuideHighlight'

export default function ShareSheet({
  open,
  selectedRecipientId,
  onSelectRecipient,
  onConfirm,
  onClose,
  isHighlighted,
  confirmError = null,
}) {
  const dialogRef = useRef(null)
  useEffect(() => {
    if (!open) return undefined
    const previous = document.activeElement
    dialogRef.current?.querySelector('button[aria-label="Close share sheet"]')?.focus()
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'Tab') {
        const buttons = [...dialogRef.current.querySelectorAll('button')]
        const index = buttons.indexOf(document.activeElement)
        event.preventDefault()
        buttons[(index + (event.shiftKey ? -1 : 1) + buttons.length) % buttons.length]?.focus()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => { window.removeEventListener('keydown', onKeyDown); previous?.focus() }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="absolute inset-0 z-20 flex flex-col justify-end bg-forest/35"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="share-sheet-title"
        >
          <button
            type="button"
            className="flex-1 cursor-default"
            aria-label="Dismiss share sheet background"
            onClick={onClose}
          />

          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="max-h-full overflow-y-auto rounded-t-[1.75rem] bg-ivory px-5 pt-4 pb-6 shadow-lift"
          >
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-forest/20" aria-hidden="true" />

            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold tracking-[0.14em] text-teal uppercase">
                  Practice share sheet
                </p>
                <h3 id="share-sheet-title" className="font-display mt-1 text-2xl font-semibold text-forest">
                  Send to…
                </h3>
                <p className="mt-1 text-sm text-forest-muted">
                  Fictional contacts only. Nothing is sent.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="touch-target inline-flex items-center justify-center rounded-xl text-forest"
                aria-label="Close share sheet"
              >
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            <GuideHighlight active={isHighlighted('recipient-list')} className="rounded-3xl">
              <ul className="space-y-2" role="listbox" aria-label="Practice contacts">
                {PRACTICE_CONTACTS.map((contact) => {
                  const selected = selectedRecipientId === contact.id
                  return (
                    <li key={contact.id}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={selected}
                        onClick={() => onSelectRecipient(contact.id)}
                        className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-colors ${
                          selected
                            ? 'bg-teal text-ivory shadow-soft'
                            : 'bg-sage/80 text-forest hover:bg-teal-soft'
                        }`}
                      >
                        <span
                          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold text-ivory"
                          style={{ backgroundColor: selected ? '#0F2A25' : contact.color }}
                          aria-hidden="true"
                        >
                          {contact.initials}
                        </span>
                        <span className="flex-1 text-base font-semibold">{contact.name}</span>
                        {selected && <Check className="h-5 w-5" aria-hidden="true" />}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </GuideHighlight>

            {confirmError && (
              <div
                className="mt-4 rounded-2xl bg-teal-soft/90 px-4 py-3"
                role="status"
                aria-live="polite"
              >
                <p className="text-sm text-forest">{confirmError.en}</p>
                <p className="mt-1 text-sm text-forest" lang="ur" dir="auto">
                  {confirmError.ur}
                </p>
              </div>
            )}

            <div className="mt-5">
              <GuideHighlight active={isHighlighted('confirm-share')} className="rounded-2xl">
                <button
                  type="button"
                  onClick={onConfirm}
                  className={`touch-target flex w-full items-center justify-center rounded-2xl px-5 py-4 text-base font-semibold text-ivory ${
                    selectedRecipientId ? 'bg-forest' : 'bg-forest/45'
                  }`}
                  aria-label="Confirm share in practice mode"
                >
                  Confirm Share
                </button>
              </GuideHighlight>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
