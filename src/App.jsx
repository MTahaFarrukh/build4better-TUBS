import { useEffect, useMemo, useRef } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import AppShell from './components/layout/AppShell'
import ScamScreen from './screens/ScamScreen'
import WelcomeScreen from './screens/WelcomeScreen'
import DashboardScreen from './screens/DashboardScreen'
import PracticeLabScreen from './screens/PracticeLabScreen'
import FollowAlongScreen from './screens/FollowAlongScreen'
import { DEFAULT_FOLLOW_ALONG_LESSON_ID } from './data/followAlong'
import { LESSON_IDS } from './data/interactiveLessons'
import { DEFAULT_PROGRESS, normalizeProgress, withResultRewards } from './data/progress'
import { PRACTICE_MODES } from './hooks/usePracticePhone'
import { useLocalStorage } from './hooks/useLocalStorage'
import { todayKey, useTheme } from './hooks/usePreference'

const withToday = (current) => {
  const today = todayKey()
  return current.practiceDays.includes(today) ? current.practiceDays : [...current.practiceDays, today]
}

const VIEWS = {
  welcome: 'welcome',
  dashboard: 'dashboard',
  lab: 'lab',
  followAlong: 'follow-along',
}

export default function App() {
  const reduceMotion = useReducedMotion()
  useTheme() // applies data-theme to <html> on first paint
  const migratedProgress = useRef(false)
  const [view, setView] = useLocalStorage('digital-ustaad:view', VIEWS.welcome)
  const [rawProgress, setRawProgress] = useLocalStorage(
    'digital-ustaad:progress',
    DEFAULT_PROGRESS,
  )
  const [practiceMode, setPracticeMode] = useLocalStorage(
    'digital-ustaad:practice-mode',
    PRACTICE_MODES.guided,
  )
  const [activeLessonId, setActiveLessonId] = useLocalStorage(
    'digital-ustaad:active-lesson',
    LESSON_IDS.sharePhoto,
  )
  const [followAlongLessonId, setFollowAlongLessonId] = useLocalStorage(
    'digital-ustaad:follow-along-lesson',
    DEFAULT_FOLLOW_ALONG_LESSON_ID,
  )

  const progress = useMemo(() => normalizeProgress(rawProgress), [rawProgress])

  useEffect(() => {
    if (migratedProgress.current) return
    const needsMigration =
      !rawProgress ||
      typeof rawProgress !== 'object' ||
      Array.isArray(rawProgress) ||
      rawProgress.version !== 4 ||
      Object.prototype.hasOwnProperty.call(rawProgress, 'shareFamilyPhotoCompleted')

    migratedProgress.current = true
    if (needsMigration) setRawProgress(normalizeProgress(rawProgress))
  }, [rawProgress, setRawProgress])

  // Migrate old simulator view key
  useEffect(() => {
    if (view === 'simulator') setView(VIEWS.lab)
  }, [view, setView])

  const goToDashboard = () => setView(VIEWS.dashboard)
  const goToWelcome = () => setView(VIEWS.welcome)
  const markHello = () => setRawProgress((prev) => ({ ...normalizeProgress(prev), helloBonus: true }))

  const startLab = (lessonId, mode) => {
    setActiveLessonId(lessonId)
    setPracticeMode(mode)
    setRawProgress((prev) => {
      const current = normalizeProgress(prev)
      return { ...current, lessonsStarted: true, practiceDays: withToday(current), [`${lessonId}Started`]: true }
    })
    setView(VIEWS.lab)
  }

  const startFollowAlong = () => {
    setFollowAlongLessonId(DEFAULT_FOLLOW_ALONG_LESSON_ID)
    setRawProgress((prev) => ({
      ...normalizeProgress(prev),
      followAlongStarted: true,
    }))
    setView(VIEWS.followAlong)
  }

  const handleLabCompleted = (resultSummary) => {
    const lessonId = resultSummary?.lessonId || activeLessonId
    setRawProgress((prev) => {
      const current = normalizeProgress(prev)
      const key =
        resultSummary?.mode === PRACTICE_MODES.independent
          ? 'independentCompletedIds'
          : 'guidedCompletedIds'
      const list = current[key].includes(lessonId)
        ? current[key]
        : [...current[key], lessonId]
      return withResultRewards({
        ...current,
        lessonsStarted: true,
        practiceDays: withToday(current),
        [key]: list,
        masteredIds: resultSummary?.mode === 'independent' && resultSummary.completedWithoutAssistance && resultSummary.incorrectAttempts === 0 ? [...new Set([...(current.masteredIds || []), lessonId])] : (current.masteredIds || []),
        latestResult: resultSummary,
        ...(resultSummary?.mode === PRACTICE_MODES.independent
          ? { latestIndependentResult: resultSummary }
          : {}),
      }, resultSummary, todayKey())
    })
  }

  const handleFollowAlongCompleted = (lessonId) => {
    setRawProgress((prev) => {
      const current = normalizeProgress(prev)
      const ids = current.followAlongCompletedLessonIds.includes(lessonId)
        ? current.followAlongCompletedLessonIds
        : [...current.followAlongCompletedLessonIds, lessonId]
      return { ...current, followAlongStarted: true, practiceDays: withToday(current), followAlongCompletedLessonIds: ids }
    })
  }

  const handleResetProgress = () => {
    setRawProgress({ ...DEFAULT_PROGRESS })
    setPracticeMode(PRACTICE_MODES.guided)
    setActiveLessonId(LESSON_IDS.sharePhoto)
    setFollowAlongLessonId(DEFAULT_FOLLOW_ALONG_LESSON_ID)
    if (view === VIEWS.lab || view === VIEWS.followAlong) setView(VIEWS.dashboard)
  }

  const safeView =
    view === 'simulator'
      ? VIEWS.lab
      : Object.values(VIEWS).includes(view)
        ? view
        : VIEWS.welcome
  const safeMode = Object.values(PRACTICE_MODES).includes(practiceMode)
    ? practiceMode
    : PRACTICE_MODES.guided

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={
          safeView === VIEWS.lab
            ? `${safeView}-${activeLessonId}-${safeMode}`
            : safeView === VIEWS.followAlong
              ? `${safeView}-${followAlongLessonId}`
              : safeView
        }
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={reduceMotion ? undefined : { opacity: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.25 }}
        className="min-h-screen"
      >
        {safeView === VIEWS.welcome ? (
          <WelcomeScreen onStart={goToDashboard} progress={progress} onHello={markHello} />
        ) : safeView === VIEWS.dashboard ? (
          <DashboardScreen
            onBack={goToWelcome}
            progress={progress}
            onStartLesson={startLab}
            onStartFollowAlong={startFollowAlong}
            onResetProgress={handleResetProgress}
          />
        ) : safeView === VIEWS.lab ? (
          activeLessonId === 'scam-safety' ? <ScamScreen mode={safeMode} onBack={goToDashboard} onCompleted={handleLabCompleted}/> : <PracticeLabScreen
            lessonId={activeLessonId}
            mode={safeMode}
            onBack={goToDashboard}
            onCompleted={handleLabCompleted}
            onIndependent={() => startLab(activeLessonId, PRACTICE_MODES.independent)}
          />
        ) : safeView === VIEWS.followAlong ? (
          <FollowAlongScreen
            lessonId={followAlongLessonId}
            onBack={goToDashboard}
            onLessonCompleted={handleFollowAlongCompleted}
          />
        ) : (
          <AppShell>
            <p className="text-lg text-ink">Something went wrong. Please refresh the page.</p>
          </AppShell>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
