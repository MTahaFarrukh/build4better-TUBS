import { useEffect, useState } from 'react'

function readStoredValue(key, initialValue) {
  try {
    const stored = window.localStorage.getItem(key)
    if (stored === null) return initialValue
    return JSON.parse(stored)
  } catch {
    return initialValue
  }
}

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => readStoredValue(key, initialValue))

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Ignore quota / private-mode write failures.
    }
  }, [key, value])

  return [value, setValue]
}
