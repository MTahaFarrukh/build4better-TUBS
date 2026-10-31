import { useCallback, useMemo, useReducer } from 'react'
import { getInteractiveLesson, LESSON_IDS } from '../data/interactiveLessons'

export const SCREENS = {
  home: 'home',
  gallery: 'gallery',
  preview: 'preview',
  share: 'share',
  whatsappList: 'whatsapp-list',
  whatsappChat: 'whatsapp-chat',
  success: 'success',
}

export const PRACTICE_MODES = {
  guided: 'guided',
  independent: 'independent',
}

function buildHint(en, ur) {
  return { en, ur }
}

function createInitialState(lessonId, mode) {
  const independent = mode === PRACTICE_MODES.independent
  return {
    lessonId,
    mode,
    screen: SCREENS.home,
    selectedPhotoId: null,
    selectedRecipientId: null,
    activeChatId: null,
    isRecording: false,
    recordingStartedAt: null,
    assistanceCount: 0,
    voiceSent: false,
    shareConfirmed: false,
    chatMessages: {},
    guidedEnabled: !independent,
    guidedStep: 1,
    maxReachedStep: 1,
    hint: null,
    confirmError: null,
    startedAt: Date.now(),
    incorrectAttempts: 0,
    successfulActions: 0,
    completedStepIds: [],
    resultSummary: null,
  }
}

function markStep(ids, id) {
  return ids.includes(id) ? ids : [...ids, id]
}

function advanceGuided(state, expectedStepId) {
  if (!state.guidedEnabled) return { guidedStep: state.guidedStep, maxReachedStep: state.maxReachedStep }
  if (state.guidedStep !== expectedStepId) {
    return { guidedStep: state.guidedStep, maxReachedStep: state.maxReachedStep }
  }
  const lesson = getInteractiveLesson(state.lessonId)
  const next = Math.min(state.guidedStep + 1, lesson?.steps.length ?? state.guidedStep)
  return {
    guidedStep: next,
    maxReachedStep: Math.max(state.maxReachedStep, next),
  }
}

function expectStep(state, stepId) {
  if (!state.guidedEnabled) return true
  return state.guidedStep === stepId
}

function wrong(state, hint) {
  return {
    ...state,
    incorrectAttempts: state.incorrectAttempts + 1,
    hint: state.mode === PRACTICE_MODES.independent
      ? buildHint('That action is not part of this task. Try again, or ask for help.', 'یہ عمل اس مشق کا حصہ نہیں۔ دوبارہ کوشش کریں یا مدد لیں۔')
      : state.incorrectAttempts >= 1 ? hint : buildHint('Try another tap. Follow the glowing outline.', 'دوبارہ کوشش کریں۔ نمایاں بٹن دیکھیں۔'),
  }
}

function finish(state, completedSteps) {
  const finishedAt = Date.now()
  return {
    ...state,
    screen: SCREENS.success,
    guidedEnabled: false,
    hint: null,
    confirmError: null,
    successfulActions: state.successfulActions + 1,
    completedStepIds: completedSteps.reduce((ids, id) => markStep(ids, id), state.completedStepIds),
    resultSummary: {
      completed: true,
      mode: state.mode,
      lessonId: state.lessonId,
      incorrectAttempts: state.incorrectAttempts,
      successfulActions: state.successfulActions + 1,
      durationMs: Math.max(0, finishedAt - state.startedAt),
      completedWithoutAssistance: state.mode === PRACTICE_MODES.independent && state.assistanceCount === 0,
      assistanceCount: state.assistanceCount,
      completedSteps,
      finishedAt: new Date(finishedAt).toISOString(),
    },
  }
}

