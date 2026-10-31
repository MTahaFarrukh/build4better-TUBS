export const LESSON_POINTS = {
  'share-family-photo': 100,
  'whatsapp-voice-message': 120,
  'scam-safety': 150,
}
export const STAGE_SIZE = 200
export const DAILY_BONUS = 50
export const HELLO_BONUS = 20
export const FOLLOW_ALONG_BONUS = 30

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
  // ISO day keys (YYYY-MM-DD) on which the learner practised; drives the real streak.
  practiceDays: [],
  // Best points kept per lesson, so replaying cannot farm an unlimited score.
  lessonScores: {},
  // Days on which a lesson was actually finished. Each day adds DAILY_BONUS once.
  dailyBonusDays: [],
  helloBonus: false,
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

function sanitizeDays(raw) {
  return sanitizeIds(raw).filter((day) => /^\d{4}-\d{2}-\d{2}$/.test(day)).sort()
}

// Guided finish is a start. Doing it alone is worth more. A clean solo finish earns the full lesson.
export function pointsForResult(result) {
  if (!result?.completed) return 0
  const max = LESSON_POINTS[result.lessonId] || 0
  if (!max) return 0
  const clean = result.mode === 'independent' && result.completedWithoutAssistance && (result.incorrectAttempts || 0) === 0
  if (clean) return max
  if (result.mode === 'independent') return Math.round(max * 0.7)
  return Math.round(max * 0.4)
}

function sanitizeScores(raw, guided, independent, mastered) {
  const stored = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {}
  const scores = {}
  for (const [id, max] of Object.entries(LESSON_POINTS)) {
    const saved = Number(stored[id])
    let best = Number.isFinite(saved) ? Math.max(0, Math.min(max, saved)) : 0
    if (guided.includes(id)) best = Math.max(best, Math.round(max * 0.4))
    if (independent.includes(id)) best = Math.max(best, Math.round(max * 0.7))
    if (mastered.includes(id)) best = max
    if (best) scores[id] = best
  }
  return scores
}

export function totalPoints(progress) {
  const data = progress?.lessonScores ? progress : normalizeProgress(progress)
  const lessons = Object.values(data.lessonScores || {}).reduce((sum, value) => sum + value, 0)
  const daily = (data.dailyBonusDays?.length || 0) * DAILY_BONUS
  const hello = data.helloBonus ? HELLO_BONUS : 0
  const realPhone = data.followAlongCompletedLessonIds?.length ? FOLLOW_ALONG_BONUS : 0
  return lessons + daily + hello + realPhone
}

export function withResultRewards(progress, result, today) {
  const current = normalizeProgress(progress)
  const lessonId = result?.lessonId
  const earned = pointsForResult(result)
  const lessonScores = { ...current.lessonScores }
  if (lessonId && earned) lessonScores[lessonId] = Math.max(lessonScores[lessonId] || 0, earned)
  const dailyBonusDays = today && !current.dailyBonusDays.includes(today)
    ? [...current.dailyBonusDays, today].sort()
    : current.dailyBonusDays
  return { ...current, lessonScores, dailyBonusDays }
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
  const masteredIds = sanitizeIds(raw.masteredIds)
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
    masteredIds,
    lessonsStarted,
    guidedCompletedIds,
    independentCompletedIds,
    latestResult: sanitizeResult(raw.latestResult || raw.latestIndependentResult),
    latestIndependentResult: sanitizeResult(raw.latestIndependentResult),
    followAlongStarted: Boolean(raw.followAlongStarted || followAlongCompletedLessonIds.length),
    followAlongCompletedLessonIds,
    practiceDays: sanitizeDays(raw.practiceDays),
    lessonScores: sanitizeScores(raw.lessonScores, guidedCompletedIds, independentCompletedIds, masteredIds),
    dailyBonusDays: sanitizeDays(raw.dailyBonusDays),
    helloBonus: Boolean(raw.helloBonus),
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
