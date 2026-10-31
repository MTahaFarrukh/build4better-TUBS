import { useCallback, useReducer } from 'react'
import { TOTAL_GUIDED_STEPS } from '../data/guidedSteps'

export const APPS = {
  home: 'home',
  gallery: 'gallery',
  preview: 'preview',
  share: 'share',
  success: 'success',
}

export const PRACTICE_MODES = {
  guided: 'guided',
  independent: 'independent',
}

function createInitialState(mode = PRACTICE_MODES.guided) {
  const independent = mode === PRACTICE_MODES.independent
  return {
    mode,
    app: APPS.home,
    selectedPhotoId: null,
    selectedRecipientId: null,
    shareConfirmed: false,
    guidedEnabled: !independent,
    guidedStep: 1,
    maxReachedStep: 1,
    guidedComplete: false,
    hint: null,
    confirmError: null,
    celebration: false,
    startedAt: Date.now(),
    incorrectAttempts: 0,
    successfulActions: 0,
    completedStepIds: [],
    resultSummary: null,
  }
}

export const initialSimulatorState = createInitialState(PRACTICE_MODES.guided)

function buildHint(messageEn, messageUr) {
  return { en: messageEn, ur: messageUr }
}

function markStep(stepIds, stepId) {
  if (stepIds.includes(stepId)) return stepIds
  return [...stepIds, stepId]
}

function bumpSuccess(state, stepId) {
  return {
    successfulActions: state.successfulActions + 1,
    completedStepIds: stepId
      ? markStep(state.completedStepIds, stepId)
      : state.completedStepIds,
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'RESET':
      return createInitialState(action.mode ?? state.mode)

    case 'EXIT_GUIDED':
      return {
        ...state,
        guidedEnabled: false,
        hint: null,
      }

    case 'SET_GUIDED_STEP': {
      const capped = Math.min(action.step, state.maxReachedStep)
      const next = Math.min(Math.max(capped, 1), TOTAL_GUIDED_STEPS)
      return { ...state, guidedStep: next, hint: null }
    }

    case 'OPEN_GALLERY': {
      const advancing = state.guidedEnabled && state.guidedStep === 1
      const guidedStep = advancing ? 2 : state.guidedStep
      return {
        ...state,
        app: APPS.gallery,
        hint: null,
        confirmError: null,
        guidedStep,
        maxReachedStep: Math.max(state.maxReachedStep, guidedStep),
        ...bumpSuccess(state, 'open-gallery'),
      }
    }

    case 'SELECT_PHOTO': {
      const advancing = state.guidedEnabled && state.guidedStep === 2
      const guidedStep = advancing ? 3 : state.guidedStep
      return {
        ...state,
        selectedPhotoId: action.photoId,
        app: APPS.preview,
        hint: null,
        confirmError: null,
        guidedStep,
        maxReachedStep: Math.max(state.maxReachedStep, guidedStep),
        ...bumpSuccess(state, 'select-photo'),
      }
    }

    case 'OPEN_SHARE': {
      if (!state.selectedPhotoId) {
        return {
          ...state,
          incorrectAttempts: state.incorrectAttempts + 1,
          hint:
            state.mode === PRACTICE_MODES.independent
              ? null
              : buildHint(
                  'Select a photo first, then tap Share.',
                  'پہلے تصویر منتخب کریں، پھر Share دبائیں۔',
                ),
        }
      }
      const advancing = state.guidedEnabled && state.guidedStep === 3
      const guidedStep = advancing ? 4 : state.guidedStep
      return {
        ...state,
        app: APPS.share,
        hint: null,
        confirmError: null,
        guidedStep,
        maxReachedStep: Math.max(state.maxReachedStep, guidedStep),
        ...bumpSuccess(state, 'open-share'),
      }
    }

    case 'SELECT_RECIPIENT': {
      const advancing = state.guidedEnabled && state.guidedStep === 4
      const guidedStep = advancing ? 5 : state.guidedStep
      return {
        ...state,
        selectedRecipientId: action.recipientId,
        hint: null,
        confirmError: null,
        guidedStep,
        maxReachedStep: Math.max(state.maxReachedStep, guidedStep),
        ...bumpSuccess(state, 'choose-contact'),
      }
    }

    case 'CONFIRM_SHARE': {
      if (!state.selectedRecipientId) {
        return {
          ...state,
          incorrectAttempts: state.incorrectAttempts + 1,
          confirmError: buildHint(
            'Please choose someone first — Ammi, Abu, Beti, or Family Group.',
            'پہلے کسی کو منتخب کریں — امی، ابو، بیٹی، یا Family Group۔',
          ),
          hint:
            state.mode === PRACTICE_MODES.independent
              ? null
              : buildHint(
                  'Please choose someone first — Ammi, Abu, Beti, or Family Group.',
                  'پہلے کسی کو منتخب کریں — امی، ابو، بیٹی، یا Family Group۔',
                ),
        }
      }

      const finishedAt = Date.now()
      const successPatch = bumpSuccess(state, 'confirm')
      const completedStepIds = markStep(
        markStep(
          markStep(successPatch.completedStepIds, 'select-photo'),
          'open-share',
        ),
        'choose-contact',
      )

      return {
        ...state,
        ...successPatch,
        completedStepIds,
        shareConfirmed: true,
        app: APPS.success,
        celebration: true,
        hint: null,
        confirmError: null,
        guidedComplete: state.mode === PRACTICE_MODES.guided,
        guidedEnabled: false,
        guidedStep: TOTAL_GUIDED_STEPS,
        maxReachedStep: TOTAL_GUIDED_STEPS,
        resultSummary: {
          completed: true,
          mode: state.mode,
          incorrectAttempts: state.incorrectAttempts,
          successfulActions: successPatch.successfulActions,
          durationMs:
            typeof state.startedAt === 'number'
              ? Math.max(0, finishedAt - state.startedAt)
              : null,
          completedWithoutAssistance: state.mode === PRACTICE_MODES.independent,
          completedSteps: ['select-photo', 'open-share', 'choose-contact', 'confirm'],
          finishedAt: new Date(finishedAt).toISOString(),
        },
      }
    }

    case 'WRONG_ACTION':
      return {
        ...state,
        incorrectAttempts: state.incorrectAttempts + 1,
        hint:
          state.mode === PRACTICE_MODES.independent ? null : action.hint,
      }

    case 'CLEAR_HINT':
      return { ...state, hint: null, confirmError: null }

    case 'GO_HOME':
      return {
        ...state,
        app: APPS.home,
        selectedPhotoId: null,
        selectedRecipientId: null,
        shareConfirmed: false,
        celebration: false,
        hint: null,
        confirmError: null,
      }

    case 'BACK': {
      if (state.app === APPS.share) {
        return { ...state, app: APPS.preview, hint: null, confirmError: null }
      }
      if (state.app === APPS.preview) {
        return {
          ...state,
          app: APPS.gallery,
          selectedPhotoId: null,
          hint: null,
          confirmError: null,
        }
      }
      if (state.app === APPS.gallery || state.app === APPS.success) {
        return {
          ...state,
          app: APPS.home,
          selectedPhotoId: null,
          selectedRecipientId: null,
          shareConfirmed: false,
          celebration: false,
          hint: null,
          confirmError: null,
        }
      }
      return state
    }

    default:
      return state
  }
}