function reducer(state, action) {
  const lesson = getInteractiveLesson(state.lessonId)
  const isPhoto = state.lessonId === LESSON_IDS.sharePhoto
  const isVoice = state.lessonId === LESSON_IDS.voiceMessage

  switch (action.type) {
    case 'RESET':
      return createInitialState(action.lessonId ?? state.lessonId, action.mode ?? state.mode)

    case 'EXIT_GUIDED':
      return { ...state, guidedEnabled: false, hint: null }

    case 'SET_GUIDED_STEP': {
      const max = lesson?.steps.length ?? 1
      const capped = Math.min(action.step, state.maxReachedStep)
      const next = Math.min(Math.max(capped, 1), max)
      return { ...state, guidedStep: next, hint: null }
    }

    case 'CLEAR_HINT':
      return { ...state, hint: null, confirmError: null }

    case 'SHOW_HELP': {
      // Guided: current step help. Independent: infer from phone screen/state.
      let step = lesson?.steps.find((item) => item.id === state.guidedStep)
      if (!state.guidedEnabled && lesson) {
        if (isPhoto) {
          if (state.screen === SCREENS.home) step = lesson.steps[0]
          else if (state.screen === SCREENS.gallery) step = lesson.steps[1]
          else if (state.screen === SCREENS.preview) step = lesson.steps[2]
          else if (state.screen === SCREENS.share && !state.selectedRecipientId) {
            step = lesson.steps[3]
          } else if (state.screen === SCREENS.share) step = lesson.steps[4]
        } else if (isVoice) {
          if (state.screen === SCREENS.home) step = lesson.steps[0]
          else if (state.screen === SCREENS.whatsappList) step = lesson.steps[1]
          else if (state.screen === SCREENS.whatsappChat && !state.isRecording) {
            step = lesson.steps[2]
          } else if (state.screen === SCREENS.whatsappChat) step = lesson.steps[3]
        }
      }
      if (!step) return state
      return {
        ...state,
        assistanceCount: state.assistanceCount + 1,
        hint: buildHint(step.helpEn, step.helpUr),
      }
    }

    case 'OPEN_GALLERY': {
      if (isVoice) {
        return wrong(
          state,
          buildHint(
            'For this lesson, open WhatsApp — not Gallery.',
            'اس سبق میں WhatsApp کھولیں — Gallery نہیں۔',
          ),
        )
      }
      const onStep = expectStep(state, 1)
      const guided = onStep
        ? advanceGuided(state, 1)
        : { guidedStep: state.guidedStep, maxReachedStep: state.maxReachedStep }
      return {
        ...state,
        ...guided,
        screen: SCREENS.gallery,
        hint: onStep || !state.guidedEnabled ? null : state.hint,
        successfulActions: onStep ? state.successfulActions + 1 : state.successfulActions,
        completedStepIds: onStep
          ? markStep(state.completedStepIds, 'open-gallery')
          : state.completedStepIds,
      }
    }

    case 'OPEN_WHATSAPP': {
      if (isPhoto) {
        return wrong(
          state,
          buildHint(
            'For this lesson, open Gallery — not WhatsApp.',
            'اس سبق میں Gallery کھولیں — WhatsApp نہیں۔',
          ),
        )
      }
      const onStep = expectStep(state, 1)
      const guided = onStep
        ? advanceGuided(state, 1)
        : { guidedStep: state.guidedStep, maxReachedStep: state.maxReachedStep }
      return {
        ...state,
        ...guided,
        screen: SCREENS.whatsappList,
        hint: onStep || !state.guidedEnabled ? null : state.hint,
        successfulActions: onStep ? state.successfulActions + 1 : state.successfulActions,
        completedStepIds: onStep
          ? markStep(state.completedStepIds, 'open-whatsapp')
          : state.completedStepIds,
      }
    }

    case 'WRONG_HOME_APP':
      return wrong(
        state,
        buildHint(
          `${action.label} is only for practice decoration. Use the highlighted app for this lesson.`,
          `${action.label} صرف دکھانے کے لیے ہے۔ اس سبق کا نمایاں ایپ استعمال کریں۔`,
        ),
      )

    case 'SELECT_PHOTO': {
      if (!isPhoto) return state
      if (state.screen !== SCREENS.gallery && state.screen !== SCREENS.preview) {
        return wrong(state, buildHint('Open Gallery first.', 'پہلے Gallery کھولیں۔'))
      }
      if (!expectStep(state, 2) && state.guidedEnabled) {
        return wrong(state, buildHint(lesson.steps[1].helpEn, lesson.steps[1].helpUr))
      }
      const guided = advanceGuided(state, 2)
      return {
        ...state,
        ...guided,
        selectedPhotoId: action.photoId,
        screen: SCREENS.preview,
        hint: null,
        successfulActions: state.successfulActions + 1,
        completedStepIds: markStep(state.completedStepIds, 'select-photo'),
      }
    }

    case 'OPEN_SHARE': {
      if (!isPhoto) return state
      if (!state.selectedPhotoId) {
        return wrong(
          state,
          buildHint('Select a photo first, then Share.', 'پہلے تصویر منتخب کریں، پھر Share۔'),
        )
      }
      if (!expectStep(state, 3) && state.guidedEnabled) {
        return wrong(state, buildHint(lesson.steps[2].helpEn, lesson.steps[2].helpUr))
      }
      const guided = advanceGuided(state, 3)
      return {
        ...state,
        ...guided,
        screen: SCREENS.share,
        hint: null,
        confirmError: null,
        successfulActions: state.successfulActions + 1,
        completedStepIds: markStep(state.completedStepIds, 'open-share'),
      }
    }

    case 'SELECT_RECIPIENT': {
      if (!isPhoto) return state
      if (!expectStep(state, 4) && !expectStep(state, 5) && state.guidedEnabled) {
        return wrong(state, buildHint(lesson.steps[3].helpEn, lesson.steps[3].helpUr))
      }
      const guided = advanceGuided(state, 4)
      return {
        ...state,
        ...guided,
        selectedRecipientId: action.recipientId,
        hint: null,
        confirmError: null,
        successfulActions: state.successfulActions + 1,
        completedStepIds: markStep(state.completedStepIds, 'choose-contact'),
      }
    }

    case 'CONFIRM_SHARE': {
      if (!isPhoto) return state
      if (!state.selectedRecipientId) {
        return {
          ...wrong(
            state,
            buildHint(
              'Please choose someone first — Ammi, Abu, Beti, or Family Group.',
              'پہلے کسی کو منتخب کریں۔',
            ),
          ),
          confirmError: buildHint(
            'Please choose someone first — Ammi, Abu, Beti, or Family Group.',
            'پہلے کسی کو منتخب کریں۔',
          ),
          screen: SCREENS.share,
        }
      }
      if (!expectStep(state, 5) && state.guidedEnabled) {
        return wrong(state, buildHint(lesson.steps[4].helpEn, lesson.steps[4].helpUr))
      }
      return finish(state, ['select-photo', 'open-share', 'choose-contact', 'confirm'])
    }

    case 'OPEN_CHAT': {
      if (!isVoice) return state
      if (state.screen !== SCREENS.whatsappList && state.screen !== SCREENS.whatsappChat) {
        return wrong(state, buildHint('Open WhatsApp first.', 'پہلے WhatsApp کھولیں۔'))
      }
      if (!expectStep(state, 2) && state.guidedEnabled) {
        return wrong(state, buildHint(lesson.steps[1].helpEn, lesson.steps[1].helpUr))
      }
      const guided = advanceGuided(state, 2)
      return {
        ...state,
        ...guided,
        activeChatId: action.chatId,
        screen: SCREENS.whatsappChat,
        isRecording: false,
        hint: null,
        successfulActions: state.successfulActions + 1,
        completedStepIds: markStep(state.completedStepIds, 'open-chat'),
      }
    }

    case 'START_RECORDING': {
      if (!isVoice || state.isRecording) return state
      if (state.screen !== SCREENS.whatsappChat || !state.activeChatId) {
        return wrong(state, buildHint('Open a chat first.', 'پہلے چیٹ کھولیں۔'))
      }
      if (state.guidedEnabled && state.guidedStep < 3) {
        return wrong(state, buildHint(lesson.steps[2].helpEn, lesson.steps[2].helpUr))
      }
      const onStep = expectStep(state, 3)
      const guided = onStep
        ? advanceGuided(state, 3)
        : { guidedStep: state.guidedStep, maxReachedStep: state.maxReachedStep }
      return {
        ...state,
        ...guided,
        isRecording: true,
        recordingStartedAt: Date.now(),
        hint: null,
        successfulActions: onStep ? state.successfulActions + 1 : state.successfulActions,
        completedStepIds: onStep
          ? markStep(state.completedStepIds, 'start-recording')
          : state.completedStepIds,
      }
    }

    case 'SEND_VOICE': {
      if (!isVoice) return state
      if (!state.isRecording) {
        return wrong(
          state,
          buildHint(
            'Hold the microphone first, then release to send.',
            'پہلے مائیک دبائیں، پھر چھوڑ کر بھیجیں۔',
          ),
        )
      }
      if (!expectStep(state, 4) && state.guidedEnabled) {
        // Allow send if they advanced somehow
      }
      if (Date.now() - state.recordingStartedAt < 700) {
        return { ...state, isRecording: false, recordingStartedAt: null, guidedStep: 3,
          hint: buildHint('Hold a little longer, then release. Try again.', 'تھوڑی دیر دبائے رکھیں، پھر چھوڑیں۔ دوبارہ کوشش کریں۔') }
      }
      const guided = advanceGuided(state, 4)
      const existing = state.chatMessages[state.activeChatId] ?? []
      const voiceMessage = {
        id: `voice-${Date.now()}`,
        from: 'me',
        type: 'voice',
        durationSec: Math.max(1, Math.round((Date.now() - state.recordingStartedAt) / 1000)),
      }
      return finish(
        {
          ...state,
          ...guided,
          isRecording: false,
          voiceSent: true,
          chatMessages: {
            ...state.chatMessages,
            [state.activeChatId]: [...existing, voiceMessage],
          },
        },
        ['open-whatsapp', 'open-chat', 'start-recording', 'send-voice'],
      )
    }

    case 'CANCEL_RECORDING':
      if (!state.isRecording) return state
      return { ...state, isRecording: false, recordingStartedAt: null, guidedStep: 3, hint: null }

    case 'BACK': {
      if (state.screen === SCREENS.share) {
        return { ...state, screen: SCREENS.preview, guidedStep: 3, selectedRecipientId: null, hint: null, confirmError: null }
      }
      if (state.screen === SCREENS.preview) {
        return {
          ...state,
          screen: SCREENS.gallery,
          guidedStep: 2,
          selectedPhotoId: null,
          hint: null,
        }
      }
      if (state.screen === SCREENS.whatsappChat) {
        return {
          ...state,
          screen: SCREENS.whatsappList,
          guidedStep: 2,
          activeChatId: null,
          isRecording: false,
          hint: null,
        }
      }
      if (
        state.screen === SCREENS.gallery ||
        state.screen === SCREENS.whatsappList ||
        state.screen === SCREENS.success
      ) {
        return {
          ...createInitialState(state.lessonId, state.mode),
          guidedEnabled: state.guidedEnabled,
          guidedStep: 1,
          maxReachedStep: state.maxReachedStep,
          incorrectAttempts: state.incorrectAttempts,
          successfulActions: state.successfulActions,
          startedAt: state.startedAt,
          assistanceCount: state.assistanceCount,
          completedStepIds: state.completedStepIds,
        }
      }
      return state
    }

    case 'GO_HOME':
      return {
        ...state,
        screen: SCREENS.home,
        selectedPhotoId: null, selectedRecipientId: null, activeChatId: null,
        isRecording: false, recordingStartedAt: null, hint: null, confirmError: null,
        guidedEnabled: state.guidedEnabled,
        guidedStep: 1,
        maxReachedStep: state.maxReachedStep,
        incorrectAttempts: state.incorrectAttempts,
        successfulActions: state.successfulActions,
        startedAt: state.startedAt,
      }

    default:
      return state
  }
}

