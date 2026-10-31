export const PRACTICE_CHATS = [
  {
    id: 'ammi',
    name: 'Ammi',
    initials: 'ام',
    color: '#167D68',
    preview: 'Allah hafiz, beta',
    messages: [
      { id: 'm1', from: 'them', type: 'text', text: 'Assalam o alaikum beta' },
      { id: 'm2', from: 'me', type: 'text', text: 'Walaikum assalam Ammi' },
      { id: 'm3', from: 'them', type: 'text', text: 'Allah hafiz, beta' },
    ],
  },
  {
    id: 'abu',
    name: 'Abu',
    initials: 'اب',
    color: '#183B35',
    preview: 'Call me when free',
    messages: [
      { id: 'm1', from: 'them', type: 'text', text: 'Beta, ghar kab aaoge?' },
      { id: 'm2', from: 'me', type: 'text', text: 'Shaam ko, Abu' },
    ],
  },
  {
    id: 'beti',
    name: 'Beti',
    initials: 'بے',
    color: '#2A524A',
    preview: 'Miss you!',
    messages: [
      { id: 'm1', from: 'them', type: 'text', text: 'Miss you!' },
      { id: 'm2', from: 'me', type: 'text', text: 'Miss you too' },
    ],
  },
  {
    id: 'family-group',
    name: 'Family Group',
    initials: 'FG',
    color: '#4F6F68',
    preview: 'Picnic photos later',
    messages: [
      { id: 'm1', from: 'them', type: 'text', text: 'Picnic photos later inshaAllah' },
      { id: 'm2', from: 'me', type: 'text', text: 'Ji!' },
    ],
  },
]

export function getChatById(id) {
  return PRACTICE_CHATS.find((chat) => chat.id === id) ?? null
}
