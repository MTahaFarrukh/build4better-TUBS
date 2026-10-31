import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, Mic, Send, Trash2, CheckCheck } from 'lucide-react'
import { getChatById } from '../../data/whatsappChats'
import GuideHighlight from './GuideHighlight'

export default function WhatsAppChat({ chatId, extraMessages = [], isRecording, recordingStartedAt, onBack, onStartRecording, onSendVoice, onCancelRecording, isHighlighted }) {
  const chat = getChatById(chatId)
  const holding = useRef(false)
  const origin = useRef(0)
  const [elapsed, setElapsed] = useState(0)
  useEffect(() => {
    if (!isRecording) { setElapsed(0); return }
    const update = () => setElapsed(Math.floor((Date.now() - recordingStartedAt) / 1000))
    update()
    const timer = window.setInterval(update, 250)
    return () => window.clearInterval(timer)
  }, [isRecording, recordingStartedAt])
  const cancel = () => { holding.current = false; onCancelRecording() }
  useEffect(() => {
    const interrupt = () => { holding.current = false; onCancelRecording() }
    const visibility = () => { if (document.hidden) interrupt() }
    window.addEventListener('blur', interrupt)
    document.addEventListener('visibilitychange', visibility)
    return () => { window.removeEventListener('blur', interrupt); document.removeEventListener('visibilitychange', visibility) }
  }, [onCancelRecording])
  if (!chat) return null
  const duration = `${Math.floor(elapsed / 60)}:${String(elapsed % 60).padStart(2, '0')}`
  return (
    <div className="flex h-full flex-col bg-[#efeae2]">
      <div className="flex items-center gap-2 bg-[#075E54] px-3 py-3 text-white">
        <button onClick={onBack} className="touch-target flex items-center justify-center rounded-xl" aria-label="Back to chats"><ArrowLeft /></button>
        <span className="flex h-11 w-11 items-center justify-center rounded-full font-bold" style={{ backgroundColor: chat.color }}>{chat.initials}</span>
        <div><h2 className="text-lg font-semibold">{chat.name}</h2><p className="text-sm text-white/80">Practice chat · مشق</p></div>
      </div>
      <div className="chat-wallpaper min-h-0 flex-1 space-y-3 overflow-y-auto px-3 py-4">
        <p className="mx-auto mb-5 w-fit rounded-lg bg-white/85 px-3 py-1 text-xs text-forest">Today · آج</p>
        {[...chat.messages, ...extraMessages].map(message => <div key={message.id} className={`w-fit max-w-[88%] rounded-xl px-4 py-3 text-base shadow-sm ${message.from === 'me' ? 'ml-auto bg-[#d9fdd3]' : 'bg-white'}`}>
          {message.type === 'voice' ? <span className="flex items-center gap-3"><Mic size={20} />Voice note · {message.durationSec}s<CheckCheck size={16} /></span> : message.text}
          <span className="mt-1 block text-right text-[11px] text-forest-muted">10:10 {message.from === 'me' ? '✓✓' : ''}</span>
        </div>)}
      </div>
      <div className="bg-[#f8faf8] px-3 py-3">
        {isRecording && <div className="recording-indicator" role="status"><span className="recording-dot" /><strong className="tabular-nums">{duration}</strong><span className="voice-wave" aria-hidden="true">▂ ▅ ▃ ▇ ▄ ▆ ▂ ▅ ▃</span><span className="text-sm">Recording</span></div>}
        <div className="flex items-center gap-2">
          {isRecording ? <button className="lab-action flex-1" onClick={cancel}><Trash2 size={19} />Cancel · منسوخ</button> : <div className="flex-1 rounded-full bg-white px-4 py-3 text-sm text-forest-muted shadow-sm">Voice message…</div>}
          <GuideHighlight active={isHighlighted('mic-button')} className="rounded-full">
            <button className={`record-button ${isRecording ? 'recording' : ''}`} aria-label="Hold to record a practice voice message, release to send"
              onPointerDown={event => {
                if (event.button !== 0 || isRecording) return
                event.preventDefault(); event.currentTarget.setPointerCapture(event.pointerId)
                holding.current = true; origin.current = event.clientX; onStartRecording()
              }}
              onPointerMove={event => { if (holding.current && origin.current - event.clientX > 65) cancel() }}
              onPointerUp={event => { event.preventDefault(); if (holding.current) { holding.current = false; onSendVoice() } }}
              onPointerCancel={cancel}
              onLostPointerCapture={() => { if (holding.current) cancel() }}
              onKeyDown={event => { if ((event.key === ' ' || event.key === 'Enter') && !event.repeat) { event.preventDefault(); holding.current = true; onStartRecording() } if (event.key === 'Escape') cancel() }}
              onKeyUp={event => { if ((event.key === ' ' || event.key === 'Enter') && holding.current) { event.preventDefault(); holding.current = false; onSendVoice() } }}
              onContextMenu={event => event.preventDefault()}><Mic size={25} /></button>
          </GuideHighlight>
        </div>
        <p className="mt-2 text-center text-sm text-forest-muted">{isRecording ? 'Release to send · Slide left to cancel' : 'Hold mic, then release · مائیک دبائیں، پھر چھوڑیں'}</p>
        <div className="mt-2 flex justify-center">
          {isRecording ? <button className="lab-action" onClick={() => { holding.current = false; onSendVoice() }}><Send size={17} />Send · بھیجیں</button> : <button className="lab-action" onClick={onStartRecording}>Or tap to start · ریکارڈ کریں</button>}
        </div>
      </div>
    </div>
  )
}
