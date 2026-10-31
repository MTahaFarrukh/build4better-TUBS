import { useEffect, useMemo, useRef } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import AppShell from './components/layout/AppShell'
import WelcomeScreen from './screens/WelcomeScreen'
import DashboardScreen from './screens/DashboardScreen'
import LessonSimulatorScreen from './screens/LessonSimulatorScreen'
import FollowAlongScreen from './screens/FollowAlongScreen'
import {
  DEFAULT_FOLLOW_ALONG_LESSON_ID,
} from './data/followAlong'
import { DEFAULT_PROGRESS, normalizeProgress } from './data/progress'
import { PRACTICE_MODES } from './hooks/useSimulator'
import { useLocalStorage } from './hooks/useLocalStorage'

const VIEWS = {
  welcome: 'welcome',
  dashboard: 'dashboard',
  simulator: 'simulator',
  followAlong: 'follow-along',
}

export default function App() {
  const reduceMotion = useReducedMotion()
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
  const [followAlongLessonId, setFollowAlongLessonId] = useLocalStorage(
    'digital-ustaad:follow-along-lesson',
    DEFAULT_FOLLOW_ALONG_LESSON_ID,
  )

  const progress = useMemo(
    () => normalizeProgress(rawProgress),
    [rawProgress],
  )

  useEffect(() => {
    if (migratedProgress.current) return

    const needsMigration =
      !rawProgress ||
      typeof rawProgress !== 'object' ||
      Array.isArray(rawProgress) ||
      rawProgress.version !== 3 ||
      Object.prototype.hasOwnProperty.call(rawProgress, 'shareFamilyPhotoCompleted')

    migratedProgress.current = true
    if (needsMigration) {
      setRawProgress(normalizeProgress(rawProgress))
    }
  }, [rawProgress, setRawProgress])

  const goToDashboard = () => setView(VIEWS.dashboard)
  const goToWelcome = () => setView(VIEWS.welcome)

  const startPractice = (mode) => {
    setPracticeMode(mode)
    setRawProgress((prev) => ({
      ...normalizeProgress(prev),
      shareFamilyPhotoStarted: true,
    }))
    setView(VIEWS.simulator)
  }

  const startFollowAlong = (lessonId = DEFAULT_FOLLOW_ALONG_LESSON_ID) => {
    setFollowAlongLessonId(lessonId)
    setRawProgress((prev) => ({
      ...normalizeProgress(prev),
      followAlongStarted: true,
    }))
    setView(VIEWS.followAlong)
  }

  const handleGuidedCompleted = () => {
    setRawProgress((prev) => ({
      ...normalizeProgress(prev),
      shareFamilyPhotoStarted: true,
      guidedCompleted: true,
    }))
  }

  const handleIndependentCompleted = (resultSummary) => {
    setRawProgress((prev) => ({
      ...normalizeProgress(prev),
      shareFamilyPhotoStarted: true,
      independentCompleted: true,
      latestIndependentResult: resultSummary,
    }))
  }

  const handleFollowAlongCompleted = (lessonId) => {
    setRawProgress((prev) => {
      const current = normalizeProgress(prev)
      const ids = current.followAlongCompletedLessonIds.includes(lessonId)
        ? current.followAlongCompletedLessonIds
        : [...current.followAlongCompletedLessonIds, lessonId]
      return {
        ...current,
        followAlongStarted: true,
        followAlongCompletedLessonIds: ids,
      }
    })
  }

  const handleResetProgress = () => {
    setRawProgress({ ...DEFAULT_PROGRESS })
    setPracticeMode(PRACTICE_MODES.guided)
    setFollowAlongLessonId(DEFAULT_FOLLOW_ALONG_LESSON_ID)
    if (view === VIEWS.simulator || view === VIEWS.followAlong) {
      setView(VIEWS.dashboard)
    }
  }

  const safeView = Object.values(VIEWS).includes(view) ? view : VIEWS.welcome
  const safeMode = Object.values(PRACTICE_MODES).includes(practiceMode)
    ? practiceMode
    : PRACTICE_MODES.guided

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={
          safeView === VIEWS.simulator
            ? `${safeView}-${safeMode}`
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
          <WelcomeScreen onStart={goToDashboard} />
        ) : safeView === VIEWS.dashboard ? (
          <DashboardScreen
            onBack={goToWelcome}
            progress={progress}
            onStartGuided={() => startPractice(PRACTICE_MODES.guided)}
            onStartIndependent={() => startPractice(PRACTICE_MODES.independent)}
            onStartFollowAlong={() => startFollowAlong(DEFAULT_FOLLOW_ALONG_LESSON_ID)}
            onResetProgress={handleResetProgress}
          />
        ) : safeView === VIEWS.simulator ? (
          <LessonSimulatorScreen
            onBack={goToDashboard}
            mode={safeMode}
            onGuidedCompleted={handleGuidedCompleted}
            onIndependentCompleted={handleIndependentCompleted}
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
