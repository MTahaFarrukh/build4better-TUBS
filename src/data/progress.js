export const DEFAULT_PROGRESS = {
  version: 4,
  masteredIds: [],
  lessonsStarted: false,
  guidedCompletedIds: [],
  independentCompletedIds: [],
  latestResult: null,
  latestIndependentResult: null,
  followAlongStarted: false,
  followAlongCompletedLessonIds: [],
  // legacy-compatible flags used by older UI copy paths
  shareFamilyPhotoStarted: false,
  guidedCompleted: false,
  independentCompleted: false,
}

export const COMPLETED_STEPS = [
  { id: 'select-photo', labelEn: 'Selected a photo', labelUr: 'تصویر منتخب کی' },
  { id: 'open-share', labelEn: 'Opened Share', labelUr: 'Share کھولا' },
  { id: 'choose-contact', labelEn: 'Chose a contact', labelUr: 'رابطہ چنا' },
  { id: 'confirm', labelEn: 'Confirmed sharing', labelUr: 'شیئر کی تصدیق کی' },
  { id: 'open-whatsapp', labelEn: 'Opened WhatsApp', labelUr: 'واٹس ایپ کھولی' },
  { id: 'open-chat', labelEn: 'Opened a chat', labelUr: 'چیٹ کھولی' },
  { id: 'start-recording', labelEn: 'Held to record', labelUr: 'ریکارڈ کرنے دبایا' },
  { id: 'send-voice', labelEn: 'Sent voice note', labelUr: 'وائس نوٹ بھیجا' },
]

function sanitizeIds(raw) {
  if (!Array.isArray(raw)) return []
  return [...new Set(raw.filter((id) => typeof id === 'string' && id.trim()))]
}

function sanitizeResult(raw) {
  if (!raw || typeof raw !== 'object') return null
  const incorrectAttempts = Number(raw.incorrectAttempts)
  const successfulActions = Number(raw.successfulActions)
  const durationMs = Number(raw.durationMs)
  const mode = raw.mode === 'guided' || raw.mode === 'independent' ? raw.mode : null

  return {
    completed: Boolean(raw.completed),
    mode,
    lessonId: typeof raw.lessonId === 'string' ? raw.lessonId : null,
    incorrectAttempts: Number.isFinite(incorrectAttempts) ? Math.max(0, incorrectAttempts) : 0,
    successfulActions: Number.isFinite(successfulActions) ? Math.max(0, successfulActions) : 0,
    durationMs: Number.isFinite(durationMs) && durationMs >= 0 ? durationMs : null,
    assistanceCount: Number.isFinite(Number(raw.assistanceCount)) ? Math.max(0, Number(raw.assistanceCount)) : 0,
    completedWithoutAssistance: Boolean(raw.completedWithoutAssistance) && !(Number(raw.assistanceCount) > 0),
    completedSteps: Array.isArray(raw.completedSteps)
      ? raw.completedSteps.filter((step) => typeof step === 'string')
      : [],
    finishedAt: typeof raw.finishedAt === 'string' ? raw.finishedAt : null,
  }
}

export function normalizeProgress(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return { ...DEFAULT_PROGRESS }
  }

  const guidedCompletedIds = sanitizeIds(
    raw.guidedCompletedIds ||
      (raw.guidedCompleted || raw.shareFamilyPhotoCompleted
        ? ['share-family-photo']
        : []),
  )
  const independentCompletedIds = sanitizeIds(
    raw.independentCompletedIds ||
      (raw.independentCompleted ? ['share-family-photo'] : []),
  )
  const followAlongCompletedLessonIds = sanitizeIds(raw.followAlongCompletedLessonIds)
  const lessonsStarted = Boolean(
    raw.lessonsStarted ||
      raw.shareFamilyPhotoStarted ||
      guidedCompletedIds.length ||
      independentCompletedIds.length ||
      raw.followAlongStarted ||
      followAlongCompletedLessonIds.length,
  )

  return {
    version: 4,
    masteredIds: sanitizeIds(raw.masteredIds),
    lessonsStarted,
    guidedCompletedIds,
    independentCompletedIds,
    latestResult: sanitizeResult(raw.latestResult || raw.latestIndependentResult),
    latestIndependentResult: sanitizeResult(raw.latestIndependentResult),
    followAlongStarted: Boolean(raw.followAlongStarted || followAlongCompletedLessonIds.length),
    followAlongCompletedLessonIds,
    shareFamilyPhotoStarted: lessonsStarted,
    guidedCompleted: guidedCompletedIds.length > 0,
    independentCompleted: independentCompletedIds.length > 0,
  }
}

export function getProgressPercent(progress) {
  const data = normalizeProgress(progress)
  const ids = ['share-family-photo', 'whatsapp-voice-message']
  const completed = ids.reduce((count, id) => count + Number(data.guidedCompletedIds.includes(id)) + Number(data.independentCompletedIds.includes(id)), 0)
  return completed * 25
}

export function getProgressLabel(progress) {
  const data = normalizeProgress(progress)
  if (data.guidedCompletedIds.length >= 2 && data.independentCompletedIds.length >= 2) {
    return 'Both lessons practised'
  }
  if (data.independentCompletedIds.length) return 'Independent practice completed'
  if (data.guidedCompletedIds.length) return 'Guided practice completed'
  if (data.lessonsStarted) return 'Practice started'
  return 'Ready to begin'
}

export function formatDuration(durationMs) {
  if (durationMs == null || !Number.isFinite(durationMs) || durationMs < 0) return null
  const totalSeconds = Math.round(durationMs / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  if (minutes <= 0) return `${seconds} seconds`
  if (seconds === 0) return `${minutes} min`
  return `${minutes} min ${seconds} sec`
}
