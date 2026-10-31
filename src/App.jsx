import { AnimatePresence, motion } from 'framer-motion'
import AppShell from './components/layout/AppShell'
import WelcomeScreen from './screens/WelcomeScreen'
import DashboardScreen from './screens/DashboardScreen'
import { useLocalStorage } from './hooks/useLocalStorage'

const VIEWS = {
  welcome: 'welcome',
  dashboard: 'dashboard',
}

export default function App() {
  const [view, setView] = useLocalStorage('digital-ustaad:view', VIEWS.welcome)
  const [progress, setProgress] = useLocalStorage('digital-ustaad:progress', {
    shareFamilyPhotoStarted: false,
  })

  const goToDashboard = () => setView(VIEWS.dashboard)
  const goToWelcome = () => setView(VIEWS.welcome)

  const handleStartLesson = () => {
    setProgress((prev) => ({
      ...prev,
      shareFamilyPhotoStarted: true,
    }))
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={view}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="min-h-screen"
      >
        {view === VIEWS.welcome ? (
          <WelcomeScreen onStart={goToDashboard} />
        ) : view === VIEWS.dashboard ? (
          <DashboardScreen
            onBack={goToWelcome}
            lessonStarted={Boolean(progress.shareFamilyPhotoStarted)}
            onStartLesson={handleStartLesson}
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
