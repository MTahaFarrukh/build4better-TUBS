import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Production web only; Capacitor continues to use its bundled assets.
if (import.meta.env.PROD && 'serviceWorker' in navigator && !window.Capacitor) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').then(registration => {
      registration.addEventListener('updatefound', () => {
        const worker = registration.installing
        worker?.addEventListener('statechange', () => {
          if (worker.state === 'installed' && navigator.serviceWorker.controller) {
            window.dispatchEvent(new Event('ustaad-update-ready'))
          }
        })
      })
    }).catch(() => { /* Normal online learning still works if offline preparation fails. */ })
  })
}
