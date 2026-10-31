export const DEFAULT_PROGRESS = {
  version: 3,
  shareFamilyPhotoStarted: false,
  guidedCompleted: false,
  independentCompleted: false,
  latestIndependentResult: null,
  followAlongStarted: false,
  followAlongCompletedLessonIds: [],
}

export const COMPLETED_STEPS = [
  { id: 'select-photo', labelEn: 'Selected a photo', labelUr: 'تصویر منتخب کی' },
  { id: 'open-share', labelEn: 'Opened Share', labelUr: 'Share کھولا' },
  { id: 'choose-contact', labelEn: 'Chose a contact', labelUr: 'رابطہ چنا' },
  { id: 'confirm', labelEn: 'Confirmed sharing', labelUr: 'شیئر کی تصدیق کی' },
]

function sanitizeResult(raw) {
  if (!raw || typeof raw !== 'object') return null

  const incorrectAttempts = Number(raw.incorrectAttempts)
  const successfulActions = Number(raw.successfulActions)
  const durationMs = Number(raw.durationMs)

  const mode = raw.mode === 'guided' || raw.mode === 'independent' ? raw.mode : null

  return {
    completed: Boolean(raw.completed),
    mode,
    incorrectAttempts: Number.isFinite(incorrectAttempts) ? Math.max(0, incorrectAttempts) : 0,
    successfulActions: Number.isFinite(successfulActions) ? Math.max(0, successfulActions) : 0,
    durationMs: Number.isFinite(durationMs) && durationMs >= 0 ? durationMs : null,
    completedWithoutAssistance: Boolean(raw.completedWithoutAssistance),
    completedSteps: Array.isArray(raw.completedSteps)
      ? raw.completedSteps.filter((step) => typeof step === 'string')
      : COMPLETED_STEPS.map((step) => step.id),
    finishedAt: typeof raw.finishedAt === 'string' ? raw.finishedAt : null,
  }
}

function sanitizeLessonIds(raw) {
  if (!Array.isArray(raw)) return []
  return [...new Set(raw.filter((id) => typeof id === 'string' && id.trim()))]
}

export function normalizeProgress(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return { ...DEFAULT_PROGRESS }
  }

  const guidedCompleted = Boolean(
    raw.guidedCompleted || raw.shareFamilyPhotoCompleted,
  )
  const independentCompleted = Boolean(raw.independentCompleted)
  const followAlongCompletedLessonIds = sanitizeLessonIds(
    raw.followAlongCompletedLessonIds,
  )
  const followAlongStarted = Boolean(
    raw.followAlongStarted || followAlongCompletedLessonIds.length > 0,
  )
  const started = Boolean(
    raw.shareFamilyPhotoStarted ||
      guidedCompleted ||
      independentCompleted ||
      followAlongStarted,
  )

  return {
    version: 3,
    shareFamilyPhotoStarted: started,
    guidedCompleted,
    independentCompleted,
    latestIndependentResult: sanitizeResult(raw.latestIndependentResult),
    followAlongStarted,
    followAlongCompletedLessonIds,
  }
}

export function getProgressPercent(progress) {
  const data = normalizeProgress(progress)
  if (data.followAlongCompletedLessonIds.length > 0 && data.independentCompleted) {
    return 100
  }
  if (data.independentCompleted) return 90
  if (data.followAlongCompletedLessonIds.length > 0) return 80
  if (data.guidedCompleted) return 65
  if (data.shareFamilyPhotoStarted || data.followAlongStarted) return 30
  return 0
}

export function getProgressLabel(progress) {
  const data = normalizeProgress(progress)
  if (data.followAlongCompletedLessonIds.length > 0) {
    return 'Follow-Along practice completed'
  }
  if (data.independentCompleted) return 'Independent practice completed'
  if (data.guidedCompleted) return 'Guided practice completed'
  if (data.shareFamilyPhotoStarted || data.followAlongStarted) return 'Practice started'
  return 'Ready to begin'
}

export function formatDuration(durationMs) {
  if (durationMs == null || !Number.isFinite(durationMs) || durationMs < 0) {
    return null
  }

  const totalSeconds = Math.round(durationMs / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  if (minutes <= 0) return `${seconds} seconds`
  if (seconds === 0) return `${minutes} min`
  return `${minutes} min ${seconds} sec`
}
