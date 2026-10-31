import { ArrowLeft } from 'lucide-react'
import { PRACTICE_CHATS } from '../../data/whatsappChats'
import GuideHighlight from './GuideHighlight'

export default function WhatsAppList({ onOpenChat, onBack, isHighlighted }) {
  return (
    <div className="flex h-full flex-col bg-ivory">
      <div className="flex items-center gap-3 bg-[#075E54] px-4 py-3 text-ivory">
        <button
          type="button"
          onClick={onBack}
          className="touch-target inline-flex items-center justify-center rounded-xl"
          aria-label="Back to home"
        >
          <ArrowLeft className="h-6 w-6" aria-hidden="true" />
        </button>
        <div>
          <h2 className="text-lg font-semibold">WhatsApp</h2>
          <p className="text-xs text-ivory/80">Practice chats only</p>
        </div>
      </div>

      <GuideHighlight active={isHighlighted('chat-list')} className="min-h-0 flex-1 overflow-y-auto rounded-none">
        <ul className="divide-y divide-forest/10">
          {PRACTICE_CHATS.map((chat) => (
            <li key={chat.id}>
              <button
                type="button"
                onClick={() => onOpenChat(chat.id)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-sage/50"
                aria-label={`Open chat with ${chat.name}`}
              >
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold text-ivory"
                  style={{ backgroundColor: chat.color }}
                  aria-hidden="true"
                >
                  {chat.initials}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-forest">{chat.name}</span>
                  <span className="block truncate text-sm text-forest-muted">{chat.preview}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </GuideHighlight>
    </div>
  )
}
