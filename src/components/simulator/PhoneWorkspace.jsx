import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { getContactById, getPhotoById } from '../../data/gallery'
import { SCREENS } from '../../hooks/usePracticePhone'
import GalleryGrid from './GalleryGrid'
import HomeScreen from './HomeScreen'
import PhoneFrame from './PhoneFrame'
import PhotoPreview from './PhotoPreview'
import ShareSheet from './ShareSheet'
import SuccessScreen from './SuccessScreen'
import WhatsAppChat from './WhatsAppChat'
import WhatsAppList from './WhatsAppList'

export default function PhoneWorkspace({ phone }) {
  const reduceMotion = useReducedMotion()
  const {
    state,
    openGallery,
    openWhatsApp,
    wrongHomeApp,
    selectPhoto,
    openShare,
    selectRecipient,
    confirmShare,
    openChat,
    startRecording,
    sendVoice,
    cancelRecording,
    goBack,
    goHome,
    reset,
    isHighlighted,
  } = phone

  const photo = getPhotoById(state.selectedPhotoId)
  const recipient = getContactById(state.selectedRecipientId)
  const screenKey =
    state.screen === SCREENS.share ? SCREENS.preview : state.screen
  const transition = reduceMotion ? { duration: 0 } : { duration: 0.2 }

  return (
    <PhoneFrame onBack={goBack} onHome={goHome}>
      <div className="relative min-h-0 flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={screenKey}
            className="absolute inset-0"
            inert={state.screen === SCREENS.share ? "" : undefined}
            initial={reduceMotion ? false : { opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, x: -10 }}
            transition={transition}
          >
            {state.screen === SCREENS.home && (
              <HomeScreen
                lessonId={state.lessonId}
                onOpenGallery={openGallery}
                onOpenWhatsApp={openWhatsApp}
                onWrongApp={wrongHomeApp}
                onGoHome={goHome}
                isHighlighted={isHighlighted}
              />
            )}

            {state.screen === SCREENS.gallery && (
              <GalleryGrid
                onSelectPhoto={selectPhoto}
                onBack={goBack}
                isHighlighted={isHighlighted}
              />
            )}

            {(state.screen === SCREENS.preview || state.screen === SCREENS.share) && (
              <PhotoPreview
                photo={photo}
                onBack={goBack}
                onShare={openShare}
                isHighlighted={isHighlighted}
              />
            )}

            {state.screen === SCREENS.whatsappList && (
              <WhatsAppList
                onOpenChat={openChat}
                onBack={goBack}
                isHighlighted={isHighlighted}
              />
            )}

            {state.screen === SCREENS.whatsappChat && (
              <WhatsAppChat
                chatId={state.activeChatId}
                extraMessages={state.chatMessages[state.activeChatId] ?? []}
                isRecording={state.isRecording}
                recordingStartedAt={state.recordingStartedAt}
                onBack={goBack}
                onStartRecording={startRecording}
                onSendVoice={sendVoice}
                onCancelRecording={cancelRecording}
                isHighlighted={isHighlighted}
              />
            )}

            {state.screen === SCREENS.success && (
              <SuccessScreen
                photo={photo}
                recipientName={
                  recipient?.name ||
                  (state.activeChatId
                    ? getContactById(state.activeChatId)?.name
                    : 'family')
                }
                title={
                  state.voiceSent
                    ? 'Voice message sent in practice!'
                    : 'Photo shared in practice!'
                }
                message={
                  state.voiceSent
                    ? `You recorded and sent a practice voice note to ${
                        getContactById(state.activeChatId)?.name ?? 'family'
                      }. Nothing real was sent.`
                    : undefined
                }
                onReset={() => reset(state.mode, state.lessonId)}
                onBackHome={goHome}
              />
            )}
          </motion.div>
        </AnimatePresence>

        <ShareSheet
          open={state.screen === SCREENS.share}
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
