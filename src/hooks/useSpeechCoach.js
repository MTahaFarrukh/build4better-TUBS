import { useCallback, useEffect, useState } from 'react'
import { voiceKey } from '../data/voiceKey'

// One spoken line at a time, shared by every screen.
let generation = 0
let currentAudio = null
let pendingUrdu = null

function haltAudio() {
  if (!currentAudio) return
  currentAudio.onended = null
  currentAudio.onerror = null
  currentAudio.pause()
  currentAudio.src = ''
  currentAudio = null
}

if (typeof window !== 'undefined') {
  window.addEventListener('pointerdown', () => {
    const job = pendingUrdu
    if (!job) return
    pendingUrdu = null
    job()
  })
}

export function useSpeechCoach() {
  const [supported, setSupported] = useState(() => typeof window !== 'undefined')
  const [speaking, setSpeaking] = useState(false)

  useEffect(() => {
    setSupported(typeof window !== 'undefined')
  }, [])

  const stop = useCallback(() => {
    generation += 1
    pendingUrdu = null
    window.speechSynthesis?.cancel()
    haltAudio()
    setSpeaking(false)
  }, [])

  const playUrduClips = useCallback((lines, mine) => {
    const queue = lines.map((line) => String(line).trim()).filter(Boolean)
    const next = () => {
      if (mine !== generation) return
      const line = queue.shift()
      if (!line) {
        setSpeaking(false)
        return
      }
      const audio = new Audio(`${import.meta.env.BASE_URL}voice/ur/${voiceKey(line)}.mp3`)
      audio.volume = 1
      currentAudio = audio
      let moved = false
      const go = () => {
        if (moved || mine !== generation) return
        moved = true
        next()
      }
      audio.onended = go
      audio.onerror = go
      setSpeaking(true)
      audio.play().catch((error) => {
        if (mine !== generation) return
        if (error?.name === 'NotAllowedError') {
          moved = true
          queue.unshift(line)
          pendingUrdu = () => { if (mine === generation) next() }
          return
        }
        go()
      })
    }
    next()
  }, [])

  const speakLines = useCallback((lines, lang = 'en-US') => {
    const list = (Array.isArray(lines) ? lines : [lines]).filter(Boolean)
    if (!list.length) return
    const mine = ++generation
    window.speechSynthesis?.cancel()
    haltAudio()
    if (/^ur/i.test(lang)) {
      playUrduClips(list, mine)
      return
    }
    if (!window.speechSynthesis) return
    const utterance = new SpeechSynthesisUtterance(list.join('. '))
    utterance.lang = 'en-US'
    utterance.rate = 0.9
    utterance.onstart = () => { if (mine === generation) setSpeaking(true) }
    utterance.onend = () => { if (mine === generation) setSpeaking(false) }
    utterance.onerror = () => { if (mine === generation) setSpeaking(false) }
    window.speechSynthesis.speak(utterance)
  }, [playUrduClips])

  const speak = useCallback((text, lang) => speakLines([text], lang), [speakLines])

  return { supported, speaking, speak, speakLines, stop }
}
