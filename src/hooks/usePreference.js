import { useEffect, useState } from 'react'

// Small shared preference hook: localStorage + cross-component sync via a window event.
function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw === null ? fallback : JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function usePreference(key, fallback) {
  const [value, setValue] = useState(() => read(key, fallback))
  useEffect(() => {
    const sync = () => setValue(read(key, fallback))
    window.addEventListener(`ustaad-pref:${key}`, sync)
    return () => window.removeEventListener(`ustaad-pref:${key}`, sync)
  }, [key, fallback])
  const update = (next) => {
    const resolved = typeof next === 'function' ? next(read(key, fallback)) : next
    try { localStorage.setItem(key, JSON.stringify(resolved)) } catch { /* private mode */ }
    setValue(resolved)
    window.dispatchEvent(new Event(`ustaad-pref:${key}`))
  }
  return [value, update]
}

// Theme: "glass" (dark, animated) or "easy" (light, high-contrast, larger type for seniors).
export const THEMES = { glass: 'glass', easy: 'easy' }
export function useTheme() {
  const [theme, setTheme] = usePreference('digital-ustaad:theme', THEMES.glass)
  useEffect(() => {
    const easy = theme === THEMES.easy
    document.documentElement.dataset.theme = easy ? THEMES.easy : THEMES.glass
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', easy ? '#f7f8fc' : '#080a18')
  }, [theme])
  return { theme, easy: theme === THEMES.easy, setTheme, toggle: () => setTheme(theme === THEMES.easy ? THEMES.glass : THEMES.easy) }
}

// Ustaad voice: automatically read each instruction aloud.
export function useVoicePreference() {
  const [voice, setVoice] = usePreference('digital-ustaad:voice', true)
  return { voice: Boolean(voice), setVoice, toggle: () => setVoice(!voice) }
}

export function todayKey(date = new Date()) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

// Consecutive-day streak ending today or yesterday.
export function computeStreak(days = [], now = new Date()) {
  const set = new Set(days)
  if (!set.size) return 0
  const cursor = new Date(now)
  if (!set.has(todayKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1)
    if (!set.has(todayKey(cursor))) return 0
  }
  let streak = 0
  while (set.has(todayKey(cursor))) {
    streak += 1
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}
