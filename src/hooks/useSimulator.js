import { useCallback, useReducer } from 'react'
import { TOTAL_GUIDED_STEPS } from '../data/guidedSteps'

export const APPS = {
  home: 'home',
  gallery: 'gallery',
  preview: 'preview',
  share: 'share',
  success: 'success',
}

export const initialSimulatorState = {
  app: APPS.home,
  selectedPhotoId: null,
  selectedRecipientId: null,
  shareConfirmed: false,
  guidedEnabled: true,
  guidedStep: 1,
  maxReachedStep: 1,
  guidedComplete: false,
  hint: null,
  celebration: false,
}

function buildHint(messageEn, messageUr) {
  return { en: messageEn, ur: messageUr }
}

function reducer(state, action) {
  switch (action.type) {
    case 'RESET':
      return {
        ...initialSimulatorState,
        guidedEnabled: action.guidedEnabled ?? true,
      }

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
        guidedStep,
        maxReachedStep: Math.max(state.maxReachedStep, guidedStep),
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
        guidedStep,
        maxReachedStep: Math.max(state.maxReachedStep, guidedStep),
      }
    }

    case 'OPEN_SHARE': {
      if (!state.selectedPhotoId) {
        return {
          ...state,
          hint: buildHint(
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
        guidedStep,
        maxReachedStep: Math.max(state.maxReachedStep, guidedStep),
      }
    }

    case 'SELECT_RECIPIENT': {
      const advancing = state.guidedEnabled && state.guidedStep === 4
      const guidedStep = advancing ? 5 : state.guidedStep
      return {
        ...state,
        selectedRecipientId: action.recipientId,
        hint: null,
        guidedStep,
        maxReachedStep: Math.max(state.maxReachedStep, guidedStep),
      }
    }

    case 'CONFIRM_SHARE': {
      if (!state.selectedRecipientId) {
        return {
          ...state,
          hint: buildHint(
            'Please choose someone first — Ammi, Abu, Beti, or Family Group.',
            'پہلے کسی کو منتخب کریں — امی، ابو، بیٹی، یا Family Group۔',
          ),
        }
      }

      return {
        ...state,
        shareConfirmed: true,
        app: APPS.success,
        celebration: true,
        hint: null,
        guidedComplete: true,
        guidedEnabled: false,
        guidedStep: TOTAL_GUIDED_STEPS,
        maxReachedStep: TOTAL_GUIDED_STEPS,
      }
    }

    case 'WRONG_ACTION':
      return {
        ...state,
        hint: action.hint,
      }

    case 'CLEAR_HINT':
      return { ...state, hint: null }

    case 'GO_HOME':
      return {
        ...state,
        app: APPS.home,
        selectedPhotoId: null,
        selectedRecipientId: null,
        shareConfirmed: false,
        celebration: false,
        hint: null,
      }

    case 'BACK': {
      if (state.app === APPS.share) {
        return { ...state, app: APPS.preview, hint: null }
      }
      if (state.app === APPS.preview) {
        return {
          ...state,
          app: APPS.gallery,
          selectedPhotoId: null,
          hint: null,
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
        }
      }
      return state
    }

    default:
      return state
  }
}

export function useSimulator(startGuided = true) {
  const [state, dispatch] = useReducer(reducer, {
    ...initialSimulatorState,
    guidedEnabled: startGuided,
  })

  const reset = useCallback((guidedEnabled = true) => {
    dispatch({ type: 'RESET', guidedEnabled })
  }, [])

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
    (target) => state.guidedEnabled && !state.guidedComplete && (
      (state.guidedStep === 1 && target === 'gallery-app') ||
      (state.guidedStep === 2 && target === 'photo-grid') ||
      (state.guidedStep === 3 && target === 'share-button') ||
      (state.guidedStep === 4 && target === 'recipient-list') ||
      (state.guidedStep === 5 && target === 'confirm-share')
    ),
    [state.guidedEnabled, state.guidedComplete, state.guidedStep],
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
