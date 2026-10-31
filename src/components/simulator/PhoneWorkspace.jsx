import { AnimatePresence, motion } from 'framer-motion'
import { getContactById, getPhotoById } from '../../data/gallery'
import { APPS, PRACTICE_MODES } from '../../hooks/useSimulator'
import GalleryGrid from './GalleryGrid'
import HomeScreen from './HomeScreen'
import PhoneFrame from './PhoneFrame'
import PhotoPreview from './PhotoPreview'
import ShareSheet from './ShareSheet'
import SuccessScreen from './SuccessScreen'

export default function PhoneWorkspace({ simulator, hideInPhoneSuccess = false }) {
  const {
    state,
    openGallery,
    selectPhoto,
    openShare,
    selectRecipient,
    confirmShare,
    goBack,
    goHome,
    reset,
    wrongAction,
    isHighlighted,
  } = simulator

  const photo = getPhotoById(state.selectedPhotoId)
  const recipient = getContactById(state.selectedRecipientId)
  const showSuccess = state.app === APPS.success && !hideInPhoneSuccess

  const handleWrongApp = (label) => {
    if (state.mode === PRACTICE_MODES.independent) {
      wrongAction(null)
      return
    }

    if (state.guidedEnabled && state.guidedStep === 1) {
      wrongAction({
        en: `That was ${label}. For this lesson, open Gallery.`,
        ur: `یہ ${label} تھی۔ اس سبق کے لیے Gallery کھولیں۔`,
      })
      return
    }

    wrongAction({
      en: `${label} is only decorative in practice mode. Try Gallery for this lesson.`,
      ur: `مشق میں ${label} صرف دکھانے کے لیے ہے۔ اس سبق میں Gallery آزمائیں۔`,
    })
  }

  return (
    <PhoneFrame>
      <div className="relative min-h-0 flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={state.app === APPS.share ? APPS.preview : state.app}
            className="absolute inset-0"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.22 }}
          >
            {state.app === APPS.home && (
              <HomeScreen
                onOpenGallery={openGallery}
                onWrongApp={handleWrongApp}
                isHighlighted={isHighlighted}
              />
            )}

            {state.app === APPS.gallery && (
              <GalleryGrid
                onSelectPhoto={selectPhoto}
                onBack={goBack}
                isHighlighted={isHighlighted}
              />
            )}

            {(state.app === APPS.preview || state.app === APPS.share) && (
              <PhotoPreview
                photo={photo}
                onBack={goBack}
                onShare={openShare}
                isHighlighted={isHighlighted}
              />
            )}

            {showSuccess && (
              <SuccessScreen
                photo={photo}
                recipientName={recipient?.name ?? 'family'}
                onReset={() => reset(state.mode)}
                onBackHome={goHome}
              />
            )}

            {state.app === APPS.success && hideInPhoneSuccess && (
              <div className="flex h-full flex-col items-center justify-center bg-sage px-6 text-center">
                <p className="font-display text-2xl font-semibold text-forest">
                  Opening your results…
                </p>
                <p className="mt-2 text-sm text-forest-muted" lang="ur" dir="auto">
                  نتائج کھل رہے ہیں…
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <ShareSheet
          open={state.app === APPS.share}
          selectedRecipientId={state.selectedRecipientId}
          onSelectRecipient={selectRecipient}
          onConfirm={confirmShare}
          onClose={goBack}
          isHighlighted={isHighlighted}
          confirmError={state.confirmError}
        />
      </div>
    </PhoneFrame>
  )
}