export function useSimulator(mode = PRACTICE_MODES.guided) {
  const [state, dispatch] = useReducer(reducer, mode, createInitialState)

  const reset = useCallback((nextMode = mode) => {
    dispatch({ type: 'RESET', mode: nextMode })
  }, [mode])

  const openGallery = useCallback(() => {
    dispatch({ type: 'OPEN_GALLERY' })
  }, [])

  const selectPhoto = useCallback((photoId) => {
    dispatch({ type: 'SELECT_PHOTO', photoId })
  }, [])

  const openShare = useCallback(() => {
    dispatch({ type: 'OPEN_SHARE' })
  }, [])

  const selectRecipient = useCallback((recipientId) => {
    dispatch({ type: 'SELECT_RECIPIENT', recipientId })
  }, [])

  const confirmShare = useCallback(() => {
    dispatch({ type: 'CONFIRM_SHARE' })
  }, [])

  const goBack = useCallback(() => {
    dispatch({ type: 'BACK' })
  }, [])

  const goHome = useCallback(() => {
    dispatch({ type: 'GO_HOME' })
  }, [])

  const exitGuided = useCallback(() => {
    dispatch({ type: 'EXIT_GUIDED' })
  }, [])

  const setGuidedStep = useCallback((step) => {
    dispatch({ type: 'SET_GUIDED_STEP', step })
  }, [])

  const wrongAction = useCallback((hint) => {
    dispatch({ type: 'WRONG_ACTION', hint })
  }, [])

  const clearHint = useCallback(() => {
    dispatch({ type: 'CLEAR_HINT' })
  }, [])

  const isHighlighted = useCallback(
    (target) =>
      state.mode === PRACTICE_MODES.guided &&
      state.guidedEnabled &&
      !state.guidedComplete &&
      (
        (state.guidedStep === 1 && target === 'gallery-app') ||
        (state.guidedStep === 2 && target === 'photo-grid') ||
        (state.guidedStep === 3 && target === 'share-button') ||
        (state.guidedStep === 4 && target === 'recipient-list') ||
        (state.guidedStep === 5 && target === 'confirm-share')
      ),
    [state.mode, state.guidedEnabled, state.guidedComplete, state.guidedStep],
  )

  return {
    state,
    reset,
    openGallery,
    selectPhoto,
    openShare,
    selectRecipient,
    confirmShare,
    goBack,
    goHome,
    exitGuided,
    setGuidedStep,
    wrongAction,
    clearHint,
    isHighlighted,
  }
}