export function usePracticePhone(lessonId, mode = PRACTICE_MODES.guided) {
  const [state, dispatch] = useReducer(
    reducer,
    { lessonId, mode },
    ({ lessonId: id, mode: startMode }) => createInitialState(id, startMode),
  )

  const lesson = useMemo(() => getInteractiveLesson(state.lessonId), [state.lessonId])

  const reset = useCallback((nextMode = mode, nextLessonId = lessonId) => {
    dispatch({ type: 'RESET', mode: nextMode, lessonId: nextLessonId })
  }, [mode, lessonId])

  const isHighlighted = useCallback(
    (target) => {
      if (!state.guidedEnabled || state.resultSummary) return false
      const step = lesson?.steps.find((item) => item.id === state.guidedStep)
      return step?.target === target
    },
    [state.guidedEnabled, state.resultSummary, state.guidedStep, lesson],
  )

  return {
    state,
    lesson,
    reset,
    isHighlighted,
    openGallery: () => dispatch({ type: 'OPEN_GALLERY' }),
    openWhatsApp: () => dispatch({ type: 'OPEN_WHATSAPP' }),
    wrongHomeApp: (label) => dispatch({ type: 'WRONG_HOME_APP', label }),
    selectPhoto: (photoId) => dispatch({ type: 'SELECT_PHOTO', photoId }),
    openShare: () => dispatch({ type: 'OPEN_SHARE' }),
    selectRecipient: (recipientId) => dispatch({ type: 'SELECT_RECIPIENT', recipientId }),
    confirmShare: () => dispatch({ type: 'CONFIRM_SHARE' }),
    openChat: (chatId) => dispatch({ type: 'OPEN_CHAT', chatId }),
    startRecording: () => dispatch({ type: 'START_RECORDING' }),
    sendVoice: () => dispatch({ type: 'SEND_VOICE' }),
    cancelRecording: () => dispatch({ type: 'CANCEL_RECORDING' }),
    goBack: () => dispatch({ type: 'BACK' }),
    goHome: () => dispatch({ type: 'GO_HOME' }),
    exitGuided: () => dispatch({ type: 'EXIT_GUIDED' }),
    setGuidedStep: (step) => dispatch({ type: 'SET_GUIDED_STEP', step }),
    clearHint: () => dispatch({ type: 'CLEAR_HINT' }),
    showHelp: () => dispatch({ type: 'SHOW_HELP' }),
  }
}
