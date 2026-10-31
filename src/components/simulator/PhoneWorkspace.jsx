import { AnimatePresence, motion } from 'framer-motion'
import { getContactById, getPhotoById } from '../../data/gallery'
import { APPS } from '../../hooks/useSimulator'
import GalleryGrid from './GalleryGrid'
import HomeScreen from './HomeScreen'
import PhoneFrame from './PhoneFrame'
import PhotoPreview from './PhotoPreview'
import ShareSheet from './ShareSheet'
import SuccessScreen from './SuccessScreen'

export default function PhoneWorkspace({ simulator }) {
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

  const handleWrongApp = (label) => {
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

            {state.app === APPS.success && (
              <SuccessScreen
                photo={photo}
                recipientName={recipient?.name ?? 'family'}
                onReset={() => reset(true)}
                onBackHome={goHome}
              />
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
        />
      </div>
    </PhoneFrame>
  )
}
