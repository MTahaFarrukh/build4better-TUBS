import { useRef } from 'react'
import { ArrowLeft, Mic } from 'lucide-react'
import { getChatById } from '../../data/whatsappChats'
import GuideHighlight from './GuideHighlight'

export default function WhatsAppChat({
  chatId,
  extraMessages = [],
  isRecording,
  onBack,
  onStartRecording,
  onSendVoice,
  onCancelRecording,
  isHighlighted,
}) {
  const chat = getChatById(chatId)
  const holding = useRef(false)

  if (!chat) return null

  const messages = [...chat.messages, ...extraMessages]

  const handlePointerDown = (event) => {
    event.preventDefault()
    holding.current = true
    onStartRecording()
  }

  const handlePointerUp = (event) => {
    event.preventDefault()
    if (!holding.current) return
    holding.current = false
    onSendVoice()
  }

  const handlePointerLeave = () => {
    if (!holding.current) return
    holding.current = false
    onCancelRecording()
  }

  return (
    <div className="flex h-full flex-col bg-[#ECE5DD]">
      <div className="flex items-center gap-3 bg-[#075E54] px-4 py-3 text-ivory">
        <button
          type="button"
          onClick={onBack}
          className="touch-target inline-flex items-center justify-center rounded-xl"
          aria-label="Back to chats"
        >
          <ArrowLeft className="h-6 w-6" aria-hidden="true" />
        </button>
        <span
          className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold"
          style={{ backgroundColor: chat.color }}
          aria-hidden="true"
        >
          {chat.initials}
        </span>
        <div>
          <h2 className="text-lg font-semibold">{chat.name}</h2>
          <p className="text-xs text-ivory/80">Practice chat</p>
        </div>
      </div>

      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto px-3 py-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm shadow-soft ${
              message.from === 'me'
                ? 'ml-auto bg-[#DCF8C6] text-forest'
                : 'bg-ivory text-forest'
            }`}
          >
            {message.type === 'voice' ? (
              <p className="font-medium">
                Voice message · {message.durationSec ?? 2}s
                <span className="mt-1 block text-xs text-forest-muted">Practice only</span>
              </p>
            ) : (
              message.text
            )}
          </div>
        ))}
      </div>

      <div className="border-t border-forest/10 bg-ivory px-3 py-3">
        {isRecording && (
          <p className="mb-2 text-center text-sm font-semibold text-teal" role="status">
            Recording… hold, then release to send
          </p>
        )}
        <div className="flex items-center gap-3">
          <div className="flex-1 rounded-full bg-sage px-4 py-3 text-sm text-forest-muted">
            Practice message…
          </div>
          <GuideHighlight active={isHighlighted('mic-button')} className="rounded-full">
            <button
              type="button"
              className={`touch-target flex h-14 w-14 items-center justify-center rounded-full text-ivory shadow-soft ${
                isRecording ? 'bg-forest scale-105' : 'bg-teal'
              }`}
              aria-label="Hold to record a practice voice message, release to send"
              onPointerDown={handlePointerDown}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerLeave}
              onContextMenu={(event) => event.preventDefault()}
            >
              <Mic className="h-6 w-6" aria-hidden="true" />
            </button>
          </GuideHighlight>
        </div>
        <p className="mt-2 text-center text-xs text-forest-muted">
          Hold mic to record · release to send · nothing real is sent
        </p>
      </div>
    </div>
  )
}
